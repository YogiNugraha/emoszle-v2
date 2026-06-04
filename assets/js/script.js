"use strict";

/* ====== DOM ====== */
const board = document.getElementById("board");
const hintBtn = document.getElementById("hint-btn");
const pieceContainer = document.getElementById("piece-container");
const restartBtn = document.getElementById("restart-btn");
const difficultySelect = document.getElementById("difficulty");
const imageSelect = document.getElementById("image-select");
const referenceImage = document.getElementById("reference-image");
const timerDisplay = document.getElementById("timer");
const moveCountDisplay = document.getElementById("move-count");
const highScoreDisplay = document.getElementById("high-score");
const winModal = document.getElementById("win-modal");
const winTitle = document.getElementById("win-title");
const finalTime = document.getElementById("final-time");
const finalMoves = document.getElementById("final-moves");
const playAgainBtn = document.getElementById("play-again-btn");
const dropSound = document.getElementById("drop-sound");
const winSound = document.getElementById("win-sound");
const bgMusic = document.getElementById("bg-music");
const muteBtn = document.getElementById("mute-btn");

/* ====== CONFIG ====== */
const difficulties = {
  easy: { rows: 2, cols: 3 }, // 3x2
  normal: { rows: 3, cols: 4 }, // 4x3
  hard: { rows: 4, cols: 5 }, // 5x4
};

let rows, cols, imageSrc, difficulty;
let draggedPiece = null;
let moveCount = 0;
let timerInterval = null;
let timeElapsed = 0;
let isGameActive = false;
let isMusicPlaying = false;

let touchStartX = 0,
  touchStartY = 0,
  isDragging = false,
  currentTouchTarget = null;

const debounce = (fn, wait = 150) => {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), wait);
  };
};
const throttle = (fn, limit = 100) => {
  let ok = true;
  return (...a) => {
    if (!ok) return;
    ok = false;
    fn(...a);
    setTimeout(() => (ok = true), limit);
  };
};

/* ====== TTS ====== */
const synthesizer = window.speechSynthesis;
let indonesianVoice,
  isSpeaking = false;

synthesizer.onvoiceschanged = () => {
  const voices = synthesizer.getVoices();
  indonesianVoice = voices.find((v) => v.lang === "id-ID") || voices[0] || null;
};

const MUSIC_VOLUME_NORMAL = 0.4,
  MUSIC_VOLUME_DUCKED = 0.1;

function speak(text) {
  if (!window.SpeechSynthesisUtterance || !text || isSpeaking) return;
  try {
    if (synthesizer.speaking) synthesizer.cancel();
  } catch {}
  isSpeaking = true;
  if (isMusicPlaying && bgMusic) bgMusic.volume = MUSIC_VOLUME_DUCKED;

  const u = new SpeechSynthesisUtterance(text);
  if (indonesianVoice) u.voice = indonesianVoice;
  u.pitch = 1;
  u.rate = 1;
  u.volume = 0.9;
  u.onend = () => {
    isSpeaking = false;
    if (isMusicPlaying && bgMusic) bgMusic.volume = MUSIC_VOLUME_NORMAL;
  };
  try {
    synthesizer.speak(u);
  } catch {
    isSpeaking = false;
    if (isMusicPlaying && bgMusic) bgMusic.volume = MUSIC_VOLUME_NORMAL;
  }
}

/* ====== TIME & SCORE ====== */
const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
    2,
    "0"
  )}`;

function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    timeElapsed++;
    timerDisplay.textContent = formatTime(timeElapsed);
  }, 1000);
}
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

const incMoveCount = throttle(() => {
  if (!isGameActive) return;
  moveCount++;
  moveCountDisplay.textContent = String(moveCount);
}, 80);

function getHighScoreKey() {
  const imageName = (imageSrc || "").split("/").pop()?.split(".")[0] || "img";
  return `highscore-${difficulty}-${imageName}`;
}
function loadHighScore() {
  try {
    const score = localStorage.getItem(getHighScoreKey());
    highScoreDisplay.textContent = score
      ? formatTime(parseInt(score, 10))
      : "--:--";
  } catch {
    highScoreDisplay.textContent = "--:--";
  }
}
function saveHighScore() {
  try {
    const key = getHighScoreKey();
    const best = localStorage.getItem(key);
    if (!best || timeElapsed < parseInt(best, 10)) {
      localStorage.setItem(key, String(timeElapsed));
      winTitle.textContent = "REKOR BARU! 🏆";
      loadHighScore();
    }
  } catch {}
}

/* ====== MUSIC ====== */
function toggleMusic() {
  if (!bgMusic) return;
  isMusicPlaying = !isMusicPlaying;
  if (isMusicPlaying) {
    bgMusic.volume = MUSIC_VOLUME_NORMAL;
    bgMusic.loop = true;
    bgMusic.play().catch(() => {});
    muteBtn.textContent = "🔊";
  } else {
    bgMusic.pause();
    muteBtn.textContent = "🔇";
  }
}

/* ====== LAYOUT HELPERS ====== */
function getResponsiveSlotSize(cols) {
  const scroller = document.querySelector(".board-scroll");
  if (!scroller) return 80;
  const cs = getComputedStyle(scroller);
  const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
  const available = scroller.getBoundingClientRect().width - padX;
  const size = Math.floor(available / cols); // bulat ke bawah supaya pas
  return Math.max(56, Math.min(160, size)); // guard rails
}

/* ====== GAME FLOW ====== */
function resetGame() {
  isGameActive = false;
  draggedPiece = null;
  moveCount = 0;
  timeElapsed = 0;
  stopTimer();
  timerDisplay.textContent = "00:00";
  moveCountDisplay.textContent = "0";
  board.innerHTML = "";
  pieceContainer.innerHTML = "";
  winModal.classList.add("hidden");
  winTitle.textContent = "Selamat! 🎉";
}

function activateGame() {
  if (isGameActive) return;
  isGameActive = true;
  startTimer();
  if (!isMusicPlaying) toggleMusic();
}

/* ====== BUILD BOARD ====== */
function setupGame() {
  difficulty = difficultySelect.value;
  rows = difficulties[difficulty].rows;
  cols = difficulties[difficulty].cols;
  imageSrc = imageSelect.value;

  // set overlay image (untuk pratinjau samar di papan)
//   board.style.setProperty("--current-puzzle-image", `url(${imageSrc})`);

  resetGame();
  loadHighScore();

  const slotSize = getResponsiveSlotSize(cols);
  const pieceSize = slotSize - 1.5; // sedikit lebih kecil dari slot
  const boardWidth = slotSize * cols;
  const boardHeight = slotSize * rows;

  // ukuran papan & grid
  board.style.width = `${boardWidth}px`;
  board.style.height = `${boardHeight}px`;
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  // gambar acuan: isi kartu
  referenceImage.src = imageSrc;
  referenceImage.style.width = "100%";
  referenceImage.style.height = "auto";
  referenceImage.style.objectFit = "cover";
  referenceImage.style.aspectRatio = `${cols}/${rows}`;

  createSlotsOptimized(); // buat slot dulu (agar z-index grid benar)
  createPiecesOptimized(boardWidth, boardHeight, pieceSize);

  bindListenersOnce(); // listener dipasang SEKALI
  addVoiceEventListeners();
}

/* ====== CREATE ELEMENTS ====== */
function createPiecesOptimized(boardWidth, boardHeight, pieceSize) {
  const frag = document.createDocumentFragment();
  const slotW = boardWidth / cols,
    slotH = boardHeight / rows;

  const pieces = [];
  for (let i = 0; i < rows * cols; i++) {
    const piece = document.createElement("div");
    piece.className = "piece";
    piece.draggable = true;
    piece.dataset.index = String(i);
    const x = (i % cols) * slotW,
      y = Math.floor(i / cols) * slotH;
    piece.style.cssText = `
      width:${pieceSize}px; height:${pieceSize}px;
      background-image:url(${imageSrc});
      background-size:${boardWidth}px ${boardHeight}px;
      background-position:-${x}px -${y}px;`;
    pieces.push(piece);
  }
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  pieces.forEach((p) => frag.appendChild(p));
  pieceContainer.appendChild(frag);
}

function createSlotsOptimized() {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < rows * cols; i++) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.index = String(i);
    const r = Math.floor(i / cols),
      c = i % cols;
    if (r === 0) slot.classList.add("edge-top");
    if (c === 0) slot.classList.add("edge-left");
    if (r === rows - 1) slot.classList.add("edge-bottom");
    if (c === cols - 1) slot.classList.add("edge-right");
    frag.appendChild(slot);
  }
  board.appendChild(frag);
}

/* ====== DnD + TOUCH (DELEGATION; dipasang SEKALI) ====== */
let uiBound = false;

function resolveDropTarget(el) {
  if (!el) return null;
  if (el.classList?.contains("slot")) return el;
  if (el.id === "piece-container") return el;
  const slot = el.closest?.(".slot");
  if (slot) return slot;
  const pc = el.closest?.("#piece-container");
  if (pc) return pc;
  return null;
}

function bindListenersOnce() {
  if (uiBound) return;
  uiBound = true;

  const hosts = [board, pieceContainer];

  // DESKTOP DnD
  hosts.forEach((h) => {
    h.addEventListener("dragstart", (e) => {
      const piece = e.target.closest?.(".piece");
      if (!piece) return;
      activateGame();
      draggedPiece = piece;
      piece.classList.add("dragging");
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", piece.dataset.index || "");
      }
    });

    h.addEventListener("dragend", (e) => {
      const piece = e.target.closest?.(".piece");
      if (!piece) return;
      piece.classList.remove("dragging");
      draggedPiece = null;
    });

    h.addEventListener("dragover", (e) => {
      if (!draggedPiece) return;
      e.preventDefault();
      const t = resolveDropTarget(e.target);
      if (!t) return;
      document
        .querySelectorAll(".drag-over")
        .forEach((el) => el.classList.remove("drag-over"));
      t.classList.add("drag-over");
      if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
    });

    h.addEventListener("dragleave", (e) => {
      const t = resolveDropTarget(e.target);
      if (t) t.classList.remove("drag-over");
    });

    h.addEventListener("drop", (e) => {
      if (!draggedPiece) return;
      e.preventDefault();
      const t = resolveDropTarget(e.target);
      if (!t) return;
      t.classList.remove("drag-over");

      const originalParent = draggedPiece.parentElement;
      if (t.classList.contains("slot")) {
        if (t.children.length > 0)
          originalParent.appendChild(t.firstElementChild);
        t.appendChild(draggedPiece);
        processSuccessfulDrop();
      } else if (t.id === "piece-container") {
        t.appendChild(draggedPiece);
        processSuccessfulDrop();
      }
    });
  });

  // TOUCH
  hosts.forEach((h) => {
    h.addEventListener(
      "touchstart",
      (e) => {
        const piece = e.target.closest?.(".piece");
        if (!piece) return;
        e.preventDefault();
        activateGame();
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        currentTouchTarget = piece;
        isDragging = false;
        piece.style.transform = "scale(1.05)";
        piece.style.zIndex = "1000";
      },
      { passive: false }
    );

    h.addEventListener(
      "touchmove",
      (e) => {
        if (!currentTouchTarget) return;
        e.preventDefault();
        const touch = e.touches[0];
        const dx = Math.abs(touch.clientX - touchStartX),
          dy = Math.abs(touch.clientY - touchStartY);
        if (!isDragging && (dx > 5 || dy > 5)) {
          isDragging = true;
          currentTouchTarget.classList.add("dragging");
        }
        if (isDragging) {
          const half = currentTouchTarget.offsetWidth / 2 || 40;
          currentTouchTarget.style.position = "fixed";
          currentTouchTarget.style.left = touch.clientX - half + "px";
          currentTouchTarget.style.top = touch.clientY - half + "px";
          currentTouchTarget.style.pointerEvents = "none";

          const el = document.elementFromPoint(touch.clientX, touch.clientY);
          document
            .querySelectorAll(".drag-over")
            .forEach((x) => x.classList.remove("drag-over"));
          const t = resolveDropTarget(el);
          if (t) t.classList.add("drag-over");
        }
      },
      { passive: false }
    );

    h.addEventListener(
      "touchend",
      (e) => {
        if (!currentTouchTarget) return;
        e.preventDefault();
        const piece = currentTouchTarget;

        // reset visual
        piece.style.transform = "";
        piece.style.zIndex = "";
        piece.style.position = "";
        piece.style.left = "";
        piece.style.top = "";
        piece.style.pointerEvents = "";
        piece.classList.remove("dragging");
        document
          .querySelectorAll(".drag-over")
          .forEach((x) => x.classList.remove("drag-over"));

        if (isDragging) {
          const touch = e.changedTouches[0];
          const el = document.elementFromPoint(touch.clientX, touch.clientY);
          const t = resolveDropTarget(el);
          if (t) {
            const originalParent = piece.parentElement;
            if (t.classList.contains("slot")) {
              if (t.children.length > 0)
                originalParent.appendChild(t.firstElementChild);
              t.appendChild(piece);
              processSuccessfulDrop();
            } else if (t.id === "piece-container") {
              t.appendChild(piece);
              processSuccessfulDrop();
            }
          }
        }
        currentTouchTarget = null;
        isDragging = false;
      },
      { passive: false }
    );
  });

  // UI once
  restartBtn?.addEventListener("click", setupGame);
  playAgainBtn?.addEventListener("click", setupGame);
  muteBtn?.addEventListener("click", toggleMusic);
  hintBtn?.addEventListener("click", placeOnePieceHint);

  // Debounced selects
  const setupGameDebounced = debounce(setupGame, 150);
  difficultySelect?.addEventListener("change", setupGameDebounced);
  imageSelect?.addEventListener("change", setupGameDebounced);
}

/* ====== DROP SUCCESS & WIN ====== */
function processSuccessfulDrop() {
  incMoveCount();
  try {
    if (dropSound) {
      dropSound.currentTime = 0;
      dropSound.play().catch(() => {});
    }
  } catch {}
  requestAnimationFrame(checkWinCondition);
}

function checkWinCondition() {
  if (pieceContainer.children.length > 0) return; // masih ada potongan di container
  const slots = board.querySelectorAll(".slot");
  for (const slot of slots) {
    const piece = slot.firstElementChild;
    if (!piece || piece.dataset.index !== slot.dataset.index) return;
  }
  stopTimer();
  saveHighScore();
  try {
    if (winSound) {
      winSound.currentTime = 0;
      winSound.play().catch(() => {});
    }
  } catch {}
  speak(
    `Asyik, Berhasil! Kamu menyelesaikan puzzle dalam ${formatTime(
      timeElapsed
    )}, dengan ${moveCount} gerakan.`
  );
  finalTime.textContent = formatTime(timeElapsed);
  finalMoves.textContent = String(moveCount);
  winModal.classList.remove("hidden");
}

/* ====== HINT ====== */
function placeOnePieceHint() {
  const misplaced = [];
  pieceContainer.querySelectorAll(".piece").forEach((p) => misplaced.push(p)); // semua di container salah
  board.querySelectorAll(".slot").forEach((slot) => {
    const p = slot.firstElementChild;
    if (p && p.dataset.index !== slot.dataset.index) misplaced.push(p);
  });
  if (misplaced.length === 0) {
    speak("Semua potongan sudah benar!");
    return;
  }

  const piece = misplaced[Math.floor(Math.random() * misplaced.length)];
  const correctIndex = piece.dataset.index;
  const target = board.querySelector(`.slot[data-index="${correctIndex}"]`);
  if (!target) return;

  if (target.children.length > 0) {
    const obstruct = target.firstElementChild;
    pieceContainer.appendChild(obstruct);
    speak("Memindahkan potongan penghalang.");
  }

  target.appendChild(piece);
  piece.classList.add("hint-glow");
  piece.draggable = false;
  incMoveCount();
  setTimeout(() => piece.classList.remove("hint-glow"), 1200);
  checkWinCondition();
}

/* ====== Speech hover (opsional) ====== */
function addVoiceEventListeners() {
  const say = debounce(speak, 300);
  [
    ["back-btn", "Kembali ke Halaman Utama"],
    ["mute-btn", "Nyalakan atau Matikan Musik"],
  ].forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el)
      el.addEventListener("mouseenter", () => say(text), { passive: true });
  });
  restartBtn?.addEventListener("mouseenter", () => say("Ulangi Permainan"), {
    passive: true,
  });
  difficultySelect?.addEventListener(
    "mouseenter",
    () => say("Pilih Tingkat Kesulitan"),
    { passive: true }
  );
  difficultySelect?.addEventListener("change", () => {
    const t =
      difficultySelect.options[difficultySelect.selectedIndex]?.text || "";
    say(`Kesulitan diubah menjadi ${t}`);
  });
  imageSelect?.addEventListener(
    "mouseenter",
    () => say("Pilih Gambar Puzzle"),
    { passive: true }
  );
  imageSelect?.addEventListener("change", () => {
    const t = imageSelect.options[imageSelect.selectedIndex]?.text || "";
    say(`Puzzle diubah menjadi ${t}`);
  });
}

/* ====== INIT ====== */
window.addEventListener(
  "load",
  () => {
    // baca game dari variabel global PHP (pretty URL)
    const selectedGame = window.selectedGame || '';
    if (selectedGame) {
      for (const option of imageSelect.options) {
        if (option.value.includes(selectedGame)) {
          imageSelect.value = option.value;
          break;
        }
      }
    }

    setTimeout(
      () => speak("Selamat datang di E-Moszle! Silakan pilih permainanmu."),
      800
    );
    setupGame();

    const yearElement = document.getElementById("current-year");
    if (yearElement) yearElement.textContent = String(new Date().getFullYear());
  },
  { once: true }
);
