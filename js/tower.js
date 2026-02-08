/**
 * Tower Module
 * Tower基类，各塔类型子类，Shooting Logic，Upgrade System
 */

import { distance, angle } from './utils.js';
import { ProjectileFactory } from './projectile.js';

/**
 * Tower Base Class
 */
export class Tower {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        this.radius = options.radius || 20;

        // 基础属性
        this.type = options.type || 'basic';
        this.name = options.name || 'Basic Tower';
        this.level = 1;
        this.maxLevel = options.maxLevel || 3;

        // 战斗属性
        this.damage = options.damage || 10;
        this.range = options.range || 150;
        this.fireRate = options.fireRate || 1000; // 毫秒
        this.projectileType = options.projectileType || 'normal';

        // 成本
        this.cost = options.cost || 100;
        this.upgradeCost = options.upgradeCost || 100;
        this.sellValue = options.sellValue || 50;

        // 外观
        this.color = options.color || '#4a90d9';
        this.barrelAngle = 0;

        // 状态
        this.lastFireTime = 0;
        this.target = null;
        this.totalKills = 0;
        this.totalDamage = 0;

        // 动画
        this.recoil = 0;
    }

    /**
     * 更新防御塔
     */
    update(deltaTime, zombies, currentTime) {
        // 更新后坐力动画
        if (this.recoil > 0) {
            this.recoil -= deltaTime * 0.01;
            if (this.recoil < 0) this.recoil = 0;
        }

        // Find Target
        this.findTarget(zombies);

        // 瞄准目标
        if (this.target && this.target.isAlive()) {
            this.barrelAngle = angle(this.x, this.y, this.target.x, this.target.y);

            // 尝试Shoot
            if (currentTime - this.lastFireTime >= this.fireRate) {
                return this.fire(currentTime);
            }
        }

        return null;
    }

    /**
     * Find Target
     */
    findTarget(zombies) {
        // 当前目标仍然有效且在范围内
        if (this.target && this.target.isAlive()) {
            const dist = distance(this.x, this.y, this.target.x, this.target.y);
            if (dist <= this.range) {
                return;
            }
        }

        // 寻找新目标
        this.target = null;
        let closestDist = Infinity;

        for (const zombie of zombies) {
            if (zombie.isAlive()) {
                const dist = distance(this.x, this.y, zombie.x, zombie.y);
                if (dist <= this.range && dist < closestDist) {
                    closestDist = dist;
                    this.target = zombie;
                }
            }
        }
    }

    /**
     * 开火
     */
    fire(currentTime) {
        if (!this.target) return null;

        this.lastFireTime = currentTime;
        this.recoil = 5;

        return this.createProjectile();
    }

    /**
     * 创建投射物
     */
    createProjectile() {
        return ProjectileFactory.create(
            this.projectileType,
            this.x + Math.cos(this.barrelAngle) * 20,
            this.y + Math.sin(this.barrelAngle) * 20,
            this.target,
            this.damage
        );
    }

    /**
     * Upgrade防御塔
     */
    upgrade() {
        if (this.level >= this.maxLevel) {
            return { success: false, message: '已达到最高等级' };
        }

        this.level++;

        // 提升属性
        this.damage = Math.floor(this.damage * 1.5);
        this.range = Math.floor(this.range * 1.1);
        this.fireRate = Math.max(200, this.fireRate * 0.9);

        // 更新Upgrade和出售价格
        this.upgradeCost = Math.floor(this.upgradeCost * 1.5);
        this.sellValue = Math.floor(this.sellValue * 1.3);

        return { success: true };
    }

    /**
     * 获取Upgrade后的属性预览
     */
    getUpgradePreview() {
        if (this.level >= this.maxLevel) {
            return null;
        }

        return {
            level: this.level + 1,
            damage: Math.floor(this.damage * 1.5),
            range: Math.floor(this.range * 1.1),
            fireRate: Math.max(200, this.fireRate * 0.9),
            cost: this.upgradeCost
        };
    }

    /**
     * Render Tower
     */
    render(ctx) {
        ctx.save();

        // 绘制射程范围（半透明）
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.fill();

        // 绘制底座
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制等级标记
        if (this.level > 1) {
            ctx.fillStyle = '#ffd700';
            for (let i = 0; i < this.level - 1; i++) {
                const starAngle = (Math.PI * 2 / (this.level - 1)) * i - Math.PI / 2;
                const starX = this.x + Math.cos(starAngle) * (this.radius - 5);
                const starY = this.y + Math.sin(starAngle) * (this.radius - 5);
                ctx.beginPath();
                ctx.arc(starX, starY, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // 绘制炮管
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.barrelAngle);

        const barrelLength = 25 - this.recoil;
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(0, -4, barrelLength, 8);

        // 炮口
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(barrelLength - 2, -5, 4, 10);

        ctx.restore();

        // 绘制塔身
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // 塔身边框
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制中心点
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    /**
     * Render Range范围（用于建造预览）
     */
    renderRange(ctx) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

/**
 * Basic Tower
 */
export class BasicTower extends Tower {
    constructor(x, y) {
        super(x, y, {
            type: 'basic',
            name: 'Basic Tower',
            damage: 15,
            range: 150,
            fireRate: 1000,
            cost: 100,
            upgradeCost: 100,
            sellValue: 50,
            color: '#4a90d9',
            projectileType: 'normal'
        });
    }
}

/**
 * Sniper Tower
 */
export class SniperTower extends Tower {
    constructor(x, y) {
        super(x, y, {
            type: 'sniper',
            name: 'Sniper Tower',
            damage: 80,
            range: 350,
            fireRate: 2500,
            cost: 250,
            upgradeCost: 200,
            sellValue: 125,
            color: '#9b59b6',
            projectileType: 'sniper'
        });
    }
}

/**
 * Rapid Tower
 */
export class RapidTower extends Tower {
    constructor(x, y) {
        super(x, y, {
            type: 'rapid',
            name: 'Rapid Tower',
            damage: 8,
            range: 120,
            fireRate: 200,
            cost: 200,
            upgradeCost: 150,
            sellValue: 100,
            color: '#e74c3c',
            projectileType: 'rapid'
        });
    }
}

/**
 * Splash Tower
 */
export class SplashTower extends Tower {
    constructor(x, y) {
        super(x, y, {
            type: 'splash',
            name: 'Splash Tower',
            damage: 30,
            range: 180,
            fireRate: 1500,
            cost: 350,
            upgradeCost: 250,
            sellValue: 175,
            color: '#f39c12',
            projectileType: 'splash'
        });
    }
}

/**
 * Tower Factory
 */
export class TowerFactory {
    static types = {
        basic: BasicTower,
        sniper: SniperTower,
        rapid: RapidTower,
        splash: SplashTower
    };

    static create(type, x, y) {
        const TowerClass = this.types[type];
        if (TowerClass) {
            return new TowerClass(x, y);
        }
        return new BasicTower(x, y);
    }

    static getTowerInfo(type) {
        const infos = {
            basic: { name: 'Basic Tower', cost: 100, description: '平衡的攻防能力' },
            sniper: { name: 'Sniper Tower', cost: 250, description: '超远射程，高伤害' },
            rapid: { name: 'Rapid Tower', cost: 200, description: '极快射速' },
            splash: { name: 'Splash Tower', cost: 350, description: '范围伤害' }
        };
        return infos[type] || infos.basic;
    }
}

export default Tower;
