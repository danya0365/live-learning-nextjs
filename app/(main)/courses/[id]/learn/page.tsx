import { LearnCourseView } from "@/src/presentation/components/learn/LearnCourseView";
import { createServerCourseDetailPresenter } from '@/src/presentation/presenters/course-detail/CourseDetailPresenterServerFactory';
import { createServerStaticLearnContentPresenter } from "@/src/presentation/presenters/learn-content/StaticLearnContentPresenterServerFactory";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const presenter = await createServerCourseDetailPresenter();
  return presenter.generateMetadata(id);
}

export default async function LearnCoursePage({ params }: Props) {
  const { id } = await params;
  const presenter = await createServerCourseDetailPresenter();
  const viewModel = await presenter.getViewModel(id);
  
  if (!viewModel || !viewModel.course.hasInteractiveLab || !viewModel.course.interactiveLabSlug) {
    notFound();
  }

  const courseSlug = viewModel.course.interactiveLabSlug;
  const learnPresenter = createServerStaticLearnContentPresenter();
  const course = await learnPresenter.getCourseBySlug(courseSlug);
  
  if (!course) {
    notFound();
  }

  return <LearnCourseView courseId={id} courseType={courseSlug} />;
}
