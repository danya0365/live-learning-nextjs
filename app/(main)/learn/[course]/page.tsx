import { getCourseBySlug, learnCourses } from "@/src/data/master/learnCourses";
import { LearnCourseView } from "@/src/presentation/components/learn/LearnCourseView";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ course: string }>;
}

export async function generateStaticParams() {
  return learnCourses.map((course) => ({ course: course.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  
  if (!course) {
    return { title: "Not Found" };
  }

  return {
    title: `Learn ${course.title} | Play Stack`,
    description: course.descriptionTh,
  };
}

export default async function LearnCoursePage({ params }: Props) {
  const { course: courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  
  if (!course) {
    notFound();
  }

  return <LearnCourseView courseType={courseSlug as "javascript" | "typescript"} />;
}
