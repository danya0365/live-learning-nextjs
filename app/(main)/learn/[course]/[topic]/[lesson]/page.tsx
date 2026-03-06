import { getCourseBySlug, getTopicFilterForCourse, learnCourses } from "@/src/data/master/learnCourses";
import { getLessonsByTopic } from "@/src/data/master/learnLessons";
import { getTopicBySlug, learnTopics } from "@/src/data/master/learnTopics";
import { LearnLessonView } from "@/src/presentation/components/learn/LearnLessonView";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ course: string; topic: string; lesson: string }>;
}

export async function generateStaticParams() {
  const paths: { course: string; topic: string; lesson: string }[] = [];
  
  learnCourses.forEach((course) => {
    const topicFilter = getTopicFilterForCourse(course.slug);
    learnTopics
      .filter(t => topicFilter(t.id))
      .forEach((topic) => {
        const lessons = getLessonsByTopic(topic.id);
        lessons.forEach((lesson) => {
          paths.push({ 
            course: course.slug, 
            topic: topic.slug, 
            lesson: lesson.slug 
          });
        });
      });
  });
  
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: courseSlug, topic: topicSlug, lesson: lessonSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  const topic = getTopicBySlug(topicSlug);
  
  if (!course || !topic) {
    return { title: "Not Found" };
  }

  const lessons = getLessonsByTopic(topic.id);
  const lesson = lessons.find(l => l.slug === lessonSlug);
  
  return {
    title: lesson ? `${lesson.titleTh} | ${course.title} | Play Stack` : "Not Found",
    description: lesson?.description,
  };
}

export default async function LearnLessonPage({ params }: Props) {
  const { course: courseSlug, topic: topicSlug, lesson: lessonSlug } = await params;
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

  // Validate lesson exists
  const lessons = getLessonsByTopic(topic.id);
  const lesson = lessons.find(l => l.slug === lessonSlug);
  if (!lesson) {
    notFound();
  }

  return <LearnLessonView topicSlug={topicSlug} lessonSlug={lessonSlug} courseSlug={courseSlug} />;
}
