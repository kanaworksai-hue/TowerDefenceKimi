/**
 * /
 * Projectile Base ClassClass
 */

import { distance, direction, circleCollision } from './utils.js';

/**
 * Projectile Base Class
 */
export class Projectile {
    constructor(x, y, target, config = {}) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.target = target;

        // 
        this.speed = config.speed || 8;
        this.damage = config.damage || 10;
        this.radius = config.radius || 4;
        this.maxRange = config.maxRange || 500;
        this.color = config.color || '#f39c12';

        // 
        this.isDead = false;
        this.traveledDistance = 0;

        // 
        this.updateDirection();
    }

    /**
     * （）
     */
    updateDirection() {
        if (this.target && !this.target.isDead) {
            const dir = direction(this.x, this.y, this.target.x, this.target.y);
            this.vx = dir.x * this.speed;
            this.vy = dir.y * this.speed;
        }
    }

    /**
     * 
     * @param {number} deltaTime - 
     */
    update(deltaTime) {
        if (this.isDead) return;

        // 
        this.updateDirection();

        // 
        const moveX = this.vx * deltaTime * 0.06;
        const moveY = this.vy * deltaTime * 0.06;

        this.x += moveX;
        this.y += moveY;

        // 
        this.traveledDistance += Math.sqrt(moveX * moveX + moveY * moveY);

        // 
        if (this.traveledDistance >= this.maxRange) {
            this.isDead = true;
        }

        // 
        this.checkHit();
    }

    /**
     * 
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
     * 
     * @param {Zombie} target - 
     */
    onHit(target) {
        target.takeDamage(this.damage);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx - Canvas
     */
    render(ctx) {
        if (this.isDead) return;

        ctx.save();

        // 
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 
        ctx.fillStyle = this.color + '40';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // 
        this.renderTrail(ctx);

        ctx.restore();
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx - Canvas
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
 * Normal Projectile
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
 * Sniper Projectile（、）
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
        // Sniper Projectile
        // ，
        if (!this.target || this.target.isDead || this.hitTargets.has(this.target)) {
            return;
        }

        if (circleCollision(this.x, this.y, this.radius, this.target.x, this.target.y, this.target.radius)) {
            this.onHit(this.target);
            this.hitTargets.add(this.target);
            // Sniper Projectile，
        }
    }

    render(ctx) {
        if (this.isDead) return;

        ctx.save();

        // Sniper Projectile
        const angle = Math.atan2(this.vy, this.vx);
        const length = 25;

        // 
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

        // 
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/**
 * （）
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

        // 
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
 * Splash Projectile（Explosion Effect）
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
        // Explosion Effect
        this.exploded = true;
        // Explosion Effect
    }

    render(ctx) {
        if (this.isDead) return;

        ctx.save();

        // 
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 
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
 * Laser Projectile（）
 */
export class LaserProjectile extends Projectile {
    constructor(x, y, target, damage) {
        super(x, y, target, {
            speed: 100, // 
            damage: damage,
            radius: 2,
            maxRange: 500,
            color: '#00ffff'
        });
        this.lifetime = 0.1; // 
        this.maxLifetime = 0.1;
    }

    update(deltaTime) {
        // 
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

        // 
        const alpha = this.lifetime / this.maxLifetime;
        ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        // 
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/**
 * Ice Projectile（）
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

        // Ice Projectile
        ctx.fillStyle = this.color;
        ctx.shadowColor = '#3498db';
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 
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
 * Explosion EffectClass
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

        // 
        this.dealDamage();
    }

    /**
     * 
     */
    dealDamage() {
        for (const zombie of this.zombies) {
            if (!zombie.isDead && !zombie.isFinished) {
                const dist = distance(this.x, this.y, zombie.x, zombie.y);
                if (dist <= this.radius + zombie.radius) {
                    // ，
                    const damageFactor = 1 - (dist / (this.radius + zombie.radius)) * 0.5;
                    zombie.takeDamage(this.damage * damageFactor);
                }
            }
        }
    }

    update(deltaTime) {
        this.lifetime -= deltaTime / 1000;

        // 
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

        // 
        ctx.fillStyle = `rgba(255, 100, 0, ${alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // 
        ctx.fillStyle = `rgba(255, 200, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // 
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/**
 * 
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
     * 
     * @param {string} type - Projectile Types
     * @param {number} x - x
     * @param {number} y - y
     * @param {Zombie} target - 
     * @param {number} damage - 
     * @param {Object} options - 
     * @returns {Projectile} 
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
