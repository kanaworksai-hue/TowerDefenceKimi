/**
 * Game Entry Module
 * Initialization and Event Binding
 */

import { Game, GameState } from './game.js';

/**
 * Game Application Class
 */
class GameApp {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.game = null;

        // UI元素
        this.ui = {
            lives: document.getElementById('lives'),
            money: document.getElementById('money'),
            wave: document.getElementById('wave'),
            score: document.getElementById('score'),
            towerButtons: document.querySelectorAll('.tower-btn'),
            startWaveBtn: document.getElementById('start-wave-btn'),
            pauseBtn: document.getElementById('pause-btn'),
            speedBtn: document.getElementById('speed-btn'),
            upgradePanel: document.getElementById('tower-upgrade-panel'),
            towerLevel: document.getElementById('tower-level'),
            towerDamage: document.getElementById('tower-damage'),
            towerRange: document.getElementById('tower-range'),
            towerSpeed: document.getElementById('tower-speed'),
            upgradeBtn: document.getElementById('upgrade-btn'),
            sellBtn: document.getElementById('sell-btn'),
            closeUpgradeBtn: document.getElementById('close-upgrade-btn'),
            gameOverModal: document.getElementById('game-over-modal'),
            finalScore: document.getElementById('final-score'),
            finalWave: document.getElementById('final-wave'),
            restartBtn: document.getElementById('restart-btn')
        };

        // 游戏速度选项
        this.speedOptions = [1, 1.5, 2];
        this.currentSpeedIndex = 0;

        this.init();
    }

    /**
     * Initialize Application
     */
    init() {
        // 创建游戏实例
        this.game = new Game(this.canvas);

        // 绑定游戏事件回调
        this.bindGameCallbacks();

        // Bind UI Events
        this.bindUIEvents();

        // 初始化UI状态
        this.updateUI();
    }

    /**
     * 绑定游戏回调
     */
    bindGameCallbacks() {
        // 金钱变化
        this.game.onMoneyChanged = (money) => {
            this.ui.money.textContent = money;
            this.updateTowerButtons();
        };

        // 生命值变化
        this.game.onLivesChanged = (lives) => {
            this.ui.lives.textContent = lives;
        };

        // 波次变化
        this.game.onWaveChanged = (wave) => {
            this.ui.wave.textContent = wave;
        };

        // 分数变化
        this.game.onScoreChanged = (score) => {
            this.ui.score.textContent = score;
        };

        // 防御塔选中
        this.game.onTowerSelected = (tower) => {
            this.showUpgradePanel(tower);
        };

        // 防御塔取消选中
        this.game.onTowerDeselected = () => {
            this.hideUpgradePanel();
        };

        // 防御塔建造
        this.game.onTowerBuilt = () => {
            this.updateTowerButtons();
        };

        // 防御塔升级
        this.game.onTowerUpgraded = (tower) => {
            this.showUpgradePanel(tower);
            this.updateTowerButtons();
        };

        // 波次开始
        this.game.onWaveStarted = () => {
            this.ui.startWaveBtn.disabled = true;
            this.ui.startWaveBtn.textContent = '波次进行中...';
        };

        // 波次完成
        this.game.onWaveCompleted = () => {
            this.ui.startWaveBtn.disabled = false;
            this.ui.startWaveBtn.textContent = '开始波次';
        };

        // 游戏结束
        this.game.onGameOver = (score, wave) => {
            this.ui.finalScore.textContent = score;
            this.ui.finalWave.textContent = wave;
            this.ui.gameOverModal.classList.remove('hidden');
        };
    }

    /**
     * Bind UI Events
     */
    bindUIEvents() {
        // 防御塔选择按钮
        this.ui.towerButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                this.selectTowerType(type, btn);
            });
        });

        // Start Wave Button
        this.ui.startWaveBtn.addEventListener('click', () => {
            this.game.startWave();
        });

        // 暂停按钮
        this.ui.pauseBtn.addEventListener('click', () => {
            const state = this.game.togglePause();
            this.ui.pauseBtn.textContent = state === GameState.PAUSED ? '继续' : '暂停';
        });

        // 速度按钮
        this.ui.speedBtn.addEventListener('click', () => {
            this.currentSpeedIndex = (this.currentSpeedIndex + 1) % this.speedOptions.length;
            const speed = this.speedOptions[this.currentSpeedIndex];
            this.game.setGameSpeed(speed);
            this.ui.speedBtn.textContent = speed + 'x';
        });

        // 升级按钮
        this.ui.upgradeBtn.addEventListener('click', () => {
            if (this.game.selectedTower) {
                const result = this.game.upgradeTower(this.game.selectedTower);
                if (!result.success) {
                    alert(result.message);
                }
            }
        });

        // 出售按钮
        this.ui.sellBtn.addEventListener('click', () => {
            if (this.game.selectedTower) {
                this.game.sellTower(this.game.selectedTower);
            }
        });

        // Close Upgrade Panel按钮
        this.ui.closeUpgradeBtn.addEventListener('click', () => {
            this.game.selectedTower = null;
            this.hideUpgradePanel();
        });

        // 重新开始按钮
        this.ui.restartBtn.addEventListener('click', () => {
            this.ui.gameOverModal.classList.add('hidden');
            this.game.restart();
            this.ui.startWaveBtn.disabled = false;
            this.ui.startWaveBtn.textContent = '开始波次';
            this.ui.pauseBtn.textContent = '暂停';
            this.updateUI();
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Escape':
                    this.game.selectedTower = null;
                    this.game.selectTowerType(null);
                    this.clearTowerSelection();
                    this.hideUpgradePanel();
                    break;
                case ' ':
                    e.preventDefault();
                    this.ui.pauseBtn.click();
                    break;
                case 'Enter':
                    if (!this.ui.startWaveBtn.disabled) {
                        this.ui.startWaveBtn.click();
                    }
                    break;
            }
        });
    }

    /**
     * 选择防御塔类型
     */
    selectTowerType(type, btn) {
        // 清除之前的选择
        this.clearTowerSelection();

        // 如果点击的是已选中的，则取消选择
        if (this.game.selectedTowerType === type) {
            this.game.selectTowerType(null);
            return;
        }

        // 检查金币是否足够
        const towerInfo = this.game.getTowerInfo?.(type) || { cost: 100 };
        if (this.game.money < towerInfo.cost) {
            alert('金币不足！');
            return;
        }

        // 选中新类型
        this.game.selectTowerType(type);
        btn.classList.add('selected');
    }

    /**
     * 清除防御塔选择
     */
    clearTowerSelection() {
        this.ui.towerButtons.forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    /**
     * Show Upgrade Panel
     */
    showUpgradePanel(tower) {
        this.ui.towerLevel.textContent = tower.level;
        this.ui.towerDamage.textContent = tower.damage;
        this.ui.towerRange.textContent = Math.floor(tower.range);
        this.ui.towerSpeed.textContent = (1000 / tower.fireRate).toFixed(1) + '/s';

        const upgradePreview = tower.getUpgradePreview();
        if (upgradePreview) {
            this.ui.upgradeBtn.disabled = false;
            this.ui.upgradeBtn.querySelector('#upgrade-cost').textContent = tower.upgradeCost;
        } else {
            this.ui.upgradeBtn.disabled = true;
            this.ui.upgradeBtn.querySelector('#upgrade-cost').textContent = 'MAX';
        }

        this.ui.sellBtn.querySelector('#sell-value').textContent = tower.sellValue;
        this.ui.upgradePanel.classList.remove('hidden');
    }

    /**
     * Hide Upgrade Panel
     */
    hideUpgradePanel() {
        this.ui.upgradePanel.classList.add('hidden');
    }

    /**
     * 更新防御塔按钮状态
     */
    updateTowerButtons() {
        this.ui.towerButtons.forEach(btn => {
            const type = btn.dataset.type;
            const towerInfo = this.game.getTowerInfo?.(type) || { cost: 100 };

            if (this.game.money < towerInfo.cost) {
                btn.classList.add('disabled');
            } else {
                btn.classList.remove('disabled');
            }
        });
    }

    /**
     * 更新UI
     */
    updateUI() {
        this.ui.lives.textContent = this.game.lives;
        this.ui.money.textContent = this.game.money;
        this.ui.wave.textContent = this.game.wave;
        this.ui.score.textContent = this.game.score;
        this.updateTowerButtons();
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new GameApp();
});

export default GameApp;
