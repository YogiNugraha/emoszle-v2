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
        currentYear: document.getElementById("current-year")
    };

    // Initialize Utilities
    const audioCtrl = new AudioController();
    const ttsCtrl = new TTSController(audioCtrl);
    const timer = new Timer(elements.timerDisplay);

    // Initialize Game Core
    const game = new PuzzleGame({
        board: elements.board,
        pieceContainer: elements.pieceContainer,
        referenceImage: elements.referenceImage,
        moveCountDisplay: elements.moveCountDisplay
    });

    // Wire up events
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
        
        ttsCtrl.speak(
            `Asyik, Berhasil! Kamu menyelesaikan puzzle dalam ${Timer.formatTime(timer.getTimeElapsed())}, dengan ${game.moveCount} gerakan.`
        );
        
        if (elements.finalTime) elements.finalTime.textContent = Timer.formatTime(timer.getTimeElapsed());
        if (elements.finalMoves) elements.finalMoves.textContent = String(game.moveCount);
        if (elements.winModal) elements.winModal.classList.remove("hidden");
    };

    // Game Flow Functions
    const setupGame = () => {
        const diff = elements.difficultySelect.value;
        const img = elements.imageSelect.value;
        
        timer.reset();
        Storage.loadHighScore(diff, img, elements.highScoreDisplay);
        
        if (elements.winModal) elements.winModal.classList.add("hidden");
        
        game.setup(diff, img);
        timer.start();
        
        if (!audioCtrl.isMusicPlaying) {
            audioCtrl.toggleMusic(elements.muteBtn);
        }
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
        if (result && result.obstructMoved) {
            ttsCtrl.speak("Memindahkan potongan penghalang.");
        } else if (result === false) {
            ttsCtrl.speak("Semua potongan sudah benar!");
        }
    });

    const setupGameDebounced = debounce(setupGame, 150);
    elements.difficultySelect?.addEventListener("change", setupGameDebounced);
    elements.imageSelect?.addEventListener("change", setupGameDebounced);

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
    
    elements.imageSelect?.addEventListener("mouseenter", () => say("Pilih Gambar Puzzle"), { passive: true });
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

        setTimeout(() => ttsCtrl.speak("Selamat datang di E-Moszle! Silakan pilih permainanmu."), 800);
        setupGame();

        if (elements.currentYear) {
            elements.currentYear.textContent = String(new Date().getFullYear());
        }
    };

    // Run init
    init();
});
