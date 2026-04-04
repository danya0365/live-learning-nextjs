"use client";

import { LearnCourse, LearnLesson, LearnTopic } from "@/src/domain/types/learn-content";
import { useStaticLearnContentPresenter } from "@/src/presentation/presenters/learn-content/useStaticLearnContentPresenter";
import { useLearnModeStore } from "@/src/presentation/stores/learnModeStore";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LearnCinemaView } from "./LearnCinemaView";
import { LearnFocusView } from "./LearnFocusView";
import { LearnLabView } from "./LearnLabView";
import { LearnModeSwitcher } from "./LearnModeSwitcher";
import { LearnPodcastView } from "./LearnPodcastView";
import { LearnPresentationView } from "./LearnPresentationView";

interface LearnCourseViewProps {
  courseId: string;
  courseType: string;
}

export function MainLearnCourseView({ courseId, courseType }: LearnCourseViewProps) {
  const { isLessonComplete } = useProgressStore();
  const { viewMode } = useLearnModeStore();

  const presenter = useStaticLearnContentPresenter();
  
  const [data, setData] = useState<{
    course: LearnCourse | null;
    topics: LearnTopic[];
    lessonsByTopic: Record<string, LearnLesson[]>;
    loading: boolean;
  }>({
    course: null,
    topics: [],
    lessonsByTopic: {},
    loading: true
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [course, topics] = await Promise.all([
          presenter.getCourseBySlug(courseType),
          presenter.getTopicsForCourse(courseType)
        ]);
        
        const lessonsByTopic: Record<string, LearnLesson[]> = {};
        if (topics) {
          for (const topic of topics) {
            lessonsByTopic[topic.id] = await presenter.getLessonsByTopic(topic.id);
          }
        }

        setData({
          course: course || null,
          topics: topics || [],
          lessonsByTopic,
          loading: false
        });
      } catch(e) {
        console.error(e);
        setData(prev => ({...prev, loading: false}));
      }
    }
    loadData();
  }, [presenter, courseType]);

  const { course, topics, lessonsByTopic, loading } = data;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getTopicProgress = (topicId: string) => {
    const lessons = lessonsByTopic[topicId] || [];
    const completed = lessons.filter(l => isLessonComplete(l.id)).length;
    return { completed, total: lessons.length };
  };

  const getTotalProgress = () => {
    let completed = 0;
    let total = 0;
    topics.forEach(topic => {
      const lessons = lessonsByTopic[topic.id] || [];
      completed += lessons.filter(l => isLessonComplete(l.id)).length;
      total += lessons.length;
    });
    return { completed, total };
  };

  const totalProgress = getTotalProgress();
  const brandColor = course?.color || "indigo";

  // Render special modes
  if (viewMode === "focus") {
    return <LearnFocusView courseSlug={courseType} />;
  }

  if (viewMode === "presentation") {
    return <LearnPresentationView courseSlug={courseType} />;
  }

  if (viewMode === "cinema") {
    return <LearnCinemaView courseSlug={courseType} />;
  }

  if (viewMode === "podcast") {
    return <LearnPodcastView courseSlug={courseType} />;
  }

  if (viewMode === "lab") {
    return <LearnLabView courseSlug={courseType} />;
  }

  // Normal mode
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href={`/courses/${courseId}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">Course Detail</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{course?.title || courseType}</span>
      </div>

      {/* Mode Switcher */}
      <div className="mb-6 flex justify-center">
        <LearnModeSwitcher brandColor={brandColor as "yellow" | "blue" | "cyan" | "orange"} hasLab={course?.hasLab} />
      </div>

      {/* Header */}
      <div className={`bg-gradient-to-r ${course?.bgGradient || "from-indigo-600 to-purple-600"} rounded-2xl p-6 mb-8`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 bg-${brandColor}-500 rounded-2xl flex items-center justify-center text-2xl font-bold ${brandColor === "yellow" ? "text-black" : "text-white"} shadow-lg`}>
            {course?.icon || "??"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {course?.title || courseType}
            </h1>
            <p className="text-white/80">
              {course?.descriptionTh || ""}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80">ความคืบหน้า</span>
          <span className="text-white font-medium">
            {totalProgress.completed}/{totalProgress.total} บทเรียน
          </span>
        </div>
        <div className="h-3 bg-black/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${totalProgress.total > 0 ? (totalProgress.completed / totalProgress.total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Topics */}
      <div className="space-y-4">
        {topics.map((topic) => {
          const progress = getTopicProgress(topic.id);
          const progressPercent = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
          const isComplete = progress.completed === progress.total && progress.total > 0;

          return (
            <Link
              key={topic.id}
              href={`/courses/${courseId}/learn/${topic.slug}`}
              className={`block p-6 rounded-2xl border transition-all hover:scale-[1.01] ${
                isComplete
                  ? "bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-500/50"
                  : `bg-white/80 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700/50 hover:border-${brandColor}-400 dark:hover:border-${brandColor}-500/50`
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-2xl`}>
                    {topic.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {isComplete && "✅ "}{topic.titleTh}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{topic.descriptionTh}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {progress.completed}/{progress.total}
                  </span>
                </div>
              </div>

              <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isComplete
                      ? "bg-green-500"
                      : `bg-gradient-to-r ${course?.bgGradient || "from-indigo-500 to-purple-500"}`
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Back Link */}
      <div className="mt-8">
        <Link 
          href={`/courses/${courseId}`} 
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors inline-flex items-center gap-2 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> กลับหน้าคอร์สเรียน
        </Link>
      </div>
    </div>
  );
}
