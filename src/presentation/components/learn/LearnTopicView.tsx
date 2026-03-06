"use client";

import { MainLearnTopicView } from "./MainLearnTopicView";

interface LearnTopicViewProps {
  topicSlug: string;
  courseSlug: string;
}

export function LearnTopicView({ topicSlug, courseSlug }: LearnTopicViewProps) {
  return <MainLearnTopicView topicSlug={topicSlug} courseSlug={courseSlug} />;
}
