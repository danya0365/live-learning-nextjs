// Premium Lesson Content - Phase 1 & 2
// High-quality educational content for game development

export interface LessonContent {
  id: string;
  moduleId: string;
  title: string;
  titleTh: string;
  content: string;
  codeExamples: CodeExample[];
  challenge?: Challenge;
  videoUrl?: string;
  order: number;
  duration: number;
}

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  description?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  expectedOutput?: string;
  hints: string[];
  testCases: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export const lessonContents: LessonContent[] = [
  // ==========================================
  // PHASE 1: FOUNDATION
  // ==========================================

  // Module 1.1: Programming Basics for Games
  {
    id: "lesson-1-1-1",
    moduleId: "module-1-1",
    title: "JavaScript Fundamentals for Games",
    titleTh: "พื้นฐาน JavaScript สำหรับเกม",
    order: 1,
    duration: 45,
    content: `
# พื้นฐาน JavaScript สำหรับการพัฒนาเกม

## 🎯 สิ่งที่คุณจะได้เรียนรู้
- การประกาศตัวแปรแบบ Modern JavaScript (let, const)
- ชนิดข้อมูลที่สำคัญสำหรับเกม
- การสร้าง Objects สำหรับ game entities
- Best practices ที่ใช้ในอุตสาหกรรมเกม

---

## 📚 ทำไม JavaScript ถึงเหมาะกับการพัฒนาเกม?

JavaScript เป็นภาษาที่ทรงพลังสำหรับการพัฒนาเกมบนเว็บ:
- 🌐 ทำงานได้บน Browser ทุกตัวโดยไม่ต้องติดตั้งอะไร
- ⚡ Performance สูงด้วย V8 Engine และ WebGL
- 🎮 มี Game Engine มากมาย (Phaser, PixiJS, Three.js)
- 👥 Community ใหญ่และมี resources มากมาย

---

## 📝 การประกาศตัวแปร

### Modern JavaScript: let vs const

\`\`\`javascript
// 🔄 let - ใช้สำหรับค่าที่เปลี่ยนแปลงได้
let playerHealth = 100;
let playerX = 0;
let playerY = 0;
let score = 0;

// 🔒 const - ใช้สำหรับค่าคงที่ที่ไม่เปลี่ยน
const GRAVITY = 9.8;
const MAX_HEALTH = 100;
const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 720;
const TILE_SIZE = 32;
\`\`\`

> 💡 **Pro Tip:** ใช้ \`const\` เป็นค่าเริ่มต้น และใช้ \`let\` เฉพาะเมื่อค่านั้นต้องเปลี่ยนแปลงจริงๆ

### ❌ หลีกเลี่ยง var
\`\`\`javascript
// ❌ ไม่แนะนำ - มี issues เรื่อง scope
var oldWay = "avoid this";

// ✅ ใช้ let หรือ const แทน
let modernWay = "use this instead";
\`\`\`

---

## 🎮 ชนิดข้อมูลที่สำคัญในเกม

### 1. Numbers (ตัวเลข)
\`\`\`javascript
// พิกัดและตำแหน่ง
let x = 100;
let y = 200.5;

// สถิติ (Stats)
let health = 100;
let mana = 50;
let damage = 25;
let attackSpeed = 1.5;

// เวลาและ Delta Time
let deltaTime = 0.016; // ~60 FPS
let elapsedTime = 0;
\`\`\`

### 2. Strings (ข้อความ)
\`\`\`javascript
// ข้อมูลตัวละคร
const playerName = "DragonSlayer99";
const characterClass = "Warrior";

// Template Literals - สำหรับ dynamic text
const damageText = \`\${playerName} dealt \${damage} damage!\`;
const healthBar = \`HP: \${health}/\${MAX_HEALTH}\`;
\`\`\`

### 3. Booleans (จริง/เท็จ)
\`\`\`javascript
// สถานะตัวละคร
let isAlive = true;
let isJumping = false;
let isAttacking = false;
let canMove = true;

// Game States
let isPaused = false;
let isGameOver = false;
let hasWon = false;
\`\`\`

### 4. Arrays (อาร์เรย์)
\`\`\`javascript
// Inventory System
let inventory = ["sword", "shield", "health_potion"];

// Enemy List
let enemies = [];
let bullets = [];
let particles = [];

// High Scores
let highScores = [10000, 8500, 7200, 5000, 3500];
\`\`\`

### 5. Objects (ออบเจ็กต์) - สำคัญมาก!
\`\`\`javascript
// Player Object
const player = {
  name: "Hero",
  class: "Knight",
  level: 1,
  experience: 0,
  
  // Stats
  health: 100,
  maxHealth: 100,
  mana: 50,
  maxMana: 50,
  damage: 15,
  defense: 10,
  
  // Position
  x: 100,
  y: 200,
  width: 32,
  height: 48,
  
  // Movement
  velocityX: 0,
  velocityY: 0,
  speed: 5,
  jumpForce: 12,
  
  // State
  isAlive: true,
  isJumping: false,
  direction: "right",
  
  // Inventory
  inventory: [],
  gold: 0
};

// เข้าถึง properties
console.log(player.name);        // "Hero"
console.log(player.health);      // 100
console.log(player.x, player.y); // 100, 200
\`\`\`

---

## 🏗️ สร้าง Game Entity Pattern

Pattern ที่ใช้ในเกมจริง:

\`\`\`javascript
// Factory Function สำหรับสร้าง Enemy
function createEnemy(type, x, y) {
  const enemyStats = {
    slime: { health: 20, damage: 5, speed: 2, xp: 10 },
    goblin: { health: 40, damage: 10, speed: 3, xp: 25 },
    orc: { health: 80, damage: 20, speed: 2.5, xp: 50 },
    dragon: { health: 500, damage: 50, speed: 4, xp: 500 }
  };

  const stats = enemyStats[type] || enemyStats.slime;

  return {
    type,
    ...stats,
    maxHealth: stats.health,
    x,
    y,
    width: 32,
    height: 32,
    isAlive: true,
    
    // Methods
    takeDamage(amount) {
      this.health -= amount;
      if (this.health <= 0) {
        this.health = 0;
        this.isAlive = false;
      }
    },
    
    heal(amount) {
      this.health = Math.min(this.health + amount, this.maxHealth);
    }
  };
}

// สร้าง enemies
const slime = createEnemy("slime", 100, 200);
const boss = createEnemy("dragon", 500, 300);

// ใช้งาน
slime.takeDamage(15);
console.log(slime.health); // 5
\`\`\`

---

## ✨ Best Practices

### 1. ใช้ UPPER_CASE สำหรับค่าคงที่
\`\`\`javascript
const MAX_ENEMIES = 50;
const PLAYER_SPEED = 5;
const GRAVITY = 0.5;
\`\`\`

### 2. ใช้ camelCase สำหรับตัวแปรทั่วไป
\`\`\`javascript
let playerHealth = 100;
let currentLevel = 1;
let isGameRunning = true;
\`\`\`

### 3. Group related data ใน Objects
\`\`\`javascript
// ✅ ดี - จัดกลุ่ม
const gameConfig = {
  screen: { width: 1280, height: 720 },
  physics: { gravity: 0.5, friction: 0.8 },
  player: { startX: 100, startY: 500 }
};

// ❌ ไม่ดี - กระจัดกระจาย
const screenWidth = 1280;
const screenHeight = 720;
const gravity = 0.5;
\`\`\`

---

## ✅ สรุป

| Concept | ใช้ทำอะไร | ตัวอย่าง |
|---------|----------|----------|
| \`const\` | ค่าคงที่ | \`const GRAVITY = 9.8\` |
| \`let\` | ค่าที่เปลี่ยนได้ | \`let health = 100\` |
| Numbers | ตำแหน่ง, สถิติ | \`x, y, health, damage\` |
| Strings | ชื่อ, ข้อความ | \`playerName, dialogText\` |
| Booleans | สถานะ | \`isAlive, isPaused\` |
| Arrays | รายการ | \`inventory, enemies\` |
| Objects | Entities | \`player, enemy, bullet\` |

**พร้อมสำหรับบทต่อไป: Game Loop! 🎮**
    `,
    codeExamples: [
      {
        title: "Complete Player Entity",
        language: "javascript",
        code: `// Complete Player Entity Example
const player = {
  // Identity
  name: "Hero",
  class: "Knight",
  
  // Stats
  level: 1,
  experience: 0,
  experienceToLevel: 100,
  health: 100,
  maxHealth: 100,
  
  // Position & Movement
  x: 100,
  y: 500,
  velocityX: 0,
  velocityY: 0,
  speed: 5,
  
  // State
  isAlive: true,
  isGrounded: false,
  
  // Methods
  move(dx, dy) {
    this.x += dx * this.speed;
    this.y += dy * this.speed;
  },
  
  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    if (this.health === 0) this.isAlive = false;
  },
  
  gainExperience(amount) {
    this.experience += amount;
    while (this.experience >= this.experienceToLevel) {
      this.levelUp();
    }
  },
  
  levelUp() {
    this.level++;
    this.experience -= this.experienceToLevel;
    this.experienceToLevel = Math.floor(this.experienceToLevel * 1.5);
    this.maxHealth += 10;
    this.health = this.maxHealth;
    console.log(\`Level Up! Now level \${this.level}\`);
  }
};

// Test
player.gainExperience(150);
console.log(player.level); // 2`,
        description: "ตัวอย่าง Player Entity แบบสมบูรณ์พร้อม methods"
      }
    ],
    challenge: {
      id: "challenge-1-1-1",
      title: "🎯 Challenge: สร้าง Item System",
      description: "สร้าง function createItem ที่รับ type และ return item object พร้อม properties ที่เหมาะสม",
      starterCode: `// สร้าง Item Factory Function
function createItem(type) {
  // TODO: สร้าง item object based on type
  // Types: "health_potion", "mana_potion", "sword", "shield"
  // Each item should have: name, type, value, description
  
  return {
    // your code here
  };
}

// Test
const potion = createItem("health_potion");
const sword = createItem("sword");

console.log(potion);
console.log(sword);`,
      solution: `function createItem(type) {
  const items = {
    health_potion: {
      name: "Health Potion",
      type: "consumable",
      value: 50,
      description: "Restores 50 HP"
    },
    mana_potion: {
      name: "Mana Potion", 
      type: "consumable",
      value: 30,
      description: "Restores 30 MP"
    },
    sword: {
      name: "Iron Sword",
      type: "weapon",
      value: 15,
      description: "+15 Attack Damage"
    },
    shield: {
      name: "Wooden Shield",
      type: "armor",
      value: 10,
      description: "+10 Defense"
    }
  };
  
  return items[type] || { name: "Unknown", type: "misc", value: 0 };
}`,
      hints: [
        "ใช้ object เก็บข้อมูล items ทั้งหมด",
        "ใช้ type เป็น key ในการดึงข้อมูล",
        "อย่าลืม handle กรณี type ไม่ถูกต้อง"
      ],
      expectedOutput: "Health Potion",
      testCases: [
        { input: 'createItem("health_potion").value', expectedOutput: "50", description: "Health potion should restore 50 HP" },
        { input: 'createItem("sword").type', expectedOutput: "weapon", description: "Sword should be weapon type" }
      ]
    }
  },

  {
    id: "lesson-1-1-2",
    moduleId: "module-1-1",
    title: "Game Loop Fundamentals",
    titleTh: "หัวใจของเกม: Game Loop",
    order: 2,
    duration: 50,
    content: `
# Game Loop: หัวใจของเกมทุกเกม

## 🎯 สิ่งที่คุณจะได้เรียนรู้
- เข้าใจว่า Game Loop คืออะไรและทำงานอย่างไร
- การใช้ requestAnimationFrame
- การคำนวณ Delta Time สำหรับ smooth movement
- Fixed vs Variable Timestep

---

## 🔄 Game Loop คืออะไร?

Game Loop คือ **วงจรหลัก** ที่ทำงานซ้ำตลอดเวลาที่เกมทำงาน:

\`\`\`
┌──────────────────────────────────────────────┐
│                  GAME LOOP                    │
├──────────────────────────────────────────────┤
│                                              │
│   ┌─────────────┐                           │
│   │   INPUT     │  ← รับ input จากผู้เล่น      │
│   │   PHASE     │    (keyboard, mouse)       │
│   └──────┬──────┘                           │
│          ↓                                   │
│   ┌──────┴──────┐                           │
│   │   UPDATE    │  ← อัพเดท game state       │
│   │   PHASE     │    (ตำแหน่ง, collision)     │
│   └──────┬──────┘                           │
│          ↓                                   │
│   ┌──────┴──────┐                           │
│   │   RENDER    │  ← วาดทุกอย่างลงหน้าจอ      │
│   │   PHASE     │    (graphics, UI)          │
│   └──────┬──────┘                           │
│          ↓                                   │
│          └────→ กลับไปเริ่มใหม่ (60 FPS)        │
│                                              │
└──────────────────────────────────────────────┘
\`\`\`

---

## ⚡ requestAnimationFrame

วิธีที่ดีที่สุดในการสร้าง Game Loop บน Browser:

\`\`\`javascript
function gameLoop(timestamp) {
  // 1. Handle Input
  handleInput();
  
  // 2. Update Game Logic
  update();
  
  // 3. Render Graphics
  render();
  
  // 4. Request next frame
  requestAnimationFrame(gameLoop);
}

// เริ่ม game loop
requestAnimationFrame(gameLoop);
\`\`\`

### ทำไมต้อง requestAnimationFrame?
- ⚡ Sync กับ monitor refresh rate (60 FPS)
- 🔋 หยุดอัตโนมัติเมื่อ tab ไม่ active (ประหยัด battery)
- 🎨 Smooth animations ไม่กระตุก

---

## ⏱️ Delta Time - สำคัญมาก!

**ปัญหา:** เครื่องแต่ละเครื่องมี FPS ต่างกัน (30, 60, 144 FPS)
**ทำให้:** เกมทำงานเร็ว/ช้าไม่เท่ากัน!

\`\`\`javascript
// ❌ ปัญหา - เคลื่อนที่ไม่สม่ำเสมอ
function update() {
  player.x += 5; // 5 pixels ต่อ frame
  // 60 FPS = 300 px/s
  // 30 FPS = 150 px/s  ← ช้ากว่า 2 เท่า!
}
\`\`\`

\`\`\`javascript
// ✅ แก้ไข - ใช้ Delta Time
let lastTime = 0;

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000; // seconds
  lastTime = timestamp;
  
  update(deltaTime);
  render();
  
  requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
  // 300 pixels per second ไม่ว่า FPS จะเป็นเท่าไร
  player.x += 300 * deltaTime;
}
\`\`\`

### Delta Time ทำงานอย่างไร?

| FPS | Delta Time | Movement per frame | Total per second |
|-----|------------|-------------------|------------------|
| 60 | 0.0167s | 5 px | 300 px |
| 30 | 0.0333s | 10 px | 300 px |
| 120 | 0.0083s | 2.5 px | 300 px |

**ผลลัพธ์เหมือนกัน ไม่ว่า FPS จะเป็นเท่าไร!**

---

## 🎮 Complete Game Loop Template

\`\`\`javascript
// ==========================================
// GAME LOOP TEMPLATE
// ==========================================

// Game State
const game = {
  isRunning: true,
  isPaused: false,
  lastTime: 0,
  fps: 0,
  frameCount: 0
};

// Input State
const keys = {
  left: false,
  right: false,
  up: false,
  down: false,
  space: false
};

// Player
const player = {
  x: 400,
  y: 300,
  speed: 200 // pixels per second
};

// ==========================================
// INPUT HANDLING
// ==========================================
function setupInput() {
  document.addEventListener('keydown', (e) => {
    switch(e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        keys.left = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        keys.right = true;
        break;
      case 'ArrowUp':
      case 'KeyW':
        keys.up = true;
        break;
      case 'ArrowDown':
      case 'KeyS':
        keys.down = true;
        break;
      case 'Space':
        keys.space = true;
        break;
      case 'Escape':
        game.isPaused = !game.isPaused;
        break;
    }
  });

  document.addEventListener('keyup', (e) => {
    switch(e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        keys.left = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        keys.right = false;
        break;
      case 'ArrowUp':
      case 'KeyW':
        keys.up = false;
        break;
      case 'ArrowDown':
      case 'KeyS':
        keys.down = false;
        break;
      case 'Space':
        keys.space = false;
        break;
    }
  });
}

// ==========================================
// UPDATE
// ==========================================
function update(deltaTime) {
  if (game.isPaused) return;
  
  // Player movement
  if (keys.left) player.x -= player.speed * deltaTime;
  if (keys.right) player.x += player.speed * deltaTime;
  if (keys.up) player.y -= player.speed * deltaTime;
  if (keys.down) player.y += player.speed * deltaTime;
  
  // Keep player in bounds
  player.x = Math.max(0, Math.min(800 - 32, player.x));
  player.y = Math.max(0, Math.min(600 - 32, player.y));
}

// ==========================================
// RENDER
// ==========================================
function render() {
  const ctx = canvas.getContext('2d');
  
  // Clear screen
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, 800, 600);
  
  // Draw player
  ctx.fillStyle = game.isPaused ? '#666' : '#4ade80';
  ctx.fillRect(player.x, player.y, 32, 32);
  
  // Draw FPS
  ctx.fillStyle = '#fff';
  ctx.font = '14px monospace';
  ctx.fillText(\`FPS: \${game.fps}\`, 10, 20);
  
  // Draw pause text
  if (game.isPaused) {
    ctx.fillStyle = '#fff';
    ctx.font = '48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', 400, 300);
    ctx.textAlign = 'left';
  }
}

// ==========================================
// GAME LOOP
// ==========================================
function gameLoop(timestamp) {
  // Calculate delta time
  const deltaTime = (timestamp - game.lastTime) / 1000;
  game.lastTime = timestamp;
  
  // Calculate FPS
  game.frameCount++;
  if (game.frameCount % 30 === 0) {
    game.fps = Math.round(1 / deltaTime);
  }
  
  // Main loop
  update(deltaTime);
  render();
  
  // Continue loop
  if (game.isRunning) {
    requestAnimationFrame(gameLoop);
  }
}

// ==========================================
// START GAME
// ==========================================
function startGame() {
  setupInput();
  requestAnimationFrame(gameLoop);
  console.log('🎮 Game Started!');
}

startGame();
\`\`\`

---

## ✅ สรุป

| Concept | คำอธิบาย |
|---------|----------|
| Game Loop | วงจรหลักที่ทำงานซ้ำตลอดเกม |
| requestAnimationFrame | API สำหรับ smooth 60 FPS |
| Delta Time | เวลาระหว่าง frames (seconds) |
| Input Phase | รับ input จากผู้เล่น |
| Update Phase | อัพเดท game logic |
| Render Phase | วาดกราฟิก |

**บทต่อไป: คณิตศาสตร์สำหรับเกม! 📐**
    `,
    codeExamples: [
      {
        title: "FPS Counter",
        language: "javascript",
        code: `// FPS Counter Implementation
let fps = 0;
let frameCount = 0;
let lastFpsUpdate = 0;

function gameLoop(timestamp) {
  frameCount++;
  
  // Update FPS every second
  if (timestamp - lastFpsUpdate >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastFpsUpdate = timestamp;
    console.log(\`FPS: \${fps}\`);
  }
  
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);`,
        description: "วิธีคำนวณและแสดง FPS แบบ accurate"
      }
    ]
  },

  {
    id: "lesson-1-1-3",
    moduleId: "module-1-1",
    title: "Math for Games",
    titleTh: "คณิตศาสตร์สำหรับเกม",
    order: 3,
    duration: 55,
    content: `
# คณิตศาสตร์สำหรับการพัฒนาเกม

## 🎯 สิ่งที่คุณจะได้เรียนรู้
- Vector คืออะไรและใช้ทำอะไร
- การคำนวณระยะทางและทิศทาง
- การตรวจจับ Collision
- Trigonometry สำหรับการหมุนและเล็ง

---

## 📐 Vectors - พื้นฐานของทุกอย่างในเกม

Vector คือข้อมูลที่มีทั้ง **ขนาด** และ **ทิศทาง**

\`\`\`javascript
// Vector 2D
const position = { x: 100, y: 200 };
const velocity = { x: 5, y: -3 };
const direction = { x: 0.707, y: 0.707 }; // normalized

// Vector Class
class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  
  // บวก vectors
  add(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }
  
  // ลบ vectors
  subtract(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }
  
  // คูณด้วย scalar
  multiply(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }
  
  // ความยาว (magnitude)
  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  
  // Normalize (ทำให้ความยาว = 1)
  normalize() {
    const len = this.length;
    if (len === 0) return new Vector2();
    return new Vector2(this.x / len, this.y / len);
  }
  
  // Dot product
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }
  
  // ระยะทางถึง vector อื่น
  distanceTo(v) {
    return this.subtract(v).length;
  }
  
  // มุมจาก vector นี้ไป vector อื่น
  angleTo(v) {
    return Math.atan2(v.y - this.y, v.x - this.x);
  }
}
\`\`\`

---

## 📏 การคำนวณระยะทาง

\`\`\`javascript
// ระยะทางระหว่าง 2 จุด (Euclidean Distance)
function distance(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// ตัวอย่างการใช้งาน
const player = { x: 100, y: 100 };
const enemy = { x: 200, y: 150 };

const dist = distance(player, enemy);
console.log(\`Distance: \${dist.toFixed(2)}\`); // ~111.80

// ใช้เช็คว่าอยู่ในระยะโจมตีหรือไม่
const ATTACK_RANGE = 50;
if (distance(player, enemy) <= ATTACK_RANGE) {
  console.log("Enemy in range!");
}
\`\`\`

### Distance Squared (เร็วกว่า!)
\`\`\`javascript
// ใช้ distance squared เมื่อไม่ต้องการค่าจริง (ประหยัด Math.sqrt)
function distanceSquared(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return dx * dx + dy * dy;
}

// เปรียบเทียบกับ range squared แทน
const ATTACK_RANGE = 50;
const ATTACK_RANGE_SQ = ATTACK_RANGE * ATTACK_RANGE; // 2500

if (distanceSquared(player, enemy) <= ATTACK_RANGE_SQ) {
  console.log("Enemy in range!");
}
\`\`\`

---

## 💥 Collision Detection

### 1. AABB (Axis-Aligned Bounding Box)
\`\`\`javascript
// สี่เหลี่ยมที่ไม่หมุน
function aabbCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// ตัวอย่าง
const player = { x: 100, y: 100, width: 32, height: 32 };
const enemy = { x: 120, y: 110, width: 32, height: 32 };

if (aabbCollision(player, enemy)) {
  console.log("Collision detected!");
}
\`\`\`

### 2. Circle Collision
\`\`\`javascript
// วงกลมชนวงกลม
function circleCollision(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < a.radius + b.radius;
}

// ตัวอย่าง
const ball1 = { x: 100, y: 100, radius: 20 };
const ball2 = { x: 130, y: 110, radius: 15 };

if (circleCollision(ball1, ball2)) {
  console.log("Balls collided!");
}
\`\`\`

### 3. Point in Rectangle
\`\`\`javascript
function pointInRect(point, rect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

// ใช้สำหรับเช็ค mouse click
canvas.addEventListener('click', (e) => {
  const mousePos = { x: e.offsetX, y: e.offsetY };
  
  if (pointInRect(mousePos, button)) {
    console.log("Button clicked!");
  }
});
\`\`\`

---

## 🔄 Trigonometry

### การหมุนและมุม
\`\`\`javascript
// แปลง degrees เป็น radians
function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

// แปลง radians เป็น degrees
function radToDeg(radians) {
  return radians * (180 / Math.PI);
}

// หามุมจากจุดหนึ่งไปอีกจุด
function angleBetween(from, to) {
  return Math.atan2(to.y - from.y, to.x - from.x);
}

// ตัวอย่าง: ศัตรูหันหน้าหาผู้เล่น
const enemy = { x: 200, y: 200, rotation: 0 };
const player = { x: 400, y: 300 };

enemy.rotation = angleBetween(enemy, player);
\`\`\`

### การเคลื่อนที่ตามมุม
\`\`\`javascript
// เคลื่อนที่ไปในทิศทางที่กำหนด
function moveInDirection(entity, angle, speed, deltaTime) {
  entity.x += Math.cos(angle) * speed * deltaTime;
  entity.y += Math.sin(angle) * speed * deltaTime;
}

// ตัวอย่าง: กระสุนบินไปหาเป้าหมาย
const bullet = { x: 100, y: 100 };
const target = { x: 300, y: 200 };
const angle = angleBetween(bullet, target);

function update(deltaTime) {
  moveInDirection(bullet, angle, 500, deltaTime); // 500 px/s
}
\`\`\`

---

## ✅ สรุป

| Concept | สูตร | ใช้ทำอะไร |
|---------|------|----------|
| Distance | √(dx² + dy²) | หาระยะห่าง |
| AABB | เช็ค overlap ทั้ง 4 ด้าน | Collision สี่เหลี่ยม |
| Circle | distance < r1 + r2 | Collision วงกลม |
| atan2 | Math.atan2(dy, dx) | หามุม |
| cos/sin | x += cos(θ), y += sin(θ) | เคลื่อนที่ตามมุม |

**บทต่อไป: Text-Based Games! 📝**
    `,
    codeExamples: [
      {
        title: "Complete Collision System",
        language: "javascript",
        code: `// Collision Detection System
const Collision = {
  // AABB
  rectRect(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x &&
           a.y < b.y + b.height && a.y + a.height > b.y;
  },
  
  // Circle
  circleCircle(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < a.radius + b.radius;
  },
  
  // Circle vs Rect
  circleRect(circle, rect) {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    
    return (dx * dx + dy * dy) < (circle.radius * circle.radius);
  },
  
  // Point in Rect
  pointRect(point, rect) {
    return point.x >= rect.x && point.x <= rect.x + rect.width &&
           point.y >= rect.y && point.y <= rect.y + rect.height;
  }
};

// Usage
const player = { x: 100, y: 100, width: 32, height: 32 };
const enemy = { x: 120, y: 110, width: 32, height: 32 };

if (Collision.rectRect(player, enemy)) {
  console.log("Hit!");
}`,
        description: "ระบบ Collision Detection แบบครบถ้วน"
      }
    ]
  },

  // Continue with Module 1.2 and beyond...
  // Adding brief content for remaining lessons
  
  { id: "lesson-1-2-1", moduleId: "module-1-2", title: "Console Interaction", titleTh: "การโต้ตอบกับ Console", order: 1, duration: 30, content: `# Console Interaction\n\n## 🎯 Introduction\nLearn to create interactive console games using readline.\n\n## Code Example\n\`\`\`javascript\nconst readline = require('readline');\n\nconst rl = readline.createInterface({\n  input: process.stdin,\n  output: process.stdout\n});\n\nrl.question('Enter your name: ', (name) => {\n  console.log(\`Hello, \${name}!\`);\n  rl.close();\n});\n\`\`\``, codeExamples: [] },
  { id: "lesson-1-2-2", moduleId: "module-1-2", title: "State Management", titleTh: "การจัดการ State", order: 2, duration: 45, content: `# Game State Management\n\n## Managing Complex States\n\`\`\`javascript\nconst gameState = {\n  player: { health: 100, inventory: [] },\n  currentRoom: 'start',\n  flags: { doorUnlocked: false }\n};\n\`\`\``, codeExamples: [] },
  { id: "lesson-1-2-3", moduleId: "module-1-2", title: "Story Branching", titleTh: "การแตกกิ่งเรื่องราว", order: 3, duration: 60, content: `# Story Branching\n\n## Creating Interactive Narratives\n\`\`\`javascript\nconst story = {\n  start: {\n    text: 'You stand at a crossroads...',\n    choices: [\n      { text: 'Go left', next: 'forest' },\n      { text: 'Go right', next: 'cave' }\n    ]\n  }\n};\n\`\`\``, codeExamples: [] },
];

// Import additional content from extra file
import { allAdditionalContents } from "./lessonContentsExtra";

// Combine all lesson contents
const allLessonContents: LessonContent[] = [
  ...lessonContents,
  ...allAdditionalContents
];

export function getLessonContent(lessonId: string): LessonContent | undefined {
  return allLessonContents.find((l) => l.id === lessonId);
}

export function getLessonsByModule(moduleId: string): LessonContent[] {
  return allLessonContents.filter((l) => l.moduleId === moduleId);
}

