/**
 * 工具函数模块
 * 包含数学计算、碰撞检测等通用功能
 */

/**
 * 计算两点之间的距离
 * @param {number} x1 - 点1的x坐标
 * @param {number} y1 - 点1的y坐标
 * @param {number} x2 - 点2的x坐标
 * @param {number} y2 - 点2的y坐标
 * @returns {number} 两点之间的距离
 */
export function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 计算两点之间的距离平方（用于性能优化，避免开方运算）
 * @param {number} x1 - 点1的x坐标
 * @param {number} y1 - 点1的y坐标
 * @param {number} x2 - 点2的x坐标
 * @param {number} y2 - 点2的y坐标
 * @returns {number} 两点之间的距离平方
 */
export function distanceSquared(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return dx * dx + dy * dy;
}

/**
 * 检测两个圆形是否碰撞
 * @param {number} x1 - 圆1的x坐标
 * @param {number} y1 - 圆1的y坐标
 * @param {number} r1 - 圆1的半径
 * @param {number} x2 - 圆2的x坐标
 * @param {number} y2 - 圆2的y坐标
 * @param {number} r2 - 圆2的半径
 * @returns {boolean} 是否碰撞
 */
export function circleCollision(x1, y1, r1, x2, y2, r2) {
    const distSq = distanceSquared(x1, y1, x2, y2);
    const radiusSum = r1 + r2;
    return distSq <= radiusSum * radiusSum;
}

/**
 * 检测点是否在圆内
 * @param {number} px - 点的x坐标
 * @param {number} py - 点的y坐标
 * @param {number} cx - 圆心的x坐标
 * @param {number} cy - 圆心的y坐标
 * @param {number} r - 圆的半径
 * @returns {boolean} 点是否在圆内
 */
export function pointInCircle(px, py, cx, cy, r) {
    return distanceSquared(px, py, cx, cy) <= r * r;
}

/**
 * 检测点是否在矩形内
 * @param {number} px - 点的x坐标
 * @param {number} py - 点的y坐标
 * @param {number} rx - 矩形左上角的x坐标
 * @param {number} ry - 矩形左上角的y坐标
 * @param {number} rw - 矩形的宽度
 * @param {number} rh - 矩形的高度
 * @returns {boolean} 点是否在矩形内
 */
export function pointInRect(px, py, rx, ry, rw, rh) {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

/**
 * 检测两个矩形是否碰撞
 * @param {number} x1 - 矩形1的x坐标
 * @param {number} y1 - 矩形1的y坐标
 * @param {number} w1 - 矩形1的宽度
 * @param {number} h1 - 矩形1的高度
 * @param {number} x2 - 矩形2的x坐标
 * @param {number} y2 - 矩形2的y坐标
 * @param {number} w2 - 矩形2的宽度
 * @param {number} h2 - 矩形2的高度
 * @returns {boolean} 是否碰撞
 */
export function rectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

/**
 * 计算两点之间的角度
 * @param {number} x1 - 起点x坐标
 * @param {number} y1 - 起点y坐标
 * @param {number} x2 - 终点x坐标
 * @param {number} y2 - 终点y坐标
 * @returns {number} 角度（弧度）
 */
export function angle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * 将角度限制在0到2π之间
 * @param {number} rad - 弧度值
 * @returns {number} 规范化后的弧度值
 */
export function normalizeAngle(rad) {
    while (rad < 0) rad += Math.PI * 2;
    while (rad >= Math.PI * 2) rad -= Math.PI * 2;
    return rad;
}

/**
 * 线性插值
 * @param {number} start - 起始值
 * @param {number} end - 结束值
 * @param {number} t - 插值因子(0-1)
 * @returns {number} 插值结果
 */
export function lerp(start, end, t) {
    return start + (end - start) * t;
}

/**
 * 获取两点之间的方向向量
 * @param {number} x1 - 起点x坐标
 * @param {number} y1 - 起点y坐标
 * @param {number} x2 - 终点x坐标
 * @param {number} y2 - 终点y坐标
 * @returns {Object} 单位向量 {x, y}
 */
export function direction(x1, y1, x2, y2) {
    const dist = distance(x1, y1, x2, y2);
    if (dist === 0) return { x: 0, y: 0 };
    return {
        x: (x2 - x1) / dist,
        y: (y2 - y1) / dist
    };
}

/**
 * 生成随机整数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} 随机整数
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成随机浮点数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 随机浮点数
 */
export function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * 限制数值在范围内
 * @param {number} value - 要限制的值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 限制后的值
 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * 格式化数字显示
 * @param {number} num - 数字
 * @returns {string} 格式化后的字符串
 */
export function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * 颜色工具函数
 */
export const ColorUtils = {
    /**
     * 将十六进制颜色转换为RGB对象
     * @param {string} hex - 十六进制颜色值
     * @returns {Object} RGB对象 {r, g, b}
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    /**
     * 将RGB值转换为十六进制颜色
     * @param {number} r - 红色值(0-255)
     * @param {number} g - 绿色值(0-255)
     * @param {number} b - 蓝色值(0-255)
     * @returns {string} 十六进制颜色值
     */
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    /**
     * 混合两种颜色
     * @param {string} color1 - 第一种颜色(十六进制)
     * @param {string} color2 - 第二种颜色(十六进制)
     * @param {number} ratio - 混合比例(0-1)
     * @returns {string} 混合后的颜色
     */
    mix(color1, color2, ratio) {
        const c1 = this.hexToRgb(color1);
        const c2 = this.hexToRgb(color2);
        if (!c1 || !c2) return color1;

        const r = Math.round(c1.r + (c2.r - c1.r) * ratio);
        const g = Math.round(c1.g + (c2.g - c1.g) * ratio);
        const b = Math.round(c1.b + (c2.b - c1.b) * ratio);

        return this.rgbToHex(r, g, b);
    }
};

/**
 * 缓动函数
 */
export const Easing = {
    linear: t => t,
    easeIn: t => t * t,
    easeOut: t => 1 - (1 - t) * (1 - t),
    easeInOut: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    elastic: t => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
    }
};

/**
 * 简单的计时器类
 */
export class Timer {
    constructor(duration, callback, repeat = false) {
        this.duration = duration;
        this.callback = callback;
        this.repeat = repeat;
        this.elapsed = 0;
        this.running = false;
    }

    start() {
        this.running = true;
        this.elapsed = 0;
    }

    stop() {
        this.running = false;
    }

    reset() {
        this.elapsed = 0;
    }

    update(deltaTime) {
        if (!this.running) return;

        this.elapsed += deltaTime;
        if (this.elapsed >= this.duration) {
            this.callback();
            if (this.repeat) {
                this.elapsed = 0;
            } else {
                this.running = false;
            }
        }
    }
}

/**
 * 对象池类，用于优化性能
 */
export class ObjectPool {
    constructor(factory, resetFn, initialSize = 10) {
        this.factory = factory;
        this.resetFn = resetFn;
        this.pool = [];
        this.active = [];

        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.factory());
        }
    }

    get() {
        let obj = this.pool.length > 0 ? this.pool.pop() : this.factory();
        this.active.push(obj);
        return obj;
    }

    release(obj) {
        const index = this.active.indexOf(obj);
        if (index > -1) {
            this.active.splice(index, 1);
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }

    releaseAll() {
        for (const obj of this.active) {
            this.resetFn(obj);
            this.pool.push(obj);
        }
        this.active.length = 0;
    }

    forEach(callback) {
        this.active.forEach(callback);
    }

    getActive() {
        return this.active;
    }
}
