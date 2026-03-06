"use client";

import { LearnCourse, LearnLesson, LearnTopic } from "@/src/domain/types/learn-content";
import { useStaticLearnContentPresenter } from "@/src/presentation/presenters/learn-content/useStaticLearnContentPresenter";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LearnTopicViewProps {
  courseId: string;
  topicSlug: string;
  courseSlug: string;
}

export function MainLearnTopicView({ courseId, topicSlug, courseSlug }: LearnTopicViewProps) {
  const { isLessonComplete } = useProgressStore();
  const presenter = useStaticLearnContentPresenter();
  
  const [data, setData] = useState<{
    course: LearnCourse | null;
    topic: LearnTopic | null;
    lessons: LearnLesson[];
    loading: boolean;
  }>({
    course: null,
    topic: null,
    lessons: [],
    loading: true
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [course, topic] = await Promise.all([
          presenter.getCourseBySlug(courseSlug),
          presenter.getTopicBySlug(topicSlug)
        ]);
        
        const lessons = topic ? await presenter.getLessonsByTopic(topic.id) : [];

        setData({
          course: course || null,
          topic: topic || null,
          lessons,
          loading: false
        });
      } catch(e) {
        console.error(e);
        setData(prev => ({...prev, loading: false}));
      }
    }
    loadData();
  }, [presenter, courseSlug, topicSlug]);

  const { course, topic, lessons, loading } = data;

  const basePath = `/courses/${courseId}/learn/${topicSlug}`;
  const backPath = `/courses/${courseId}/learn`;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!topic || !course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">❌ ไม่พบหัวข้อนี้</h1>
        <Link href={`/courses/${courseId}/learn`} className="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 block">
          ← กลับไปหน้า Interactive Lab
        </Link>
      </div>
    );
  }

  const completedCount = lessons.filter(l => isLessonComplete(l.id)).length;
  
  // Dynamic color classes based on course
  const colorClasses: Record<string, { gradient: string; brand: string; text: string }> = {
    javascript: { gradient: "from-yellow-600 to-orange-600", brand: "yellow", text: "text-yellow-600 dark:text-yellow-400" },
    html: { gradient: "from-orange-600 to-red-600", brand: "orange", text: "text-orange-600 dark:text-orange-400" },
    go: { gradient: "from-cyan-600 to-teal-600", brand: "cyan", text: "text-cyan-600 dark:text-cyan-400" },
  };
  
  const colors = colorClasses[courseSlug] || colorClasses.javascript;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href={`/courses/${courseId}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">Course</Link>
        <span>/</span>
        <Link href={backPath} className={`hover:${colors.text}`}>{course.title}</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{topic.titleTh}</span>
      </div>

      {/* Header */}
      <div className={`bg-gradient-to-r ${colors.gradient} rounded-2xl p-6 mb-8`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-3xl`}>
            {topic.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{topic.titleTh}</h1>
            <p className="text-white/80">{topic.descriptionTh}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80">ความคืบหน้า</span>
          <span className="text-white font-medium">{completedCount}/{lessons.length}</span>
        </div>
        <div className="h-2 bg-black/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white"
            style={{ width: `${lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Lessons */}
      <div className="space-y-3">
        {lessons.map((lesson, index) => {
          const isComplete = isLessonComplete(lesson.id);
          const lessonPath = `${basePath}/${lesson.slug}`;
          
          return (
            <Link
              key={lesson.id}
              href={lessonPath}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01] ${
                isComplete
                  ? "bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-500/30"
                  : "bg-white/80 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700/50 hover:border-gray-400 dark:hover:border-slate-600"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                isComplete
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
              }`}>
                {isComplete ? "✓" : index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">{lesson.titleTh}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.description}</p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                {lesson.duration} นาที
              </div>
            </Link>
          );
        })}
      </div>

      {/* Back button */}
      <div className="mt-8">
        <Link
          href={backPath}
          className={`${colors.text} hover:opacity-80 transition-colors`}
        >
          ← กลับไปหน้า {course.title}
        </Link>
      </div>
    </div>
  );
}
