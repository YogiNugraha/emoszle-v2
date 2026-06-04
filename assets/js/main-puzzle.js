import { AudioController } from "./modules/utils/AudioController.js";
import { TTSController } from "./modules/utils/TTSController.js";
import { Timer } from "./modules/utils/Timer.js";
import { Storage } from "./modules/utils/Storage.js";
import { PuzzleGame } from "./modules/games/PuzzleGame.js";

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const elements = {
        board: document.getElementById("board"),
        hintBtn: document.getElementById("hint-btn"),
        pieceContainer: document.getElementById("piece-container"),
        restartBtn: document.getElementById("restart-btn"),
        difficultySelect: document.getElementById("difficulty"),
        imageSelect: document.getElementById("image-select"),
        referenceImage: document.getElementById("reference-image"),
        timerDisplay: document.getElementById("timer"),
        moveCountDisplay: document.getElementById("move-count"),
        highScoreDisplay: document.getElementById("high-score"),
        winModal: document.getElementById("win-modal"),
        winTitle: document.getElementById("win-title"),
        finalTime: document.getElementById("final-time"),
        finalMoves: document.getElementById("final-moves"),
        playAgainBtn: document.getElementById("play-again-btn"),
        muteBtn: document.getElementById("mute-btn"),
        backBtn: document.getElementById("back-btn"),
        mobileRefBtn: document.getElementById("mobile-ref-btn"),
        refModal: document.getElementById("reference-modal"),
        closeRefBtn: document.getElementById("close-ref-btn"),
        modalRefImage: document.getElementById("modal-reference-image"),
        referenceName: document.getElementById("reference-name"),
        modalRefName: document.getElementById("modal-reference-name")
    };

    // Initialize Utilities
    const audioCtrl = new AudioController();
    const ttsCtrl = new TTSController(audioCtrl);
    const timer = new Timer(elements.timerDisplay);

    // --- Reference Modal Logic ---
    if (elements.mobileRefBtn && elements.refModal) {
        elements.mobileRefBtn.addEventListener("click", () => {
            elements.refModal.classList.remove("hidden");
            elements.refModal.setAttribute("aria-hidden", "false");
            audioCtrl.play('drop');
        });

        elements.closeRefBtn.addEventListener("click", () => {
            elements.refModal.classList.add("hidden");
            elements.refModal.setAttribute("aria-hidden", "true");
            audioCtrl.play('drop');
        });

        // Close on outside click
        elements.refModal.addEventListener("click", (e) => {
            if (e.target === elements.refModal) {
                elements.closeRefBtn.click();
            }
        });
    }

    // Initialize Game Core
    const game = new PuzzleGame({
        board: elements.board,
        pieceContainer: elements.pieceContainer,
        referenceImage: elements.referenceImage,
        moveCountDisplay: elements.moveCountDisplay
    });

    // Wire up events
    game.onGameStart = () => {
        if (!timer.isRunning) {
            timer.start();
        }
    };

    game.onDropSuccess = () => {
        audioCtrl.playDropSound();
    };

    game.onWin = () => {
        timer.stop();
        
        const isNewRecord = Storage.saveHighScore(game.difficulty, game.imageSrc, timer.getTimeElapsed());
        
        if (elements.winTitle) {
            elements.winTitle.textContent = isNewRecord ? "REKOR BARU! 🏆" : "Asyik, Berhasil! 🎉";
        }
        
        Storage.loadHighScore(game.difficulty, game.imageSrc, elements.highScoreDisplay);
        
        audioCtrl.playWinSound();
        
        const elapsedSecs = timer.getTimeElapsed();
        const mins = Math.floor(elapsedSecs / 60);
        const secs = elapsedSecs % 60;
        let timeSpeech = "";
        if (mins > 0) timeSpeech += `${mins} menit `;
        if (secs > 0 || mins === 0) timeSpeech += `${secs} detik`;
        
        ttsCtrl.speak(
            `Asyik, Berhasil! Kamu menyelesaikan puzzle dalam waktu ${timeSpeech}, dengan ${game.moveCount} gerakan.`
        );
        
        if (elements.finalTime) elements.finalTime.textContent = Timer.formatTime(timer.getTimeElapsed());
        if (elements.finalMoves) elements.finalMoves.textContent = String(game.moveCount);
        if (elements.winModal) elements.winModal.classList.remove("hidden");
    };

    // --- Game Setup ---
    const setupGame = () => {
        const diff = elements.difficultySelect?.value || "easy";
        const img = elements.imageSelect?.value || "assets/img/engklek-kapal.png";
        const imgName = elements.imageSelect?.options[elements.imageSelect.selectedIndex]?.text || "Engklek Kapal";
        
        elements.referenceImage.src = img;
        if (elements.referenceName) {
            elements.referenceName.textContent = imgName;
        }

        if (elements.modalRefImage) {
            elements.modalRefImage.src = img;
        }
        if (elements.modalRefName) {
            elements.modalRefName.textContent = imgName;
        }
        
        timer.stop();
        timer.reset();
        Storage.loadHighScore(diff, img, elements.highScoreDisplay);
        
        if (elements.winModal) elements.winModal.classList.add("hidden");
        
        game.setup(diff, img);
    };

    // Debounce/Throttle Helpers (from original)
    const debounce = (fn, wait = 150) => {
        let t;
        return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); };
    };

    // Bind UI Events
    elements.restartBtn?.addEventListener("click", setupGame);
    elements.playAgainBtn?.addEventListener("click", setupGame);
    elements.muteBtn?.addEventListener("click", () => audioCtrl.toggleMusic(elements.muteBtn));
    
    elements.hintBtn?.addEventListener("click", () => {
        const result = game.giveHint();
        if (result && result.piece && result.target) {
            ttsCtrl.speak("Petunjuk aktif. Pasangkan potongan yang menyala hijau ke kotak yang berkedip kuning.");
        } else if (result === false) {
            ttsCtrl.speak("Semua potongan sudah benar!");
        }
    });

    const setupGameDebounced = debounce(setupGame, 150);
    elements.difficultySelect?.addEventListener("change", setupGameDebounced);
    
    elements.imageSelect?.addEventListener("mouseenter", () => say("Pilih Gambar Puzzle"), { passive: true });
    elements.imageSelect.addEventListener("change", (e) => {
        elements.referenceImage.src = e.target.value;
        if (elements.modalRefImage) {
            elements.modalRefImage.src = e.target.value;
        }
        setupGameDebounced();
    });
    
    // Recalculate board sizes on window resize
    window.addEventListener("resize", setupGameDebounced);

    // Setup TTS Hover events
    const say = debounce(ttsCtrl.speak.bind(ttsCtrl), 300);
    
    elements.backBtn?.addEventListener("mouseenter", () => say("Kembali ke Halaman Utama"), { passive: true });
    elements.muteBtn?.addEventListener("mouseenter", () => say("Nyalakan atau Matikan Musik"), { passive: true });
    elements.restartBtn?.addEventListener("mouseenter", () => say("Ulangi Permainan"), { passive: true });
    elements.difficultySelect?.addEventListener("mouseenter", () => say("Pilih Tingkat Kesulitan"), { passive: true });
    
    elements.difficultySelect?.addEventListener("change", () => {
        const t = elements.difficultySelect.options[elements.difficultySelect.selectedIndex]?.text || "";
        say(`Kesulitan diubah menjadi ${t}`);
    });
    
    elements.imageSelect?.addEventListener("change", () => {
        const t = elements.imageSelect.options[elements.imageSelect.selectedIndex]?.text || "";
        say(`Puzzle diubah menjadi ${t}`);
    });

    // Initialization
    const init = () => {
        const selectedGame = window.selectedGame || '';
        if (selectedGame && elements.imageSelect) {
            for (const option of elements.imageSelect.options) {
                if (option.value.includes(selectedGame)) {
                    elements.imageSelect.value = option.value;
                    break;
                }
            }
        }
        // Setup game board (without sound)
        setupGame();

        if (elements.currentYear) {
            elements.currentYear.textContent = String(new Date().getFullYear());
        }
    };

    // Handle Browser Autoplay Policy
    let hasInteracted = false;
    const unlockAudio = () => {
        if (hasInteracted) return;
        hasInteracted = true;
        
        // Start background music
        if (!audioCtrl.isMusicPlaying) {
            audioCtrl.toggleMusic(elements.muteBtn);
        }
        
        // Speak welcome message
        setTimeout(() => ttsCtrl.speak("Selamat datang di E-Moszle! Silakan pilih permainanmu."), 200);
        
        // Clean up listeners
        ['click', 'touchstart', 'mousedown', 'keydown'].forEach(e => {
            document.removeEventListener(e, unlockAudio, { capture: true });
        });
    };

    ['click', 'touchstart', 'mousedown', 'keydown'].forEach(e => {
        document.addEventListener(e, unlockAudio, { once: true, capture: true });
    });

    // Run init
    init();
});
