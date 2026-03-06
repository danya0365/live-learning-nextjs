// Master Data: Course Phases
// Based on FEATURES.md

export interface Phase {
  id: string;
  number: number;
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  icon: string;
  color: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced" | "pro";
  modules: string[]; // Module IDs
}

export const phases: Phase[] = [
  {
    id: "phase-1",
    number: 1,
    title: "Foundation",
    titleTh: "พื้นฐาน",
    description: "Programming basics, text-based games, game loop concepts",
    descriptionTh: "พื้นฐานการเขียนโปรแกรม, เกมแบบ Text-Based, แนวคิด Game Loop",
    icon: "🎯",
    color: "from-green-500 to-emerald-600",
    duration: "2-3 weeks",
    level: "beginner",
    modules: ["module-1-1", "module-1-2"],
  },
  {
    id: "phase-2",
    number: 2,
    title: "Web-Based 2D Games",
    titleTh: "เกม 2D บนเว็บ",
    description: "Canvas API, Phaser.js, PixiJS for 2D game development",
    descriptionTh: "Canvas API, Phaser.js, PixiJS สำหรับพัฒนาเกม 2D",
    icon: "🎮",
    color: "from-blue-500 to-cyan-600",
    duration: "2-3 months",
    level: "intermediate",
    modules: ["module-2-1", "module-2-2", "module-2-3"],
  },
  {
    id: "phase-3",
    number: 3,
    title: "Multiplayer Fundamentals",
    titleTh: "พื้นฐาน Multiplayer",
    description: "Real-time multiplayer with Colyseus and P2P with PeerJS",
    descriptionTh: "Multiplayer แบบ Real-time ด้วย Colyseus และ P2P ด้วย PeerJS",
    icon: "🌐",
    color: "from-purple-500 to-pink-600",
    duration: "1-2 months",
    level: "intermediate",
    modules: ["module-3-1", "module-3-2"],
  },
  {
    id: "phase-4",
    number: 4,
    title: "3D Game Development",
    titleTh: "พัฒนาเกม 3D",
    description: "Three.js, Babylon.js, PlayCanvas, Unity WebGL",
    descriptionTh: "Three.js, Babylon.js, PlayCanvas, Unity WebGL",
    icon: "🎲",
    color: "from-orange-500 to-red-600",
    duration: "2-3 months",
    level: "advanced",
    modules: ["module-4-1", "module-4-2", "module-4-3", "module-4-4"],
  },
  {
    id: "phase-5",
    number: 5,
    title: "Advanced Topics",
    titleTh: "หัวข้อขั้นสูง",
    description: "Architecture, multiplayer optimization, monetization, performance",
    descriptionTh: "Architecture, การ optimize multiplayer, monetization, performance",
    icon: "🚀",
    color: "from-indigo-500 to-violet-600",
    duration: "2-3 months",
    level: "pro",
    modules: ["module-5-1", "module-5-2", "module-5-3", "module-5-4", "module-5-5"],
  },
];

export function getPhaseById(id: string): Phase | undefined {
  return phases.find((phase) => phase.id === id);
}

export function getPhaseByNumber(number: number): Phase | undefined {
  return phases.find((phase) => phase.number === number);
}
