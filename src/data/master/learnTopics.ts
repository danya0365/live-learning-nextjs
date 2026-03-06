// Learn Topics Master Data
// Similar structure to phases for the /learn page

export interface LearnTopic {
  id: string;
  slug: string;
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  icon: string;
  color: string;
  order: number;
  lessonCount: number;
}

export const learnTopics: LearnTopic[] = [
  {
    id: "topic-basics",
    slug: "basics",
    title: "JavaScript Basics",
    titleTh: "พื้นฐาน JavaScript",
    description: "Variables, data types, operators, and basic syntax",
    descriptionTh: "ตัวแปร, ชนิดข้อมูล, operators และ syntax พื้นฐาน",
    icon: "🌱",
    color: "from-green-500 to-emerald-600",
    order: 1,
    lessonCount: 8,
  },
  {
    id: "topic-control",
    slug: "control-flow",
    title: "Control Flow",
    titleTh: "การควบคุมการทำงาน",
    description: "Conditionals, loops, and program flow",
    descriptionTh: "เงื่อนไข, loops และการควบคุมโปรแกรม",
    icon: "🔀",
    color: "from-blue-500 to-cyan-600",
    order: 2,
    lessonCount: 6,
  },
  {
    id: "topic-functions",
    slug: "functions",
    title: "Functions",
    titleTh: "ฟังก์ชัน",
    description: "Function declarations, expressions, arrows, and closures",
    descriptionTh: "การประกาศฟังก์ชัน, expressions, arrows และ closures",
    icon: "⚡",
    color: "from-purple-500 to-pink-600",
    order: 3,
    lessonCount: 7,
  },
  {
    id: "topic-objects",
    slug: "objects-arrays",
    title: "Objects & Arrays",
    titleTh: "Objects และ Arrays",
    description: "Object creation, arrays, and data structures",
    descriptionTh: "การสร้าง Object, arrays และโครงสร้างข้อมูล",
    icon: "📦",
    color: "from-orange-500 to-red-600",
    order: 4,
    lessonCount: 8,
  },
  {
    id: "topic-classes",
    slug: "classes",
    title: "Classes & OOP",
    titleTh: "Classes และ OOP",
    description: "Object-oriented programming with JavaScript classes",
    descriptionTh: "การเขียนโปรแกรมเชิงวัตถุด้วย JavaScript classes",
    icon: "🏗️",
    color: "from-indigo-500 to-violet-600",
    order: 5,
    lessonCount: 5,
  },
  {
    id: "topic-async",
    slug: "async",
    title: "Async JavaScript",
    titleTh: "Async JavaScript",
    description: "Callbacks, Promises, Async/Await",
    descriptionTh: "Callbacks, Promises และ Async/Await",
    icon: "⏳",
    color: "from-teal-500 to-cyan-600",
    order: 6,
    lessonCount: 6,
  },
  {
    id: "topic-dom",
    slug: "dom",
    title: "DOM & Events",
    titleTh: "DOM และ Events",
    description: "DOM manipulation and event handling",
    descriptionTh: "การจัดการ DOM และ Events",
    icon: "🌐",
    color: "from-rose-500 to-pink-600",
    order: 7,
    lessonCount: 6,
  },
  // HTML Topics
  {
    id: "topic-html-basics",
    slug: "html-basics",
    title: "HTML Basics",
    titleTh: "พื้นฐาน HTML",
    description: "HTML elements, tags, and structure",
    descriptionTh: "องค์ประกอบ, แท็ก และโครงสร้าง HTML",
    icon: "📄",
    color: "from-orange-500 to-red-600",
    order: 1,
    lessonCount: 4,
  },
  {
    id: "topic-html-semantic",
    slug: "html-semantic",
    title: "Semantic HTML",
    titleTh: "Semantic HTML",
    description: "Meaningful HTML elements for better structure",
    descriptionTh: "การใช้ HTML อย่างมีความหมายเพื่อโครงสร้างที่ดี",
    icon: "🏗️",
    color: "from-red-500 to-pink-600",
    order: 2,
    lessonCount: 3,
  },
  // Go Topics
  {
    id: "topic-go-basics",
    slug: "go-basics",
    title: "Go Basics",
    titleTh: "พื้นฐาน Go",
    description: "Variables, types, and basic syntax",
    descriptionTh: "ตัวแปร, ชนิดข้อมูล และ syntax พื้นฐาน",
    icon: "🐹",
    color: "from-cyan-500 to-teal-600",
    order: 1,
    lessonCount: 3,
  },
  {
    id: "topic-go-concurrency",
    slug: "go-concurrency",
    title: "Concurrency",
    titleTh: "การทำงานพร้อมกัน",
    description: "Goroutines and channels",
    descriptionTh: "Goroutines และ Channels",
    icon: "⚡",
    color: "from-teal-500 to-emerald-600",
    order: 2,
    lessonCount: 2,
  },
];

export function getTopicBySlug(slug: string): LearnTopic | undefined {
  return learnTopics.find((topic) => topic.slug === slug);
}

export function getTopicById(id: string): LearnTopic | undefined {
  return learnTopics.find((topic) => topic.id === id);
}
