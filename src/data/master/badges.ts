// Badges and Achievements data

export interface Badge {
  id: string;
  name: string;
  nameTh: string;
  description: string;
  descriptionTh: string;
  icon: string;
  category: "learning" | "practice" | "social" | "special";
  points: number;
  requirement: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const badges: Badge[] = [
  // Learning badges
  {
    id: "first-lesson",
    name: "First Steps",
    nameTh: "ก้าวแรก",
    description: "Complete your first lesson",
    descriptionTh: "เรียนจบบทเรียนแรก",
    icon: "🎯",
    category: "learning",
    points: 10,
    requirement: "Complete 1 lesson",
    rarity: "common",
  },
  {
    id: "module-master",
    name: "Module Master",
    nameTh: "Master Module",
    description: "Complete an entire module",
    descriptionTh: "เรียนจบ module ทั้งหมด",
    icon: "📚",
    category: "learning",
    points: 50,
    requirement: "Complete 1 module",
    rarity: "rare",
  },
  {
    id: "phase-champion",
    name: "Phase Champion",
    nameTh: "Champion Phase",
    description: "Complete an entire phase",
    descriptionTh: "เรียนจบ phase ทั้งหมด",
    icon: "🏆",
    category: "learning",
    points: 200,
    requirement: "Complete 1 phase",
    rarity: "epic",
  },
  {
    id: "game-master",
    name: "Game Master",
    nameTh: "Game Master",
    description: "Complete all phases",
    descriptionTh: "เรียนจบทุก phase",
    icon: "👑",
    category: "learning",
    points: 1000,
    requirement: "Complete all phases",
    rarity: "legendary",
  },

  // Practice badges
  {
    id: "code-runner",
    name: "Code Runner",
    nameTh: "นักวิ่งโค้ด",
    description: "Run code in playground 10 times",
    descriptionTh: "รันโค้ดใน playground 10 ครั้ง",
    icon: "⚡",
    category: "practice",
    points: 20,
    requirement: "Run code 10 times",
    rarity: "common",
  },
  {
    id: "challenge-accepted",
    name: "Challenge Accepted",
    nameTh: "รับ Challenge",
    description: "Complete your first challenge",
    descriptionTh: "ทำ Challenge สำเร็จครั้งแรก",
    icon: "🎮",
    category: "practice",
    points: 30,
    requirement: "Complete 1 challenge",
    rarity: "common",
  },
  {
    id: "project-builder",
    name: "Project Builder",
    nameTh: "นักสร้าง Project",
    description: "Complete your first project",
    descriptionTh: "ทำ Project สำเร็จครั้งแรก",
    icon: "🔨",
    category: "practice",
    points: 100,
    requirement: "Complete 1 project",
    rarity: "rare",
  },

  // Social badges
  {
    id: "community-member",
    name: "Community Member",
    nameTh: "สมาชิก Community",
    description: "Join the community forum",
    descriptionTh: "เข้าร่วม Community forum",
    icon: "👥",
    category: "social",
    points: 10,
    requirement: "Post 1 message in community",
    rarity: "common",
  },
  {
    id: "helper",
    name: "Helper",
    nameTh: "ผู้ช่วยเหลือ",
    description: "Help other members",
    descriptionTh: "ช่วยเหลือสมาชิกคนอื่น",
    icon: "🤝",
    category: "social",
    points: 50,
    requirement: "Reply to 5 questions",
    rarity: "rare",
  },

  // Special badges
  {
    id: "early-bird",
    name: "Early Bird",
    nameTh: "นกเช้าตรู่",
    description: "Joined during beta period",
    descriptionTh: "เข้าร่วมช่วง beta",
    icon: "🐣",
    category: "special",
    points: 50,
    requirement: "Join during beta",
    rarity: "epic",
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    nameTh: "นักรบ 7 วัน",
    description: "7-day learning streak",
    descriptionTh: "เรียนติดต่อกัน 7 วัน",
    icon: "🔥",
    category: "special",
    points: 70,
    requirement: "Learn 7 days in a row",
    rarity: "rare",
  },
  {
    id: "streak-30",
    name: "Month Master",
    nameTh: "Master เดือน",
    description: "30-day learning streak",
    descriptionTh: "เรียนติดต่อกัน 30 วัน",
    icon: "💎",
    category: "special",
    points: 300,
    requirement: "Learn 30 days in a row",
    rarity: "legendary",
  },
];

export function getBadgesByCategory(category: string): Badge[] {
  return badges.filter((b) => b.category === category);
}

export function getBadgeById(id: string): Badge | undefined {
  return badges.find((b) => b.id === id);
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case "common":
      return "text-gray-600";
    case "rare":
      return "text-blue-600";
    case "epic":
      return "text-purple-600";
    case "legendary":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
}
