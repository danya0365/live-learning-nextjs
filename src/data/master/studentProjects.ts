// Student Projects Showcase Data

export interface StudentProject {
  id: string;
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  author: string;
  authorAvatar: string;
  thumbnail: string;
  category: "2d" | "3d" | "multiplayer" | "casual";
  engine: string;
  phaseCompleted: number;
  tags: string[];
  likes: number;
  plays: number;
  featured: boolean;
  demoUrl?: string;
  sourceUrl?: string;
  createdAt: string;
}

// Mock student projects
export const studentProjects: StudentProject[] = [
  {
    id: "project-1",
    title: "Space Invaders Clone",
    titleTh: "โคลน Space Invaders",
    description: "Classic arcade shooter with modern graphics",
    descriptionTh: "เกมยิงอาเขตคลาสสิกพร้อมกราฟิกยุคใหม่",
    author: "สมชาย",
    authorAvatar: "🧑‍💻",
    thumbnail: "🚀",
    category: "2d",
    engine: "Phaser.js",
    phaseCompleted: 2,
    tags: ["arcade", "shooter", "retro"],
    likes: 42,
    plays: 156,
    featured: true,
    createdAt: "2024-12-15",
  },
  {
    id: "project-2",
    title: "Dungeon Crawler",
    titleTh: "Dungeon Crawler",
    description: "Procedural dungeon exploration with combat",
    descriptionTh: "สำรวจ dungeon ที่สร้างแบบ procedural พร้อมระบบต่อสู้",
    author: "สมหญิง",
    authorAvatar: "👩‍💻",
    thumbnail: "🏰",
    category: "2d",
    engine: "PixiJS",
    phaseCompleted: 2,
    tags: ["roguelike", "procedural", "rpg"],
    likes: 67,
    plays: 234,
    featured: true,
    createdAt: "2024-12-10",
  },
  {
    id: "project-3",
    title: "Multiplayer Chess",
    titleTh: "หมากรุกออนไลน์",
    description: "Real-time multiplayer chess with ranking",
    descriptionTh: "หมากรุกแบบ real-time พร้อมระบบ ranking",
    author: "วิชัย",
    authorAvatar: "👨‍🔬",
    thumbnail: "♟️",
    category: "multiplayer",
    engine: "Colyseus",
    phaseCompleted: 3,
    tags: ["board-game", "multiplayer", "competitive"],
    likes: 89,
    plays: 412,
    featured: true,
    createdAt: "2024-11-28",
  },
  {
    id: "project-4",
    title: "3D Racing Game",
    titleTh: "เกมแข่งรถ 3D",
    description: "Fast-paced 3D racing with multiple tracks",
    descriptionTh: "เกมแข่งรถ 3D ความเร็วสูงหลายสนาม",
    author: "พิชัย",
    authorAvatar: "🧔",
    thumbnail: "🏎️",
    category: "3d",
    engine: "Three.js",
    phaseCompleted: 4,
    tags: ["racing", "3d", "arcade"],
    likes: 124,
    plays: 567,
    featured: true,
    createdAt: "2024-11-20",
  },
  {
    id: "project-5",
    title: "Bubble Pop",
    titleTh: "Bubble Pop",
    description: "Relaxing bubble popping puzzle game",
    descriptionTh: "เกมปริศนาแตกฟองอากาศผ่อนคลาย",
    author: "มานี",
    authorAvatar: "👩",
    thumbnail: "🫧",
    category: "casual",
    engine: "Canvas API",
    phaseCompleted: 2,
    tags: ["puzzle", "casual", "relaxing"],
    likes: 35,
    plays: 189,
    featured: false,
    createdAt: "2024-12-01",
  },
  {
    id: "project-6",
    title: "Tower Defense",
    titleTh: "Tower Defense",
    description: "Strategic tower defense with upgrades",
    descriptionTh: "เกมวางแผนป้องกันหอคอยพร้อมระบบอัพเกรด",
    author: "กิตติ",
    authorAvatar: "🧑‍🎨",
    thumbnail: "🗼",
    category: "2d",
    engine: "Phaser.js",
    phaseCompleted: 2,
    tags: ["strategy", "tower-defense", "upgrade"],
    likes: 56,
    plays: 298,
    featured: false,
    createdAt: "2024-11-25",
  },
  {
    id: "project-7",
    title: "Card Battle",
    titleTh: "การ์ดต่อสู้",
    description: "P2P card game with PeerJS",
    descriptionTh: "เกมการ์ดต่อสู้แบบ P2P ด้วย PeerJS",
    author: "ธนา",
    authorAvatar: "👨‍💼",
    thumbnail: "🃏",
    category: "multiplayer",
    engine: "PeerJS",
    phaseCompleted: 3,
    tags: ["card-game", "p2p", "strategy"],
    likes: 78,
    plays: 345,
    featured: false,
    createdAt: "2024-11-15",
  },
  {
    id: "project-8",
    title: "3D Puzzle Box",
    titleTh: "กล่องปริศนา 3D",
    description: "Rotating 3D puzzle with physics",
    descriptionTh: "ปริศนากล่อง 3D ที่หมุนได้พร้อม physics",
    author: "อรุณ",
    authorAvatar: "👨‍🔧",
    thumbnail: "📦",
    category: "3d",
    engine: "Babylon.js",
    phaseCompleted: 4,
    tags: ["puzzle", "3d", "physics"],
    likes: 45,
    plays: 178,
    featured: false,
    createdAt: "2024-11-10",
  },
];

export function getFeaturedProjects(): StudentProject[] {
  return studentProjects.filter((p) => p.featured);
}

export function getProjectsByCategory(category: string): StudentProject[] {
  return studentProjects.filter((p) => p.category === category);
}

export function getProjectById(id: string): StudentProject | undefined {
  return studentProjects.find((p) => p.id === id);
}
