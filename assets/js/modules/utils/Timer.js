export class Timer {
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.timerInterval = null;
        this.timeElapsed = 0;
    }

    static formatTime(s) {
        return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    }

    start() {
        this.stop();
        this.timerInterval = setInterval(() => {
            this.timeElapsed++;
            if (this.displayElement) {
                this.displayElement.textContent = Timer.formatTime(this.timeElapsed);
            }
        }, 1000);
    }

    stop() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    reset() {
        this.stop();
        this.timeElapsed = 0;
        if (this.displayElement) {
            this.displayElement.textContent = "00:00";
        }
    }

    getTimeElapsed() {
        return this.timeElapsed;
    }
}
