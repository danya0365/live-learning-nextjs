"use client";

import { getCourseBySlug } from "@/src/data/master/learnCourses";
import { getLessonsByTopic } from "@/src/data/master/learnLessons";
import { getTopicBySlug } from "@/src/data/master/learnTopics";
import { CodeEditor } from "@/src/presentation/components/editor/CodeEditor";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import Link from "next/link";
import { useEffect, useState } from "react";

// Quiz Section Component
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizSectionProps {
  quiz: QuizQuestion[];
  lessonId: string;
  onComplete: () => void;
}

function QuizSection({ quiz, lessonId, onComplete }: QuizSectionProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = () => {
    let correct = 0;
    quiz.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setShowResults(true);
    if (correct === quiz.length) {
      onComplete();
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const allAnswered = Object.keys(answers).length === quiz.length;

  return (
    <div className="bg-white/80 dark:bg-slate-800/50 rounded-2xl p-6 mb-6 border border-purple-200 dark:border-purple-500/30">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">❓ คำถามปิดท้าย</h3>
      
      <div className="space-y-6">
        {quiz.map((q, qIdx) => (
          <div key={qIdx} className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4">
            <p className="text-gray-900 dark:text-white font-medium mb-3">
              {qIdx + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oIdx) => {
                const isSelected = answers[qIdx] === oIdx;
                const isCorrect = q.correctAnswer === oIdx;
                const showCorrect = showResults && isCorrect;
                const showWrong = showResults && isSelected && !isCorrect;
                
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(qIdx, oIdx)}
                    disabled={showResults}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                      showCorrect
                        ? 'bg-green-600/30 border-2 border-green-500 text-green-300'
                        : showWrong
                          ? 'bg-red-600/30 border-2 border-red-500 text-red-300'
                          : isSelected
                            ? 'bg-purple-600/30 border-2 border-purple-500 text-purple-300'
                            : 'bg-gray-100 dark:bg-slate-700/50 hover:bg-gray-200 dark:hover:bg-slate-600/50 text-gray-700 dark:text-gray-300 border-2 border-transparent'
                    }`}
                  >
                    <span className="mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                    {opt}
                    {showCorrect && <span className="float-right">✓</span>}
                    {showWrong && <span className="float-right">✗</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        {!showResults ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              allAnswered
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            ✅ ตรวจคำตอบ
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <div className={`text-lg font-bold ${score === quiz.length ? 'text-green-400' : 'text-yellow-400'}`}>
              คะแนน: {score}/{quiz.length}
              {score === quiz.length && ' 🎉 ยอดเยี่ยม!'}
            </div>
            {score < quiz.length && (
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white rounded-lg"
              >
                🔄 ลองใหม่
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface LearnLessonViewProps {
  topicSlug: string;
  lessonSlug: string;
  courseSlug: string;
}

export function MainLearnLessonView({ topicSlug, lessonSlug, courseSlug }: LearnLessonViewProps) {
  const { isLessonComplete, markLessonComplete, totalPoints } = useProgressStore();
  const [isCompleted, setIsCompleted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const course = getCourseBySlug(courseSlug);
  const topic = getTopicBySlug(topicSlug);
  const lessons = topic ? getLessonsByTopic(topic.id) : [];
  const lesson = lessons.find(l => l.slug === lessonSlug);
  const lessonIndex = lessons.findIndex(l => l.slug === lessonSlug);
  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;

  const basePath = `/learn/${courseSlug}/${topicSlug}`;
  const topicPath = `/learn/${courseSlug}/${topicSlug}`;
  const coursePath = `/learn/${courseSlug}`;

  useEffect(() => {
    if (lesson) {
      setIsCompleted(isLessonComplete(lesson.id));
    }
  }, [lesson, isLessonComplete]);

  if (!topic || !lesson || !course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">❌ ไม่พบบทเรียนนี้</h1>
        <Link href="/learn" className="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 block">
          ← กลับไปหน้า Learn
        </Link>
      </div>
    );
  }

  const handleComplete = () => {
    markLessonComplete(lesson.id);
    setIsCompleted(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Simple markdown renderer - with light/dark mode support
  const renderContent = (content: string) => {
    return content
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-indigo-600 dark:text-indigo-400">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-sm text-pink-600 dark:text-pink-400">$1</code>')
      .replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        '<pre class="bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm border border-gray-200 dark:border-slate-700"><code>$2</code></pre>'
      )
      .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-700 dark:text-gray-300">• $1</li>')
      .replace(/\n\n/g, "</p><p class='mb-3 text-gray-700 dark:text-gray-300'>");
  };

  // Dynamic colors based on course
  const colorClasses: Record<string, { gradient: string; btn: string; text: string }> = {
    javascript: { gradient: "from-yellow-600 to-orange-600", btn: "bg-yellow-600 hover:bg-yellow-700", text: "text-yellow-600 dark:text-yellow-400" },
    html: { gradient: "from-orange-600 to-red-600", btn: "bg-orange-600 hover:bg-orange-700", text: "text-orange-600 dark:text-orange-400" },
    go: { gradient: "from-cyan-600 to-teal-600", btn: "bg-cyan-600 hover:bg-cyan-700", text: "text-cyan-600 dark:text-cyan-400" },
  };
  const colors = colorClasses[courseSlug] || colorClasses.javascript;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg animate-pulse">
          <div className="font-bold">🎉 เรียนจบแล้ว!</div>
          <div className="text-sm">+10 Points • รวม {totalPoints + 10} pts</div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
        <Link href="/learn" className="hover:text-indigo-600 dark:hover:text-indigo-400">Learn</Link>
        <span>/</span>
        <Link href={coursePath} className={`hover:${colors.text}`}>{course.title}</Link>
        <span>/</span>
        <Link href={topicPath} className={`hover:${colors.text}`}>{topic.titleTh}</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{lesson.titleTh}</span>
      </div>

      {/* Header */}
      <div className={`bg-gradient-to-r ${colors.gradient} rounded-2xl p-6 mb-6`}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              📖 {lesson.titleTh}
            </h1>
            <div className="flex items-center gap-4 text-sm text-white/80">
              <span>⏱️ {lesson.duration} นาที</span>
              <span>📚 บทที่ {lesson.order}</span>
            </div>
          </div>
          {isCompleted && (
            <span className="px-3 py-1 bg-green-600/40 text-green-200 rounded-full text-sm">
              ✅ เรียนจบแล้ว
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/80 dark:bg-slate-800/50 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-slate-700">
        <div 
          className="prose prose-gray dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderContent(lesson.content) }}
        />
      </div>

      {/* Code Example */}
      {lesson.codeExample && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">💻 ลองเขียนโค้ด</h3>
          <CodeEditor
            initialCode={lesson.codeExample}
            title="ตัวอย่างโค้ด"
            storageKey={`learn-${lesson.id}`}
          />
        </div>
      )}

      {/* Challenge */}
      {lesson.challenge && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🎯 Challenge</h3>
          <CodeEditor
            initialCode={lesson.challenge.starterCode}
            title={lesson.challenge.description}
            description={lesson.challenge.description}
            expectedOutput={lesson.challenge.expectedOutput}
            hints={lesson.challenge.hints}
            storageKey={`learn-challenge-${lesson.id}`}
            onComplete={handleComplete}
          />
        </div>
      )}

      {/* Quiz */}
      {lesson.quiz && lesson.quiz.length > 0 && (
        <QuizSection 
          quiz={lesson.quiz} 
          lessonId={lesson.id}
          onComplete={handleComplete}
        />
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
        <div>
          {prevLesson ? (
            <Link
              href={`${basePath}/${prevLesson.slug}`}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white rounded-lg transition-colors"
            >
              ← {prevLesson.titleTh}
            </Link>
          ) : (
            <Link
              href={topicPath}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white rounded-lg transition-colors"
            >
              ← กลับ
            </Link>
          )}
        </div>

        <div className="flex gap-2">
          {!isCompleted && (
            <button
              onClick={handleComplete}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              ✅ เรียนจบแล้ว (+10 pts)
            </button>
          )}
          {nextLesson ? (
            <Link
              href={`${basePath}/${nextLesson.slug}`}
              className={`px-4 py-2 ${colors.btn} text-white rounded-lg transition-colors`}
            >
              {nextLesson.titleTh} →
            </Link>
          ) : (
            <Link
              href={topicPath}
              className={`px-4 py-2 ${colors.btn} text-white rounded-lg transition-colors`}
            >
              เรียนจบหัวข้อ ✓
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
