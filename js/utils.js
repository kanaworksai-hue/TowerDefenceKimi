/**
 * 
 * Math Calculations、Collision Detection
 */

/**
 * 
 * @param {number} x1 - 1x
 * @param {number} y1 - 1y
 * @param {number} x2 - 2x
 * @param {number} y2 - 2y
 * @returns {number} 
 */
export function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * （，）
 * @param {number} x1 - 1x
 * @param {number} y1 - 1y
 * @param {number} x2 - 2x
 * @param {number} y2 - 2y
 * @returns {number} 
 */
export function distanceSquared(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return dx * dx + dy * dy;
}

/**
 * 
 * @param {number} x1 - 1x
 * @param {number} y1 - 1y
 * @param {number} r1 - 1
 * @param {number} x2 - 2x
 * @param {number} y2 - 2y
 * @param {number} r2 - 2
 * @returns {boolean} 
 */
export function circleCollision(x1, y1, r1, x2, y2, r2) {
    const distSq = distanceSquared(x1, y1, x2, y2);
    const radiusSum = r1 + r2;
    return distSq <= radiusSum * radiusSum;
}

/**
 * 
 * @param {number} px - x
 * @param {number} py - y
 * @param {number} cx - x
 * @param {number} cy - y
 * @param {number} r - 
 * @returns {boolean} 
 */
export function pointInCircle(px, py, cx, cy, r) {
    return distanceSquared(px, py, cx, cy) <= r * r;
}

/**
 * 
 * @param {number} px - x
 * @param {number} py - y
 * @param {number} rx - x
 * @param {number} ry - y
 * @param {number} rw - 
 * @param {number} rh - 
 * @returns {boolean} 
 */
export function pointInRect(px, py, rx, ry, rw, rh) {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

/**
 * 
 * @param {number} x1 - 1x
 * @param {number} y1 - 1y
 * @param {number} w1 - 1
 * @param {number} h1 - 1
 * @param {number} x2 - 2x
 * @param {number} y2 - 2y
 * @param {number} w2 - 2
 * @param {number} h2 - 2
 * @returns {boolean} 
 */
export function rectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

/**
 * 
 * @param {number} x1 - x
 * @param {number} y1 - y
 * @param {number} x2 - x
 * @param {number} y2 - y
 * @returns {number} （）
 */
export function angle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * 02π
 * @param {number} rad - 
 * @returns {number} 
 */
export function normalizeAngle(rad) {
    while (rad < 0) rad += Math.PI * 2;
    while (rad >= Math.PI * 2) rad -= Math.PI * 2;
    return rad;
}

/**
 * Linear Interpolation
 * @param {number} start - 
 * @param {number} end - 
 * @param {number} t - (0-1)
 * @returns {number} 
 */
export function lerp(start, end, t) {
    return start + (end - start) * t;
}

/**
 * 
 * @param {number} x1 - x
 * @param {number} y1 - y
 * @param {number} x2 - x
 * @param {number} y2 - y
 * @returns {Object}  {x, y}
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
 * 
 * @param {number} min - （）
 * @param {number} max - （）
 * @returns {number} 
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 
 * @param {number} min - 
 * @param {number} max - 
 * @returns {number} 
 */
export function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * 
 * @param {number} value - 
 * @param {number} min - 
 * @param {number} max - 
 * @returns {number} 
 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * 
 * @param {number} num - 
 * @returns {string} 
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
 * Color Utils
 */
export const ColorUtils = {
    /**
     * RGB
     * @param {string} hex - 
     * @returns {Object} RGB {r, g, b}
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
     * RGB
     * @param {number} r - (0-255)
     * @param {number} g - (0-255)
     * @param {number} b - (0-255)
     * @returns {string} 
     */
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    /**
     * 
     * @param {string} color1 - ()
     * @param {string} color2 - ()
     * @param {number} ratio - (0-1)
     * @returns {string} 
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
 * Easing Functions
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
 * Timer Class
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
 * Object PoolClass，
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
