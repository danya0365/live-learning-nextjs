// Playground data and examples

export interface PlaygroundExample {
  id: string;
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  category: "basics" | "2d" | "3d" | "multiplayer";
  difficulty: "easy" | "medium" | "hard";
  code: string;
  engine: string;
  icon: string;
}

export const playgroundExamples: PlaygroundExample[] = [
  // Basics
  {
    id: "game-loop",
    title: "Basic Game Loop",
    titleTh: "Game Loop พื้นฐาน",
    description: "Learn the core game loop pattern",
    descriptionTh: "เรียนรู้รูปแบบ Game Loop พื้นฐาน",
    category: "basics",
    difficulty: "easy",
    icon: "🔄",
    engine: "Vanilla JS",
    code: `// Basic Game Loop
let lastTime = 0;
let gameRunning = true;

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  
  // Update game state
  update(deltaTime);
  
  // Render game
  render();
  
  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

function update(dt) {
  // Update game logic here
  console.log('Delta time:', dt.toFixed(2), 'ms');
}

function render() {
  // Render game here
}

// Start the game loop
requestAnimationFrame(gameLoop);`,
  },
  {
    id: "keyboard-input",
    title: "Keyboard Input",
    titleTh: "การรับ Input จาก Keyboard",
    description: "Handle keyboard input for games",
    descriptionTh: "รับ input จาก keyboard สำหรับเกม",
    category: "basics",
    difficulty: "easy",
    icon: "⌨️",
    engine: "Vanilla JS",
    code: `// Keyboard Input Handler
const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  console.log('Key pressed:', e.code);
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// Check keys in game loop
function update() {
  if (keys['ArrowUp'] || keys['KeyW']) {
    console.log('Moving up!');
  }
  if (keys['ArrowDown'] || keys['KeyS']) {
    console.log('Moving down!');
  }
  if (keys['ArrowLeft'] || keys['KeyA']) {
    console.log('Moving left!');
  }
  if (keys['ArrowRight'] || keys['KeyD']) {
    console.log('Moving right!');
  }
  if (keys['Space']) {
    console.log('Jump!');
  }
}

// Run update every 16ms (~60fps)
setInterval(update, 16);
console.log('Use WASD or Arrow keys!');`,
  },
  // 2D Examples
  {
    id: "canvas-drawing",
    title: "Canvas Drawing",
    titleTh: "วาดรูปด้วย Canvas",
    description: "Basic Canvas API drawing",
    descriptionTh: "การวาดรูปพื้นฐานด้วย Canvas API",
    category: "2d",
    difficulty: "easy",
    icon: "🎨",
    engine: "Canvas API",
    code: `// Canvas Drawing Example
const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 300;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

// Draw background
ctx.fillStyle = '#1a1a2e';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw a circle (player)
ctx.beginPath();
ctx.arc(200, 150, 30, 0, Math.PI * 2);
ctx.fillStyle = '#4ade80';
ctx.fill();

// Draw rectangle (enemy)
ctx.fillStyle = '#ef4444';
ctx.fillRect(300, 100, 40, 40);

// Draw text
ctx.font = '16px Arial';
ctx.fillStyle = '#ffffff';
ctx.fillText('Player', 180, 200);
ctx.fillText('Enemy', 295, 160);

console.log('Canvas created! Check the preview.');`,
  },
  {
    id: "sprite-animation",
    title: "Sprite Animation",
    titleTh: "แอนิเมชัน Sprite",
    description: "Animate sprites with Canvas",
    descriptionTh: "สร้างแอนิเมชัน sprite ด้วย Canvas",
    category: "2d",
    difficulty: "medium",
    icon: "🏃",
    engine: "Canvas API",
    code: `// Sprite Animation
const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 300;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Simple animated square
let x = 50;
let y = 150;
let vx = 3;
let frame = 0;

function animate() {
  // Clear
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Update position
  x += vx;
  if (x > 370 || x < 30) vx *= -1;
  
  // Draw "sprite" with animation
  const size = 30 + Math.sin(frame * 0.1) * 5;
  const hue = (frame * 2) % 360;
  
  ctx.fillStyle = \`hsl(\${hue}, 70%, 60%)\`;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw trail
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = \`hsla(\${hue}, 70%, 60%, \${0.1 * (5-i)})\`;
    ctx.beginPath();
    ctx.arc(x - vx * i * 3, y, size * (1 - i * 0.15), 0, Math.PI * 2);
    ctx.fill();
  }
  
  frame++;
  requestAnimationFrame(animate);
}

animate();`,
  },
  {
    id: "collision-detection",
    title: "Collision Detection",
    titleTh: "ตรวจจับการชน",
    description: "AABB and circle collision",
    descriptionTh: "AABB และ circle collision detection",
    category: "2d",
    difficulty: "medium",
    icon: "💥",
    engine: "Canvas API",
    code: `// Collision Detection
const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 300;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Player (circle)
let player = { x: 200, y: 150, r: 20 };

// Obstacles (rectangles)
const obstacles = [
  { x: 50, y: 50, w: 60, h: 60 },
  { x: 300, y: 100, w: 50, h: 80 },
  { x: 150, y: 200, w: 80, h: 40 },
];

// Circle vs Rectangle collision
function checkCollision(circle, rect) {
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  return (dx * dx + dy * dy) < (circle.r * circle.r);
}

function update(e) {
  if (e) {
    const rect = canvas.getBoundingClientRect();
    player.x = e.clientX - rect.left;
    player.y = e.clientY - rect.top;
  }
  
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw obstacles
  obstacles.forEach(obs => {
    const hit = checkCollision(player, obs);
    ctx.fillStyle = hit ? '#ef4444' : '#3b82f6';
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
  });
  
  // Draw player
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
  ctx.fillStyle = '#4ade80';
  ctx.fill();
  
  ctx.font = '14px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText('Move mouse over canvas!', 10, 290);
}

canvas.addEventListener('mousemove', update);
update();`,
  },
  // 3D Example
  {
    id: "three-cube",
    title: "Three.js Cube",
    titleTh: "Cube ด้วย Three.js",
    description: "Basic 3D rendering with Three.js",
    descriptionTh: "การเรนเดอร์ 3D พื้นฐานด้วย Three.js",
    category: "3d",
    difficulty: "medium",
    icon: "🎲",
    engine: "Three.js",
    code: `// Note: This requires Three.js library
// In a real playground, Three.js would be pre-loaded

console.log('Three.js Example');
console.log(\`
// Three.js Basic Cube

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(800, 600);
document.body.appendChild(renderer.domElement);

// Create cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ 
  color: 0x00ff00,
  wireframe: true 
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// Animation
function animate() {
  requestAnimationFrame(animate);
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}

animate();
\`);`,
  },
];

export function getExamplesByCategory(category: string): PlaygroundExample[] {
  return playgroundExamples.filter((ex) => ex.category === category);
}

export function getExampleById(id: string): PlaygroundExample | undefined {
  return playgroundExamples.find((ex) => ex.id === id);
}
