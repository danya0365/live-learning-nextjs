"use client";

import { MainLearnLessonView } from "./MainLearnLessonView";

interface LearnLessonViewProps {
  courseId: string;
  topicSlug: string;
  lessonSlug: string;
  courseSlug: string;
}

export function LearnLessonView({ courseId, topicSlug, lessonSlug, courseSlug }: LearnLessonViewProps) {
  return <MainLearnLessonView courseId={courseId} topicSlug={topicSlug} lessonSlug={lessonSlug} courseSlug={courseSlug} />;
}
