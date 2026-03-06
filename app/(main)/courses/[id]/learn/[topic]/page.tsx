import { getCourseBySlug, getTopicFilterForCourse, learnCourses } from "@/src/data/master/learnCourses";
import { getTopicBySlug, learnTopics } from "@/src/data/master/learnTopics";
import { LearnTopicView } from "@/src/presentation/components/learn/LearnTopicView";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ course: string; topic: string }>;
}

export async function generateStaticParams() {
  const paths: { course: string; topic: string }[] = [];
  
  learnCourses.forEach((course) => {
    const topicFilter = getTopicFilterForCourse(course.slug);
    learnTopics
      .filter(t => topicFilter(t.id))
      .forEach((topic) => {
        paths.push({ course: course.slug, topic: topic.slug });
      });
  });
  
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: courseSlug, topic: topicSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  const topic = getTopicBySlug(topicSlug);
  
  if (!course || !topic) {
    return { title: "Not Found" };
  }

  return {
    title: `${topic.titleTh} | ${course.title} | Play Stack`,
    description: topic.descriptionTh,
  };
}

export default async function LearnTopicPage({ params }: Props) {
  const { course: courseSlug, topic: topicSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  const topic = getTopicBySlug(topicSlug);
  
  if (!course || !topic) {
    notFound();
  }

  // Validate that topic belongs to this course
  const topicFilter = getTopicFilterForCourse(courseSlug);
  if (!topicFilter(topic.id)) {
    notFound();
  }

  return <LearnTopicView topicSlug={topicSlug} courseSlug={courseSlug} />;
}
