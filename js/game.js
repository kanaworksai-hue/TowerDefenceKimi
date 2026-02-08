/**
 * Main Game Module
 * GameClass，Game Loop(requestAnimationFrame)，，Wave Control
 */

import { GameMap } from './map.js';
import { Tower, TowerFactory } from './tower.js';
import { Zombie, ZombieFactory } from './zombie.js';
import { Projectile, Explosion } from './projectile.js';
import { distance } from './utils.js';

/**
 * Game StateEnum
 */
export const GameState = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over'
};

/**
 * Main Game Class
 */
export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Game State
        this.state = GameState.MENU;
        this.gameSpeed = 1;

        // Game Data
        this.money = 500;
        this.lives = 20;
        this.wave = 1;
        this.score = 0;

        // Game Objects
        this.map = null;
        this.towers = [];
        this.zombies = [];
        this.projectiles = [];
        this.explosions = [];

        // Wave Control
        this.waveInProgress = false;
        this.zombiesToSpawn = [];
        this.spawnTimer = 0;
        this.spawnInterval = 1000;
        this.waveCooldown = 0;

        // Selection State
        this.selectedTowerType = null;
        this.selectedTower = null;
        this.mouseX = 0;
        this.mouseY = 0;

        // Game Loop
        this.lastTime = 0;
        this.animationId = null;

        // Initialize
        this.init();
    }

    /**
     * Initialize Game
     */
    init() {
        // Set Canvas Size
        this.resize();

        // Create Map
        this.map = new GameMap(this.canvas.width, this.canvas.height);

        // Set Default Path
        const pathPoints = this.generatePath();
        this.map.setPath(pathPoints);

        // Bind Events
        this.bindEvents();

        // Start Game Loop
        this.start();
    }

    /**
     * Generate Path Points
     */
    generatePath() {
        const margin = 60;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // S-Shaped Path
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
     * Resize Canvas
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
     * Bind Events
     */
    bindEvents() {
        // Mouse Move
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        // Mouse Click
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleClick(x, y);
        });

        // Window Resize
        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    /**
     * Handle Click Event
     */
    handleClick(x, y) {
        if (this.state !== GameState.PLAYING) return;

        // Check if Tower Clicked
        const clickedTower = this.towers.find(t =>
            distance(x, y, t.x, t.y) < t.radius
        );

        if (clickedTower) {
            this.selectedTower = clickedTower;
            this.onTowerSelected?.(clickedTower);
            return;
        }

        // Build Tower
        if (this.selectedTowerType) {
            this.tryBuildTower(x, y);
        } else {
            this.selectedTower = null;
            this.onTowerDeselected?.();
        }
    }

    /**
     * Try Build Tower
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

        // Deduct Gold
        this.money -= towerInfo.cost;
        this.onMoneyChanged?.(this.money);

        // Create Tower
        const tower = TowerFactory.create(this.selectedTowerType, cell.x, cell.y);
        this.towers.push(tower);

        // Mark Grid
        this.map.placeTower(cell.col, cell.row, tower);

        // Play Build Sound
        this.onTowerBuilt?.(tower);

        return true;
    }

    /**
     * Sell Tower
     */
    sellTower(tower) {
        const index = this.towers.indexOf(tower);
        if (index === -1) return false;

        // Refund Gold
        this.money += tower.sellValue;
        this.onMoneyChanged?.(this.money);

        // Remove Tower
        this.towers.splice(index, 1);

        // Clear Grid Mark
        const cell = this.map.getCellAt(tower.x, tower.y);
        if (cell) {
            this.map.removeTower(cell.col, cell.row);
        }

        this.selectedTower = null;
        this.onTowerDeselected?.();

        return true;
    }

    /**
     * Upgrade Tower
     */
    upgradeTower(tower) {
        if (this.money < tower.upgradeCost) {
            return { success: false, message: 'Insufficient Gold' };
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
     * Select Tower Type
     */
    selectTowerType(type) {
        this.selectedTowerType = type;
        this.selectedTower = null;
        this.onTowerDeselected?.();
    }

    /**
     * Start Wave
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
     * Generate Wave
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

        // Boss Wave
        if (wave % 5 === 0) {
            zombies.push({
                type: 'boss',
                delay: count * this.spawnInterval
            });
        }

        return zombies;
    }

    /**
     * Get Zombie Type for Wave
     */
    getZombieTypeForWave(wave) {
        const rand = Math.random();

        if (wave >= 8 && rand < 0.05) return 'boss';
        if (wave >= 4 && rand < 0.25) return 'tank';
        if (wave >= 2 && rand < 0.4) return 'fast';

        return 'normal';
    }

    /**
     * Spawn Zombie
     */
    spawnZombie(type) {
        const startPoint = this.map.startPoint;
        if (!startPoint) return;

        const zombie = ZombieFactory.create(type, startPoint.x, startPoint.y);
        zombie.setPath(this.map.path);
        this.zombies.push(zombie);
    }

    /**
     * Set Game Speed
     */
    setGameSpeed(speed) {
        this.gameSpeed = speed;
    }

    /**
     * Toggle Pause
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
     * Start Game
     */
    start() {
        this.state = GameState.PLAYING;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    /**
     * Restart
     */
    restart() {
        // Reset Game Data
        this.money = 500;
        this.lives = 20;
        this.wave = 1;
        this.score = 0;

        // Clear Game Objects
        this.towers = [];
        this.zombies = [];
        this.projectiles = [];
        this.explosions = [];

        // Reset Wave
        this.waveInProgress = false;
        this.zombiesToSpawn = [];

        // Reset Selection
        this.selectedTower = null;
        this.selectedTowerType = null;

        // Reset Map
        this.map.reset();

        // Regenerate Path
        const pathPoints = this.generatePath();
        this.map.setPath(pathPoints);

        // Update UI
        this.onMoneyChanged?.(this.money);
        this.onLivesChanged?.(this.lives);
        this.onWaveChanged?.(this.wave);
        this.onScoreChanged?.(this.score);

        // Start Game
        this.state = GameState.PLAYING;
    }

    /**
     * Game Over
     */
    gameOver() {
        this.state = GameState.GAME_OVER;
        this.onGameOver?.(this.score, this.wave);
    }

    /**
     * Main Game Loop
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
     * Update Game Logic
     */
    update(deltaTime, currentTime) {
        // Update Wave
        this.updateWave(deltaTime);

        // Update Towers
        this.updateTowers(deltaTime, currentTime);

        // Update Zombies
        this.updateZombies(deltaTime);

        // Update Projectiles
        this.updateProjectiles(deltaTime);

        // Update Explosions
        this.updateExplosions(deltaTime);

        // Cleanup Dead Objects
        this.cleanup();
    }

    /**
     * Update Wave
     */
    updateWave(deltaTime) {
        if (!this.waveInProgress) return;

        // Spawn Zombie
        this.spawnTimer += deltaTime;

        while (this.zombiesToSpawn.length > 0 &&
               this.spawnTimer >= this.zombiesToSpawn[0].delay) {
            const zombieData = this.zombiesToSpawn.shift();
            this.spawnZombie(zombieData.type);
            this.spawnTimer = 0;
        }

        // Check Wave End
        if (this.zombiesToSpawn.length === 0 &&
            this.zombies.filter(z => z.isAlive()).length === 0) {
            this.waveInProgress = false;
            this.wave++;
            this.onWaveChanged?.(this.wave);
            this.onWaveCompleted?.(this.wave - 1);

            // Wave Reward
            const waveReward = 50 + this.wave * 10;
            this.money += waveReward;
            this.onMoneyChanged?.(this.money);
        }
    }

    /**
     * Update Towers
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
     * Update Zombies
     */
    updateZombies(deltaTime) {
        for (const zombie of this.zombies) {
            zombie.update(deltaTime, this.map.path);

            // Check if Reached End
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
     * Update Projectiles
     */
    updateProjectiles(deltaTime) {
        const aliveZombies = this.zombies.filter(z => z.isAlive());

        for (const projectile of this.projectiles) {
            projectile.update(deltaTime);

            // Check Hit
            const hit = projectile.checkHit(aliveZombies);
            if (hit) {
                if (Array.isArray(hit)) {
                    // Penetrating Bullet Hits Multiple
                    for (const zombie of hit) {
                        const reward = zombie.takeDamage(projectile.damage);
                        if (reward > 0) {
                            this.addReward(reward);
                        }
                    }
                } else {
                    // Normal Bullet Hits Single
                    const reward = hit.takeDamage(projectile.damage);
                    if (reward > 0) {
                        this.addReward(reward);
                    }

                    // Check Splash
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
     * Create Explosion
     */
    createExplosion(x, y, radius, damage) {
        const explosion = new Explosion(x, y, radius, damage, this.zombies);
        this.explosions.push(explosion);
    }

    /**
     * Update Explosions
     */
    updateExplosions(deltaTime) {
        for (const explosion of this.explosions) {
            explosion.update(deltaTime);
        }
    }

    /**
     * Add Reward
     */
    addReward(reward) {
        this.money += reward;
        this.score += reward * 10;
        this.onMoneyChanged?.(this.money);
        this.onScoreChanged?.(this.score);
    }

    /**
     * Cleanup Dead Objects
     */
    cleanup() {
        this.zombies = this.zombies.filter(z => z.isAlive() || !z.hasReachedEnd());
        this.projectiles = this.projectiles.filter(p => !p.isDead);
        this.explosions = this.explosions.filter(e => !e.isDead);
    }

    /**
     * Render Game
     */
    render() {
        // Clear Canvas
        this.ctx.fillStyle = '#0f0f23';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Map
        this.map.render(this.ctx);

        // Draw Build Preview
        if (this.selectedTowerType && !this.selectedTower) {
            this.renderBuildPreview();
        }

        // Draw Tower Range
        if (this.selectedTower) {
            this.selectedTower.renderRange(this.ctx);
        }

        // Draw Towers
        for (const tower of this.towers) {
            tower.render(this.ctx);
        }

        // Draw Zombies
        for (const zombie of this.zombies) {
            zombie.render(this.ctx);
        }

        // Draw Projectiles
        for (const projectile of this.projectiles) {
            projectile.render(this.ctx);
        }

        // Draw Explosions
        for (const explosion of this.explosions) {
            explosion.render(this.ctx);
        }

        // Draw Pause Overlay
        if (this.state === GameState.PAUSED) {
            this.renderPauseOverlay();
        }
    }

    /**
     * Draw Build Preview
     */
    renderBuildPreview() {
        const cell = this.map.getCellAt(this.mouseX, this.mouseY);
        if (!cell) return;

        const canBuild = this.map.canBuildAt(this.mouseX, this.mouseY);

        // Draw Range Preview
        const towerInfo = TowerFactory.getTowerInfo(this.selectedTowerType);
        const range = this.getTowerRange(this.selectedTowerType);

        this.ctx.fillStyle = canBuild ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)';
        this.ctx.strokeStyle = canBuild ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(cell.x, cell.y, range, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Draw Highlight
        this.map.renderBuildHighlight(this.ctx, this.mouseX, this.mouseY, canBuild);
    }

    /**
     * Get Tower Range
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
     * Draw Pause Overlay
     */
    renderPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Paused', this.canvas.width / 2, this.canvas.height / 2);
    }

    /**
     * Destroy Game
     */
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

export default Game;
