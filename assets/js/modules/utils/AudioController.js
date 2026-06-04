export class AudioController {
    constructor() {
        this.bgMusic = document.getElementById("bg-music");
        this.dropSound = document.getElementById("drop-sound");
        this.winSound = document.getElementById("win-sound");
        
        this.isMusicPlaying = false;
        this.MUSIC_VOLUME_NORMAL = 0.4;
        this.MUSIC_VOLUME_DUCKED = 0.1;
    }

    toggleMusic(muteBtnElement) {
        if (!this.bgMusic) return;
        this.isMusicPlaying = !this.isMusicPlaying;
        
        if (this.isMusicPlaying) {
            this.bgMusic.volume = this.MUSIC_VOLUME_NORMAL;
            this.bgMusic.loop = true;
            this.bgMusic.play().catch(() => {});
            if (muteBtnElement) muteBtnElement.textContent = "🔊";
        } else {
            this.bgMusic.pause();
            if (muteBtnElement) muteBtnElement.textContent = "🔇";
        }
    }

    duckMusic() {
        if (this.isMusicPlaying && this.bgMusic) {
            this.bgMusic.volume = this.MUSIC_VOLUME_DUCKED;
        }
    }

    restoreMusic() {
        if (this.isMusicPlaying && this.bgMusic) {
            this.bgMusic.volume = this.MUSIC_VOLUME_NORMAL;
        }
    }

    playDropSound() {
        try {
            if (this.dropSound) {
                this.dropSound.currentTime = 0;
                this.dropSound.play().catch(() => {});
            }
        } catch (e) {}
    }

    playWinSound() {
        try {
            if (this.winSound) {
                this.winSound.currentTime = 0;
                this.winSound.play().catch(() => {});
            }
        } catch (e) {}
    }
}
