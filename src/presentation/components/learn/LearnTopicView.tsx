"use client";

import { MainLearnTopicView } from "./MainLearnTopicView";

interface LearnTopicViewProps {
  courseId: string;
  topicSlug: string;
  courseSlug: string;
}

export function LearnTopicView({ courseId, topicSlug, courseSlug }: LearnTopicViewProps) {
  return <MainLearnTopicView courseId={courseId} topicSlug={topicSlug} courseSlug={courseSlug} />;
}
