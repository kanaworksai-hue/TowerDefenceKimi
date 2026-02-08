/**
 * Zombie Module
 * Zombie Base Class、()、Take Damage
 */

import { distance, direction } from './utils.js';

/**
 * Zombie Base Class
 */
export class Zombie {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        this.radius = options.radius || 12;

        // 
        this.maxHp = options.hp || 100;
        this.hp = this.maxHp;
        this.speed = options.speed || 30;
        this.reward = options.reward || 10;
        this.damage = options.damage || 1;

        // Class
        this.type = options.type || 'normal';
        this.color = options.color || '#2ecc71';

        // 
        this.alive = true;
        this.reachedEnd = false;
        this.slowed = false;
        this.slowFactor = 1;
        this.slowDuration = 0;

        // 
        this.pathIndex = 0;
        this.path = [];

        // 
        this.animFrame = 0;
        this.animSpeed = 0.15;
    }

    /**
     * Set Path
     */
    setPath(path) {
        this.path = path;
        this.pathIndex = 0;

        // 
        if (path.length > 0) {
            this.x = path[0].x;
            this.y = path[0].y;
        }
    }

    /**
     * Update Zombies
     */
    update(deltaTime, path) {
        if (!this.alive || this.reachedEnd) return;

        // Slow Effect
        if (this.slowed && this.slowDuration > 0) {
            this.slowDuration -= deltaTime;
            if (this.slowDuration <= 0) {
                this.slowed = false;
                this.slowFactor = 1;
            }
        }

        // 
        const currentPath = path || this.path;
        if (!currentPath || currentPath.length === 0) return;

        // Move Along Path
        this.moveAlongPath(deltaTime, currentPath);

        // 
        this.animFrame += this.animSpeed;
    }

    /**
     * Move Along Path
     */
    moveAlongPath(deltaTime, path) {
        if (this.pathIndex >= path.length - 1) {
            this.reachedEnd = true;
            return;
        }

        const target = path[this.pathIndex + 1];
        const dist = distance(this.x, this.y, target.x, target.y);

        // 
        const moveDistance = this.speed * this.slowFactor * (deltaTime / 1000);

        if (dist <= moveDistance) {
            // ，
            this.x = target.x;
            this.y = target.y;
            this.pathIndex++;

            if (this.pathIndex >= path.length - 1) {
                this.reachedEnd = true;
            }
        } else {
            // 
            const dir = direction(this.x, this.y, target.x, target.y);
            this.x += dir.x * moveDistance;
            this.y += dir.y * moveDistance;
        }
    }

    /**
     * Take Damage
     */
    takeDamage(damage) {
        if (!this.alive) return 0;

        this.hp -= damage;

        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
            return this.reward;
        }

        return 0;
    }

    /**
     * Slow Effect
     */
    applySlow(factor, duration) {
        this.slowed = true;
        this.slowFactor = Math.min(this.slowFactor, factor);
        this.slowDuration = Math.max(this.slowDuration, duration);
    }

    /**
     * Is Alive
     */
    isAlive() {
        return this.alive;
    }

    /**
     * 
     */
    hasReachedEnd() {
        return this.reachedEnd;
    }

    /**
     * 
     */
    getHpPercent() {
        return this.hp / this.maxHp;
    }

    /**
     * Render Zombie
     */
    render(ctx) {
        if (!this.alive) return;

        ctx.save();

        // 
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.radius - 2, this.radius, this.radius * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // 
        const wobble = Math.sin(this.animFrame) * 2;

        // 
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + wobble, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 
        const eyeOffset = 4;
        const eyeRadius = 3;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x - eyeOffset + wobble, this.y - 2, eyeRadius, 0, Math.PI * 2);
        ctx.arc(this.x + eyeOffset + wobble, this.y - 2, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // 
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x - eyeOffset + wobble, this.y - 2, 1.5, 0, Math.PI * 2);
        ctx.arc(this.x + eyeOffset + wobble, this.y - 2, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Slow Effect
        if (this.slowed) {
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Draw Health Bar
        this.renderHealthBar(ctx);

        ctx.restore();
    }

    /**
     * 
     */
    renderHealthBar(ctx) {
        const barWidth = 24;
        const barHeight = 4;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.radius - 10;

        // 
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // 
        const hpPercent = this.getHpPercent();
        let hpColor = '#2ecc71';
        if (hpPercent < 0.3) hpColor = '#e74c3c';
        else if (hpPercent < 0.6) hpColor = '#f39c12';

        ctx.fillStyle = hpColor;
        ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

        // 
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}

/**
 * Normal Zombie
 */
export class NormalZombie extends Zombie {
    constructor(x, y) {
        super(x, y, {
            type: 'normal',
            hp: 100,
            speed: 30,
            reward: 10,
            damage: 1,
            color: '#2ecc71'
        });
    }
}

/**
 * Fast Zombie
 */
export class FastZombie extends Zombie {
    constructor(x, y) {
        super(x, y, {
            type: 'fast',
            hp: 60,
            speed: 60,
            reward: 15,
            damage: 1,
            color: '#f39c12',
            radius: 10
        });
    }
}

/**
 * Tank Zombie
 */
export class TankZombie extends Zombie {
    constructor(x, y) {
        super(x, y, {
            type: 'tank',
            hp: 300,
            speed: 20,
            reward: 30,
            damage: 2,
            color: '#8e44ad',
            radius: 16
        });
    }
}

/**
 * Boss Zombie
 */
export class BossZombie extends Zombie {
    constructor(x, y) {
        super(x, y, {
            type: 'boss',
            hp: 1000,
            speed: 15,
            reward: 100,
            damage: 5,
            color: '#c0392b',
            radius: 20
        });
    }
}

/**
 * Zombie Factory
 */
export class ZombieFactory {
    static create(type, x, y) {
        switch (type) {
            case 'normal':
                return new NormalZombie(x, y);
            case 'fast':
                return new FastZombie(x, y);
            case 'tank':
                return new TankZombie(x, y);
            case 'boss':
                return new BossZombie(x, y);
            default:
                return new NormalZombie(x, y);
        }
    }

    /**
     * Spawn ZombieClass
     */
    static createForWave(wave, x, y) {
        const types = ['normal'];

        if (wave >= 2) types.push('fast');
        if (wave >= 4) types.push('tank');
        if (wave >= 8 && wave % 5 === 0) types.push('boss');

        // ，
        const random = Math.random();
        let selectedType = 'normal';

        if (wave >= 8 && random < 0.1) {
            selectedType = 'boss';
        } else if (wave >= 4 && random < 0.3) {
            selectedType = 'tank';
        } else if (wave >= 2 && random < 0.5) {
            selectedType = 'fast';
        }

        return this.create(selectedType, x, y);
    }
}

export default Zombie;
