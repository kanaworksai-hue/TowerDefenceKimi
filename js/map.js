/**
 * Map Module
 * Grid System、Path Management
 */

/**
 * Map Class
 * 
 */
export class GameMap {
    constructor(width, height, tileSize = 40) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.cols = Math.ceil(width / tileSize);
        this.rows = Math.ceil(height / tileSize);

        // Initialize Grid
        this.grid = [];
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = {
                    type: 'empty',  // empty, path, tower, blocked
                    tower: null,
                    row: row,
                    col: col,
                    x: col * tileSize + tileSize / 2,
                    y: row * tileSize + tileSize / 2
                };
            }
        }

        // 
        this.path = [];
        // StartEnd
        this.startPoint = null;
        this.endPoint = null;
    }

    /**
     * Set Path
     * @param {Array} pathPoints -  [{x, y}, ...]
     */
    setPath(pathPoints) {
        this.path = pathPoints;
        this.startPoint = pathPoints[0];
        this.endPoint = pathPoints[pathPoints.length - 1];

        // 
        for (let i = 0; i < pathPoints.length - 1; i++) {
            const start = pathPoints[i];
            const end = pathPoints[i + 1];
            this.markPathLine(start, end);
        }
    }

    /**
     * 
     * @param {Object} start - Start {x, y}
     * @param {Object} end - End {x, y}
     */
    markPathLine(start, end) {
        const startCol = Math.floor(start.x / this.tileSize);
        const startRow = Math.floor(start.y / this.tileSize);
        const endCol = Math.floor(end.x / this.tileSize);
        const endRow = Math.floor(end.y / this.tileSize);

        // Bresenham
        const dx = Math.abs(endCol - startCol);
        const dy = Math.abs(endRow - startRow);
        const sx = startCol < endCol ? 1 : -1;
        const sy = startRow < endRow ? 1 : -1;
        let err = dx - dy;

        let x = startCol;
        let y = startRow;

        while (true) {
            if (y >= 0 && y < this.rows && x >= 0 && x < this.cols) {
                this.grid[y][x].type = 'path';
            }

            if (x === endCol && y === endRow) break;

            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }
    }

    /**
     * 
     * @param {number} col - 
     * @param {number} row - 
     * @returns {Object|null} 
     */
    getCell(col, row) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            return this.grid[row][col];
        }
        return null;
    }

    /**
     * 
     * @param {number} x - x
     * @param {number} y - y
     * @returns {Object|null} 
     */
    getCellAt(x, y) {
        const col = Math.floor(x / this.tileSize);
        const row = Math.floor(y / this.tileSize);
        return this.getCell(col, row);
    }

    /**
     * 
     * @param {number} col - 
     * @param {number} row - 
     * @returns {boolean} 
     */
    canBuild(col, row) {
        const cell = this.getCell(col, row);
        return cell && cell.type === 'empty';
    }

    /**
     * 
     * @param {number} x - x
     * @param {number} y - y
     * @returns {boolean} 
     */
    canBuildAt(x, y) {
        const cell = this.getCellAt(x, y);
        return cell && cell.type === 'empty';
    }

    /**
     * Place Tower
     * @param {number} col - 
     * @param {number} row - 
     * @param {Tower} tower - 
     * @returns {boolean} 
     */
    placeTower(col, row, tower) {
        const cell = this.getCell(col, row);
        if (cell && cell.type === 'empty') {
            cell.type = 'tower';
            cell.tower = tower;
            return true;
        }
        return false;
    }

    /**
     * 
     * @param {number} col - 
     * @param {number} row - 
     * @returns {boolean} 
     */
    removeTower(col, row) {
        const cell = this.getCell(col, row);
        if (cell && cell.type === 'tower') {
            cell.type = 'empty';
            cell.tower = null;
            return true;
        }
        return false;
    }

    /**
     * 
     * @param {number} x - x
     * @param {number} y - y
     * @returns {Tower|null} 
     */
    getTowerAt(x, y) {
        const cell = this.getCellAt(x, y);
        return cell ? cell.tower : null;
    }

    /**
     * 
     * @param {number} currentIndex - 
     * @returns {Object|null} 
     */
    getNextPathPoint(currentIndex) {
        if (currentIndex + 1 < this.path.length) {
            return {
                point: this.path[currentIndex + 1],
                index: currentIndex + 1
            };
        }
        return null;
    }

    /**
     * 
     * @param {number} index - 
     * @returns {Object|null} 
     */
    getPathPoint(index) {
        if (index >= 0 && index < this.path.length) {
            return this.path[index];
        }
        return null;
    }

    /**
     * 
     * @returns {number} 
     */
    getPathLength() {
        return this.path.length;
    }

    /**
     * Draw Map
     * @param {CanvasRenderingContext2D} ctx - Canvas
     */
    render(ctx) {
        // Draw Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;

        for (let row = 0; row <= this.rows; row++) {
            ctx.beginPath();
            ctx.moveTo(0, row * this.tileSize);
            ctx.lineTo(this.width, row * this.tileSize);
            ctx.stroke();
        }

        for (let col = 0; col <= this.cols; col++) {
            ctx.beginPath();
            ctx.moveTo(col * this.tileSize, 0);
            ctx.lineTo(col * this.tileSize, this.height);
            ctx.stroke();
        }

        // Draw Path
        if (this.path.length > 0) {
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = this.tileSize * 0.6;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(this.path[0].x, this.path[0].y);
            for (let i = 1; i < this.path.length; i++) {
                ctx.lineTo(this.path[i].x, this.path[i].y);
            }
            ctx.stroke();

            // Draw Path
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = this.tileSize * 0.7;
            ctx.globalCompositeOperation = 'destination-over';
            ctx.beginPath();
            ctx.moveTo(this.path[0].x, this.path[0].y);
            for (let i = 1; i < this.path.length; i++) {
                ctx.lineTo(this.path[i].x, this.path[i].y);
            }
            ctx.stroke();
            ctx.globalCompositeOperation = 'source-over';
        }

        // Start
        if (this.startPoint) {
            this.drawPoint(ctx, this.startPoint, '#00ff00', 'Start');
        }

        // End
        if (this.endPoint) {
            this.drawPoint(ctx, this.endPoint, '#ff0000', 'End');
        }
    }

    /**
     * Draw Path
     * @param {CanvasRenderingContext2D} ctx - Canvas
     * @param {Object} point - 
     * @param {string} color - 
     * @param {string} label - 
     */
    drawPoint(ctx, point, color, label) {
        const size = this.tileSize * 0.8;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, point.x, point.y);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx - Canvas
     * @param {number} mouseX - x
     * @param {number} mouseY - y
     * @param {boolean} canBuild - 
     */
    renderBuildHighlight(ctx, mouseX, mouseY, canBuild) {
        const cell = this.getCellAt(mouseX, mouseY);
        if (!cell) return;

        const x = cell.col * this.tileSize;
        const y = cell.row * this.tileSize;

        ctx.fillStyle = canBuild ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(x, y, this.tileSize, this.tileSize);

        ctx.strokeStyle = canBuild ? '#00ff00' : '#ff0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, this.tileSize, this.tileSize);
    }

    /**
     * 
     * @param {number} col - 
     * @param {number} row - 
     * @returns {Object}  {x, y}
     */
    getCellCenter(col, row) {
        return {
            x: col * this.tileSize + this.tileSize / 2,
            y: row * this.tileSize + this.tileSize / 2
        };
    }

    /**
     * Reset Map
     */
    reset() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.grid[row][col];
                if (cell.type === 'tower') {
                    cell.type = 'empty';
                    cell.tower = null;
                }
            }
        }
    }
}

/**
 * 
 */
export const MapPresets = {
    /**
     * 
     * @param {number} width - 
     * @param {number} height - 
     * @returns {Array} 
     */
    straight(width, height) {
        const margin = 60;
        return [
            { x: margin, y: height / 2 },
            { x: width - margin, y: height / 2 }
        ];
    },

    /**
     * Z
     * @param {number} width - 
     * @param {number} height - 
     * @returns {Array} 
     */
    zigzag(width, height) {
        const margin = 60;
        const midY = height / 2;
        const quarterY = height / 4;
        const threeQuarterY = height * 3 / 4;

        return [
            { x: margin, y: quarterY },
            { x: width * 0.3, y: quarterY },
            { x: width * 0.3, y: threeQuarterY },
            { x: width * 0.7, y: threeQuarterY },
            { x: width * 0.7, y: quarterY },
            { x: width - margin, y: quarterY }
        ];
    },

    /**
     * 
     * @param {number} width - 
     * @param {number} height - 
     * @returns {Array} 
     */
    spiral(width, height) {
        const margin = 80;
        const centerX = width / 2;
        const centerY = height / 2;

        return [
            { x: margin, y: margin },
            { x: width - margin, y: margin },
            { x: width - margin, y: height - margin },
            { x: margin + 100, y: height - margin },
            { x: margin + 100, y: margin + 100 },
            { x: width - margin - 100, y: margin + 100 },
            { x: width - margin - 100, y: height - margin - 100 },
            { x: centerX, y: height - margin - 100 },
            { x: centerX, y: centerY }
        ];
    },

    /**
     * S
     * @param {number} width - 
     * @param {number} height - 
     * @returns {Array} 
     */
    snake(width, height) {
        const margin = 60;
        const segments = 4;
        const segmentWidth = (width - margin * 2) / segments;
        const path = [{ x: margin, y: margin }];

        for (let i = 0; i < segments; i++) {
            const x = margin + (i + 1) * segmentWidth;
            const y = i % 2 === 0 ? height - margin : margin;
            path.push({ x, y });

            if (i < segments - 1) {
                const nextY = i % 2 === 0 ? height - margin : margin;
                path.push({ x, y: nextY });
            }
        }

        return path;
    }
};
