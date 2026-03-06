"use client";

import { MainLearnCourseView } from "./MainLearnCourseView";

interface LearnCourseViewProps {
  courseType: string;
}

export function LearnCourseView({ courseType }: LearnCourseViewProps) {
  return <MainLearnCourseView courseType={courseType} />;
}
