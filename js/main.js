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

        // UI Elements
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

        // Game Speed Options
        this.speedOptions = [1, 1.5, 2];
        this.currentSpeedIndex = 0;

        this.init();
    }

    /**
     * Initialize Application
     */
    init() {
        // Create Game Instance
        this.game = new Game(this.canvas);

        // Bind Game Event Callbacks
        this.bindGameCallbacks();

        // Bind UI Events
        this.bindUIEvents();

        // Initialize UI State
        this.updateUI();
    }

    /**
     * Bind Game Callbacks
     */
    bindGameCallbacks() {
        // Money Changed
        this.game.onMoneyChanged = (money) => {
            this.ui.money.textContent = money;
            this.updateTowerButtons();
        };

        // Lives Changed
        this.game.onLivesChanged = (lives) => {
            this.ui.lives.textContent = lives;
        };

        // Wave Changed
        this.game.onWaveChanged = (wave) => {
            this.ui.wave.textContent = wave;
        };

        // Score Changed
        this.game.onScoreChanged = (score) => {
            this.ui.score.textContent = score;
        };

        // Tower Selected
        this.game.onTowerSelected = (tower) => {
            this.showUpgradePanel(tower);
        };

        // Tower Deselected
        this.game.onTowerDeselected = () => {
            this.hideUpgradePanel();
        };

        // Tower Built
        this.game.onTowerBuilt = () => {
            this.updateTowerButtons();
        };

        // Tower Upgraded
        this.game.onTowerUpgraded = (tower) => {
            this.showUpgradePanel(tower);
            this.updateTowerButtons();
        };

        // Wave Started
        this.game.onWaveStarted = () => {
            this.ui.startWaveBtn.disabled = true;
            this.ui.startWaveBtn.textContent = 'Wave In Progress...';
        };

        // Wave Completed
        this.game.onWaveCompleted = () => {
            this.ui.startWaveBtn.disabled = false;
            this.ui.startWaveBtn.textContent = 'Start Wave';
        };

        // Game Over
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
        // Tower Selection Buttons
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

        // Pause Button
        this.ui.pauseBtn.addEventListener('click', () => {
            const state = this.game.togglePause();
            this.ui.pauseBtn.textContent = state === GameState.PAUSED ? 'Resume' : 'Pause';
        });

        // Speed Button
        this.ui.speedBtn.addEventListener('click', () => {
            this.currentSpeedIndex = (this.currentSpeedIndex + 1) % this.speedOptions.length;
            const speed = this.speedOptions[this.currentSpeedIndex];
            this.game.setGameSpeed(speed);
            this.ui.speedBtn.textContent = speed + 'x';
        });

        // Upgrade Button
        this.ui.upgradeBtn.addEventListener('click', () => {
            if (this.game.selectedTower) {
                const result = this.game.upgradeTower(this.game.selectedTower);
                if (!result.success) {
                    alert(result.message);
                }
            }
        });

        // Sell Button
        this.ui.sellBtn.addEventListener('click', () => {
            if (this.game.selectedTower) {
                this.game.sellTower(this.game.selectedTower);
            }
        });

        // Close Upgrade Panel Button
        this.ui.closeUpgradeBtn.addEventListener('click', () => {
            this.game.selectedTower = null;
            this.hideUpgradePanel();
        });

        // Restart Button
        this.ui.restartBtn.addEventListener('click', () => {
            this.ui.gameOverModal.classList.add('hidden');
            this.game.restart();
            this.ui.startWaveBtn.disabled = false;
            this.ui.startWaveBtn.textContent = 'Start Wave';
            this.ui.pauseBtn.textContent = 'Pause';
            this.updateUI();
        });

        // Keyboard Shortcuts
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
     * Select Tower Type
     */
    selectTowerType(type, btn) {
        // Clear Previous Selection
        this.clearTowerSelection();

        // If Clicking Already Selected, Deselect
        if (this.game.selectedTowerType === type) {
            this.game.selectTowerType(null);
            return;
        }

        // Check If Enough Money
        const towerInfo = this.game.getTowerInfo?.(type) || { cost: 100 };
        if (this.game.money < towerInfo.cost) {
            alert('Insufficient Gold!');
            return;
        }

        // Select New Type
        this.game.selectTowerType(type);
        btn.classList.add('selected');
    }

    /**
     * Clear Tower Selection
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
     * Update Tower Buttons State
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
     * Update UI
     */
    updateUI() {
        this.ui.lives.textContent = this.game.lives;
        this.ui.money.textContent = this.game.money;
        this.ui.wave.textContent = this.game.wave;
        this.ui.score.textContent = this.game.score;
        this.updateTowerButtons();
    }
}

// Start Game
document.addEventListener('DOMContentLoaded', () => {
    new GameApp();
});

export default GameApp;
