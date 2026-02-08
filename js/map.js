/**
 * 地图模块
 * 负责网格系统、路径管理和可建造区域判断
 */

/**
 * 地图类
 * 管理游戏地图的所有信息
 */
export class GameMap {
    constructor(width, height, tileSize = 40) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.cols = Math.ceil(width / tileSize);
        this.rows = Math.ceil(height / tileSize);

        // 初始化网格
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

        // 路径点数组
        this.path = [];
        // 起点和终点
        this.startPoint = null;
        this.endPoint = null;
    }

    /**
     * 设置路径
     * @param {Array} pathPoints - 路径点数组 [{x, y}, ...]
     */
    setPath(pathPoints) {
        this.path = pathPoints;
        this.startPoint = pathPoints[0];
        this.endPoint = pathPoints[pathPoints.length - 1];

        // 标记路径上的网格
        for (let i = 0; i < pathPoints.length - 1; i++) {
            const start = pathPoints[i];
            const end = pathPoints[i + 1];
            this.markPathLine(start, end);
        }
    }

    /**
     * 标记路径线段经过的网格
     * @param {Object} start - 起点 {x, y}
     * @param {Object} end - 终点 {x, y}
     */
    markPathLine(start, end) {
        const startCol = Math.floor(start.x / this.tileSize);
        const startRow = Math.floor(start.y / this.tileSize);
        const endCol = Math.floor(end.x / this.tileSize);
        const endRow = Math.floor(end.y / this.tileSize);

        // 使用Bresenham算法标记路径
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
     * 获取网格单元格
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @returns {Object|null} 网格单元格
     */
    getCell(col, row) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            return this.grid[row][col];
        }
        return null;
    }

    /**
     * 根据像素坐标获取网格单元格
     * @param {number} x - x坐标
     * @param {number} y - y坐标
     * @returns {Object|null} 网格单元格
     */
    getCellAt(x, y) {
        const col = Math.floor(x / this.tileSize);
        const row = Math.floor(y / this.tileSize);
        return this.getCell(col, row);
    }

    /**
     * 检查位置是否可以建造
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @returns {boolean} 是否可以建造
     */
    canBuild(col, row) {
        const cell = this.getCell(col, row);
        return cell && cell.type === 'empty';
    }

    /**
     * 检查像素坐标位置是否可以建造
     * @param {number} x - x坐标
     * @param {number} y - y坐标
     * @returns {boolean} 是否可以建造
     */
    canBuildAt(x, y) {
        const cell = this.getCellAt(x, y);
        return cell && cell.type === 'empty';
    }

    /**
     * 在指定位置放置防御塔
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @param {Tower} tower - 防御塔实例
     * @returns {boolean} 是否放置成功
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
     * 移除指定位置的防御塔
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @returns {boolean} 是否移除成功
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
     * 获取指定位置的防御塔
     * @param {number} x - x坐标
     * @param {number} y - y坐标
     * @returns {Tower|null} 防御塔实例
     */
    getTowerAt(x, y) {
        const cell = this.getCellAt(x, y);
        return cell ? cell.tower : null;
    }

    /**
     * 获取路径上的下一个点
     * @param {number} currentIndex - 当前路径点索引
     * @returns {Object|null} 下一个路径点
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
     * 获取路径上的指定点
     * @param {number} index - 路径点索引
     * @returns {Object|null} 路径点
     */
    getPathPoint(index) {
        if (index >= 0 && index < this.path.length) {
            return this.path[index];
        }
        return null;
    }

    /**
     * 获取路径总长度
     * @returns {number} 路径点数
     */
    getPathLength() {
        return this.path.length;
    }

    /**
     * 绘制地图
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    render(ctx) {
        // 绘制网格背景
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

        // 绘制路径
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

            // 绘制路径边框
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

        // 绘制起点
        if (this.startPoint) {
            this.drawPoint(ctx, this.startPoint, '#00ff00', '起点');
        }

        // 绘制终点
        if (this.endPoint) {
            this.drawPoint(ctx, this.endPoint, '#ff0000', '终点');
        }
    }

    /**
     * 绘制路径点标记
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {Object} point - 点坐标
     * @param {string} color - 颜色
     * @param {string} label - 标签
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
     * 绘制可建造区域高亮
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} mouseX - 鼠标x坐标
     * @param {number} mouseY - 鼠标y坐标
     * @param {boolean} canBuild - 是否可以建造
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
     * 获取网格坐标对应的像素中心坐标
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @returns {Object} 中心坐标 {x, y}
     */
    getCellCenter(col, row) {
        return {
            x: col * this.tileSize + this.tileSize / 2,
            y: row * this.tileSize + this.tileSize / 2
        };
    }

    /**
     * 重置地图
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
 * 预设地图配置
 */
export const MapPresets = {
    /**
     * 简单直线地图
     * @param {number} width - 地图宽度
     * @param {number} height - 地图高度
     * @returns {Array} 路径点数组
     */
    straight(width, height) {
        const margin = 60;
        return [
            { x: margin, y: height / 2 },
            { x: width - margin, y: height / 2 }
        ];
    },

    /**
     * Z字形地图
     * @param {number} width - 地图宽度
     * @param {number} height - 地图高度
     * @returns {Array} 路径点数组
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
     * 螺旋形地图
     * @param {number} width - 地图宽度
     * @param {number} height - 地图高度
     * @returns {Array} 路径点数组
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
     * S形地图
     * @param {number} width - 地图宽度
     * @param {number} height - 地图高度
     * @returns {Array} 路径点数组
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
