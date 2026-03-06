"use client";

import { LearnLesson, LearnTopic } from "@/src/domain/types/learn-content";
import { useStaticLearnContentPresenter } from "@/src/presentation/presenters/learn-content/useStaticLearnContentPresenter";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import Link from "next/link";
import { useEffect, useState } from "react";

export function LearnView() {
  const { isLessonComplete, totalPoints } = useProgressStore();

  const presenter = useStaticLearnContentPresenter();

  const [data, setData] = useState<{
    topics: LearnTopic[];
    lessonsByTopic: Record<string, LearnLesson[]>;
    loading: boolean;
  }>({
    topics: [],
    lessonsByTopic: {},
    loading: true
  });

  useEffect(() => {
    async function loadData() {
      try {
        const topics = await presenter.getAllTopics();
        const lessonsByTopic: Record<string, LearnLesson[]> = {};
        for (const topic of topics) {
          lessonsByTopic[topic.id] = await presenter.getLessonsByTopic(topic.id);
        }
        setData({ topics, lessonsByTopic, loading: false });
      } catch (e) {
        console.error(e);
        setData(prev => ({...prev, loading: false}));
      }
    }
    loadData();
  }, [presenter]);

  const { topics, lessonsByTopic, loading } = data;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">📖 Learn JavaScript</h1>
        <p className="text-gray-400">
          เรียนรู้ JavaScript จากพื้นฐานจนถึงขั้นสูง พร้อม Interactive Examples
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold">🎯 ความคืบหน้าทั้งหมด</h3>
            <p className="text-indigo-200 text-sm">
              {totalProgress.completed}/{totalProgress.total} บทเรียน • {totalPoints} Points
            </p>
          </div>
          <div className="text-3xl font-bold text-white">
            {totalProgress.total > 0 
              ? Math.round((totalProgress.completed / totalProgress.total) * 100) 
              : 0}%
          </div>
        </div>
        <div className="h-3 bg-indigo-900/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all"
            style={{ 
              width: `${totalProgress.total > 0 
                ? (totalProgress.completed / totalProgress.total) * 100 
                : 0}%` 
            }}
          />
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid gap-4">
        {topics.map((topic) => {
          const progress = getTopicProgress(topic.id);
          const progressPercent = progress.total > 0 
            ? (progress.completed / progress.total) * 100 
            : 0;
          const isComplete = progress.completed === progress.total && progress.total > 0;

          return (
            <Link
              key={topic.id}
              href={`/learn/${topic.slug}`}
              className={`block p-6 rounded-2xl border transition-all hover:scale-[1.02] ${
                isComplete
                  ? "bg-green-900/20 border-green-500/50"
                  : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-2xl`}>
                    {topic.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {isComplete && "✅ "}{topic.titleTh}
                    </h3>
                    <p className="text-sm text-gray-400">{topic.descriptionTh}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-400">
                    {progress.completed}/{progress.total}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isComplete
                      ? "bg-green-500"
                      : "bg-gradient-to-r from-indigo-500 to-purple-500"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="mt-8 flex gap-4">
        <Link
          href="/playground"
          className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-center transition-colors"
        >
          🎮 Playground
        </Link>
        <Link
          href="/courses"
          className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-center transition-colors"
        >
          📚 Game Courses
        </Link>
      </div>
    </div>
  );
}
