# 塔防游戏视觉设计方案

## 设计理念

本游戏采用**程序化Canvas绘制**方案，完全不依赖外部图片资源。所有视觉元素通过代码实时渲染，具有以下优势：
- 文件体积小，加载速度快
- 可动态调整大小和颜色
- 支持流畅的动画效果
- 易于修改和扩展

视觉风格：**科技感 + 霓虹光效**，深色背景搭配高饱和度色彩。

---

## 1. CSS颜色变量方案

```css
:root {
  /* 背景色系 */
  --bg-dark: #1a1a2e;
  --bg-panel: #16213e;
  --bg-card: #0f3460;
  --bg-hover: #1a4a7a;

  /* 防御塔颜色 */
  --tower-machine: #4ecca3;
  --tower-machine-dark: #3ba382;
  --tower-sniper: #e94560;
  --tower-sniper-dark: #c73a52;
  --tower-rocket: #f4a261;
  --tower-rocket-dark: #e08c4a;
  --tower-slow: #9d4edd;
  --tower-slow-dark: #7b2cbf;

  /* 僵尸颜色 */
  --zombie-normal: #6ab04c;
  --zombie-normal-dark: #4a8a3c;
  --zombie-fast: #f9ca24;
  --zombie-fast-dark: #d4a520;
  --zombie-tank: #eb4d4b;
  --zombie-tank-dark: #c73a38;
  --zombie-fly: #74b9ff;
  --zombie-fly-dark: #5a9fd9;

  /* 特效颜色 */
  --effect-bullet: #f1c40f;
  --effect-explosion: #e74c3c;
  --effect-slow: #3498db;
  --effect-heal: #2ecc71;
  --effect-range: rgba(255, 255, 255, 0.3);

  /* UI颜色 */
  --ui-text: #ecf0f1;
  --ui-text-muted: #95a5a6;
  --ui-border: #34495e;
  --ui-success: #2ecc71;
  --ui-warning: #f39c12;
  --ui-danger: #e74c3c;

  /* 路径和地图 */
  --path-color: #2c3e50;
  --path-border: #34495e;
  --grid-line: rgba(255, 255, 255, 0.05);
}
```

---

## 2. 防御塔视觉设计

### 2.1 机枪塔 (Machine Gun Tower)

**特征**：方形基座 + 旋转枪管

```javascript
/**
 * 绘制机枪塔
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 中心X坐标
 * @param {number} y - 中心Y坐标
 * @param {number} size - 塔的大小（像素）
 * @param {number} rotation - 旋转角度（弧度）
 * @param {number} level - 塔等级（1-3）
 */
function drawMachineGunTower(ctx, x, y, size, rotation, level = 1) {
  const baseSize = size * 0.8;
  const barrelLength = size * 0.6;
  const barrelWidth = size * 0.2;

  ctx.save();
  ctx.translate(x, y);

  // 绘制方形基座（带发光效果）
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#4ecca3';
  ctx.fillStyle = '#4ecca3';
  ctx.fillRect(-baseSize/2, -baseSize/2, baseSize, baseSize);

  // 基座内部细节
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#3ba382';
  ctx.fillRect(-baseSize/3, -baseSize/3, baseSize/1.5, baseSize/1.5);

  // 绘制旋转枪管
  ctx.rotate(rotation);

  // 枪管底座
  ctx.fillStyle = '#4ecca3';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
  ctx.fill();

  // 枪管
  ctx.fillStyle = '#6fffd3';
  ctx.fillRect(0, -barrelWidth/2, barrelLength, barrelWidth);

  // 枪口
  ctx.fillStyle = '#aaffee';
  ctx.fillRect(barrelLength - 5, -barrelWidth/3, 8, barrelWidth/1.5);

  // 等级标识
  drawLevelIndicator(ctx, 0, 0, size, level);

  ctx.restore();
}
```

### 2.2 狙击塔 (Sniper Tower)

**特征**：三角形基座 + 长枪管

```javascript
/**
 * 绘制狙击塔
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 中心X坐标
 * @param {number} y - 中心Y坐标
 * @param {number} size - 塔的大小（像素）
 * @param {number} rotation - 旋转角度（弧度）
 * @param {number} level - 塔等级（1-3）
 */
function drawSniperTower(ctx, x, y, size, rotation, level = 1) {
  const baseSize = size * 0.8;
  const barrelLength = size * 0.9;

  ctx.save();
  ctx.translate(x, y);

  // 绘制三角形基座
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#e94560';
  ctx.fillStyle = '#e94560';

  ctx.beginPath();
  ctx.moveTo(0, -baseSize/2);
  ctx.lineTo(-baseSize/2, baseSize/2);
  ctx.lineTo(baseSize/2, baseSize/2);
  ctx.closePath();
  ctx.fill();

  // 基座内部细节
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#c73a52';
  ctx.beginPath();
  ctx.moveTo(0, -baseSize/4);
  ctx.lineTo(-baseSize/3, baseSize/3);
  ctx.lineTo(baseSize/3, baseSize/3);
  ctx.closePath();
  ctx.fill();

  // 绘制长枪管
  ctx.rotate(rotation);

  // 枪管支架
  ctx.fillStyle = '#e94560';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
  ctx.fill();

  // 长枪管
  ctx.fillStyle = '#ff6b7a';
  ctx.fillRect(0, -size * 0.1, barrelLength, size * 0.2);

  // 瞄准镜
  ctx.fillStyle = '#ff8a9a';
  ctx.fillRect(size * 0.3, -size * 0.15, size * 0.3, size * 0.08);

  // 枪口
  ctx.fillStyle = '#ffccd5';
  ctx.fillRect(barrelLength - 3, -size * 0.06, 6, size * 0.12);

  // 等级标识
  drawLevelIndicator(ctx, 0, 0, size, level);

  ctx.restore();
}
```

### 2.3 火箭塔 (Rocket Tower)

**特征**：圆形基座 + 发射管阵列

```javascript
/**
 * 绘制火箭塔
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 中心X坐标
 * @param {number} y - 中心Y坐标
 * @param {number} size - 塔的大小（像素）
 * @param {number} rotation - 旋转角度（弧度）
 * @param {number} level - 塔等级（1-3）
 */
function drawRocketTower(ctx, x, y, size, rotation, level = 1) {
  const baseSize = size * 0.8;

  ctx.save();
  ctx.translate(x, y);

  // 绘制圆形基座
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#f4a261';
  ctx.fillStyle = '#f4a261';

  ctx.beginPath();
  ctx.arc(0, 0, baseSize/2, 0, Math.PI * 2);
  ctx.fill();

  // 基座内部圆环
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#e08c4a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, baseSize/3, 0, Math.PI * 2);
  ctx.stroke();

  // 绘制发射管阵列
  ctx.rotate(rotation);

  const tubeCount = level === 1 ? 2 : level === 2 ? 3 : 4;
  const tubeRadius = size * 0.35;
  const tubeSize = size * 0.18;

  for (let i = 0; i < tubeCount; i++) {
    const angle = (Math.PI * 2 / tubeCount) * i - Math.PI / 2;
    const tx = Math.cos(angle) * tubeRadius;
    const ty = Math.sin(angle) * tubeRadius;

    // 发射管
    ctx.fillStyle = '#f4a261';
    ctx.beginPath();
    ctx.arc(tx, ty, tubeSize/2, 0, Math.PI * 2);
    ctx.fill();

    // 发射管内部
    ctx.fillStyle = '#6b4423';
    ctx.beginPath();
    ctx.arc(tx, ty, tubeSize/3, 0, Math.PI * 2);
    ctx.fill();

    // 火箭头
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(tx + Math.cos(angle) * tubeSize/2, ty + Math.sin(angle) * tubeSize/2, tubeSize/4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 中心枢纽
  ctx.fillStyle = '#e08c4a';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
  ctx.fill();

  // 等级标识
  drawLevelIndicator(ctx, 0, 0, size, level);

  ctx.restore();
}
```

### 2.4 减速塔 (Slow Tower)

**特征**：六边形基座 + 脉冲光环

```javascript
/**
 * 绘制减速塔
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 中心X坐标
 * @param {number} y - 中心Y坐标
 * @param {number} size - 塔的大小（像素）
 * @param {number} rotation - 旋转角度（弧度）
 * @param {number} level - 塔等级（1-3）
 * @param {number} pulsePhase - 脉冲相位（0-1）
 */
function drawSlowTower(ctx, x, y, size, rotation, level = 1, pulsePhase = 0) {
  const baseSize = size * 0.7;

  ctx.save();
  ctx.translate(x, y);

  // 绘制脉冲光环（动态效果）
  const pulseRadius = baseSize/2 + pulsePhase * size * 0.3;
  const pulseAlpha = 1 - pulsePhase;

  ctx.shadowBlur = 20 * pulseAlpha;
  ctx.shadowColor = '#9d4edd';
  ctx.strokeStyle = `rgba(157, 78, 221, ${pulseAlpha * 0.5})`;
  ctx.lineWidth = 2;

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
    const px = Math.cos(angle) * pulseRadius;
    const py = Math.sin(angle) * pulseRadius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();

  // 绘制六边形基座
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#9d4edd';
  ctx.fillStyle = '#9d4edd';

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
    const hx = Math.cos(angle) * baseSize/2;
    const hy = Math.sin(angle) * baseSize/2;
    if (i === 0) ctx.moveTo(hx, hy);
    else ctx.lineTo(hx, hy);
  }
  ctx.closePath();
  ctx.fill();

  // 内部六边形
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#7b2cbf';
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
    const hx = Math.cos(angle) * baseSize/3;
    const hy = Math.sin(angle) * baseSize/3;
    if (i === 0) ctx.moveTo(hx, hy);
    else ctx.lineTo(hx, hy);
  }
  ctx.closePath();
  ctx.fill();

  // 中心水晶
  ctx.fillStyle = '#c77dff';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
  ctx.fill();

  // 水晶高光
  ctx.fillStyle = '#e0aaff';
  ctx.beginPath();
  ctx.arc(-size * 0.05, -size * 0.05, size * 0.06, 0, Math.PI * 2);
  ctx.fill();

  // 等级标识
  drawLevelIndicator(ctx, 0, 0, size, level);

  ctx.restore();
}
```

### 2.5 等级指示器通用函数

```javascript
/**
 * 绘制塔等级指示器
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 中心X坐标
 * @param {number} y - 中心Y坐标
 * @param {number} size - 塔大小
 * @param {number} level - 等级（1-3）
 */
function drawLevelIndicator(ctx, x, y, size, level) {
  if (level <= 1) return;

  const dotSize = size * 0.08;
  const spacing = size * 0.12;
  const startX = x - (level - 1) * spacing / 2;
  const dotY = y + size * 0.45;

  ctx.fillStyle = '#f1c40f';
  ctx.shadowBlur = 5;
  ctx.shadowColor = '#f1c40f';

  for (let i = 0; i < level - 1; i++) {
    ctx.beginPath();
    ctx.arc(startX + i * spacing, dotY, dotSize, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;
}
```

---

## 3. 僵尸视觉设计

### 3.1 普通僵尸 (Normal Zombie)

**特征**：绿色圆形 + 简单五官

```javascript
/**
 * 绘制普通僵尸
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 中心X坐标
 * @param {number} y - 中心Y坐标
 * @param {number} size - 僵尸大小（像素）
 * @param {number} hpPercent - 生命值百分比（0-1）
 */
function drawNormalZombie(ctx, x, y, size, hpPercent = 1) {
  ctx.save();
  ctx.translate(x, y);

  // 身体
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#6ab04c';
  ctx.fillStyle = '#6ab04c';

  ctx.beginPath();
  ctx.arc(0, 0, size/2, 0, Math.PI * 2);
  ctx.fill();

  // 阴影效果
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#4a8a3c';
  ctx.beginPath();
  ctx.arc(size/8, size/8, size/3, 0, Math.PI * 2);
  ctx.fill();

  // 眼睛（白色底）
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-size/5, -size/8, size/8, 0, Math.PI * 2);
  ctx.arc(size/5, -size/8, size/8, 0, Math.PI * 2);
  ctx.fill();

  // 瞳孔（红色）
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.arc(-size/5, -size/8, size/16, 0, Math.PI * 2);
  ctx.arc(size/5, -size/8, size/16, 0, Math.PI * 2);
  ctx.fill();

  // 嘴巴
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, size/6, size/5, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // 血条
  drawHealthBar(ctx, 0, -size/2 - 8, size, hpPercent);

  ctx.restore();
}
```

### 3.2 快速僵尸 (Fast Zombie)

**特征**：黄色小圆形 + 流线型

```javascript
/**
 * 绘制快速僵尸
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 中心X坐标
 * @param {number} y - 中心Y坐标
 * @param {number} size - 僵尸大小（像素）
 * @param {number} hpPercent - 生命值百分比（0-1）
 * @param {number} speedFactor - 速度因子（影响拖尾效果）
 */
function drawFastZombie(ctx, x, y, size, hpPercent = 1, speedFactor = 1) {
  ctx.save();
  ctx.translate(x, y);

  // 速度拖尾效果
  if (speedFactor > 0.5) {
    const trailLength = size * 0.8 * speedFactor;
    const gradient = ctx.createLinearGradient(-trailLength, 0, 0, 0);
    gradient.addColorStop(0, 'rgba(249, 202, 36, 0)');
    gradient.addColorStop(1, 'rgba(249, 202, 36, 0.3)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(-trailLength/2, 0, trailLength/2, size/3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 身体（较小的圆形）
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#f9ca24';
  ctx.fillStyle = '#f9ca24';

  ctx.beginPath();
  ctx.arc(0, 0, size/2.5, 0, Math.PI * 2);
  ctx.fill();

  // 流线型装饰
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#d4a520';
  ctx.beginPath();
  ctx.ellipse(0, 0, size/4, size/6, 0, 0, Math.PI * 2);
  ctx.fill();

  // 眼睛（倾斜的）
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(-size/6, -size/10, size/10, size/14, -0.3, 0, Math.PI * 2);
  ctx.ellipse(size/6, -size/10, size/10, size/14, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // 瞳孔
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.arc(-size/6, -size/10, size/20, 0, Math.PI * 2);
  ctx.arc(size/6, -size/10, size/20, 0, Math.PI * 2);
  ctx.fill();

  // 血条
  drawHealthBar(ctx, 0, -size/2 - 8, size, hpPercent);

  ctx.restore();
}
```

### 3.3 坦克僵尸 (Tank Zombie)

**特征**：红色大圆形 + 装甲线条

```javascript
/**
 * 绘制坦克僵尸
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 中心X坐标
 * @param {number} y - 中心Y坐标
 * @param {number} size - 僵尸大小（像素）
 * @param {number} hpPercent - 生命值百分比（0-1）
 */
function drawTankZombie(ctx, x, y, size, hpPercent = 1) {
  ctx.save();
  ctx.translate(x, y);

  // 外圈装甲
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#eb4d4b';
  ctx.fillStyle = '#c0392b';

  ctx.beginPath();
  ctx.arc(0, 0, size/1.8, 0, Math.PI * 2);
  ctx.fill();

  // 主体
  ctx.fillStyle = '#eb4d4b';
  ctx.beginPath();
  ctx.arc(0, 0, size/2.2, 0, Math.PI * 2);
  ctx.fill();

  // 装甲线条
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#a93226';
  ctx.lineWidth = 3;

  // 垂直装甲线
  ctx.beginPath();
  ctx.moveTo(0, -size/2.5);
  ctx.lineTo(0, size/2.5);
  ctx.stroke();

  // 水平装甲线
  ctx.beginPath();
  ctx.moveTo(-size/2.5, 0);
  ctx.lineTo(size/2.5, 0);
  ctx.stroke();

  // 装甲铆钉
  ctx.fillStyle = '#922b21';
  const rivetPositions = [
    [-size/3, -size/3], [size/3, -size/3],
    [-size/3, size/3], [size/3, size/3]
  ];
  rivetPositions.forEach(([rx, ry]) => {
    ctx.beginPath();
    ctx.arc(rx, ry, size/12, 0, Math.PI * 2);
    ctx.fill();
  });

  // 愤怒的眼睛
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(-size/4, -size/6);
  ctx.lineTo(-size/8, -size/10);
  ctx.lineTo(-size/4, -size/14);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(size/4, -size/6);
  ctx.lineTo(size/8, -size/10);
  ctx.lineTo(size/4, -size/14);
  ctx.closePath();
  ctx.fill();

  // 瞳孔
  ctx.fillStyle = '#2c3e50';
  ctx.beginPath();
  ctx.arc(-size/4, -size/10, size/16, 0, Math.PI * 2);
  ctx.arc(size/4, -size/10, size/16, 0, Math.PI * 2);
  ctx.fill();

  // 血条（坦克僵尸血条更宽）
  drawHealthBar(ctx, 0, -size/2 - 10, size * 1.2, hpPercent, '#e74c3c');

  ctx.restore();
}
```

### 3.4 飞行僵尸 (Flying Zombie)

**特征**：蓝色 + 翅膀扇动动画

```javascript
/**
 * 绘制飞行僵尸
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 中心X坐标
 * @param {number} y - 中心Y坐标
 * @param {number} size - 僵尸大小（像素）
 * @param {number} hpPercent - 生命值百分比（0-1）
 * @param {number} wingPhase - 翅膀扇动相位（0-1）
 */
function drawFlyingZombie(ctx, x, y, size, hpPercent = 1, wingPhase = 0) {
  ctx.save();
  ctx.translate(x, y);

  // 翅膀扇动角度
  const wingAngle = Math.sin(wingPhase * Math.PI * 2) * 0.5;

  // 左翅膀
  ctx.save();
  ctx.rotate(-0.3 + wingAngle);
  ctx.fillStyle = '#5a9fd9';
  ctx.beginPath();
  ctx.moveTo(-size/3, 0);
  ctx.quadraticCurveTo(-size, -size/2, -size*1.2, 0);
  ctx.quadraticCurveTo(-size, size/4, -size/3, size/4);
  ctx.closePath();
  ctx.fill();

  // 翅膀纹理
  ctx.strokeStyle = '#4a8fc9';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-size/3, 0);
  ctx.lineTo(-size, 0);
  ctx.moveTo(-size/3, size/8);
  ctx.lineTo(-size*0.8, size/8);
  ctx.stroke();
  ctx.restore();

  // 右翅膀
  ctx.save();
  ctx.rotate(0.3 - wingAngle);
  ctx.fillStyle = '#5a9fd9';
  ctx.beginPath();
  ctx.moveTo(size/3, 0);
  ctx.quadraticCurveTo(size, -size/2, size*1.2, 0);
  ctx.quadraticCurveTo(size, size/4, size/3, size/4);
  ctx.closePath();
  ctx.fill();

  // 翅膀纹理
  ctx.strokeStyle = '#4a8fc9';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(size/3, 0);
  ctx.lineTo(size, 0);
  ctx.moveTo(size/3, size/8);
  ctx.lineTo(size*0.8, size/8);
  ctx.stroke();
  ctx.restore();

  // 身体
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#74b9ff';
  ctx.fillStyle = '#74b9ff';

  ctx.beginPath();
  ctx.ellipse(0, 0, size/2.5, size/3, 0, 0, Math.PI * 2);
  ctx.fill();

  // 身体高光
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#a3d5ff';
  ctx.beginPath();
  ctx.ellipse(-size/10, -size/10, size/6, size/8, 0, 0, Math.PI * 2);
  ctx.fill();

  // 眼睛
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-size/6, -size/12, size/10, 0, Math.PI * 2);
  ctx.arc(size/6, -size/12, size/10, 0, Math.PI * 2);
  ctx.fill();

  // 瞳孔
  ctx.fillStyle = '#2c3e50';
  ctx.beginPath();
  ctx.arc(-size/6, -size/12, size/16, 0, Math.PI * 2);
  ctx.arc(size/6, -size/12, size/16, 0, Math.PI * 2);
  ctx.fill();

  // 血条
  drawHealthBar(ctx, 0, -size/2 - 8, size, hpPercent);

  ctx.restore();
}
```

### 3.5 血条通用函数

```javascript
/**
 * 绘制血条
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 中心X坐标
 * @param {number} y - Y坐标（顶部）
 * @param {number} width - 血条宽度
 * @param {number} hpPercent - 生命值百分比（0-1）
 * @param {string} color - 血条颜色
 */
function drawHealthBar(ctx, x, y, width, hpPercent, color = '#2ecc71') {
  const height = 4;
  const halfWidth = width / 2;

  // 背景
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(x - halfWidth, y, width, height);

  // 血量
  const hpColor = hpPercent > 0.5 ? '#2ecc71' : hpPercent > 0.25 ? '#f39c12' : '#e74c3c';
  ctx.fillStyle = hpColor;
  ctx.fillRect(x - halfWidth, y, width * hpPercent, height);

  // 边框
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - halfWidth, y, width, height);
}
```

---

## 4. 特效设计

### 4.1 子弹/射击特效

```javascript
/**
 * 绘制子弹
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {number} rotation - 旋转角度
 * @param {string} type - 子弹类型：'machinegun' | 'sniper' | 'rocket'
 */
function drawBullet(ctx, x, y, rotation, type = 'machinegun') {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  switch (type) {
    case 'machinegun':
      // 小圆点子弹
      ctx.fillStyle = '#f1c40f';
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#f1c40f';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'sniper':
      // 长条形子弹
      ctx.fillStyle = '#e74c3c';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#e74c3c';
      ctx.fillRect(-8, -1.5, 16, 3);
      break;

    case 'rocket':
      // 火箭形状
      ctx.fillStyle = '#e67e22';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#e67e22';

      // 弹体
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // 尾焰
      ctx.fillStyle = '#f39c12';
      ctx.beginPath();
      ctx.moveTo(-6, 0);
      ctx.lineTo(-12, -3);
      ctx.lineTo(-12, 3);
      ctx.closePath();
      ctx.fill();
      break;
  }

  ctx.restore();
}
```

### 4.2 爆炸特效

```javascript
/**
 * 绘制爆炸效果
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 中心X坐标
 * @param {number} y - 中心Y坐标
 * @param {number} progress - 进度（0-1）
 * @param {number} maxRadius - 最大半径
 */
function drawExplosion(ctx, x, y, progress, maxRadius = 50) {
  ctx.save();
  ctx.translate(x, y);

  const currentRadius = progress * maxRadius;
  const alpha = 1 - progress;

  // 外圈冲击波
  ctx.strokeStyle = `rgba(255, 200, 100, ${alpha})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
  ctx.stroke();

  // 内圈火焰
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentRadius);
  gradient.addColorStop(0, `rgba(255, 255, 200, ${alpha})`);
  gradient.addColorStop(0.3, `rgba(255, 150, 50, ${alpha * 0.8})`);
  gradient.addColorStop(0.7, `rgba(255, 50, 50, ${alpha * 0.5})`);
  gradient.addColorStop(1, `rgba(255, 50, 50, 0)`);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
  ctx.fill();

  // 火花粒子
  ctx.fillStyle = `rgba(255, 255, 150, ${alpha})`;
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 / 8) * i + progress * Math.PI;
    const distance = currentRadius * (0.5 + Math.random() * 0.5);
    const px = Math.cos(angle) * distance;
    const py = Math.sin(angle) * distance;

    ctx.beginPath();
    ctx.arc(px, py, 2 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
```

### 4.3 减速光环特效

```javascript
/**
 * 绘制减速效果
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 中心X坐标
 * @param {number} y - 中心Y坐标
 * @param {number} size - 效果大小
 * @param {number} phase - 动画相位（0-1）
 */
function drawSlowEffect(ctx, x, y, size, phase = 0) {
  ctx.save();
  ctx.translate(x, y);

  // 旋转的光环
  ctx.rotate(phase * Math.PI * 2);

  for (let i = 0; i < 3; i++) {
    const radius = size * (0.5 + i * 0.3);
    const alpha = 0.3 - i * 0.08;

    ctx.strokeStyle = `rgba(52, 152, 219, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.lineDashOffset = -phase * 20;

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 雪花图标
  ctx.rotate(-phase * Math.PI * 2);
  ctx.fillStyle = 'rgba(200, 230, 255, 0.6)';
  ctx.font = `${size/2}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('❄', 0, 0);

  ctx.restore();
}
```

### 4.4 选中塔射程圈

```javascript
/**
 * 绘制塔的射程圈（选中时）
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 中心X坐标
 * @param {number} y - 中心Y坐标
 * @param {number} range - 射程（像素）
 * @param {boolean} valid - 是否可以放置/有效
 */
function drawRangeCircle(ctx, x, y, range, valid = true) {
  ctx.save();
  ctx.translate(x, y);

  // 填充区域
  ctx.fillStyle = valid ? 'rgba(100, 200, 100, 0.1)' : 'rgba(200, 100, 100, 0.1)';
  ctx.beginPath();
  ctx.arc(0, 0, range, 0, Math.PI * 2);
  ctx.fill();

  // 边框
  ctx.strokeStyle = valid ? 'rgba(100, 200, 100, 0.5)' : 'rgba(200, 100, 100, 0.5)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.arc(0, 0, range, 0, Math.PI * 2);
  ctx.stroke();

  // 中心点
  ctx.fillStyle = valid ? 'rgba(100, 200, 100, 0.8)' : 'rgba(200, 100, 100, 0.8)';
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

### 4.5 升级特效

```javascript
/**
 * 绘制升级特效
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 中心X坐标
 * @param {number} y - 中心Y坐标
 * @param {number} progress - 进度（0-1）
 */
function drawUpgradeEffect(ctx, x, y, progress) {
  ctx.save();
  ctx.translate(x, y);

  const alpha = 1 - progress;
  const scale = 1 + progress;

  ctx.scale(scale, scale);

  // 上升的光柱
  const gradient = ctx.createLinearGradient(0, 20, 0, -40);
  gradient.addColorStop(0, `rgba(255, 215, 0, 0)`);
  gradient.addColorStop(0.5, `rgba(255, 215, 0, ${alpha * 0.5})`);
  gradient.addColorStop(1, `rgba(255, 215, 0, 0)`);

  ctx.fillStyle = gradient;
  ctx.fillRect(-20, -40, 40, 60);

  // 星星
  ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
  drawStar(ctx, 0, -20 * progress, 5, 10, 5);

  ctx.restore();
}

/**
 * 绘制星星
 */
function drawStar(ctx, x, y, points, outerRadius, innerRadius) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}
```

---

## 5. 地图元素设计

### 5.1 绘制网格背景

```javascript
/**
 * 绘制网格背景
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 * @param {number} cellSize - 格子大小
 */
function drawGrid(ctx, width, height, cellSize) {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;

  // 垂直线
  for (let x = 0; x <= width; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // 水平线
  for (let y = 0; y <= height; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}
```

### 5.2 绘制路径

```javascript
/**
 * 绘制僵尸行走路径
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {Array<{x: number, y: number}>} path - 路径点数组
 * @param {number} cellSize - 格子大小
 */
function drawPath(ctx, path, cellSize) {
  if (path.length < 2) return;

  ctx.save();

  // 路径底色
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = cellSize * 0.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(path[0].x * cellSize + cellSize/2, path[0].y * cellSize + cellSize/2);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i].x * cellSize + cellSize/2, path[i].y * cellSize + cellSize/2);
  }
  ctx.stroke();

  // 路径边框
  ctx.strokeStyle = '#34495e';
  ctx.lineWidth = cellSize * 0.65;
  ctx.stroke();

  // 路径中心线（装饰）
  ctx.strokeStyle = 'rgba(52, 152, 219, 0.2)';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 10]);
  ctx.stroke();

  ctx.restore();
}
```

### 5.3 绘制起点和终点

```javascript
/**
 * 绘制起点标识
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - X坐标（格子坐标）
 * @param {number} y - Y坐标（格子坐标）
 * @param {number} cellSize - 格子大小
 */
function drawStartPoint(ctx, x, y, cellSize) {
  const cx = x * cellSize + cellSize/2;
  const cy = y * cellSize + cellSize/2;
  const size = cellSize * 0.4;

  ctx.save();

  // 绿色圆圈
  ctx.fillStyle = 'rgba(46, 204, 113, 0.3)';
  ctx.strokeStyle = '#2ecc71';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(cx, cy, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 文字
  ctx.fillStyle = '#2ecc71';
  ctx.font = `bold ${cellSize/3}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('START', cx, cy);

  ctx.restore();
}

/**
 * 绘制终点标识（基地）
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - X坐标（格子坐标）
 * @param {number} y - Y坐标（格子坐标）
 * @param {number} cellSize - 格子大小
 * @param {number} hpPercent - 基地生命值
 */
function drawBase(ctx, x, y, cellSize, hpPercent = 1) {
  const cx = x * cellSize + cellSize/2;
  const cy = y * cellSize + cellSize/2;
  const size = cellSize * 0.4;

  ctx.save();

  // 基地建筑
  ctx.fillStyle = '#3498db';
  ctx.strokeStyle = '#2980b9';
  ctx.lineWidth = 2;

  // 主体
  ctx.fillRect(cx - size, cy - size/2, size * 2, size);
  ctx.strokeRect(cx - size, cy - size/2, size * 2, size);

  // 屋顶
  ctx.beginPath();
  ctx.moveTo(cx - size - 5, cy - size/2);
  ctx.lineTo(cx, cy - size);
  ctx.lineTo(cx + size + 5, cy - size/2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 生命值
  drawHealthBar(ctx, cx, cy - size - 10, cellSize * 0.8, hpPercent);

  ctx.restore();
}
```

---

## 6. 音效资源方案

### 6.1 推荐免费音效网站

| 网站 | 网址 | 特点 |
|------|------|------|
| **Freesound** | https://freesound.org | 大型社区，音效丰富，需注册 |
| **OpenGameArt** | https://opengameart.org | 游戏专用资源，免费授权 |
| **Kenney Assets** | https://kenney.nl/assets | 高质量游戏资源，CC0授权 |
| **Zapsplat** | https://www.zapsplat.com | 专业音效，免费注册下载 |
| **Mixkit** | https://mixkit.co/free-sound-effects/ | 无需注册，直接下载 |

### 6.2 Web Audio API 生成音效

```javascript
/**
 * 音效生成器 - 使用Web Audio API
 */
class SoundGenerator {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  /**
   * 播放射击音效
   */
  playShoot() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  /**
   * 播放爆炸音效
   */
  playExplosion() {
    const bufferSize = this.audioContext.sampleRate * 0.5;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    noise.start();
  }

  /**
   * 播放建造音效
   */
  playBuild() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
    oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  /**
   * 播放升级音效
   */
  playUpgrade() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C大调和弦

    notes.forEach((freq, i) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = freq;

      const time = this.audioContext.currentTime + i * 0.05;
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.2, time + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

      oscillator.start(time);
      oscillator.stop(time + 0.3);
    });
  }

  /**
   * 播放僵尸死亡音效
   */
  playZombieDeath() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }
}

// 使用示例
// const sound = new SoundGenerator();
// sound.playShoot();
```

---

## 7. 完整使用示例

```javascript
// 初始化画布
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏状态
const gameState = {
  towers: [],
  zombies: [],
  bullets: [],
  effects: [],
  selectedTower: null
};

// 主渲染循环
function render() {
  // 清空画布
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制网格
  drawGrid(ctx, canvas.width, canvas.height, 40);

  // 绘制路径
  drawPath(ctx, gameState.path, 40);

  // 绘制防御塔
  gameState.towers.forEach(tower => {
    switch (tower.type) {
      case 'machinegun':
        drawMachineGunTower(ctx, tower.x, tower.y, 40, tower.rotation, tower.level);
        break;
      case 'sniper':
        drawSniperTower(ctx, tower.x, tower.y, 40, tower.rotation, tower.level);
        break;
      case 'rocket':
        drawRocketTower(ctx, tower.x, tower.y, 40, tower.rotation, tower.level);
        break;
      case 'slow':
        drawSlowTower(ctx, tower.x, tower.y, 40, tower.rotation, tower.level, tower.pulsePhase);
        break;
    }

    // 绘制选中塔的射程圈
    if (gameState.selectedTower === tower) {
      drawRangeCircle(ctx, tower.x, tower.y, tower.range, true);
    }
  });

  // 绘制僵尸
  gameState.zombies.forEach(zombie => {
    switch (zombie.type) {
      case 'normal':
        drawNormalZombie(ctx, zombie.x, zombie.y, 30, zombie.hp / zombie.maxHp);
        break;
      case 'fast':
        drawFastZombie(ctx, zombie.x, zombie.y, 25, zombie.hp / zombie.maxHp, zombie.speedFactor);
        break;
      case 'tank':
        drawTankZombie(ctx, zombie.x, zombie.y, 45, zombie.hp / zombie.maxHp);
        break;
      case 'flying':
        drawFlyingZombie(ctx, zombie.x, zombie.y, 30, zombie.hp / zombie.maxHp, zombie.wingPhase);
        break;
    }
  });

  // 绘制子弹
  gameState.bullets.forEach(bullet => {
    drawBullet(ctx, bullet.x, bullet.y, bullet.rotation, bullet.type);
  });

  // 绘制特效
  gameState.effects.forEach(effect => {
    switch (effect.type) {
      case 'explosion':
        drawExplosion(ctx, effect.x, effect.y, effect.progress, effect.maxRadius);
        break;
      case 'slow':
        drawSlowEffect(ctx, effect.x, effect.y, effect.size, effect.phase);
        break;
      case 'upgrade':
        drawUpgradeEffect(ctx, effect.x, effect.y, effect.progress);
        break;
    }
  });

  requestAnimationFrame(render);
}

// 启动渲染
render();
```

---

## 8. 视觉风格总结

### 整体风格
- **主题**：科技霓虹 + 末日生存
- **基调**：深色背景，高对比度，发光效果
- **情绪**：紧张刺激，科幻感

### 色彩系统
- **背景**：深蓝紫色系（#1a1a2e, #16213e）
- **防御塔**：
  - 机枪塔：青绿色（科技感）
  - 狙击塔：粉红色（精准致命）
  - 火箭塔：橙黄色（爆炸火力）
  - 减速塔：紫色（神秘魔法）
- **僵尸**：
  - 普通：绿色（经典僵尸）
  - 快速：黄色（闪电速度）
  - 坦克：红色（危险厚重）
  - 飞行：蓝色（天空轻盈）

### 视觉特效
- 所有元素使用 `shadowBlur` 实现发光效果
- 动态元素（子弹、爆炸）使用粒子效果
- 选中状态使用半透明范围圈
- 血条使用颜色渐变（绿->黄->红）

### 技术特点
- 纯Canvas绘制，无外部图片依赖
- 所有函数可复用，参数化配置
- 支持动画相位传递，实现流畅动画
- 模块化设计，易于扩展新塔/僵尸类型
