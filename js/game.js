/**
 * 游戏主模块
 * Game类，游戏循环(requestAnimationFrame)，状态管理，波次控制
 */

import { GameMap } from './map.js';
import { Tower, TowerFactory } from './tower.js';
import { Zombie, ZombieFactory } from './zombie.js';
import { Projectile, Explosion } from './projectile.js';
import { distance } from './utils.js';

/**
 * 游戏状态枚举
 */
export const GameState = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over'
};

/**
 * 游戏主类
 */
export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // 游戏状态
        this.state = GameState.MENU;
        this.gameSpeed = 1;

        // 游戏数据
        this.money = 500;
        this.lives = 20;
        this.wave = 1;
        this.score = 0;

        // 游戏对象
        this.map = null;
        this.towers = [];
        this.zombies = [];
        this.projectiles = [];
        this.explosions = [];

        // 波次控制
        this.waveInProgress = false;
        this.zombiesToSpawn = [];
        this.spawnTimer = 0;
        this.spawnInterval = 1000;
        this.waveCooldown = 0;

        // 选中状态
        this.selectedTowerType = null;
        this.selectedTower = null;
        this.mouseX = 0;
        this.mouseY = 0;

        // 游戏循环
        this.lastTime = 0;
        this.animationId = null;

        // 初始化
        this.init();
    }

    /**
     * 初始化游戏
     */
    init() {
        // 设置画布大小
        this.resize();

        // 创建地图
        this.map = new GameMap(this.canvas.width, this.canvas.height);

        // 设置默认路径
        const pathPoints = this.generatePath();
        this.map.setPath(pathPoints);

        // 绑定事件
        this.bindEvents();

        // 开始游戏循环
        this.start();
    }

    /**
     * 生成路径点
     */
    generatePath() {
        const margin = 60;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // S形路径
        return [
            { x: margin, y: h * 0.2 },
            { x: w * 0.3, y: h * 0.2 },
            { x: w * 0.3, y: h * 0.8 },
            { x: w * 0.7, y: h * 0.8 },
            { x: w * 0.7, y: h * 0.5 },
            { x: w - margin, y: h * 0.5 }
        ];
    }

    /**
     * 调整画布大小
     */
    resize() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();

        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        if (this.map) {
            this.map.width = this.canvas.width;
            this.map.height = this.canvas.height;
        }
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 鼠标移动
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        // 鼠标点击
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleClick(x, y);
        });

        // 窗口大小改变
        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    /**
     * 处理点击事件
     */
    handleClick(x, y) {
        if (this.state !== GameState.PLAYING) return;

        // 检查是否点击了防御塔
        const clickedTower = this.towers.find(t =>
            distance(x, y, t.x, t.y) < t.radius
        );

        if (clickedTower) {
            this.selectedTower = clickedTower;
            this.onTowerSelected?.(clickedTower);
            return;
        }

        // 建造防御塔
        if (this.selectedTowerType) {
            this.tryBuildTower(x, y);
        } else {
            this.selectedTower = null;
            this.onTowerDeselected?.();
        }
    }

    /**
     * 尝试建造防御塔
     */
    tryBuildTower(x, y) {
        const cell = this.map.getCellAt(x, y);
        if (!cell || !this.map.canBuildAt(x, y)) {
            return false;
        }

        const towerInfo = TowerFactory.getTowerInfo(this.selectedTowerType);
        if (this.money < towerInfo.cost) {
            return false;
        }

        // 扣除金币
        this.money -= towerInfo.cost;
        this.onMoneyChanged?.(this.money);

        // 创建防御塔
        const tower = TowerFactory.create(this.selectedTowerType, cell.x, cell.y);
        this.towers.push(tower);

        // 标记网格
        this.map.placeTower(cell.col, cell.row, tower);

        // 播放建造音效
        this.onTowerBuilt?.(tower);

        return true;
    }

    /**
     * 出售防御塔
     */
    sellTower(tower) {
        const index = this.towers.indexOf(tower);
        if (index === -1) return false;

        // 返还金币
        this.money += tower.sellValue;
        this.onMoneyChanged?.(this.money);

        // 移除防御塔
        this.towers.splice(index, 1);

        // 清除网格标记
        const cell = this.map.getCellAt(tower.x, tower.y);
        if (cell) {
            this.map.removeTower(cell.col, cell.row);
        }

        this.selectedTower = null;
        this.onTowerDeselected?.();

        return true;
    }

    /**
     * 升级防御塔
     */
    upgradeTower(tower) {
        if (this.money < tower.upgradeCost) {
            return { success: false, message: '金币不足' };
        }

        const result = tower.upgrade();
        if (result.success) {
            this.money -= tower.upgradeCost;
            this.onMoneyChanged?.(this.money);
            this.onTowerUpgraded?.(tower);
        }

        return result;
    }

    /**
     * 选择防御塔类型
     */
    selectTowerType(type) {
        this.selectedTowerType = type;
        this.selectedTower = null;
        this.onTowerDeselected?.();
    }

    /**
     * 开始波次
     */
    startWave() {
        if (this.waveInProgress) return false;

        this.waveInProgress = true;
        this.zombiesToSpawn = this.generateWave(this.wave);
        this.spawnTimer = 0;
        this.spawnInterval = Math.max(300, 1000 - this.wave * 50);

        this.onWaveStarted?.(this.wave);

        return true;
    }

    /**
     * 生成波次
     */
    generateWave(wave) {
        const zombies = [];
        const count = 5 + wave * 3;

        for (let i = 0; i < count; i++) {
            zombies.push({
                type: this.getZombieTypeForWave(wave),
                delay: i * this.spawnInterval
            });
        }

        // Boss波
        if (wave % 5 === 0) {
            zombies.push({
                type: 'boss',
                delay: count * this.spawnInterval
            });
        }

        return zombies;
    }

    /**
     * 根据波次获取僵尸类型
     */
    getZombieTypeForWave(wave) {
        const rand = Math.random();

        if (wave >= 8 && rand < 0.05) return 'boss';
        if (wave >= 4 && rand < 0.25) return 'tank';
        if (wave >= 2 && rand < 0.4) return 'fast';

        return 'normal';
    }

    /**
     * 生成僵尸
     */
    spawnZombie(type) {
        const startPoint = this.map.startPoint;
        if (!startPoint) return;

        const zombie = ZombieFactory.create(type, startPoint.x, startPoint.y);
        zombie.setPath(this.map.path);
        this.zombies.push(zombie);
    }

    /**
     * 设置游戏速度
     */
    setGameSpeed(speed) {
        this.gameSpeed = speed;
    }

    /**
     * 暂停/继续游戏
     */
    togglePause() {
        if (this.state === GameState.PLAYING) {
            this.state = GameState.PAUSED;
        } else if (this.state === GameState.PAUSED) {
            this.state = GameState.PLAYING;
        }
        return this.state;
    }

    /**
     * 开始游戏
     */
    start() {
        this.state = GameState.PLAYING;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    /**
     * 重新开始
     */
    restart() {
        // 重置游戏数据
        this.money = 500;
        this.lives = 20;
        this.wave = 1;
        this.score = 0;

        // 清空游戏对象
        this.towers = [];
        this.zombies = [];
        this.projectiles = [];
        this.explosions = [];

        // 重置波次
        this.waveInProgress = false;
        this.zombiesToSpawn = [];

        // 重置选中
        this.selectedTower = null;
        this.selectedTowerType = null;

        // 重置地图
        this.map.reset();

        // 重新生成路径
        const pathPoints = this.generatePath();
        this.map.setPath(pathPoints);

        // 更新UI
        this.onMoneyChanged?.(this.money);
        this.onLivesChanged?.(this.lives);
        this.onWaveChanged?.(this.wave);
        this.onScoreChanged?.(this.score);

        // 开始游戏
        this.state = GameState.PLAYING;
    }

    /**
     * 游戏结束
     */
    gameOver() {
        this.state = GameState.GAME_OVER;
        this.onGameOver?.(this.score, this.wave);
    }

    /**
     * 游戏主循环
     */
    gameLoop() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) * this.gameSpeed;
        this.lastTime = currentTime;

        if (this.state === GameState.PLAYING) {
            this.update(deltaTime, currentTime);
        }

        this.render();

        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * 更新游戏逻辑
     */
    update(deltaTime, currentTime) {
        // 更新波次
        this.updateWave(deltaTime);

        // 更新防御塔
        this.updateTowers(deltaTime, currentTime);

        // 更新僵尸
        this.updateZombies(deltaTime);

        // 更新投射物
        this.updateProjectiles(deltaTime);

        // 更新爆炸效果
        this.updateExplosions(deltaTime);

        // 清理死亡对象
        this.cleanup();
    }

    /**
     * 更新波次
     */
    updateWave(deltaTime) {
        if (!this.waveInProgress) return;

        // 生成僵尸
        this.spawnTimer += deltaTime;

        while (this.zombiesToSpawn.length > 0 &&
               this.spawnTimer >= this.zombiesToSpawn[0].delay) {
            const zombieData = this.zombiesToSpawn.shift();
            this.spawnZombie(zombieData.type);
            this.spawnTimer = 0;
        }

        // 检查波次结束
        if (this.zombiesToSpawn.length === 0 &&
            this.zombies.filter(z => z.isAlive()).length === 0) {
            this.waveInProgress = false;
            this.wave++;
            this.onWaveChanged?.(this.wave);
            this.onWaveCompleted?.(this.wave - 1);

            // 波次奖励
            const waveReward = 50 + this.wave * 10;
            this.money += waveReward;
            this.onMoneyChanged?.(this.money);
        }
    }

    /**
     * 更新防御塔
     */
    updateTowers(deltaTime, currentTime) {
        const aliveZombies = this.zombies.filter(z => z.isAlive());

        for (const tower of this.towers) {
            const projectile = tower.update(deltaTime, aliveZombies, currentTime);
            if (projectile) {
                this.projectiles.push(projectile);
            }
        }
    }

    /**
     * 更新僵尸
     */
    updateZombies(deltaTime) {
        for (const zombie of this.zombies) {
            zombie.update(deltaTime, this.map.path);

            // 检查是否到达终点
            if (zombie.hasReachedEnd() && zombie.isAlive()) {
                zombie.alive = false;
                this.lives -= zombie.damage;
                this.onLivesChanged?.(this.lives);

                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        }
    }

    /**
     * 更新投射物
     */
    updateProjectiles(deltaTime) {
        const aliveZombies = this.zombies.filter(z => z.isAlive());

        for (const projectile of this.projectiles) {
            projectile.update(deltaTime);

            // 检查命中
            const hit = projectile.checkHit(aliveZombies);
            if (hit) {
                if (Array.isArray(hit)) {
                    // 穿透子弹命中多个目标
                    for (const zombie of hit) {
                        const reward = zombie.takeDamage(projectile.damage);
                        if (reward > 0) {
                            this.addReward(reward);
                        }
                    }
                } else {
                    // 普通子弹命中单个目标
                    const reward = hit.takeDamage(projectile.damage);
                    if (reward > 0) {
                        this.addReward(reward);
                    }

                    // 检查溅射
                    if (projectile.splashRadius > 0) {
                        this.createExplosion(
                            projectile.x,
                            projectile.y,
                            projectile.splashRadius,
                            projectile.splashDamage
                        );
                    }
                }
            }
        }
    }

    /**
     * 创建爆炸
     */
    createExplosion(x, y, radius, damage) {
        const explosion = new Explosion(x, y, radius, damage, this.zombies);
        this.explosions.push(explosion);
    }

    /**
     * 更新爆炸效果
     */
    updateExplosions(deltaTime) {
        for (const explosion of this.explosions) {
            explosion.update(deltaTime);
        }
    }

    /**
     * 添加奖励
     */
    addReward(reward) {
        this.money += reward;
        this.score += reward * 10;
        this.onMoneyChanged?.(this.money);
        this.onScoreChanged?.(this.score);
    }

    /**
     * 清理死亡对象
     */
    cleanup() {
        this.zombies = this.zombies.filter(z => z.isAlive() || !z.hasReachedEnd());
        this.projectiles = this.projectiles.filter(p => !p.isDead);
        this.explosions = this.explosions.filter(e => !e.isDead);
    }

    /**
     * 渲染游戏
     */
    render() {
        // 清空画布
        this.ctx.fillStyle = '#0f0f23';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制地图
        this.map.render(this.ctx);

        // 绘制建造预览
        if (this.selectedTowerType && !this.selectedTower) {
            this.renderBuildPreview();
        }

        // 绘制防御塔范围
        if (this.selectedTower) {
            this.selectedTower.renderRange(this.ctx);
        }

        // 绘制防御塔
        for (const tower of this.towers) {
            tower.render(this.ctx);
        }

        // 绘制僵尸
        for (const zombie of this.zombies) {
            zombie.render(this.ctx);
        }

        // 绘制投射物
        for (const projectile of this.projectiles) {
            projectile.render(this.ctx);
        }

        // 绘制爆炸效果
        for (const explosion of this.explosions) {
            explosion.render(this.ctx);
        }

        // 绘制暂停遮罩
        if (this.state === GameState.PAUSED) {
            this.renderPauseOverlay();
        }
    }

    /**
     * 绘制建造预览
     */
    renderBuildPreview() {
        const cell = this.map.getCellAt(this.mouseX, this.mouseY);
        if (!cell) return;

        const canBuild = this.map.canBuildAt(this.mouseX, this.mouseY);

        // 绘制范围预览
        const towerInfo = TowerFactory.getTowerInfo(this.selectedTowerType);
        const range = this.getTowerRange(this.selectedTowerType);

        this.ctx.fillStyle = canBuild ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)';
        this.ctx.strokeStyle = canBuild ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(cell.x, cell.y, range, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // 绘制高亮
        this.map.renderBuildHighlight(this.ctx, this.mouseX, this.mouseY, canBuild);
    }

    /**
     * 获取防御塔射程
     */
    getTowerRange(type) {
        const ranges = {
            basic: 150,
            sniper: 350,
            rapid: 120,
            splash: 180
        };
        return ranges[type] || 150;
    }

    /**
     * 绘制暂停遮罩
     */
    renderPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('暂停', this.canvas.width / 2, this.canvas.height / 2);
    }

    /**
     * 销毁游戏
     */
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

export default Game;
