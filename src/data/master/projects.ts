// Master Data: Projects
// Sample projects for each module

export interface Project {
  id: string;
  moduleId: string;
  number: string;
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  difficulty: "easy" | "medium" | "hard";
  features: string[];
  thumbnail?: string;
}

export const projects: Project[] = [
  // Module 1.1 Projects
  {
    id: "project-1-1-1",
    moduleId: "module-1-1",
    number: "1.1.1",
    title: "Simple Calculator",
    titleTh: "เครื่องคิดเลขอย่างง่าย",
    description: "Build a command-line calculator",
    descriptionTh: "สร้างเครื่องคิดเลขบน command-line",
    difficulty: "easy",
    features: ["Basic operations", "Error handling", "History"],
  },
  {
    id: "project-1-1-2",
    moduleId: "module-1-1",
    number: "1.1.2",
    title: "Number Guessing Game",
    titleTh: "เกมทายตัวเลข",
    description: "Create a random number guessing game",
    descriptionTh: "สร้างเกมทายตัวเลขสุ่ม",
    difficulty: "easy",
    features: ["Random generation", "Score tracking", "Difficulty levels"],
  },

  // Module 1.2 Projects
  {
    id: "project-1-2-1",
    moduleId: "module-1-2",
    number: "1.2.1",
    title: "Choose Your Own Adventure",
    titleTh: "ผจญภัยที่คุณเลือกเอง",
    description: "Text adventure with branching narratives",
    descriptionTh: "เกมผจญภัยแบบ text ที่มีเรื่องราวหลายทาง",
    difficulty: "medium",
    features: ["Story branching", "Multiple endings", "Save/load system"],
  },
  {
    id: "project-1-2-2",
    moduleId: "module-1-2",
    number: "1.2.2",
    title: "RPG Battle System",
    titleTh: "ระบบต่อสู้ RPG",
    description: "Turn-based combat system",
    descriptionTh: "ระบบต่อสู้แบบผลัดกันเล่น",
    difficulty: "medium",
    features: ["Turn-based combat", "Character stats", "Item usage"],
  },
  {
    id: "project-1-2-3",
    moduleId: "module-1-2",
    number: "1.2.3",
    title: "Text Dungeon Crawler",
    titleTh: "Dungeon Crawler แบบ Text",
    description: "Explore dungeons, fight enemies, collect treasure",
    descriptionTh: "สำรวจ dungeon, ต่อสู้กับศัตรู, เก็บสมบัติ",
    difficulty: "hard",
    features: ["Room navigation", "Inventory", "Enemy encounters", "Treasure"],
  },

  // Module 2.1 Projects
  {
    id: "project-2-1-1",
    moduleId: "module-2-1",
    number: "2.1.1",
    title: "Snake Game",
    titleTh: "เกมงู",
    description: "Classic snake game with Canvas",
    descriptionTh: "เกมงูคลาสสิกด้วย Canvas",
    difficulty: "easy",
    features: ["Grid movement", "Food spawning", "Score system", "Game over"],
  },
  {
    id: "project-2-1-2",
    moduleId: "module-2-1",
    number: "2.1.2",
    title: "Pong Clone",
    titleTh: "โคลน Pong",
    description: "Two-player Pong game",
    descriptionTh: "เกม Pong แบบ 2 ผู้เล่น",
    difficulty: "medium",
    features: ["Paddle movement", "Ball physics", "Collision", "Two-player"],
  },
  {
    id: "project-2-1-3",
    moduleId: "module-2-1",
    number: "2.1.3",
    title: "Flappy Bird Clone",
    titleTh: "โคลน Flappy Bird",
    description: "Endless runner with gravity",
    descriptionTh: "เกม Endless runner ที่มีแรงโน้มถ่วง",
    difficulty: "medium",
    features: ["Gravity", "Procedural obstacles", "Score tracking", "Restart"],
  },

  // Module 2.2 Projects
  {
    id: "project-2-2-1",
    moduleId: "module-2-2",
    number: "2.2.1",
    title: "Platformer Game",
    titleTh: "เกม Platformer",
    description: "Side-scrolling platformer with Phaser",
    descriptionTh: "เกม Platformer แบบเลื่อนข้างด้วย Phaser",
    difficulty: "medium",
    features: ["Movement", "Jumping", "Multiple levels", "Enemy AI", "Collectibles"],
  },
  {
    id: "project-2-2-2",
    moduleId: "module-2-2",
    number: "2.2.2",
    title: "Top-Down Shooter",
    titleTh: "เกมยิงมุมมองบน",
    description: "8-directional shooter with waves",
    descriptionTh: "เกมยิง 8 ทิศทางพร้อม wave ศัตรู",
    difficulty: "hard",
    features: ["8-directional movement", "Shooting", "Enemy waves", "Boss fights"],
  },
  {
    id: "project-2-2-3",
    moduleId: "module-2-2",
    number: "2.2.3",
    title: "Puzzle Game",
    titleTh: "เกมปริศนา",
    description: "Match-3 or Tetris-like puzzle",
    descriptionTh: "ปริศนาแบบ Match-3 หรือ Tetris",
    difficulty: "hard",
    features: ["Grid gameplay", "Match detection", "Scoring", "Special effects"],
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getProjectsByModuleId(moduleId: string): Project[] {
  return projects.filter((project) => project.moduleId === moduleId);
}
