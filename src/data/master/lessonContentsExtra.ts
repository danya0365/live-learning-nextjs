// Additional Lesson Contents - Phase 2, 3, 4, 5
import { LessonContent } from "./lessonContents";

// ==========================================
// PHASE 2: 2D Games
// ==========================================

export const phase2Contents: LessonContent[] = [
  // Module 2.1: Canvas API
  {
    id: "lesson-2-1-1",
    moduleId: "module-2-1",
    title: "Canvas Basics",
    titleTh: "พื้นฐาน HTML5 Canvas",
    order: 1,
    duration: 45,
    content: `
# พื้นฐาน HTML5 Canvas

## 🎯 สิ่งที่คุณจะได้เรียนรู้
- การตั้งค่า Canvas element
- Drawing Context และวิธีใช้งาน
- วาดรูปทรงพื้นฐาน (rect, circle, line)
- การใช้สีและ gradients

---

## 🎨 Canvas คืออะไร?

Canvas คือ HTML element ที่ใช้วาดกราฟิก 2D (และ 3D ด้วย WebGL) บน browser:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>My Game</title>
  <style>
    canvas {
      background: #1a1a2e;
      display: block;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <canvas id="game" width="800" height="600"></canvas>
  <script src="game.js"></script>
</body>
</html>
\`\`\`

---

## 🖌️ Getting the Drawing Context

\`\`\`javascript
// รับ canvas element
const canvas = document.getElementById('game');

// รับ 2D drawing context
const ctx = canvas.getContext('2d');

// ตอนนี้เราสามารถวาดได้แล้ว!
ctx.fillStyle = 'green';
ctx.fillRect(100, 100, 50, 50);
\`\`\`

---

## 📐 วาดรูปทรงพื้นฐาน

### สี่เหลี่ยม (Rectangles)
\`\`\`javascript
// สี่เหลี่ยมทึบ
ctx.fillStyle = '#4ade80';
ctx.fillRect(x, y, width, height);

// สี่เหลี่ยมขอบ
ctx.strokeStyle = '#f472b6';
ctx.lineWidth = 3;
ctx.strokeRect(x, y, width, height);

// ลบสี่เหลี่ยม (ทำให้โปร่งใส)
ctx.clearRect(x, y, width, height);
\`\`\`

### วงกลม (Circles)
\`\`\`javascript
// วงกลมทึบ
ctx.beginPath();
ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
ctx.fillStyle = '#60a5fa';
ctx.fill();

// วงกลมขอบ
ctx.beginPath();
ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
ctx.strokeStyle = '#fbbf24';
ctx.stroke();
\`\`\`

### เส้น (Lines)
\`\`\`javascript
ctx.beginPath();
ctx.moveTo(startX, startY);
ctx.lineTo(endX, endY);
ctx.strokeStyle = '#a78bfa';
ctx.lineWidth = 2;
ctx.stroke();

// หลายเส้นต่อกัน
ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineTo(200, 150);
ctx.lineTo(150, 200);
ctx.closePath(); // ปิดรูปร่าง
ctx.stroke();
\`\`\`

---

## 🌈 Colors และ Gradients

### Solid Colors
\`\`\`javascript
// แบบต่างๆ
ctx.fillStyle = 'red';
ctx.fillStyle = '#ff0000';
ctx.fillStyle = 'rgb(255, 0, 0)';
ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // 50% transparent
\`\`\`

### Linear Gradient
\`\`\`javascript
const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
gradient.addColorStop(0, '#667eea');
gradient.addColorStop(1, '#764ba2');

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 800, 600);
\`\`\`

### Radial Gradient
\`\`\`javascript
const radial = ctx.createRadialGradient(
  centerX, centerY, innerRadius,
  centerX, centerY, outerRadius
);
radial.addColorStop(0, '#fbbf24');
radial.addColorStop(1, '#f97316');

ctx.fillStyle = radial;
ctx.beginPath();
ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
ctx.fill();
\`\`\`

---

## 🎮 ตัวอย่าง: วาด Game Scene

\`\`\`javascript
function drawScene() {
  // Clear screen
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 800, 600);
  
  // Draw ground
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(0, 550, 800, 50);
  
  // Draw sun
  const sunGradient = ctx.createRadialGradient(700, 100, 0, 700, 100, 50);
  sunGradient.addColorStop(0, '#fcd34d');
  sunGradient.addColorStop(1, '#f59e0b');
  ctx.fillStyle = sunGradient;
  ctx.beginPath();
  ctx.arc(700, 100, 50, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw player (simple rectangle for now)
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(100, 500, 32, 48);
  
  // Draw enemy
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(300, 518, 32, 32);
}
\`\`\`

---

## ✅ สรุป

| Method | ใช้ทำอะไร |
|--------|----------|
| \`fillRect()\` | วาดสี่เหลี่ยมทึบ |
| \`strokeRect()\` | วาดสี่เหลี่ยมขอบ |
| \`arc()\` | วาดวงกลม/ส่วนโค้ง |
| \`moveTo()\` / \`lineTo()\` | วาดเส้น |
| \`fillStyle\` | กำหนดสีเติม |
| \`strokeStyle\` | กำหนดสีขอบ |

**บทต่อไป: Animation Loop!**
    `,
    codeExamples: [
      {
        title: "Drawing a Character",
        language: "javascript",
        code: `function drawCharacter(x, y, direction) {
  // Body
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(x, y, 32, 48);
  
  // Face
  ctx.fillStyle = '#fcd34d';
  ctx.fillRect(x + 4, y + 4, 24, 24);
  
  // Eyes
  ctx.fillStyle = '#000';
  if (direction === 'right') {
    ctx.fillRect(x + 14, y + 12, 4, 4);
    ctx.fillRect(x + 22, y + 12, 4, 4);
  } else {
    ctx.fillRect(x + 6, y + 12, 4, 4);
    ctx.fillRect(x + 14, y + 12, 4, 4);
  }
}`,
        description: "วาดตัวละครแบบง่ายๆ ด้วย Canvas"
      }
    ]
  },

  {
    id: "lesson-2-1-2",
    moduleId: "module-2-1",
    title: "Animation Loop",
    titleTh: "Animation Loop",
    order: 2,
    duration: 50,
    content: `
# Animation Loop สำหรับ Canvas Games

## 🎯 เป้าหมาย
- สร้าง smooth animation ด้วย requestAnimationFrame
- ใช้ Delta Time สำหรับ consistent movement
- สร้าง sprite animation

---

## ⚡ Basic Animation Loop

\`\`\`javascript
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let player = { x: 100, y: 300, speed: 200 };
let lastTime = 0;

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  
  update(deltaTime);
  render();
  
  requestAnimationFrame(gameLoop);
}

function update(dt) {
  // เคลื่อนที่ไปทางขวา
  player.x += player.speed * dt;
  
  // วนกลับเมื่อออกจอ
  if (player.x > 800) player.x = -32;
}

function render() {
  // Clear
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, 800, 600);
  
  // Draw player
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(player.x, player.y, 32, 32);
}

requestAnimationFrame(gameLoop);
\`\`\`

---

## 🎬 Sprite Animation

\`\`\`javascript
const spriteSheet = new Image();
spriteSheet.src = 'player.png';

const animation = {
  frameWidth: 32,
  frameHeight: 32,
  currentFrame: 0,
  frameCount: 4,
  frameTime: 0.1, // seconds per frame
  elapsedTime: 0
};

function updateAnimation(dt) {
  animation.elapsedTime += dt;
  
  if (animation.elapsedTime >= animation.frameTime) {
    animation.currentFrame = 
      (animation.currentFrame + 1) % animation.frameCount;
    animation.elapsedTime = 0;
  }
}

function drawSprite(x, y) {
  ctx.drawImage(
    spriteSheet,
    animation.currentFrame * animation.frameWidth, // source X
    0, // source Y
    animation.frameWidth,
    animation.frameHeight,
    x, y, // destination
    32, 32 // size
  );
}
\`\`\`

**บทต่อไป: Input Handling!**
    `,
    codeExamples: []
  },

  {
    id: "lesson-2-1-3",
    moduleId: "module-2-1",
    title: "Input Handling",
    titleTh: "จัดการ Input",
    order: 3,
    duration: 40,
    content: `
# Input Handling สำหรับ Canvas Games

## 🎮 Keyboard Input

\`\`\`javascript
const keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

function update(dt) {
  if (keys['ArrowLeft'] || keys['KeyA']) {
    player.x -= player.speed * dt;
  }
  if (keys['ArrowRight'] || keys['KeyD']) {
    player.x += player.speed * dt;
  }
}
\`\`\`

## 🖱️ Mouse Input

\`\`\`javascript
const mouse = { x: 0, y: 0, clicked: false };

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener('mousedown', () => mouse.clicked = true);
canvas.addEventListener('mouseup', () => mouse.clicked = false);
\`\`\`
    `,
    codeExamples: []
  },

  {
    id: "lesson-2-1-4",
    moduleId: "module-2-1",
    title: "Collision Detection",
    titleTh: "ตรวจจับการชน",
    order: 4,
    duration: 50,
    content: `
# Collision Detection

## 📦 AABB Collision

\`\`\`javascript
function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// ใช้งาน
if (checkCollision(player, enemy)) {
  player.health -= 10;
  console.log("Hit!");
}
\`\`\`

## ⭕ Circle Collision

\`\`\`javascript
function circleCollision(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < a.radius + b.radius;
}
\`\`\`
    `,
    codeExamples: []
  },

  // Module 2.2: Phaser
  {
    id: "lesson-2-2-1",
    moduleId: "module-2-2",
    title: "Phaser Setup",
    titleTh: "เริ่มต้นกับ Phaser",
    order: 1,
    duration: 45,
    content: `
# เริ่มต้นกับ Phaser.js

## 🎯 ทำไมต้อง Phaser?
- Game engine ยอดนิยมที่สุดสำหรับ 2D web games
- มี built-in physics, tilemaps, animations
- Community ใหญ่และมี tutorials มากมาย

## 🚀 Setup Project

\`\`\`bash
npm init -y
npm install phaser
\`\`\`

\`\`\`javascript
import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 300 }, debug: true }
  },
  scene: { preload, create, update }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('player', 'assets/player.png');
  this.load.image('ground', 'assets/ground.png');
}

function create() {
  this.platforms = this.physics.add.staticGroup();
  this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  
  this.player = this.physics.add.sprite(100, 450, 'player');
  this.player.setCollideWorldBounds(true);
  
  this.physics.add.collider(this.player, this.platforms);
  
  this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-160);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(160);
  } else {
    this.player.setVelocityX(0);
  }
  
  if (this.cursors.up.isDown && this.player.body.touching.down) {
    this.player.setVelocityY(-330);
  }
}
\`\`\`
    `,
    codeExamples: []
  },

  { id: "lesson-2-2-2", moduleId: "module-2-2", title: "Sprites & Animation", titleTh: "Sprites และ Animation", order: 2, duration: 50, content: `# Sprites และ Animation ใน Phaser\n\n## โหลด Spritesheet\n\`\`\`javascript\nthis.load.spritesheet('player', 'player.png', {\n  frameWidth: 32, frameHeight: 48\n});\n\`\`\`\n\n## สร้าง Animation\n\`\`\`javascript\nthis.anims.create({\n  key: 'walk',\n  frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),\n  frameRate: 10,\n  repeat: -1\n});\n\nplayer.anims.play('walk', true);\n\`\`\``, codeExamples: [] },

  { id: "lesson-2-2-3", moduleId: "module-2-2", title: "Physics System", titleTh: "ระบบ Physics", order: 3, duration: 55, content: `# Phaser Physics\n\n## Arcade Physics\n\`\`\`javascript\nthis.physics.add.collider(player, platforms);\nthis.physics.add.overlap(player, coins, collectCoin, null, this);\n\nfunction collectCoin(player, coin) {\n  coin.disableBody(true, true);\n  score += 10;\n}\n\`\`\``, codeExamples: [] },

  { id: "lesson-2-2-4", moduleId: "module-2-2", title: "Tilemaps", titleTh: "Tilemaps", order: 4, duration: 60, content: `# Tilemaps ด้วย Tiled\n\n## โหลด Tilemap\n\`\`\`javascript\nthis.load.tilemapTiledJSON('map', 'level1.json');\nthis.load.image('tiles', 'tileset.png');\n\nconst map = this.make.tilemap({ key: 'map' });\nconst tileset = map.addTilesetImage('tileset', 'tiles');\nconst layer = map.createLayer('Ground', tileset);\nlayer.setCollisionByProperty({ collides: true });\n\`\`\``, codeExamples: [] },

  // Module 2.3: PixiJS
  { id: "lesson-2-3-1", moduleId: "module-2-3", title: "PixiJS Basics", titleTh: "พื้นฐาน PixiJS", order: 1, duration: 45, content: `# PixiJS - High Performance 2D\n\n## Setup\n\`\`\`javascript\nimport * as PIXI from 'pixi.js';\n\nconst app = new PIXI.Application({\n  width: 800, height: 600,\n  backgroundColor: 0x1a1a2e\n});\ndocument.body.appendChild(app.view);\n\nconst sprite = PIXI.Sprite.from('player.png');\napp.stage.addChild(sprite);\n\`\`\``, codeExamples: [] },

  { id: "lesson-2-3-2", moduleId: "module-2-3", title: "WebGL Rendering", titleTh: "WebGL Rendering", order: 2, duration: 50, content: `# WebGL และ Filters\n\n## Blur Filter\n\`\`\`javascript\nconst blur = new PIXI.filters.BlurFilter();\nsprite.filters = [blur];\n\`\`\``, codeExamples: [] },

  { id: "lesson-2-3-3", moduleId: "module-2-3", title: "Particle Systems", titleTh: "Particle Systems", order: 3, duration: 50, content: `# Particle Effects\n\n## ใช้ @pixi/particle-emitter\n\`\`\`javascript\nimport { Emitter } from '@pixi/particle-emitter';\n\nconst emitter = new Emitter(container, config);\n\`\`\``, codeExamples: [] },
];

// ==========================================
// PHASE 3: Multiplayer
// ==========================================

export const phase3Contents: LessonContent[] = [
  { id: "lesson-3-1-1", moduleId: "module-3-1", title: "Server Setup", titleTh: "ตั้งค่า Colyseus Server", order: 1, duration: 50, content: `# Colyseus Multiplayer\n\n## Server Setup\n\`\`\`javascript\nimport { Server } from 'colyseus';\nimport { GameRoom } from './rooms/GameRoom';\n\nconst gameServer = new Server();\ngameServer.define('game', GameRoom);\ngameServer.listen(2567);\n\`\`\``, codeExamples: [] },
  { id: "lesson-3-1-2", moduleId: "module-3-1", title: "State Sync", titleTh: "State Synchronization", order: 2, duration: 55, content: `# State Sync\n\n## Schema\n\`\`\`javascript\nimport { Schema, type } from '@colyseus/schema';\n\nclass Player extends Schema {\n  @type('number') x = 0;\n  @type('number') y = 0;\n}\n\`\`\``, codeExamples: [] },
  { id: "lesson-3-1-3", moduleId: "module-3-1", title: "Client Integration", titleTh: "Client Integration", order: 3, duration: 50, content: `# Client Side\n\n\`\`\`javascript\nimport { Client } from 'colyseus.js';\n\nconst client = new Client('ws://localhost:2567');\nconst room = await client.joinOrCreate('game');\n\nroom.state.players.onAdd((player, key) => {\n  console.log('Player joined:', key);\n});\n\`\`\``, codeExamples: [] },
  { id: "lesson-3-1-4", moduleId: "module-3-1", title: "Matchmaking", titleTh: "Matchmaking", order: 4, duration: 55, content: `# Matchmaking\n\n## Room Filtering\n\`\`\`javascript\nawait client.joinOrCreate('game', { level: 5, region: 'asia' });\n\`\`\``, codeExamples: [] },

  { id: "lesson-3-2-1", moduleId: "module-3-2", title: "WebRTC Basics", titleTh: "WebRTC Basics", order: 1, duration: 45, content: `# WebRTC P2P\n\nDirect peer connections without server.`, codeExamples: [] },
  { id: "lesson-3-2-2", moduleId: "module-3-2", title: "PeerJS Setup", titleTh: "PeerJS Setup", order: 2, duration: 40, content: `# PeerJS\n\n\`\`\`javascript\nimport Peer from 'peerjs';\nconst peer = new Peer();\n\`\`\``, codeExamples: [] },
  { id: "lesson-3-2-3", moduleId: "module-3-2", title: "P2P State", titleTh: "P2P State", order: 3, duration: 55, content: `# P2P Game State\n\nSync state without a server.`, codeExamples: [] },
];

// Additional phases with brief content
export const phase4Contents: LessonContent[] = [
  { id: "lesson-4-1-1", moduleId: "module-4-1", title: "3D Fundamentals", titleTh: "3D Fundamentals", order: 1, duration: 50, content: `# Three.js Basics\n\nScene, Camera, Renderer.`, codeExamples: [] },
  { id: "lesson-4-1-2", moduleId: "module-4-1", title: "Geometry & Materials", titleTh: "Geometry & Materials", order: 2, duration: 55, content: `# 3D Geometry`, codeExamples: [] },
  { id: "lesson-4-1-3", moduleId: "module-4-1", title: "Lighting", titleTh: "Lighting", order: 3, duration: 50, content: `# Lighting`, codeExamples: [] },
  { id: "lesson-4-1-4", moduleId: "module-4-1", title: "3D Physics", titleTh: "3D Physics", order: 4, duration: 60, content: `# Cannon.js`, codeExamples: [] },
  { id: "lesson-4-2-1", moduleId: "module-4-2", title: "Babylon Setup", titleTh: "Babylon Setup", order: 1, duration: 50, content: `# Babylon.js`, codeExamples: [] },
  { id: "lesson-4-2-2", moduleId: "module-4-2", title: "PBR Materials", titleTh: "PBR Materials", order: 2, duration: 55, content: `# PBR`, codeExamples: [] },
  { id: "lesson-4-2-3", moduleId: "module-4-2", title: "Physics", titleTh: "Physics", order: 3, duration: 50, content: `# Physics`, codeExamples: [] },
  { id: "lesson-4-2-4", moduleId: "module-4-2", title: "XR", titleTh: "XR", order: 4, duration: 60, content: `# WebXR`, codeExamples: [] },
  { id: "lesson-4-3-1", moduleId: "module-4-3", title: "PlayCanvas Editor", titleTh: "PlayCanvas", order: 1, duration: 50, content: `# PlayCanvas`, codeExamples: [] },
  { id: "lesson-4-3-2", moduleId: "module-4-3", title: "Scripting", titleTh: "Scripting", order: 2, duration: 50, content: `# Scripting`, codeExamples: [] },
  { id: "lesson-4-4-1", moduleId: "module-4-4", title: "Unity WebGL", titleTh: "Unity WebGL", order: 1, duration: 55, content: `# Unity`, codeExamples: [] },
  { id: "lesson-4-4-2", moduleId: "module-4-4", title: "Optimization", titleTh: "Optimization", order: 2, duration: 50, content: `# Optimize`, codeExamples: [] },
  { id: "lesson-4-4-3", moduleId: "module-4-4", title: "JS Integration", titleTh: "JS Integration", order: 3, duration: 50, content: `# Integration`, codeExamples: [] },
];

export const phase5Contents: LessonContent[] = [
  { id: "lesson-5-1-1", moduleId: "module-5-1", title: "ECS", titleTh: "ECS", order: 1, duration: 55, content: `# ECS Pattern`, codeExamples: [] },
  { id: "lesson-5-1-2", moduleId: "module-5-1", title: "State Machines", titleTh: "State Machines", order: 2, duration: 50, content: `# FSM`, codeExamples: [] },
  { id: "lesson-5-1-3", moduleId: "module-5-1", title: "Design Patterns", titleTh: "Design Patterns", order: 3, duration: 55, content: `# Patterns`, codeExamples: [] },
  { id: "lesson-5-2-1", moduleId: "module-5-2", title: "Server Architecture", titleTh: "Server Architecture", order: 1, duration: 60, content: `# Architecture`, codeExamples: [] },
  { id: "lesson-5-2-2", moduleId: "module-5-2", title: "Lag Compensation", titleTh: "Lag Compensation", order: 2, duration: 55, content: `# Lag Comp`, codeExamples: [] },
  { id: "lesson-5-2-3", moduleId: "module-5-2", title: "Anti-Cheat", titleTh: "Anti-Cheat", order: 3, duration: 50, content: `# Anti-Cheat`, codeExamples: [] },
  { id: "lesson-5-3-1", moduleId: "module-5-3", title: "Ads", titleTh: "Ads", order: 1, duration: 45, content: `# Ads`, codeExamples: [] },
  { id: "lesson-5-3-2", moduleId: "module-5-3", title: "IAP", titleTh: "IAP", order: 2, duration: 55, content: `# IAP`, codeExamples: [] },
  { id: "lesson-5-3-3", moduleId: "module-5-3", title: "Publishing", titleTh: "Publishing", order: 3, duration: 50, content: `# Publishing`, codeExamples: [] },
  { id: "lesson-5-4-1", moduleId: "module-5-4", title: "Profiling", titleTh: "Profiling", order: 1, duration: 50, content: `# Profiling`, codeExamples: [] },
  { id: "lesson-5-4-2", moduleId: "module-5-4", title: "Optimization", titleTh: "Optimization", order: 2, duration: 55, content: `# Optimize`, codeExamples: [] },
  { id: "lesson-5-4-3", moduleId: "module-5-4", title: "Memory", titleTh: "Memory", order: 3, duration: 50, content: `# Memory`, codeExamples: [] },
  { id: "lesson-5-5-1", moduleId: "module-5-5", title: "Shaders", titleTh: "Shaders", order: 1, duration: 60, content: `# GLSL`, codeExamples: [] },
  { id: "lesson-5-5-2", moduleId: "module-5-5", title: "Procedural", titleTh: "Procedural", order: 2, duration: 55, content: `# Procedural`, codeExamples: [] },
  { id: "lesson-5-5-3", moduleId: "module-5-5", title: "AI", titleTh: "AI", order: 3, duration: 55, content: `# AI`, codeExamples: [] },
  { id: "lesson-5-5-4", moduleId: "module-5-5", title: "Advanced Physics", titleTh: "Advanced Physics", order: 4, duration: 60, content: `# Physics`, codeExamples: [] },
];

// Combined export
export const allAdditionalContents = [
  ...phase2Contents,
  ...phase3Contents,
  ...phase4Contents,
  ...phase5Contents
];
