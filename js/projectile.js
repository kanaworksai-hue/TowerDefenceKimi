/**
 * 子弹/投射物模块
 * 定义子弹基类和各类特殊子弹
 */

import { distance, direction, circleCollision } from './utils.js';

/**
 * 子弹基类
 */
export class Projectile {
    constructor(x, y, target, config = {}) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.target = target;

        // 基础属性
        this.speed = config.speed || 8;
        this.damage = config.damage || 10;
        this.radius = config.radius || 4;
        this.maxRange = config.maxRange || 500;
        this.color = config.color || '#f39c12';

        // 状态
        this.isDead = false;
        this.traveledDistance = 0;

        // 计算初始方向
        this.updateDirection();
    }

    /**
     * 更新方向（追踪目标）
     */
    updateDirection() {
        if (this.target && !this.target.isDead) {
            const dir = direction(this.x, this.y, this.target.x, this.target.y);
            this.vx = dir.x * this.speed;
            this.vy = dir.y * this.speed;
        }
    }

    /**
     * 更新子弹状态
     * @param {number} deltaTime - 时间增量
     */
    update(deltaTime) {
        if (this.isDead) return;

        // 追踪目标
        this.updateDirection();

        // 移动
        const moveX = this.vx * deltaTime * 0.06;
        const moveY = this.vy * deltaTime * 0.06;

        this.x += moveX;
        this.y += moveY;

        // 计算移动距离
        this.traveledDistance += Math.sqrt(moveX * moveX + moveY * moveY);

        // 检查是否超出最大射程
        if (this.traveledDistance >= this.maxRange) {
            this.isDead = true;
        }

        // 检查是否命中目标
        this.checkHit();
    }

    /**
     * 检查是否命中目标
     */
    checkHit() {
        if (!this.target || this.target.isDead) {
            return;
        }

        if (circleCollision(this.x, this.y, this.radius, this.target.x, this.target.y, this.target.radius)) {
            this.onHit(this.target);
            this.isDead = true;
        }
    }

    /**
     * 命中时的回调
     * @param {Zombie} target - 命中的目标
     */
    onHit(target) {
        target.takeDamage(this.damage);
    }

    /**
     * 绘制子弹
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    render(ctx) {
        if (this.isDead) return;

        ctx.save();

        // 绘制子弹主体
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 绘制光晕效果
        ctx.fillStyle = this.color + '40';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // 绘制轨迹
        this.renderTrail(ctx);

        ctx.restore();
    }

    /**
     * 绘制轨迹
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    renderTrail(ctx) {
        const trailLength = 15;
        const angle = Math.atan2(this.vy, this.vx);

        ctx.strokeStyle = this.color + '60';
        ctx.lineWidth = this.radius;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - Math.cos(angle) * trailLength,
            this.y - Math.sin(angle) * trailLength
        );
        ctx.stroke();
    }
}

/**
 * 普通子弹
 */
export class NormalProjectile extends Projectile {
    constructor(x, y, target, damage) {
        super(x, y, target, {
            speed: 10,
            damage: damage,
            radius: 4,
            maxRange: 400,
            color: '#f39c12'
        });
    }
}

/**
 * 狙击子弹（高速、高伤害）
 */
export class SniperProjectile extends Projectile {
    constructor(x, y, target, damage) {
        super(x, y, target, {
            speed: 20,
            damage: damage,
            radius: 3,
            maxRange: 800,
            color: '#9b59b6'
        });
        this.penetration = true;
        this.hitTargets = new Set();
    }

    checkHit() {
        // 狙击子弹可以穿透多个目标
        // 这里简化处理，只检查主要目标
        if (!this.target || this.target.isDead || this.hitTargets.has(this.target)) {
            return;
        }

        if (circleCollision(this.x, this.y, this.radius, this.target.x, this.target.y, this.target.radius)) {
            this.onHit(this.target);
            this.hitTargets.add(this.target);
            // 狙击子弹不立即死亡，继续飞行
        }
    }

    render(ctx) {
        if (this.isDead) return;

        ctx.save();

        // 狙击子弹有特殊的视觉效果
        const angle = Math.atan2(this.vy, this.vx);
        const length = 25;

        // 绘制长轨迹
        const gradient = ctx.createLinearGradient(
            this.x, this.y,
            this.x - Math.cos(angle) * length,
            this.y - Math.sin(angle) * length
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, this.color + '00');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - Math.cos(angle) * length,
            this.y - Math.sin(angle) * length
        );
        ctx.stroke();

        // 子弹头部
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/**
 * 快速子弹（速射塔使用）
 */
export class RapidProjectile extends Projectile {
    constructor(x, y, target, damage) {
        super(x, y, target, {
            speed: 15,
            damage: damage,
            radius: 3,
            maxRange: 300,
            color: '#e74c3c'
        });
    }

    render(ctx) {
        if (this.isDead) return;

        ctx.save();

        // 快速子弹较小但明亮
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/**
 * 溅射子弹（爆炸效果）
 */
export class SplashProjectile extends Projectile {
    constructor(x, y, target, damage, splashRadius = 50) {
        super(x, y, target, {
            speed: 6,
            damage: damage,
            radius: 6,
            maxRange: 350,
            color: '#f39c12'
        });
        this.splashRadius = splashRadius;
        this.exploded = false;
    }

    onHit(target) {
        // 触发爆炸效果
        this.exploded = true;
        // 实际伤害在爆炸效果中处理
    }

    render(ctx) {
        if (this.isDead) return;

        ctx.save();

        // 绘制炮弹
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 绘制旋转效果
        ctx.strokeStyle = '#d68910';
        ctx.lineWidth = 2;
        const rotation = Date.now() / 100;
        for (let i = 0; i < 3; i++) {
            const angle = rotation + (Math.PI * 2 / 3) * i;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x + Math.cos(angle) * this.radius * 1.5,
                this.y + Math.sin(angle) * this.radius * 1.5
            );
            ctx.stroke();
        }

        ctx.restore();
    }
}

/**
 * 激光子弹（瞬间命中）
 */
export class LaserProjectile extends Projectile {
    constructor(x, y, target, damage) {
        super(x, y, target, {
            speed: 100, // 极快速度
            damage: damage,
            radius: 2,
            maxRange: 500,
            color: '#00ffff'
        });
        this.lifetime = 0.1; // 短暂存在时间
        this.maxLifetime = 0.1;
    }

    update(deltaTime) {
        // 激光瞬间到达目标
        if (this.target && !this.target.isDead) {
            this.x = this.target.x;
            this.y = this.target.y;
            this.onHit(this.target);
        }

        this.lifetime -= deltaTime / 1000;
        if (this.lifetime <= 0) {
            this.isDead = true;
        }
    }

    render(ctx) {
        if (this.isDead) return;

        ctx.save();

        // 绘制激光线
        const alpha = this.lifetime / this.maxLifetime;
        ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        // 命中点效果
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/**
 * 冰冻子弹（减速效果）
 */
export class IceProjectile extends Projectile {
    constructor(x, y, target, damage, slowFactor = 0.5, slowDuration = 2000) {
        super(x, y, target, {
            speed: 8,
            damage: damage,
            radius: 5,
            maxRange: 350,
            color: '#3498db'
        });
        this.slowFactor = slowFactor;
        this.slowDuration = slowDuration;
    }

    onHit(target) {
        super.onHit(target);
        if (target.applySlow) {
            target.applySlow(this.slowFactor, this.slowDuration / 1000);
        }
    }

    render(ctx) {
        if (this.isDead) return;

        ctx.save();

        // 冰冻子弹有雪花效果
        ctx.fillStyle = this.color;
        ctx.shadowColor = '#3498db';
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 绘制雪花图案
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;

        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i + Date.now() / 500;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x + Math.cos(angle) * this.radius * 1.5,
                this.y + Math.sin(angle) * this.radius * 1.5
            );
            ctx.stroke();
        }

        ctx.restore();
    }
}

/**
 * 爆炸效果类
 */
export class Explosion {
    constructor(x, y, radius, damage, zombies) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.damage = damage;
        this.zombies = zombies;

        this.isDead = false;
        this.lifetime = 0.3;
        this.maxLifetime = 0.3;
        this.currentRadius = 0;

        // 立即造成伤害
        this.dealDamage();
    }

    /**
     * 对范围内僵尸造成伤害
     */
    dealDamage() {
        for (const zombie of this.zombies) {
            if (!zombie.isDead && !zombie.isFinished) {
                const dist = distance(this.x, this.y, zombie.x, zombie.y);
                if (dist <= this.radius + zombie.radius) {
                    // 距离爆炸中心越远，伤害越低
                    const damageFactor = 1 - (dist / (this.radius + zombie.radius)) * 0.5;
                    zombie.takeDamage(this.damage * damageFactor);
                }
            }
        }
    }

    update(deltaTime) {
        this.lifetime -= deltaTime / 1000;

        // 爆炸范围扩散
        const progress = 1 - (this.lifetime / this.maxLifetime);
        this.currentRadius = this.radius * progress;

        if (this.lifetime <= 0) {
            this.isDead = true;
        }
    }

    render(ctx) {
        if (this.isDead) return;

        ctx.save();

        const progress = 1 - (this.lifetime / this.maxLifetime);
        const alpha = 1 - progress;

        // 外圈
        ctx.fillStyle = `rgba(255, 100, 0, ${alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // 内圈
        ctx.fillStyle = `rgba(255, 200, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // 核心
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/**
 * 子弹工厂
 */
export class ProjectileFactory {
    static types = {
        normal: NormalProjectile,
        sniper: SniperProjectile,
        rapid: RapidProjectile,
        splash: SplashProjectile,
        laser: LaserProjectile,
        ice: IceProjectile
    };

    /**
     * 创建子弹
     * @param {string} type - 子弹类型
     * @param {number} x - 起始x坐标
     * @param {number} y - 起始y坐标
     * @param {Zombie} target - 目标僵尸
     * @param {number} damage - 伤害值
     * @param {Object} options - 额外选项
     * @returns {Projectile} 子弹实例
     */
    static create(type, x, y, target, damage, options = {}) {
        const ProjectileClass = this.types[type];
        if (ProjectileClass) {
            if (type === 'splash') {
                return new ProjectileClass(x, y, target, damage, options.splashRadius);
            } else if (type === 'ice') {
                return new ProjectileClass(x, y, target, damage, options.slowFactor, options.slowDuration);
            }
            return new ProjectileClass(x, y, target, damage);
        }
        return new NormalProjectile(x, y, target, damage);
    }
}
