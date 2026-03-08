import { LearnCourse } from "@/src/domain/types/learn-content";

export const learnCourses: LearnCourse[] = [
  {
    id: "course-javascript",
    slug: "javascript",
    title: "JavaScript",
    titleTh: "JavaScript",
    description: "The language of the web - Variables, Functions, Objects, Arrays and more",
    descriptionTh: "พื้นฐานการเขียนโปรแกรมด้วย JavaScript",
    icon: "JS",
    color: "yellow",
    bgGradient: "from-yellow-600 to-orange-600",
    order: 1,
  },
  {
    id: "course-html",
    slug: "html",
    title: "HTML",
    titleTh: "HTML",
    description: "Structure of the web - Elements, Tags, Semantic HTML and more",
    descriptionTh: "โครงสร้างพื้นฐานของเว็บไซต์",
    icon: "📄",
    color: "orange",
    bgGradient: "from-orange-600 to-red-600",
    order: 2,
  },
  {
    id: "course-go",
    slug: "go",
    title: "Go",
    titleTh: "Go (Golang)",
    description: "Fast, simple, and efficient programming language",
    descriptionTh: "ภาษาที่เร็ว เรียบง่าย และมีประสิทธิภาพสูง",
    icon: "Go",
    color: "cyan",
    bgGradient: "from-cyan-600 to-teal-600",
    order: 3,
  },
  {
    id: "course-nextjs",
    slug: "nextjs",
    title: "Next.js 14",
    titleTh: "Next.js 14 Fullstack",
    description: "The React Framework for the Web",
    descriptionTh: "App Router, Server Components และ Server Actions",
    icon: "▲",
    color: "slate",
    bgGradient: "from-slate-800 to-black",
    order: 4,
  },
  {
    id: "course-line-oa",
    slug: "line-oa",
    title: "LINE OA",
    titleTh: "การใช้งาน LINE OA",
    description: "LINE Official Account management for targeted groups",
    descriptionTh: "คู่มือฉบับลงมือปฏิบัติสำหรับทีมงานดูแลผู้ใช้สารเสพติด",
    icon: "💬",
    color: "green",
    bgGradient: "from-green-500 to-emerald-600",
    order: 5,
  },
];

export function getCourseBySlug(slug: string): LearnCourse | undefined {
  return learnCourses.find((course) => course.slug === slug);
}

export function getCourseById(id: string): LearnCourse | undefined {
  return learnCourses.find((course) => course.id === id);
}

export function getValidCourseSlugs(): string[] {
  return learnCourses.map((course) => course.slug);
}

// Map course slug to the topic filter logic is now handled by getTopicsForCourse in learnTopics.ts
