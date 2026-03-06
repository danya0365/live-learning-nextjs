"use client";

import { MainLearnLessonView } from "./MainLearnLessonView";

interface LearnLessonViewProps {
  topicSlug: string;
  lessonSlug: string;
  courseSlug: string;
}

export function LearnLessonView({ topicSlug, lessonSlug, courseSlug }: LearnLessonViewProps) {
  return <MainLearnLessonView topicSlug={topicSlug} lessonSlug={lessonSlug} courseSlug={courseSlug} />;
}
