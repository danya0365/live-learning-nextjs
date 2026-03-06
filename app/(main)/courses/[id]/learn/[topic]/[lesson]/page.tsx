import { getCourseBySlug, getTopicFilterForCourse } from "@/src/data/master/learnCourses";
import { getLessonsByTopic } from "@/src/data/master/learnLessons";
import { getTopicBySlug } from "@/src/data/master/learnTopics";
import { LearnLessonView } from "@/src/presentation/components/learn/LearnLessonView";
import { createServerCourseDetailPresenter } from '@/src/presentation/presenters/course-detail/CourseDetailPresenterServerFactory';
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string; topic: string; lesson: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, topic: topicSlug, lesson: lessonSlug } = await params;
  const presenter = await createServerCourseDetailPresenter();
  const viewModel = await presenter.getViewModel(id);
  
  if (!viewModel || !viewModel.course.interactiveLabSlug) {
    return { title: "Not Found" };
  }

  const courseSlug = viewModel.course.interactiveLabSlug;
  const course = getCourseBySlug(courseSlug);
  const topic = getTopicBySlug(topicSlug);
  
  if (!course || !topic) {
    return { title: "Not Found" };
  }

  const lessons = getLessonsByTopic(topic.id);
  const lesson = lessons.find(l => l.slug === lessonSlug);
  
  return {
    title: lesson ? `${lesson.titleTh} | Interactive Lab | Play Stack` : "Not Found",
    description: lesson?.description,
  };
}

export default async function LearnLessonPage({ params }: Props) {
  const { id, topic: topicSlug, lesson: lessonSlug } = await params;
  
  const presenter = await createServerCourseDetailPresenter();
  const viewModel = await presenter.getViewModel(id);
  
  if (!viewModel || !viewModel.course.hasInteractiveLab || !viewModel.course.interactiveLabSlug) {
    notFound();
  }

  const courseSlug = viewModel.course.interactiveLabSlug;
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
