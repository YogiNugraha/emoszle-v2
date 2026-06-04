export class Game {
    constructor() {
        this.isGameActive = false;
        this.moveCount = 0;
    }

    start() {
        if (!this.isGameActive) {
            this.isGameActive = true;
            if (typeof this.onGameStart === 'function') {
                this.onGameStart();
            }
        }
    }

    reset() {
        this.isGameActive = false;
        this.moveCount = 0;
    }

    incrementMove() {
        if (!this.isGameActive) return;
        this.moveCount++;
        return this.moveCount;
    }

    checkWinCondition() {
        // To be implemented by subclasses
        return false;
    }
}
