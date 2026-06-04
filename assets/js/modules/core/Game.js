export class Game {
    constructor() {
        this.isGameActive = false;
        this.moveCount = 0;
    }

    start() {
        this.isGameActive = true;
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
