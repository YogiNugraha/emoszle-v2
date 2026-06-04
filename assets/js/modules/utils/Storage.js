import { Timer } from "./Timer.js";

export class Storage {
    static getHighScoreKey(difficulty, imageSrc) {
        const imageName = (imageSrc || "").split("/").pop()?.split(".")[0] || "img";
        return `highscore-${difficulty}-${imageName}`;
    }

    static loadHighScore(difficulty, imageSrc, displayElement) {
        try {
            const key = this.getHighScoreKey(difficulty, imageSrc);
            const score = localStorage.getItem(key);
            if (displayElement) {
                displayElement.textContent = score ? Timer.formatTime(parseInt(score, 10)) : "--:--";
            }
            return score;
        } catch (e) {
            if (displayElement) displayElement.textContent = "--:--";
            return null;
        }
    }

    static saveHighScore(difficulty, imageSrc, timeElapsed) {
        try {
            const key = this.getHighScoreKey(difficulty, imageSrc);
            const best = localStorage.getItem(key);
            if (!best || timeElapsed < parseInt(best, 10)) {
                localStorage.setItem(key, String(timeElapsed));
                return true; // Indicates a new high score
            }
            return false;
        } catch (e) {
            return false;
        }
    }
}
