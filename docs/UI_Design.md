# 塔防游戏 UI/UX 设计文档

## 1. 整体布局设计

### 1.1 画布尺寸与分区

```
┌─────────────────────────────────────────────────────────────────┐
│  顶部 HUD 栏 (60px)                                              │
├──────────────────────────────────────────┬──────────────────────┤
│                                          │                      │
│                                          │     塔选择面板        │
│                                          │     (120px)          │
│         游戏画布区域                      │                      │
│         (680px × 540px)                  ├──────────────────────┤
│                                          │                      │
│                                          │    塔详情/升级区      │
│                                          │     (200px)          │
│                                          │                      │
└──────────────────────────────────────────┴──────────────────────┘
         总画布: 800px × 600px
```

### 1.2 布局结构说明

| 区域 | 尺寸 | 位置 | 说明 |
|------|------|------|------|
| 游戏画布 | 680×540 | 左上 | 主游戏区域，显示地图、敌人、塔 |
| 顶部HUD | 800×60 | 顶部 | 显示游戏状态信息 |
| 塔选择面板 | 120×340 | 右侧上 | 4种塔的图标按钮 |
| 塔详情区 | 120×200 | 右侧下 | 选中塔的详细信息 |

---

## 2. 详细组件设计

### 2.1 顶部 HUD 栏

```
┌─────────────────────────────────────────────────────────────────┐
│  ❤️ 20    💰 500    波次: 3/10    [1x] [▶/❚❚]    ⚙️              │
└─────────────────────────────────────────────────────────────────┘
```

#### 组件详解：

| 元素 | 图标 | 显示格式 | 颜色 |
|------|------|----------|------|
| 生命值 | ❤️ | 心形 + 数字 | #ff4757 (红) |
| 金币 | 🪙/💰 | 金币图标 + 数字 | #ffa502 (橙) |
| 波次 | 📊 | 当前/总数 | #70a1ff (蓝) |
| 加速 | ⚡ | 1x/2x/3x 按钮 | #2ed573 (绿) |
| 暂停 | ⏸️ | 播放/暂停切换 | #ffffff (白) |
| 设置 | ⚙️ | 齿轮图标 | #a4b0be (灰) |

#### HUD 样式规范：

```css
/* HUD 栏容器 */
.hud-bar {
    width: 800px;
    height: 60px;
    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
    border-bottom: 2px solid #0f3460;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
}

/* HUD 项目 */
.hud-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Arial Black', 'Microsoft YaHei', sans-serif;
    font-size: 18px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.hud-item.health { color: #ff4757; }
.hud-item.money { color: #ffa502; }
.hud-item.wave { color: #70a1ff; }
```

---

### 2.2 塔选择面板

```
┌─────────────┐
│   [塔1]     │  造价: 50💰
│   🔫        │
├─────────────┤
│   [塔2]     │  造价: 100💰
│   🚀        │
├─────────────┤
│   [塔3]     │  造价: 150💰
│   ⚡        │
├─────────────┤
│   [塔4]     │  造价: 200💰
│   🧊        │
└─────────────┘
```

#### 四种塔设计：

| 类型 | 图标 | 名称 | 造价 | 颜色主题 |
|------|------|------|------|----------|
| 机枪塔 | 🔫 | 机枪塔 | 50 | #2ed573 (绿) |
| 火箭塔 | 🚀 | 火箭塔 | 100 | #ff6348 (橙) |
| 激光塔 | ⚡ | 激光塔 | 150 | #5352ed (紫) |
| 冰冻塔 | 🧊 | 冰冻塔 | 200 | #74b9ff (蓝) |

#### 塔按钮样式：

```css
/* 塔选择面板容器 */
.tower-panel {
    width: 120px;
    height: 340px;
    background: linear-gradient(180deg, #16213e 0%, #1a1a2e 100%);
    border-left: 2px solid #0f3460;
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 10px;
    box-sizing: border-box;
}

/* 塔按钮 */
.tower-btn {
    width: 100px;
    height: 70px;
    background: linear-gradient(145deg, #2d3436 0%, #1e272e 100%);
    border: 2px solid #636e72;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    position: relative;
}

.tower-btn:hover {
    border-color: #ffa502;
    box-shadow: 0 0 15px rgba(255, 165, 2, 0.5);
    transform: translateY(-2px);
}

.tower-btn.selected {
    border-color: #2ed573;
    box-shadow: 0 0 20px rgba(46, 213, 115, 0.6);
    background: linear-gradient(145deg, #1e3a2f 0%, #16271e 100%);
}

.tower-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(100%);
}

/* 塔图标 */
.tower-icon {
    font-size: 28px;
    margin-bottom: 4px;
}

/* 造价标签 */
.tower-cost {
    font-size: 12px;
    color: #ffa502;
    font-weight: bold;
    font-family: 'Arial', sans-serif;
}
```

#### 悬停提示框：

```css
/* 悬停提示框 */
.tower-tooltip {
    position: absolute;
    left: -220px;
    top: 0;
    width: 200px;
    background: rgba(26, 26, 46, 0.95);
    border: 1px solid #0f3460;
    border-radius: 8px;
    padding: 12px;
    color: #fff;
    font-family: 'Microsoft YaHei', sans-serif;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    z-index: 100;
}

.tower-tooltip h4 {
    margin: 0 0 8px 0;
    color: #ffa502;
    font-size: 16px;
    border-bottom: 1px solid #0f3460;
    padding-bottom: 4px;
}

.tower-tooltip .stat {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    margin: 4px 0;
    color: #dfe4ea;
}

.tower-tooltip .stat-label {
    color: #a4b0be;
}

.tower-tooltip .description {
    margin-top: 8px;
    font-size: 12px;
    color: #74b9ff;
    line-height: 1.4;
}
```

---

### 2.3 选中状态 - 射程圈

```css
/* 射程圈 - 选中塔时显示 */
.range-indicator {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(46, 213, 115, 0.2) 0%, rgba(46, 213, 115, 0.05) 70%, transparent 100%);
    border: 2px dashed rgba(46, 213, 115, 0.6);
    pointer-events: none;
    animation: rangePulse 2s ease-in-out infinite;
}

@keyframes rangePulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
}

/* 放置预览 - 建造时 */
.placement-preview {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid;
    pointer-events: none;
}

.placement-preview.valid {
    border-color: #2ed573;
    background: rgba(46, 213, 115, 0.3);
    box-shadow: 0 0 15px rgba(46, 213, 115, 0.5);
}

.placement-preview.invalid {
    border-color: #ff4757;
    background: rgba(255, 71, 87, 0.3);
    box-shadow: 0 0 15px rgba(255, 71, 87, 0.5);
}
```

---

### 2.4 升级弹窗

```
┌─────────────────────────────────────┐
│  🔫 机枪塔 Lv.2          [×]       │
├─────────────────────────────────────┤
│  当前属性                           │
│  ├─ 攻击力: 25 ───────→ 35          │
│  ├─ 射程: 120 ────────→ 140         │
│  └─ 攻速: 1.0 ────────→ 0.8         │
│                                     │
│  特殊效果: 10%暴击 → 15%暴击         │
│                                     │
├─────────────────────────────────────┤
│  [💰 出售: 75]    [💰 升级: 100]   │
└─────────────────────────────────────┘
```

#### 升级弹窗样式：

```css
/* 升级弹窗遮罩 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

/* 升级弹窗 */
.upgrade-modal {
    width: 320px;
    background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
    border: 2px solid #0f3460;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.8);
    overflow: hidden;
}

/* 弹窗头部 */
.modal-header {
    background: linear-gradient(90deg, #0f3460 0%, #16213e 100%);
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #1e3799;
}

.modal-title {
    font-family: 'Arial Black', 'Microsoft YaHei', sans-serif;
    font-size: 18px;
    color: #ffa502;
    margin: 0;
}

.modal-close {
    width: 28px;
    height: 28px;
    background: rgba(255, 71, 87, 0.2);
    border: 1px solid #ff4757;
    border-radius: 50%;
    color: #ff4757;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.modal-close:hover {
    background: #ff4757;
    color: #fff;
}

/* 弹窗内容 */
.modal-body {
    padding: 20px;
}

.stat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(15, 52, 96, 0.3);
}

.stat-row:last-child {
    border-bottom: none;
}

.stat-name {
    color: #a4b0be;
    font-size: 14px;
}

.stat-value {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
}

.stat-current {
    color: #dfe4ea;
}

.stat-arrow {
    color: #ffa502;
}

.stat-next {
    color: #2ed573;
    font-weight: bold;
}

/* 特殊效果 */
.special-effect {
    margin-top: 15px;
    padding: 10px;
    background: rgba(83, 82, 237, 0.1);
    border-left: 3px solid #5352ed;
    border-radius: 0 4px 4px 0;
}

.special-effect-label {
    color: #5352ed;
    font-size: 12px;
    margin-bottom: 4px;
}

.special-effect-value {
    color: #dfe4ea;
    font-size: 13px;
}

/* 弹窗底部按钮 */
.modal-footer {
    display: flex;
    gap: 10px;
    padding: 0 20px 20px;
}

.btn {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-family: 'Microsoft YaHei', sans-serif;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.btn-sell {
    background: linear-gradient(145deg, #ff4757 0%, #c0392b 100%);
    color: #fff;
}

.btn-sell:hover {
    box-shadow: 0 4px 15px rgba(255, 71, 87, 0.5);
    transform: translateY(-2px);
}

.btn-upgrade {
    background: linear-gradient(145deg, #2ed573 0%, #27ae60 100%);
    color: #fff;
}

.btn-upgrade:hover:not(:disabled) {
    box-shadow: 0 4px 15px rgba(46, 213, 115, 0.5);
    transform: translateY(-2px);
}

.btn-upgrade:disabled {
    background: #636e72;
    cursor: not-allowed;
    opacity: 0.6;
}
```

---

### 2.5 波次提示

```
╔═══════════════════════════════════════╗
║                                       ║
║         第 3 波敌人来袭！              ║
║                                       ║
║      👾 👾 👾 精英怪出现 👾 👾 👾      ║
║                                       ║
╚═══════════════════════════════════════╝

═══════════════════════════════════════

╔═══════════════════════════════════════╗
║         第 3 波击退完成！              ║
║            奖励: +100💰                ║
╚═══════════════════════════════════════╝
```

#### 波次提示样式：

```css
/* 波次提示容器 */
.wave-announcement {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    pointer-events: none;
    z-index: 500;
}

/* 波次开始提示 */
.wave-start {
    background: linear-gradient(90deg, transparent 0%, rgba(15, 52, 96, 0.9) 20%, rgba(15, 52, 96, 0.9) 80%, transparent 100%);
    padding: 30px 80px;
    animation: waveSlideIn 0.5s ease-out, waveSlideOut 0.5s ease-in 2.5s forwards;
}

.wave-start-title {
    font-family: 'Arial Black', 'Microsoft YaHei', sans-serif;
    font-size: 32px;
    color: #ff4757;
    text-shadow: 0 0 20px rgba(255, 71, 87, 0.8);
    margin-bottom: 10px;
}

.wave-start-subtitle {
    font-size: 18px;
    color: #ffa502;
}

/* 波次完成提示 */
.wave-complete {
    background: linear-gradient(90deg, transparent 0%, rgba(46, 213, 115, 0.2) 20%, rgba(46, 213, 115, 0.2) 80%, transparent 100%);
    padding: 20px 60px;
    animation: waveSlideIn 0.5s ease-out, waveSlideOut 0.5s ease-in 2s forwards;
}

.wave-complete-title {
    font-family: 'Arial Black', 'Microsoft YaHei', sans-serif;
    font-size: 28px;
    color: #2ed573;
    text-shadow: 0 0 20px rgba(46, 213, 115, 0.8);
}

.wave-reward {
    font-size: 20px;
    color: #ffa502;
    margin-top: 10px;
}

@keyframes waveSlideIn {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes waveSlideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

/* 波次进度条 */
.wave-progress {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 6px;
    background: rgba(0,0,0,0.5);
    border-radius: 3px;
    overflow: hidden;
}

.wave-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #ff4757 0%, #ffa502 50%, #2ed573 100%);
    border-radius: 3px;
    transition: width 0.3s ease;
}
```

---

### 2.6 游戏结束界面

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                                                         │
│                    🏆 胜利! 🏆                          │
│                                                         │
│              所有波次已成功击退！                        │
│                                                         │
│              最终得分: 12,580                           │
│              剩余生命: 15/20                            │
│              建造塔数: 12                               │
│                                                         │
│              [🔄 重新开始]    [🏠 主菜单]               │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    💀 失败 💀                           │
│                                                         │
│              防线被突破，基地沦陷                        │
│                                                         │
│              坚持波次: 7/10                             │
│              击杀敌人: 156                              │
│                                                         │
│              [🔄 再试一次]    [🏠 主菜单]               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 游戏结束界面样式：

```css
/* 游戏结束界面 */
.game-over-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.game-over-content {
    width: 450px;
    background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    border: 3px solid;
    border-radius: 16px;
    padding: 40px;
    text-align: center;
    animation: gameOverPulse 2s ease-in-out infinite;
}

/* 胜利样式 */
.game-over-content.victory {
    border-color: #2ed573;
    box-shadow: 0 0 50px rgba(46, 213, 115, 0.4);
}

.game-over-content.victory .game-over-title {
    color: #2ed573;
    text-shadow: 0 0 30px rgba(46, 213, 115, 0.8);
}

/* 失败样式 */
.game-over-content.defeat {
    border-color: #ff4757;
    box-shadow: 0 0 50px rgba(255, 71, 87, 0.4);
}

.game-over-content.defeat .game-over-title {
    color: #ff4757;
    text-shadow: 0 0 30px rgba(255, 71, 87, 0.8);
}

@keyframes gameOverPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
}

.game-over-title {
    font-family: 'Arial Black', 'Microsoft YaHei', sans-serif;
    font-size: 42px;
    margin-bottom: 15px;
}

.game-over-message {
    font-size: 18px;
    color: #dfe4ea;
    margin-bottom: 30px;
}

/* 统计信息 */
.game-stats {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.stat-item:last-child {
    border-bottom: none;
}

.stat-item-label {
    color: #a4b0be;
}

.stat-item-value {
    color: #ffa502;
    font-weight: bold;
}

/* 按钮组 */
.game-over-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
}

.btn-restart {
    padding: 15px 30px;
    background: linear-gradient(145deg, #ffa502 0%, #e67e22 100%);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-family: 'Microsoft YaHei', sans-serif;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-restart:hover {
    box-shadow: 0 5px 20px rgba(255, 165, 2, 0.5);
    transform: translateY(-3px);
}

.btn-menu {
    padding: 15px 30px;
    background: transparent;
    border: 2px solid #70a1ff;
    border-radius: 8px;
    color: #70a1ff;
    font-family: 'Microsoft YaHei', sans-serif;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-menu:hover {
    background: #70a1ff;
    color: #fff;
    transform: translateY(-3px);
}
```

---

## 3. 视觉风格规范

### 3.1 色彩系统

#### 主色调：

| 颜色名称 | 色值 | 用途 |
|----------|------|------|
| 深空黑 | `#0a0a0f` | 最底层背景 |
| 暗夜蓝 | `#1a1a2e` | 主背景色 |
| 深海蓝 | `#16213e` | 次级背景 |
| 科技蓝 | `#0f3460` | 边框、分隔线 |

#### 强调色：

| 颜色名称 | 色值 | 用途 |
|----------|------|------|
| 生命红 | `#ff4757` | 生命值、危险提示 |
| 金币橙 | `#ffa502` | 金币、价格、重要信息 |
| 能量绿 | `#2ed573` | 成功、升级、确认 |
| 科技蓝 | `#70a1ff` | 信息、波次、链接 |
| 神秘紫 | `#5352ed` | 特殊效果、激光塔 |
| 冰霜蓝 | `#74b9ff` | 冰冻塔、减速效果 |

#### 中性色：

| 颜色名称 | 色值 | 用途 |
|----------|------|------|
| 纯白 | `#ffffff` | 主要文字 |
| 浅灰 | `#dfe4ea` | 次级文字 |
| 中灰 | `#a4b0be` | 禁用、提示文字 |
| 深灰 | `#636e72` | 边框、分隔线 |

### 3.2 字体规范

```css
/* 字体定义 */
:root {
    --font-display: 'Arial Black', 'Impact', 'Microsoft YaHei', sans-serif;
    --font-body: 'Microsoft YaHei', 'PingFang SC', 'Arial', sans-serif;
    --font-mono: 'Consolas', 'Monaco', monospace;
}

/* 字号规范 */
.font-h1 { font-size: 42px; font-weight: 900; }  /* 游戏结束标题 */
.font-h2 { font-size: 32px; font-weight: 700; }  /* 波次提示 */
.font-h3 { font-size: 24px; font-weight: 700; }  /* 弹窗标题 */
.font-h4 { font-size: 18px; font-weight: 600; }  /* HUD数字 */
.font-body { font-size: 14px; font-weight: 400; } /* 正文 */
.font-small { font-size: 12px; font-weight: 400; } /* 辅助文字 */
```

### 3.3 按钮样式规范

```css
/* 基础按钮 */
.btn-base {
    padding: 10px 20px;
    border-radius: 6px;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    outline: none;
}

/* 主要按钮 - 橙色 */
.btn-primary {
    background: linear-gradient(145deg, #ffa502 0%, #e67e22 100%);
    color: #fff;
    box-shadow: 0 4px 10px rgba(255, 165, 2, 0.3);
}

.btn-primary:hover {
    box-shadow: 0 6px 20px rgba(255, 165, 2, 0.5);
    transform: translateY(-2px);
}

/* 成功按钮 - 绿色 */
.btn-success {
    background: linear-gradient(145deg, #2ed573 0%, #27ae60 100%);
    color: #fff;
    box-shadow: 0 4px 10px rgba(46, 213, 115, 0.3);
}

.btn-success:hover {
    box-shadow: 0 6px 20px rgba(46, 213, 115, 0.5);
    transform: translateY(-2px);
}

/* 危险按钮 - 红色 */
.btn-danger {
    background: linear-gradient(145deg, #ff4757 0%, #c0392b 100%);
    color: #fff;
    box-shadow: 0 4px 10px rgba(255, 71, 87, 0.3);
}

.btn-danger:hover {
    box-shadow: 0 6px 20px rgba(255, 71, 87, 0.5);
    transform: translateY(-2px);
}

/* 次要按钮 - 描边 */
.btn-secondary {
    background: transparent;
    border: 2px solid #70a1ff;
    color: #70a1ff;
}

.btn-secondary:hover {
    background: #70a1ff;
    color: #fff;
}

/* 图标按钮 */
.btn-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.btn-icon:hover {
    background: rgba(255,255,255,0.2);
    transform: scale(1.1);
}

.btn-icon:active {
    transform: scale(0.95);
}
```

---

## 4. 完整 CSS 代码

```css
/* ========================================
   塔防游戏 UI 样式表
   主题：末日科技风
   ======================================== */

/* ---- 基础变量 ---- */
:root {
    /* 背景色 */
    --bg-darkest: #0a0a0f;
    --bg-dark: #1a1a2e;
    --bg-medium: #16213e;
    --bg-light: #0f3460;

    /* 强调色 */
    --accent-red: #ff4757;
    --accent-orange: #ffa502;
    --accent-green: #2ed573;
    --accent-blue: #70a1ff;
    --accent-purple: #5352ed;
    --accent-cyan: #74b9ff;

    /* 文字色 */
    --text-white: #ffffff;
    --text-light: #dfe4ea;
    --text-muted: #a4b0be;
    --text-dark: #636e72;

    /* 字体 */
    --font-display: 'Arial Black', 'Impact', 'Microsoft YaHei', sans-serif;
    --font-body: 'Microsoft YaHei', 'PingFang SC', 'Arial', sans-serif;
    --font-mono: 'Consolas', 'Monaco', monospace;

    /* 尺寸 */
    --hud-height: 60px;
    --panel-width: 120px;
    --canvas-width: 680px;
    --canvas-height: 540px;
}

/* ---- 全局重置 ---- */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-body);
    background: var(--bg-darkest);
    color: var(--text-white);
    overflow: hidden;
}

/* ---- 游戏容器 ---- */
.game-container {
    width: 800px;
    height: 600px;
    margin: 0 auto;
    background: var(--bg-dark);
    position: relative;
    box-shadow: 0 0 50px rgba(0,0,0,0.8);
}

/* ---- HUD 栏 ---- */
.hud-bar {
    width: 100%;
    height: var(--hud-height);
    background: linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-medium) 100%);
    border-bottom: 2px solid var(--bg-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
}

.hud-left, .hud-center, .hud-right {
    display: flex;
    align-items: center;
    gap: 20px;
}

.hud-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.hud-item.health { color: var(--accent-red); }
.hud-item.money { color: var(--accent-orange); }
.hud-item.wave { color: var(--accent-blue); }

.hud-icon {
    font-size: 22px;
}

/* ---- 游戏区域 ---- */
.game-area {
    display: flex;
    height: var(--canvas-height);
}

/* ---- 画布 ---- */
.game-canvas {
    width: var(--canvas-width);
    height: var(--canvas-height);
    background: #0d1b2a;
    position: relative;
    overflow: hidden;
}

/* ---- 右侧面板 ---- */
.side-panel {
    width: var(--panel-width);
    background: linear-gradient(180deg, var(--bg-medium) 0%, var(--bg-dark) 100%);
    border-left: 2px solid var(--bg-light);
    display: flex;
    flex-direction: column;
}

/* ---- 塔选择面板 ---- */
.tower-panel {
    flex: 1;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.tower-btn {
    width: 100%;
    height: 70px;
    background: linear-gradient(145deg, #2d3436 0%, #1e272e 100%);
    border: 2px solid var(--text-dark);
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    position: relative;
}

.tower-btn:hover {
    border-color: var(--accent-orange);
    box-shadow: 0 0 15px rgba(255, 165, 2, 0.5);
    transform: translateY(-2px);
}

.tower-btn.selected {
    border-color: var(--accent-green);
    box-shadow: 0 0 20px rgba(46, 213, 115, 0.6);
    background: linear-gradient(145deg, #1e3a2f 0%, #16271e 100%);
}

.tower-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(100%);
}

.tower-icon {
    font-size: 28px;
    margin-bottom: 4px;
}

.tower-cost {
    font-size: 12px;
    color: var(--accent-orange);
    font-weight: bold;
}

/* ---- 塔悬停提示 ---- */
.tower-tooltip {
    position: absolute;
    right: 110px;
    top: 0;
    width: 180px;
    background: rgba(26, 26, 46, 0.95);
    border: 1px solid var(--bg-light);
    border-radius: 8px;
    padding: 12px;
    color: #fff;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    z-index: 100;
    pointer-events: none;
}

.tower-tooltip h4 {
    margin: 0 0 8px 0;
    color: var(--accent-orange);
    font-size: 14px;
    border-bottom: 1px solid var(--bg-light);
    padding-bottom: 4px;
}

.tower-tooltip .stat {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin: 3px 0;
    color: var(--text-light);
}

.tower-tooltip .stat-label {
    color: var(--text-muted);
}

.tower-tooltip .description {
    margin-top: 8px;
    font-size: 11px;
    color: var(--accent-cyan);
    line-height: 1.4;
}

/* ---- 射程圈 ---- */
.range-indicator {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(46, 213, 115, 0.2) 0%, rgba(46, 213, 115, 0.05) 70%, transparent 100%);
    border: 2px dashed rgba(46, 213, 115, 0.6);
    pointer-events: none;
    animation: rangePulse 2s ease-in-out infinite;
}

@keyframes rangePulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
}

/* ---- 放置预览 ---- */
.placement-preview {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid;
    pointer-events: none;
}

.placement-preview.valid {
    border-color: var(--accent-green);
    background: rgba(46, 213, 115, 0.3);
    box-shadow: 0 0 15px rgba(46, 213, 115, 0.5);
}

.placement-preview.invalid {
    border-color: var(--accent-red);
    background: rgba(255, 71, 87, 0.3);
    box-shadow: 0 0 15px rgba(255, 71, 87, 0.5);
}

/* ---- 升级弹窗 ---- */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.upgrade-modal {
    width: 300px;
    background: linear-gradient(145deg, var(--bg-dark) 0%, var(--bg-medium) 100%);
    border: 2px solid var(--bg-light);
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.8);
    overflow: hidden;
}

.modal-header {
    background: linear-gradient(90deg, var(--bg-light) 0%, var(--bg-medium) 100%);
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #1e3799;
}

.modal-title {
    font-family: var(--font-display);
    font-size: 16px;
    color: var(--accent-orange);
    margin: 0;
}

.modal-close {
    width: 28px;
    height: 28px;
    background: rgba(255, 71, 87, 0.2);
    border: 1px solid var(--accent-red);
    border-radius: 50%;
    color: var(--accent-red);
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.modal-close:hover {
    background: var(--accent-red);
    color: #fff;
}

.modal-body {
    padding: 15px;
}

.stat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid rgba(15, 52, 96, 0.3);
}

.stat-row:last-child {
    border-bottom: none;
}

.stat-name {
    color: var(--text-muted);
    font-size: 13px;
}

.stat-value {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
}

.stat-current {
    color: var(--text-light);
}

.stat-arrow {
    color: var(--accent-orange);
}

.stat-next {
    color: var(--accent-green);
    font-weight: bold;
}

.special-effect {
    margin-top: 12px;
    padding: 8px;
    background: rgba(83, 82, 237, 0.1);
    border-left: 3px solid var(--accent-purple);
    border-radius: 0 4px 4px 0;
}

.special-effect-label {
    color: var(--accent-purple);
    font-size: 11px;
    margin-bottom: 2px;
}

.special-effect-value {
    color: var(--text-light);
    font-size: 12px;
}

.modal-footer {
    display: flex;
    gap: 10px;
    padding: 0 15px 15px;
}

/* ---- 按钮样式 ---- */
.btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 6px;
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.btn-sell {
    background: linear-gradient(145deg, var(--accent-red) 0%, #c0392b 100%);
    color: #fff;
}

.btn-sell:hover {
    box-shadow: 0 4px 15px rgba(255, 71, 87, 0.5);
    transform: translateY(-2px);
}

.btn-upgrade {
    background: linear-gradient(145deg, var(--accent-green) 0%, #27ae60 100%);
    color: #fff;
}

.btn-upgrade:hover:not(:disabled) {
    box-shadow: 0 4px 15px rgba(46, 213, 115, 0.5);
    transform: translateY(-2px);
}

.btn-upgrade:disabled {
    background: var(--text-dark);
    cursor: not-allowed;
    opacity: 0.6;
}

/* ---- 波次提示 ---- */
.wave-announcement {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    pointer-events: none;
    z-index: 500;
}

.wave-start {
    background: linear-gradient(90deg, transparent 0%, rgba(15, 52, 96, 0.9) 20%, rgba(15, 52, 96, 0.9) 80%, transparent 100%);
    padding: 25px 60px;
    animation: waveSlideIn 0.5s ease-out, waveSlideOut 0.5s ease-in 2.5s forwards;
}

.wave-start-title {
    font-family: var(--font-display);
    font-size: 28px;
    color: var(--accent-red);
    text-shadow: 0 0 20px rgba(255, 71, 87, 0.8);
    margin-bottom: 8px;
}

.wave-start-subtitle {
    font-size: 16px;
    color: var(--accent-orange);
}

.wave-complete {
    background: linear-gradient(90deg, transparent 0%, rgba(46, 213, 115, 0.2) 20%, rgba(46, 213, 115, 0.2) 80%, transparent 100%);
    padding: 20px 50px;
    animation: waveSlideIn 0.5s ease-out, waveSlideOut 0.5s ease-in 2s forwards;
}

.wave-complete-title {
    font-family: var(--font-display);
    font-size: 24px;
    color: var(--accent-green);
    text-shadow: 0 0 20px rgba(46, 213, 115, 0.8);
}

.wave-reward {
    font-size: 18px;
    color: var(--accent-orange);
    margin-top: 8px;
}

@keyframes waveSlideIn {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes waveSlideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.wave-progress {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 250px;
    height: 5px;
    background: rgba(0,0,0,0.5);
    border-radius: 3px;
    overflow: hidden;
}

.wave-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-red) 0%, var(--accent-orange) 50%, var(--accent-green) 100%);
    border-radius: 3px;
    transition: width 0.3s ease;
}

/* ---- 游戏结束界面 ---- */
.game-over-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.game-over-content {
    width: 400px;
    background: linear-gradient(145deg, var(--bg-dark) 0%, var(--bg-medium) 50%, var(--bg-light) 100%);
    border: 3px solid;
    border-radius: 16px;
    padding: 35px;
    text-align: center;
    animation: gameOverPulse 2s ease-in-out infinite;
}

.game-over-content.victory {
    border-color: var(--accent-green);
    box-shadow: 0 0 50px rgba(46, 213, 115, 0.4);
}

.game-over-content.victory .game-over-title {
    color: var(--accent-green);
    text-shadow: 0 0 30px rgba(46, 213, 115, 0.8);
}

.game-over-content.defeat {
    border-color: var(--accent-red);
    box-shadow: 0 0 50px rgba(255, 71, 87, 0.4);
}

.game-over-content.defeat .game-over-title {
    color: var(--accent-red);
    text-shadow: 0 0 30px rgba(255, 71, 87, 0.8);
}

@keyframes gameOverPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
}

.game-over-title {
    font-family: var(--font-display);
    font-size: 36px;
    margin-bottom: 12px;
}

.game-over-message {
    font-size: 16px;
    color: var(--text-light);
    margin-bottom: 25px;
}

.game-stats {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 25px;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.stat-item:last-child {
    border-bottom: none;
}

.stat-item-label {
    color: var(--text-muted);
    font-size: 14px;
}

.stat-item-value {
    color: var(--accent-orange);
    font-weight: bold;
    font-size: 14px;
}

.game-over-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.btn-restart {
    padding: 12px 25px;
    background: linear-gradient(145deg, var(--accent-orange) 0%, #e67e22 100%);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-family: var(--font-body);
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-restart:hover {
    box-shadow: 0 5px 20px rgba(255, 165, 2, 0.5);
    transform: translateY(-3px);
}

.btn-menu {
    padding: 12px 25px;
    background: transparent;
    border: 2px solid var(--accent-blue);
    border-radius: 8px;
    color: var(--accent-blue);
    font-family: var(--font-body);
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-menu:hover {
    background: var(--accent-blue);
    color: #fff;
    transform: translateY(-3px);
}

/* ---- 控制按钮 ---- */
.control-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    font-size: 14px;
}

.control-btn:hover {
    background: rgba(255,255,255,0.2);
    transform: scale(1.1);
}

.control-btn.active {
    background: var(--accent-green);
    border-color: var(--accent-green);
}

.speed-btn {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: bold;
}

/* ---- 响应式适配 ---- */
@media (max-width: 820px) {
    .game-container {
        transform: scale(0.9);
        transform-origin: top center;
    }
}

@media (max-width: 750px) {
    .game-container {
        transform: scale(0.8);
    }
}
```

---

## 5. 交互设计说明

### 5.1 鼠标交互

| 操作 | 响应 |
|------|------|
| 点击塔按钮 | 选中塔，鼠标变为建造模式 |
| 悬停塔按钮 | 显示详细信息提示框 |
| 点击地图空地 | 建造选中的塔（金币足够时） |
| 点击已建塔 | 打开升级弹窗 |
| 悬停可建造位置 | 显示绿色射程圈预览 |
| 悬停不可建造位置 | 显示红色禁止预览 |
| 点击暂停按钮 | 游戏暂停/继续切换 |
| 点击加速按钮 | 1x/2x/3x 循环切换 |

### 5.2 键盘快捷键

| 按键 | 功能 |
|------|------|
| 1-4 | 快速选择塔类型 |
| Space | 暂停/继续 |
| Esc | 取消选中 / 关闭弹窗 |
| S | 出售选中的塔 |
| U | 升级选中的塔 |

### 5.3 动画效果规范

| 元素 | 动画 | 时长 | 缓动函数 |
|------|------|------|----------|
| 按钮悬停 | 上移+发光 | 0.2s | ease |
| 波次提示 | 滑入滑出 | 0.5s | ease-out/in |
| 射程圈 | 脉冲呼吸 | 2s | ease-in-out |
| 游戏结束 | 轻微缩放 | 2s | ease-in-out |
| 建造预览 | 透明度变化 | 0.2s | linear |

---

## 6. 文件结构建议

```
assets/
├── css/
│   └── game-ui.css          # 本设计文档对应的样式文件
├── images/
│   ├── icons/
│   │   ├── heart.png        # 生命值图标
│   │   ├── coin.png         # 金币图标
│   │   ├── tower-gun.png    # 机枪塔图标
│   │   ├── tower-rocket.png # 火箭塔图标
│   │   ├── tower-laser.png  # 激光塔图标
│   │   └── tower-ice.png    # 冰冻塔图标
│   └── ui/
│       ├── panel-bg.png     # 面板背景
│       └── button-bg.png    # 按钮背景
└── fonts/
    └── game-font.ttf        # 游戏专用字体
```

---

## 7. 设计亮点总结

1. **末日科技风格**：深色背景配合霓虹色强调，营造紧张刺激的游戏氛围
2. **清晰的信息层级**：通过颜色、大小、位置区分重要信息
3. **丰富的视觉反馈**：悬停、选中、禁用状态都有明显的视觉变化
4. **流畅的动画效果**：脉冲、滑动、缩放等动画增强游戏感
5. **完整的交互闭环**：从选塔→建造→升级→出售，每个环节都有对应的UI反馈
