"use client";

import { getTopicFilterForCourse, learnCourses } from "@/src/data/master/learnCourses";
import { getLessonsByTopic, learnLessons } from "@/src/data/master/learnLessons";
import { learnTopics } from "@/src/data/master/learnTopics";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import Link from "next/link";

export function MainLearnLandingView() {
  const { isLessonComplete } = useProgressStore();

  const getProgressForCourse = (courseSlug: string) => {
    const topicFilter = getTopicFilterForCourse(courseSlug);
    const courseTopics = learnTopics.filter(t => topicFilter(t.id));
    let completed = 0;
    let total = 0;
    courseTopics.forEach(topic => {
      const lessons = getLessonsByTopic(topic.id);
      completed += lessons.filter(l => isLessonComplete(l.id)).length;
      total += lessons.length;
    });
    return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const totalProgress = (() => {
    let completed = 0;
    let total = 0;
    learnCourses.forEach(course => {
      const progress = getProgressForCourse(course.slug);
      completed += progress.completed;
      total += progress.total;
    });
    return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  })();

  const getCourseTopics = (courseSlug: string) => {
    const filter = getTopicFilterForCourse(courseSlug);
    return learnTopics.filter(t => filter(t.id));
  };

  const courseColors: Record<string, { bg: string; border: string; text: string; progress: string; hover: string; shadow: string }> = {
    javascript: {
      bg: "from-yellow-50 to-orange-50 dark:from-yellow-500/10 dark:to-orange-500/10",
      border: "border-yellow-200 dark:border-yellow-500/20 hover:border-yellow-400 dark:hover:border-yellow-500/40",
      text: "text-yellow-600 dark:text-yellow-400",
      progress: "from-yellow-500 to-orange-500",
      hover: "group-hover:text-yellow-600 dark:group-hover:text-yellow-400",
      shadow: "shadow-yellow-500/30",
    },
    html: {
      bg: "from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10",
      border: "border-orange-200 dark:border-orange-500/20 hover:border-orange-400 dark:hover:border-orange-500/40",
      text: "text-orange-600 dark:text-orange-400",
      progress: "from-orange-500 to-red-500",
      hover: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
      shadow: "shadow-orange-500/30",
    },
    go: {
      bg: "from-cyan-50 to-teal-50 dark:from-cyan-500/10 dark:to-teal-500/10",
      border: "border-cyan-200 dark:border-cyan-500/20 hover:border-cyan-400 dark:hover:border-cyan-500/40",
      text: "text-cyan-600 dark:text-cyan-400",
      progress: "from-cyan-500 to-teal-500",
      hover: "group-hover:text-cyan-600 dark:group-hover:text-cyan-400",
      shadow: "shadow-cyan-500/30",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-white dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900">
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20" />
          <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-16 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-300 text-sm mb-6">
              <span>🎓</span>
              <span>Interactive Learning Platform</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              เรียนรู้การเขียนโปรแกรม
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              เลือกภาษาที่ต้องการเรียนรู้ พร้อม Interactive Code Editor และ Challenges
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-12">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur rounded-xl p-4 text-center border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{learnLessons.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">บทเรียน</div>
            </div>
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur rounded-xl p-4 text-center border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{learnCourses.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">คอร์ส</div>
            </div>
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur rounded-xl p-4 text-center border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{totalProgress.percent}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">เรียนแล้ว</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>ความคืบหน้ารวม</span>
              <span>{totalProgress.completed}/{totalProgress.total} บทเรียน</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 via-cyan-500 to-blue-500 transition-all"
                style={{ width: `${totalProgress.percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Cards - Dynamic */}
      <div className="max-w-6xl mx-auto px-4 py-12 -mt-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learnCourses.map(course => {
            const progress = getProgressForCourse(course.slug);
            const topics = getCourseTopics(course.slug);
            const colors = courseColors[course.slug] || courseColors.javascript;

            return (
              <Link key={course.id} href={`/learn/${course.slug}`} className="group">
                <div className={`relative bg-gradient-to-br ${colors.bg} rounded-3xl p-8 border ${colors.border} transition-all hover:scale-[1.02] overflow-hidden shadow-lg dark:shadow-none h-full`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-10 rounded-full blur-3xl" />
                  
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${course.bgGradient} rounded-2xl flex items-center justify-center text-3xl shadow-lg ${colors.shadow}`}>
                      {course.icon}
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${colors.text}`}>{progress.percent}%</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{progress.completed}/{progress.total}</div>
                    </div>
                  </div>

                  <h2 className={`text-2xl font-bold text-gray-900 dark:text-white mb-2 ${colors.hover} transition-colors`}>
                    {course.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {topics.slice(0, 3).map(topic => (
                      <span key={topic.id} className={`px-3 py-1 bg-white/50 dark:bg-white/10 ${colors.text} rounded-full text-sm`}>
                        {topic.icon} {topic.titleTh}
                      </span>
                    ))}
                    {topics.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
                        +{topics.length - 3} อื่นๆ
                      </span>
                    )}
                  </div>

                  <div className="h-2 bg-gray-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${colors.progress}`} style={{ width: `${progress.percent}%` }} />
                  </div>

                  <div className={`mt-6 flex items-center ${colors.text} font-medium`}>
                    เริ่มเรียน {course.title}
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 dark:bg-slate-800/30 border-y border-gray-200 dark:border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-8">ทำไมต้องเรียนที่นี่?</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "💻", title: "Interactive Editor", desc: "เขียนโค้ดและรันได้ทันที" },
              { icon: "🎯", title: "Challenges", desc: "ฝึกฝนด้วยโจทย์ท้าทาย" },
              { icon: "📊", title: "Progress Tracking", desc: "ติดตามความก้าวหน้า" },
              { icon: "🎮", title: "Game-Focused", desc: "ตัวอย่างจากการพัฒนาเกม" },
            ].map((feature, i) => (
              <div key={i} className="text-center p-4 bg-white dark:bg-transparent rounded-xl shadow-sm dark:shadow-none">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">พร้อมเริ่มเรียนแล้วหรือยัง?</h3>
        <div className="flex justify-center gap-4 flex-wrap">
          {learnCourses.slice(0, 2).map(course => {
            const colors = courseColors[course.slug] || courseColors.javascript;
            return (
              <Link
                key={course.id}
                href={`/learn/${course.slug}`}
                className={`px-6 py-3 bg-gradient-to-r ${course.bgGradient} text-white font-semibold rounded-xl transition-colors shadow-lg ${colors.shadow}`}
              >
                เริ่มจาก {course.title}
              </Link>
            );
          })}
          <Link href="/playground" className="px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-semibold rounded-xl transition-colors">
            🎮 ลองใน Playground
          </Link>
        </div>
      </div>
    </div>
  );
}
