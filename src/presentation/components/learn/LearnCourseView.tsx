"use client";

import { MainLearnCourseView } from "./MainLearnCourseView";

interface LearnCourseViewProps {
  courseId: string;
  courseType: string;
}

export function LearnCourseView({ courseId, courseType }: LearnCourseViewProps) {
  return <MainLearnCourseView courseId={courseId} courseType={courseType} />;
}
