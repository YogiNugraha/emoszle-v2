import { Game } from "../core/Game.js";

export class PuzzleGame extends Game {
    constructor(config) {
        super();
        this.board = config.board;
        this.pieceContainer = config.pieceContainer;
        this.referenceImage = config.referenceImage;
        this.moveCountDisplay = config.moveCountDisplay;
        
        this.difficulties = {
            easy: { rows: 2, cols: 3 },
            normal: { rows: 3, cols: 4 },
            hard: { rows: 4, cols: 5 },
        };

        this.rows = 0;
        this.cols = 0;
        this.imageSrc = '';
        this.difficulty = '';
        
        this.draggedPiece = null;
        
        // Touch state
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isDragging = false;
        this.currentTouchTarget = null;
        
        this.onDropSuccess = null; // Callback
        this.onWin = null; // Callback
        
        this.uiBound = false;
    }

    setup(difficulty, imageSrc) {
        this.difficulty = difficulty;
        this.imageSrc = imageSrc;
        this.rows = this.difficulties[difficulty].rows;
        this.cols = this.difficulties[difficulty].cols;
        
        this.reset();
        if (this.moveCountDisplay) {
            this.moveCountDisplay.textContent = "0";
        }
        
        this.board.innerHTML = "";
        this.pieceContainer.innerHTML = "";

        const slotSize = this.getResponsiveSlotSize(this.rows, this.cols);
        const pieceSize = slotSize - 1.5;
        const boardWidth = slotSize * this.cols;
        const boardHeight = slotSize * this.rows;

        this.board.style.width = `${boardWidth}px`;
        this.board.style.height = `${boardHeight}px`;
        this.board.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        this.board.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;

        this.referenceImage.src = this.imageSrc;
        this.referenceImage.style.width = "100%";
        this.referenceImage.style.height = "auto";
        this.referenceImage.style.objectFit = "cover";
        this.referenceImage.style.aspectRatio = `${this.cols}/${this.rows}`;

        this.createSlots(this.rows, this.cols);
        this.createPieces(boardWidth, boardHeight, pieceSize);
        
        this.bindListenersOnce();
    }

    getResponsiveSlotSize(rows, cols) {
        const scroller = document.querySelector(".board-scroll");
        if (!scroller) return 80;
        
        const cs = getComputedStyle(scroller);
        const padX = parseFloat(cs.paddingLeft || 0) + parseFloat(cs.paddingRight || 0);
        const padY = parseFloat(cs.paddingTop || 0) + parseFloat(cs.paddingBottom || 0);
        
        // Add 10px breathing room
        const availableW = scroller.getBoundingClientRect().width - padX - 10;
        const availableH = scroller.getBoundingClientRect().height - padY - 10;
        
        // Calculate max size that fits BOTH width and height constraints
        const sizeW = Math.floor(availableW / cols);
        const sizeH = Math.floor(availableH / rows);
        
        // The slot size is the minimum of width fit and height fit
        let size = Math.min(sizeW, sizeH);
        return Math.max(40, size);
    }

    createSlots(rows, cols) {
        const frag = document.createDocumentFragment();
        for (let i = 0; i < rows * cols; i++) {
            const slot = document.createElement("div");
            slot.className = "slot";
            slot.dataset.index = String(i);
            const r = Math.floor(i / cols), c = i % cols;
            if (r === 0) slot.classList.add("edge-top");
            if (c === 0) slot.classList.add("edge-left");
            if (r === rows - 1) slot.classList.add("edge-bottom");
            if (c === cols - 1) slot.classList.add("edge-right");
            frag.appendChild(slot);
        }
        this.board.appendChild(frag);
    }

    createPieces(boardWidth, boardHeight, pieceSize) {
        const frag = document.createDocumentFragment();

        const pieces = [];
        for (let i = 0; i < this.rows * this.cols; i++) {
            const piece = document.createElement("div");
            piece.className = "piece";
            piece.draggable = true;
            piece.dataset.index = String(i);
            
            const c = i % this.cols;
            const r = Math.floor(i / this.cols);
            const xPct = this.cols > 1 ? (c / (this.cols - 1)) * 100 : 0;
            const yPct = this.rows > 1 ? (r / (this.rows - 1)) * 100 : 0;

            piece.style.setProperty('--piece-w', `${pieceSize}px`);
            piece.style.setProperty('--piece-h', `${pieceSize}px`);
            piece.style.width = 'var(--piece-w)';
            piece.style.height = 'var(--piece-h)';
            piece.style.backgroundImage = `url(${this.imageSrc})`;
            piece.style.backgroundSize = `${this.cols * 100}% ${this.rows * 100}%`;
            piece.style.backgroundPosition = `${xPct}% ${yPct}%`;
            
            pieces.push(piece);
        }
        
        // Shuffle
        for (let i = pieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
        }
        
        pieces.forEach((p) => frag.appendChild(p));
        this.pieceContainer.appendChild(frag);
    }

    resolveDropTarget(el) {
        if (!el) return null;
        if (el.classList?.contains("slot")) return el;
        if (el.id === "piece-container") return el;
        const slot = el.closest?.(".slot");
        if (slot) return slot;
        const pc = el.closest?.("#piece-container");
        if (pc) return pc;
        return null;
    }

    bindListenersOnce() {
        if (this.uiBound) return;
        this.uiBound = true;
        const hosts = [this.board, this.pieceContainer];

        // Desktop DnD
        hosts.forEach((h) => {
            h.addEventListener("dragstart", (e) => {
                const piece = e.target.closest?.(".piece");
                if (!piece) return;
                this.start(); // Active game logic
                this.draggedPiece = piece;
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
                this.draggedPiece = null;
            });

            h.addEventListener("dragover", (e) => {
                if (!this.draggedPiece) return;
                e.preventDefault();
                const t = this.resolveDropTarget(e.target);
                if (!t) return;
                document.querySelectorAll(".drag-over").forEach((el) => el.classList.remove("drag-over"));
                t.classList.add("drag-over");
                if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
            });

            h.addEventListener("dragleave", (e) => {
                const t = this.resolveDropTarget(e.target);
                if (t) t.classList.remove("drag-over");
            });

            h.addEventListener("drop", (e) => {
                if (!this.draggedPiece) return;
                e.preventDefault();
                const t = this.resolveDropTarget(e.target);
                if (!t) return;
                t.classList.remove("drag-over");

                const originalParent = this.draggedPiece.parentElement;
                if (t.classList.contains("slot")) {
                    if (t.children.length > 0) originalParent.appendChild(t.firstElementChild);
                    t.appendChild(this.draggedPiece);
                    this.processDrop();
                } else if (t.id === "piece-container") {
                    t.appendChild(this.draggedPiece);
                    this.processDrop();
                }
            });
        });

        // Touch DnD
        hosts.forEach((h) => {
            h.addEventListener("touchstart", (e) => {
                const piece = e.target.closest?.(".piece");
                if (!piece) return;
                e.preventDefault();
                this.start();
                const touch = e.touches[0];
                this.touchStartX = touch.clientX;
                this.touchStartY = touch.clientY;
                this.currentTouchTarget = piece;
                this.isDragging = false;
                piece.style.transform = "scale(1.05)";
                piece.style.zIndex = "1000";
            }, { passive: false });

            h.addEventListener("touchmove", (e) => {
                if (!this.currentTouchTarget) return;
                e.preventDefault();
                const touch = e.touches[0];
                const dx = Math.abs(touch.clientX - this.touchStartX);
                const dy = Math.abs(touch.clientY - this.touchStartY);
                
                if (!this.isDragging && (dx > 5 || dy > 5)) {
                    this.isDragging = true;
                    this.currentTouchTarget.classList.add("dragging");
                }
                
                if (this.isDragging) {
                    const half = this.currentTouchTarget.offsetWidth / 2 || 40;
                    this.currentTouchTarget.style.position = "fixed";
                    this.currentTouchTarget.style.left = touch.clientX - half + "px";
                    this.currentTouchTarget.style.top = touch.clientY - half + "px";
                    this.currentTouchTarget.style.pointerEvents = "none";

                    const el = document.elementFromPoint(touch.clientX, touch.clientY);
                    document.querySelectorAll(".drag-over").forEach((x) => x.classList.remove("drag-over"));
                    const t = this.resolveDropTarget(el);
                    if (t) t.classList.add("drag-over");
                }
            }, { passive: false });

            h.addEventListener("touchend", (e) => {
                if (!this.currentTouchTarget) return;
                e.preventDefault();
                const piece = this.currentTouchTarget;

                piece.style.transform = "";
                piece.style.zIndex = "";
                piece.style.position = "";
                piece.style.left = "";
                piece.style.top = "";
                piece.style.pointerEvents = "";
                piece.classList.remove("dragging");
                
                document.querySelectorAll(".drag-over").forEach((x) => x.classList.remove("drag-over"));

                if (this.isDragging) {
                    const touch = e.changedTouches[0];
                    const el = document.elementFromPoint(touch.clientX, touch.clientY);
                    const t = this.resolveDropTarget(el);
                    if (t) {
                        const originalParent = piece.parentElement;
                        if (t.classList.contains("slot")) {
                            if (t.children.length > 0) originalParent.appendChild(t.firstElementChild);
                            t.appendChild(piece);
                            this.processDrop();
                        } else if (t.id === "piece-container") {
                            t.appendChild(piece);
                            this.processDrop();
                        }
                    }
                }
                this.currentTouchTarget = null;
                this.isDragging = false;
            }, { passive: false });
        });
    }

    processDrop() {
        const currentMoves = this.incrementMove();
        if (this.moveCountDisplay) {
            this.moveCountDisplay.textContent = String(currentMoves);
        }
        
        if (this.onDropSuccess) {
            this.onDropSuccess();
        }
        
        requestAnimationFrame(() => this.checkWinCondition());
    }

    checkWinCondition() {
        if (this.pieceContainer.children.length > 0) return false; 
        
        const slots = this.board.querySelectorAll(".slot");
        for (const slot of slots) {
            const piece = slot.firstElementChild;
            if (!piece || piece.dataset.index !== slot.dataset.index) return false;
        }
        
        if (this.onWin) {
            this.onWin();
        }
        return true;
    }

    giveHint() {
        this.start(); // Ensure game is active before calculating hints

        // Clear existing hints
        this.pieceContainer.querySelectorAll(".hint-source").forEach(el => el.classList.remove("hint-source"));
        this.board.querySelectorAll(".hint-target").forEach(el => el.classList.remove("hint-target"));

        const misplaced = [];
        this.pieceContainer.querySelectorAll(".piece").forEach((p) => misplaced.push(p));
        
        this.board.querySelectorAll(".slot").forEach((slot) => {
            const p = slot.firstElementChild;
            if (p && p.dataset.index !== slot.dataset.index) misplaced.push(p);
        });
        
        if (misplaced.length === 0) {
            return false; // Already finished or no pieces misplaced
        }

        const piece = misplaced[Math.floor(Math.random() * misplaced.length)];
        const correctIndex = piece.dataset.index;
        const target = this.board.querySelector(`.slot[data-index="${correctIndex}"]`);
        
        if (!target) return false;

        // Highlight the piece and target for the user
        piece.classList.add("hint-source");
        target.classList.add("hint-target");
        
        const currentMoves = this.incrementMove();
        if (this.moveCountDisplay) {
            this.moveCountDisplay.textContent = String(currentMoves);
        }
        
        setTimeout(() => {
            piece.classList.remove("hint-source");
            target.classList.remove("hint-target");
        }, 3000);
        
        return { piece, target };
    }
}
