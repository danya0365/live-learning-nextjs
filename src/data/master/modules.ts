// Master Data: Course Modules
// Based on FEATURES.md

export interface Module {
  id: string;
  phaseId: string;
  number: string; // e.g., "1.1", "2.2"
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  duration: string;
  icon: string;
  lessons: string[]; // Lesson IDs
  projects: string[]; // Project IDs
  engine?: string;
  tools?: string[];
}

export const modules: Module[] = [
  // Phase 1 Modules
  {
    id: "module-1-1",
    phaseId: "phase-1",
    number: "1.1",
    title: "Programming Basics for Games",
    titleTh: "พื้นฐานการเขียนโปรแกรมสำหรับเกม",
    description: "JavaScript/TypeScript fundamentals, game concepts, math for games",
    descriptionTh: "พื้นฐาน JavaScript/TypeScript, แนวคิดเกม, คณิตศาสตร์สำหรับเกม",
    duration: "1 week",
    icon: "📚",
    lessons: ["lesson-1-1-1", "lesson-1-1-2", "lesson-1-1-3"],
    projects: ["project-1-1-1", "project-1-1-2"],
    engine: "Vanilla JavaScript/TypeScript",
    tools: ["VS Code", "Node.js"],
  },
  {
    id: "module-1-2",
    phaseId: "phase-1",
    number: "1.2",
    title: "Text-Based Games",
    titleTh: "เกมแบบ Text-Based",
    description: "Console games, state management, story branching, combat systems",
    descriptionTh: "เกมบน Console, การจัดการ State, การแตกเรื่องราว, ระบบต่อสู้",
    duration: "1-2 weeks",
    icon: "📝",
    lessons: ["lesson-1-2-1", "lesson-1-2-2", "lesson-1-2-3"],
    projects: ["project-1-2-1", "project-1-2-2", "project-1-2-3"],
    engine: "Node.js CLI",
    tools: ["Terminal", "readline"],
  },

  // Phase 2 Modules
  {
    id: "module-2-1",
    phaseId: "phase-2",
    number: "2.1",
    title: "Canvas API & Basic 2D",
    titleTh: "Canvas API และ 2D พื้นฐาน",
    description: "HTML5 Canvas, drawing, animation, collision detection",
    descriptionTh: "HTML5 Canvas, การวาด, แอนิเมชัน, การตรวจจับการชน",
    duration: "2-3 weeks",
    icon: "🎨",
    lessons: ["lesson-2-1-1", "lesson-2-1-2", "lesson-2-1-3", "lesson-2-1-4"],
    projects: ["project-2-1-1", "project-2-1-2", "project-2-1-3"],
    engine: "Vanilla Canvas API",
    tools: ["Chrome DevTools"],
  },
  {
    id: "module-2-2",
    phaseId: "phase-2",
    number: "2.2",
    title: "Phaser.js",
    titleTh: "Phaser.js",
    description: "Popular 2D game engine, scenes, physics, tilemaps",
    descriptionTh: "Engine เกม 2D ยอดนิยม, scenes, physics, tilemaps",
    duration: "4-6 weeks",
    icon: "⚡",
    lessons: ["lesson-2-2-1", "lesson-2-2-2", "lesson-2-2-3", "lesson-2-2-4"],
    projects: ["project-2-2-1", "project-2-2-2", "project-2-2-3"],
    engine: "Phaser 3",
    tools: ["Tiled Map Editor", "Aseprite"],
  },
  {
    id: "module-2-3",
    phaseId: "phase-2",
    number: "2.3",
    title: "PixiJS",
    titleTh: "PixiJS",
    description: "High-performance 2D rendering, WebGL, particle systems",
    descriptionTh: "การเรนเดอร์ 2D ประสิทธิภาพสูง, WebGL, Particle systems",
    duration: "3-4 weeks",
    icon: "✨",
    lessons: ["lesson-2-3-1", "lesson-2-3-2", "lesson-2-3-3"],
    projects: ["project-2-3-1", "project-2-3-2", "project-2-3-3"],
    engine: "PixiJS v7+",
    tools: ["Spine", "DragonBones"],
  },

  // Phase 3 Modules
  {
    id: "module-3-1",
    phaseId: "phase-3",
    number: "3.1",
    title: "Real-time Multiplayer with Colyseus",
    titleTh: "Multiplayer แบบ Real-time ด้วย Colyseus",
    description: "Server-client architecture, state sync, rooms, matchmaking",
    descriptionTh: "สถาปัตยกรรม Server-client, การ sync state, rooms, matchmaking",
    duration: "4-5 weeks",
    icon: "🔌",
    lessons: ["lesson-3-1-1", "lesson-3-1-2", "lesson-3-1-3", "lesson-3-1-4"],
    projects: ["project-3-1-1", "project-3-1-2", "project-3-1-3"],
    engine: "Colyseus",
    tools: ["Express.js", "MongoDB", "Redis"],
  },
  {
    id: "module-3-2",
    phaseId: "phase-3",
    number: "3.2",
    title: "Peer-to-Peer with PeerJS",
    titleTh: "P2P ด้วย PeerJS",
    description: "WebRTC, peer connections, data channels, NAT traversal",
    descriptionTh: "WebRTC, การเชื่อมต่อ peer, data channels, NAT traversal",
    duration: "2-3 weeks",
    icon: "🔗",
    lessons: ["lesson-3-2-1", "lesson-3-2-2", "lesson-3-2-3"],
    projects: ["project-3-2-1", "project-3-2-2", "project-3-2-3"],
    engine: "PeerJS",
    tools: ["simple-peer"],
  },

  // Phase 4 Modules
  {
    id: "module-4-1",
    phaseId: "phase-4",
    number: "4.1",
    title: "Three.js Fundamentals",
    titleTh: "พื้นฐาน Three.js",
    description: "3D basics, scene/camera/renderer, geometry, lighting, physics",
    descriptionTh: "พื้นฐาน 3D, scene/camera/renderer, geometry, lighting, physics",
    duration: "5-6 weeks",
    icon: "🧊",
    lessons: ["lesson-4-1-1", "lesson-4-1-2", "lesson-4-1-3", "lesson-4-1-4"],
    projects: ["project-4-1-1", "project-4-1-2", "project-4-1-3"],
    engine: "Three.js",
    tools: ["Blender", "Cannon.js", "Rapier.js"],
  },
  {
    id: "module-4-2",
    phaseId: "phase-4",
    number: "4.2",
    title: "Babylon.js",
    titleTh: "Babylon.js",
    description: "Full-featured 3D engine, PBR materials, advanced physics, XR",
    descriptionTh: "Engine 3D เต็มรูปแบบ, PBR materials, physics ขั้นสูง, XR",
    duration: "6-8 weeks",
    icon: "🔮",
    lessons: ["lesson-4-2-1", "lesson-4-2-2", "lesson-4-2-3", "lesson-4-2-4"],
    projects: ["project-4-2-1", "project-4-2-2", "project-4-2-3"],
    engine: "Babylon.js",
    tools: ["Babylon.js Editor", "Babylon.js Playground"],
  },
  {
    id: "module-4-3",
    phaseId: "phase-4",
    number: "4.3",
    title: "PlayCanvas",
    titleTh: "PlayCanvas",
    description: "Cloud-based 3D engine, collaborative development, mobile optimization",
    descriptionTh: "Engine 3D บน Cloud, พัฒนาแบบ collaborative, optimize สำหรับ mobile",
    duration: "3-4 weeks",
    icon: "☁️",
    lessons: ["lesson-4-3-1", "lesson-4-3-2"],
    projects: ["project-4-3-1", "project-4-3-2"],
    engine: "PlayCanvas",
    tools: ["PlayCanvas Cloud Editor"],
  },
  {
    id: "module-4-4",
    phaseId: "phase-4",
    number: "4.4",
    title: "Unity WebGL",
    titleTh: "Unity WebGL",
    description: "Unity basics for web, WebGL builds, optimization, JS integration",
    descriptionTh: "พื้นฐาน Unity สำหรับเว็บ, WebGL builds, optimization, JS integration",
    duration: "4-5 weeks",
    icon: "🎯",
    lessons: ["lesson-4-4-1", "lesson-4-4-2", "lesson-4-4-3"],
    projects: ["project-4-4-1", "project-4-4-2"],
    engine: "Unity",
    tools: ["Unity Engine", "WebGL Build"],
  },

  // Phase 5 Modules
  {
    id: "module-5-1",
    phaseId: "phase-5",
    number: "5.1",
    title: "Game Architecture Patterns",
    titleTh: "รูปแบบสถาปัตยกรรมเกม",
    description: "ECS, state machines, design patterns, code organization",
    descriptionTh: "ECS, state machines, design patterns, การจัดโครงสร้างโค้ด",
    duration: "3-4 weeks",
    icon: "🏗️",
    lessons: ["lesson-5-1-1", "lesson-5-1-2", "lesson-5-1-3"],
    projects: ["project-5-1-1", "project-5-1-2"],
    tools: ["TypeScript", "Clean Architecture"],
  },
  {
    id: "module-5-2",
    phaseId: "phase-5",
    number: "5.2",
    title: "Advanced Multiplayer",
    titleTh: "Multiplayer ขั้นสูง",
    description: "Server architecture, lag compensation, anti-cheat, scalability",
    descriptionTh: "สถาปัตยกรรม Server, lag compensation, anti-cheat, scalability",
    duration: "4-5 weeks",
    icon: "🌍",
    lessons: ["lesson-5-2-1", "lesson-5-2-2", "lesson-5-2-3"],
    projects: ["project-5-2-1", "project-5-2-2"],
    tools: ["Load Balancers", "Redis", "Database"],
  },
  {
    id: "module-5-3",
    phaseId: "phase-5",
    number: "5.3",
    title: "Monetization & Publishing",
    titleTh: "Monetization และ Publishing",
    description: "Ads, in-app purchases, analytics, publishing platforms",
    descriptionTh: "โฆษณา, การซื้อในแอป, analytics, แพลตฟอร์มเผยแพร่",
    duration: "2-3 weeks",
    icon: "💰",
    lessons: ["lesson-5-3-1", "lesson-5-3-2", "lesson-5-3-3"],
    projects: ["project-5-3-1", "project-5-3-2"],
    tools: ["Google AdSense", "Stripe", "itch.io"],
  },
  {
    id: "module-5-4",
    phaseId: "phase-5",
    number: "5.4",
    title: "Performance & Optimization",
    titleTh: "Performance และ Optimization",
    description: "Profiling, optimization techniques, memory management, loading",
    descriptionTh: "Profiling, เทคนิคการ optimize, จัดการ memory, การโหลด",
    duration: "3-4 weeks",
    icon: "⚡",
    lessons: ["lesson-5-4-1", "lesson-5-4-2", "lesson-5-4-3"],
    projects: ["project-5-4-1", "project-5-4-2"],
    tools: ["Chrome DevTools", "Performance API"],
  },
  {
    id: "module-5-5",
    phaseId: "phase-5",
    number: "5.5",
    title: "Advanced 3D Techniques",
    titleTh: "เทคนิค 3D ขั้นสูง",
    description: "Shaders, procedural generation, advanced physics, AI/pathfinding",
    descriptionTh: "Shaders, procedural generation, physics ขั้นสูง, AI/pathfinding",
    duration: "5-6 weeks",
    icon: "🎭",
    lessons: ["lesson-5-5-1", "lesson-5-5-2", "lesson-5-5-3", "lesson-5-5-4"],
    projects: ["project-5-5-1", "project-5-5-2", "project-5-5-3"],
    tools: ["GLSL", "Perlin Noise", "A* Algorithm"],
  },
];

export function getModuleById(id: string): Module | undefined {
  return modules.find((module) => module.id === id);
}

export function getModulesByPhaseId(phaseId: string): Module[] {
  return modules.filter((module) => module.phaseId === phaseId);
}

export function getModuleByNumber(number: string): Module | undefined {
  return modules.find((module) => module.number === number);
}
