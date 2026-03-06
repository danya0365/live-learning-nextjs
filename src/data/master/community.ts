// Community forum mock data

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  category: "question" | "showcase" | "discussion" | "help";
  tags: string[];
  likes: number;
  replies: number;
  createdAt: string;
  isPinned?: boolean;
}

export interface ForumReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  likes: number;
  createdAt: string;
  isAccepted?: boolean;
}

export const forumPosts: ForumPost[] = [
  {
    id: "post-1",
    authorId: "user-1",
    authorName: "GameDev Pro",
    authorAvatar: "🧑‍💻",
    title: "ความแตกต่างระหว่าง Phaser และ PixiJS?",
    content: "สวัสดีครับ พี่ๆ ช่วยอธิบายความแตกต่างระหว่าง Phaser และ PixiJS หน่อยได้ไหมครับ ควรใช้ตัวไหนดี?",
    category: "question",
    tags: ["phaser", "pixijs", "2d"],
    likes: 24,
    replies: 8,
    createdAt: "2024-12-28",
    isPinned: true,
  },
  {
    id: "post-2",
    authorId: "user-2",
    authorName: "NewbieCoder",
    authorAvatar: "🎮",
    title: "โชว์เกม Snake ตัวแรก!",
    content: "เพิ่งทำเกม Snake เสร็จครับ ใช้ Canvas API ตามบทเรียน Module 2.1 เลย ขอบคุณทีมสอนมากครับ!",
    category: "showcase",
    tags: ["snake", "canvas", "beginner"],
    likes: 45,
    replies: 12,
    createdAt: "2024-12-27",
  },
  {
    id: "post-3",
    authorId: "user-3",
    authorName: "ThreeJsMaster",
    authorAvatar: "🎲",
    title: "แนะนำเทคนิค Three.js Performance",
    content: "มาแชร์เทคนิคเพิ่ม performance ใน Three.js กันครับ หลังจากทำ Module 4.1 มาแล้ว มีหลายเรื่องที่น่าสนใจ",
    category: "discussion",
    tags: ["threejs", "3d", "performance"],
    likes: 67,
    replies: 15,
    createdAt: "2024-12-26",
  },
  {
    id: "post-4",
    authorId: "user-4",
    authorName: "HelpNeeded",
    authorAvatar: "😅",
    title: "ช่วยด้วยครับ! Collision Detection ไม่ทำงาน",
    content: "ผมทำตามบทเรียน Collision Detection แต่ว่ามันไม่ work ครับ ช่วยดูโค้ดให้หน่อยได้ไหมครับ?",
    category: "help",
    tags: ["collision", "help", "beginner"],
    likes: 5,
    replies: 6,
    createdAt: "2024-12-29",
  },
  {
    id: "post-5",
    authorId: "user-5",
    authorName: "MultiplayerFan",
    authorAvatar: "🌐",
    title: "Colyseus vs Socket.io - ประสบการณ์จริง",
    content: "หลังจากลองทั้งสองมาแล้ว มาเล่าประสบการณ์จริงให้ฟังครับ ข้อดีข้อเสียของแต่ละตัว",
    category: "discussion",
    tags: ["colyseus", "socketio", "multiplayer"],
    likes: 89,
    replies: 23,
    createdAt: "2024-12-25",
  },
];

export function getForumPosts(category?: string): ForumPost[] {
  if (category && category !== "all") {
    return forumPosts.filter((p) => p.category === category);
  }
  return forumPosts;
}

export function getForumPostById(id: string): ForumPost | undefined {
  return forumPosts.find((p) => p.id === id);
}
