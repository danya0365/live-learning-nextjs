import { LearnTopicView } from "@/src/presentation/components/learn/LearnTopicView";
import { createServerCourseDetailPresenter } from '@/src/presentation/presenters/course-detail/CourseDetailPresenterServerFactory';
import { createServerStaticLearnContentPresenter } from "@/src/presentation/presenters/learn-content/StaticLearnContentPresenterServerFactory";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string; topic: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, topic: topicSlug } = await params;
  const presenter = await createServerCourseDetailPresenter();
  const viewModel = await presenter.getViewModel(id);
  
  if (!viewModel || !viewModel.course.interactiveLabSlug) {
    return { title: "Not Found" };
  }

  const courseSlug = viewModel.course.interactiveLabSlug;
  const learnPresenter = createServerStaticLearnContentPresenter();
  const course = await learnPresenter.getCourseBySlug(courseSlug);
  const topic = await learnPresenter.getTopicBySlug(topicSlug);
  
  if (!course || !topic) {
    return { title: "Not Found" };
  }

  return {
    title: `${topic.titleTh} | ${course.title} | Play Stack`,
    description: topic.descriptionTh,
  };
}

export default async function LearnTopicPage({ params }: Props) {
  const { id, topic: topicSlug } = await params;
  
  const presenter = await createServerCourseDetailPresenter();
  const viewModel = await presenter.getViewModel(id);
  
  if (!viewModel || !viewModel.course.hasInteractiveLab || !viewModel.course.interactiveLabSlug) {
    notFound();
  }

  const courseSlug = viewModel.course.interactiveLabSlug;
  const learnPresenter = createServerStaticLearnContentPresenter();
  const course = await learnPresenter.getCourseBySlug(courseSlug);
  const topic = await learnPresenter.getTopicBySlug(topicSlug);
  
  if (!course || !topic) {
    notFound();
  }

  // Validate that topic belongs to this course
  const topics = await learnPresenter.getTopicsForCourse(courseSlug);
  if (!topics.find(t => t.id === topic.id)) {
    notFound();
  }

  return <LearnTopicView courseId={id} topicSlug={topicSlug} courseSlug={courseSlug} />;
}
