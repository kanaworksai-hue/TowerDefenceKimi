/**
 * 僵尸模块
 * 处理僵尸基类、移动逻辑(沿路径)、受到伤害
 */

import { distance, direction } from './utils.js';

/**
 * 僵尸基类
 */
export class Zombie {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        this.radius = options.radius || 12;

        // 属性
        this.maxHp = options.hp || 100;
        this.hp = this.maxHp;
        this.speed = options.speed || 30;
        this.reward = options.reward || 10;
        this.damage = options.damage || 1;

        // 类型
        this.type = options.type || 'normal';
        this.color = options.color || '#2ecc71';

        // 状态
        this.alive = true;
        this.reachedEnd = false;
        this.slowed = false;
        this.slowFactor = 1;
        this.slowDuration = 0;

        // 路径相关
        this.pathIndex = 0;
        this.path = [];

        // 动画
        this.animFrame = 0;
        this.animSpeed = 0.15;
    }

    /**
     * 设置路径
     */
    setPath(path) {
        this.path = path;
        this.pathIndex = 0;

        // 设置初始位置到路径起点
        if (path.length > 0) {
            this.x = path[0].x;
            this.y = path[0].y;
        }
    }

    /**
     * 更新僵尸
     */
    update(deltaTime, path) {
        if (!this.alive || this.reachedEnd) return;

        // 更新减速效果
        if (this.slowed && this.slowDuration > 0) {
            this.slowDuration -= deltaTime;
            if (this.slowDuration <= 0) {
                this.slowed = false;
                this.slowFactor = 1;
            }
        }

        // 使用提供的路径或自身存储的路径
        const currentPath = path || this.path;
        if (!currentPath || currentPath.length === 0) return;

        // 沿路径移动
        this.moveAlongPath(deltaTime, currentPath);

        // 更新动画
        this.animFrame += this.animSpeed;
    }

    /**
     * 沿路径移动
     */
    moveAlongPath(deltaTime, path) {
        if (this.pathIndex >= path.length - 1) {
            this.reachedEnd = true;
            return;
        }

        const target = path[this.pathIndex + 1];
        const dist = distance(this.x, this.y, target.x, target.y);

        // 计算移动距离
        const moveDistance = this.speed * this.slowFactor * (deltaTime / 1000);

        if (dist <= moveDistance) {
            // 到达当前目标点，转向下一个
            this.x = target.x;
            this.y = target.y;
            this.pathIndex++;

            if (this.pathIndex >= path.length - 1) {
                this.reachedEnd = true;
            }
        } else {
            // 向目标点移动
            const dir = direction(this.x, this.y, target.x, target.y);
            this.x += dir.x * moveDistance;
            this.y += dir.y * moveDistance;
        }
    }

    /**
     * 受到伤害
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
     * 应用减速效果
     */
    applySlow(factor, duration) {
        this.slowed = true;
        this.slowFactor = Math.min(this.slowFactor, factor);
        this.slowDuration = Math.max(this.slowDuration, duration);
    }

    /**
     * 是否存活
     */
    isAlive() {
        return this.alive;
    }

    /**
     * 是否到达终点
     */
    hasReachedEnd() {
        return this.reachedEnd;
    }

    /**
     * 获取生命值百分比
     */
    getHpPercent() {
        return this.hp / this.maxHp;
    }

    /**
     * 渲染僵尸
     */
    render(ctx) {
        if (!this.alive) return;

        ctx.save();

        // 绘制阴影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.radius - 2, this.radius, this.radius * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // 身体摆动动画
        const wobble = Math.sin(this.animFrame) * 2;

        // 绘制身体
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + wobble, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 绘制边框
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制眼睛
        const eyeOffset = 4;
        const eyeRadius = 3;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x - eyeOffset + wobble, this.y - 2, eyeRadius, 0, Math.PI * 2);
        ctx.arc(this.x + eyeOffset + wobble, this.y - 2, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // 绘制瞳孔
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x - eyeOffset + wobble, this.y - 2, 1.5, 0, Math.PI * 2);
        ctx.arc(this.x + eyeOffset + wobble, this.y - 2, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // 减速效果
        if (this.slowed) {
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2);
            ctx.stroke();
        }

        // 绘制血条
        this.renderHealthBar(ctx);

        ctx.restore();
    }

    /**
     * 渲染血条
     */
    renderHealthBar(ctx) {
        const barWidth = 24;
        const barHeight = 4;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.radius - 10;

        // 背景
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // 血量
        const hpPercent = this.getHpPercent();
        let hpColor = '#2ecc71';
        if (hpPercent < 0.3) hpColor = '#e74c3c';
        else if (hpPercent < 0.6) hpColor = '#f39c12';

        ctx.fillStyle = hpColor;
        ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

        // 边框
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}

/**
 * 普通僵尸
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
 * 快速僵尸
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
 * 坦克僵尸
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
 * Boss僵尸
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
 * 僵尸工厂
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
     * 根据波次生成僵尸类型
     */
    static createForWave(wave, x, y) {
        const types = ['normal'];

        if (wave >= 2) types.push('fast');
        if (wave >= 4) types.push('tank');
        if (wave >= 8 && wave % 5 === 0) types.push('boss');

        // 波次越高，高级僵尸概率越大
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
