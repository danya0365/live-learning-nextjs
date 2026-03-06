"use client";

import { getCourseBySlug, getTopicFilterForCourse } from "@/src/data/master/learnCourses";
import { LearnLesson, getLessonsByTopic } from "@/src/data/master/learnLessons";
import { LearnTopic, learnTopics } from "@/src/data/master/learnTopics";
import { CodeEditor } from "@/src/presentation/components/editor/CodeEditor";
import { useLearnModeStore } from "@/src/presentation/stores/learnModeStore";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface LearnFocusViewProps {
  courseSlug: string;
}

interface LessonWithTopic {
  lesson: LearnLesson;
  topic: LearnTopic;
  globalIndex: number;
}

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
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-purple-500/30">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        ❓ คำถามปิดท้าย
      </h3>
      
      <div className="space-y-6">
        {quiz.map((q, qIdx) => (
          <div key={qIdx} className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-white font-medium mb-3">
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
                            : 'bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 border-2 border-transparent'
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

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between">
        {!showResults ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              allAnswered
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-slate-700 text-gray-500 cursor-not-allowed'
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
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
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

export function LearnFocusView({ courseSlug }: LearnFocusViewProps) {
  const { setViewMode, reset, currentLessonIndex, setLessonIndex } = useLearnModeStore();
  const { markLessonComplete, isLessonComplete, totalPoints } = useProgressStore();

  const course = getCourseBySlug(courseSlug);
  const colorMap: Record<string, "yellow" | "blue" | "cyan" | "orange"> = {
    javascript: "yellow",
    typescript: "blue",
    html: "orange",
    go: "cyan",
  };
  const brandColor = colorMap[courseSlug] || "yellow";

  // Toast state for completion message
  const [showToast, setShowToast] = useState(false);

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  
  // Refs for scrolling
  const lessonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const contentRef = useRef<HTMLDivElement>(null);

  // Get topics dynamically based on course
  const topics = useMemo(() => {
    const topicFilter = getTopicFilterForCourse(courseSlug);
    return learnTopics.filter(t => topicFilter(t.id));
  }, [courseSlug]);

  // Get all lessons with their topics
  const lessonsWithTopics = useMemo(() => {
    const result: LessonWithTopic[] = [];
    let globalIndex = 0;
    
    topics.forEach(topic => {
      const topicLessons = getLessonsByTopic(topic.id);
      topicLessons.forEach(lesson => {
        result.push({ lesson, topic, globalIndex });
        globalIndex++;
      });
    });
    return result;
  }, [topics]);

  const currentLessonInfo = lessonsWithTopics[currentLessonIndex];
  const currentLesson = currentLessonInfo?.lesson;
  const currentTopic = currentLessonInfo?.topic;
  const totalLessons = lessonsWithTopics.length;

  // Auto-expand topic and scroll to lesson when index changes
  useEffect(() => {
    if (currentLessonInfo) {
      setExpandedTopics(prev => ({
        ...prev,
        [currentLessonInfo.topic.id]: true
      }));
      
      // Scroll to lesson in sidebar
      if (!sidebarCollapsed) {
        setTimeout(() => {
          const el = lessonRefs.current.get(currentLessonInfo.lesson.id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }

      // Scroll content to top
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentLessonIndex, currentLessonInfo, sidebarCollapsed]);

  // Select lesson
  const handleSelectLesson = useCallback((lessonWithTopic: LessonWithTopic) => {
    setLessonIndex(lessonWithTopic.globalIndex);
  }, [setLessonIndex]);

  // Register lesson ref
  const setLessonRef = useCallback((lessonId: string, el: HTMLButtonElement | null) => {
    if (el) {
      lessonRefs.current.set(lessonId, el);
    } else {
      lessonRefs.current.delete(lessonId);
    }
  }, []);

  // Toggle topic expansion
  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  // Navigation
  const goToPrevious = useCallback(() => {
    if (currentLessonIndex > 0) {
      setLessonIndex(currentLessonIndex - 1);
    }
  }, [currentLessonIndex, setLessonIndex]);

  const goToNext = useCallback(() => {
    if (currentLessonIndex < totalLessons - 1) {
      setLessonIndex(currentLessonIndex + 1);
    }
  }, [currentLessonIndex, totalLessons, setLessonIndex]);

  // Mark complete and go next
  const handleCompleteAndNext = () => {
    if (currentLesson) {
      markLessonComplete(currentLesson.id);
      goToNext();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        reset();
        setViewMode("normal");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [reset, setViewMode]);

  // Exit focus mode
  const handleExit = () => {
    reset();
    setViewMode("normal");
  };

  const progressPercent = totalLessons > 0 ? ((currentLessonIndex + 1) / totalLessons) * 100 : 0;
  const isFirstLesson = currentLessonIndex === 0;
  const isLastLesson = currentLessonIndex === totalLessons - 1;

  const colorClasses = {
    yellow: {
      gradient: "from-yellow-600 to-orange-600",
      bg: "bg-yellow-500",
      text: "text-yellow-400",
      border: "border-yellow-500",
      activeBg: "bg-yellow-500/20",
      buttonGradient: "from-yellow-500 to-orange-500",
    },
    blue: {
      gradient: "from-blue-600 to-indigo-600",
      bg: "bg-blue-500",
      text: "text-blue-400",
      border: "border-blue-500",
      activeBg: "bg-blue-500/20",
      buttonGradient: "from-blue-500 to-indigo-500",
    },
    cyan: {
      gradient: "from-cyan-600 to-teal-600",
      bg: "bg-cyan-500",
      text: "text-cyan-400",
      border: "border-cyan-500",
      activeBg: "bg-cyan-500/20",
      buttonGradient: "from-cyan-500 to-teal-500",
    },
    orange: {
      gradient: "from-orange-600 to-red-600",
      bg: "bg-orange-500",
      text: "text-orange-400",
      border: "border-orange-500",
      activeBg: "bg-orange-500/20",
      buttonGradient: "from-orange-500 to-red-500",
    },
  };

  const colors = colorClasses[brandColor] || colorClasses.yellow;

  // Render content from markdown
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeBlockLines: string[] = [];
    let codeLanguage = '';
    const elements: React.ReactElement[] = [];

    lines.forEach((line, i) => {
      // Code block start
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
          codeBlockLines = [];
        } else {
          // Code block end
          inCodeBlock = false;
          elements.push(
            <pre key={`code-${i}`} className="bg-slate-900 rounded-lg p-4 overflow-x-auto my-4">
              <code className="text-sm text-green-400 font-mono whitespace-pre">
                {codeBlockLines.join('\n')}
              </code>
            </pre>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockLines.push(line);
        return;
      }

      // Headings
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-2xl font-bold text-white mt-8 mb-4">
            {line.slice(3)}
          </h2>
        );
        return;
      }
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-xl font-semibold text-white mt-6 mb-3">
            {line.slice(4)}
          </h3>
        );
        return;
      }

      // Bullet points
      if (line.startsWith('- ')) {
        elements.push(
          <li key={i} className="text-gray-300 ml-4 mb-1">
            {renderInlineCode(line.slice(2))}
          </li>
        );
        return;
      }

      // Regular text with inline code
      if (line.trim()) {
        elements.push(
          <p key={i} className="text-gray-300 mb-3">
            {renderInlineCode(line)}
          </p>
        );
      }
    });

    return elements;
  };

  const renderInlineCode = (text: string) => {
    const parts = text.split(/(`[^`]+`)/);
    return parts.map((part, i) =>
      part.startsWith('`') ? (
        <code key={i} className="px-1.5 py-0.5 bg-slate-700 rounded text-yellow-300 font-mono text-sm">
          {part.slice(1, -1)}
        </code>
      ) : (
        part
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-900">
      {/* Left Sidebar */}
      <aside 
        className={`flex-shrink-0 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-80'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <h2 className="font-bold text-white flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <span>Focus Mode</span>
          </h2>
          <button
            onClick={handleExit}
            className="text-gray-400 hover:text-white transition-colors"
            title="ออกจาก Focus Mode"
          >
            ✕
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="px-4 py-2 border-b border-slate-700 bg-slate-900/30">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>ความคืบหน้า</span>
            <span>{currentLessonIndex + 1} / {totalLessons}</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${colors.gradient} transition-all duration-300`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        
        {/* Topics & Lessons Tree */}
        <div className="flex-1 overflow-y-auto">
          {topics.map((topic) => {
            const topicLessons = lessonsWithTopics.filter(l => l.topic.id === topic.id);
            const isExpanded = expandedTopics[topic.id];
            const completedCount = topicLessons.filter(l => isLessonComplete(l.lesson.id)).length;

            return (
              <div key={topic.id} className="border-b border-slate-700/50">
                {/* Topic Header */}
                <button
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-slate-700/50 transition-colors text-left"
                >
                  <span className={`text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                  <span className="text-lg">{topic.icon}</span>
                  <span className="flex-1 text-sm font-medium text-gray-200 truncate">
                    {topic.titleTh}
                  </span>
                  <span className="text-xs text-gray-400">{completedCount}/{topicLessons.length}</span>
                </button>

                {/* Lessons */}
                {isExpanded && (
                  <div className="bg-slate-900/30">
                    {topicLessons.map((lessonWithTopic) => {
                      const isComplete = isLessonComplete(lessonWithTopic.lesson.id);
                      const isSelected = currentLessonIndex === lessonWithTopic.globalIndex;
                      
                      return (
                        <button
                          key={lessonWithTopic.lesson.id}
                          ref={(el) => setLessonRef(lessonWithTopic.lesson.id, el)}
                          onClick={() => handleSelectLesson(lessonWithTopic)}
                          className={`w-full pl-10 pr-4 py-2 flex items-center gap-2 transition-colors text-left ${
                            isSelected 
                              ? `${colors.activeBg} border-l-2 ${colors.border}` 
                              : 'hover:bg-slate-700/30'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                            isComplete 
                              ? 'bg-green-500 text-white' 
                              : isSelected
                                ? `${colors.bg} text-white`
                                : 'border border-gray-500'
                          }`}>
                            {isComplete ? '✓' : isSelected ? '●' : ''}
                          </span>
                          <span className={`flex-1 text-xs truncate ${
                            isSelected 
                              ? `${colors.text} font-medium` 
                              : 'text-gray-400'
                          }`}>
                            {lessonWithTopic.lesson.titleTh}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setSidebarCollapsed(prev => !prev)}
        className="absolute top-1/2 -translate-y-1/2 z-10 w-6 h-12 bg-slate-700 hover:bg-slate-600 rounded-r-lg flex items-center justify-center transition-all"
        style={{ left: sidebarCollapsed ? 0 : '320px' }}
      >
        <span className={`text-xs text-white transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`}>▶</span>
      </button>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div>
            {currentLesson && (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <span>{currentTopic?.icon}</span>
                  <span>{currentTopic?.titleTh}</span>
                </div>
                <h1 className="text-xl font-bold text-white">
                  {currentLesson.titleTh}
                </h1>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExit}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
            >
              ออก
            </button>
          </div>
        </header>

        {/* Toast for completion */}
        {showToast && (
          <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg animate-pulse">
            <div className="font-bold">🎉 เรียนจบแล้ว!</div>
            <div className="text-sm">+10 Points • รวม {totalPoints + 10} pts</div>
          </div>
        )}

        {/* Lesson Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-6">
          {currentLesson ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Main Content */}
              <div className="bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-slate-700">
                {renderContent(currentLesson.content)}
              </div>

              {/* Code Example Section */}
              {currentLesson.codeExample && (
                <div className="bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    💻 ลองเขียนโค้ด
                  </h3>
                  <CodeEditor
                    initialCode={currentLesson.codeExample}
                    title="ตัวอย่างโค้ด"
                    storageKey={`learn-focus-${currentLesson.id}`}
                  />
                </div>
              )}

              {/* Challenge Section */}
              {currentLesson.challenge && (
                <div className="bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-yellow-500/30">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    🎯 Challenge
                  </h3>
                  <CodeEditor
                    initialCode={currentLesson.challenge.starterCode}
                    title={currentLesson.challenge.description}
                    description={currentLesson.challenge.description}
                    expectedOutput={currentLesson.challenge.expectedOutput}
                    hints={currentLesson.challenge.hints}
                    storageKey={`learn-challenge-focus-${currentLesson.id}`}
                    onComplete={() => {
                      markLessonComplete(currentLesson.id);
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 3000);
                    }}
                  />
                </div>
              )}

              {/* Quiz Section */}
              {currentLesson.quiz && currentLesson.quiz.length > 0 && (
                <QuizSection 
                  quiz={currentLesson.quiz} 
                  lessonId={currentLesson.id}
                  onComplete={() => {
                    markLessonComplete(currentLesson.id);
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                  }}
                />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">👈</div>
                <p>เลือกบทเรียนจากเมนูด้านซ้าย</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <footer className="flex-shrink-0 px-6 py-4 bg-slate-800 border-t border-slate-700">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              disabled={isFirstLesson}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isFirstLesson
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-300 hover:bg-slate-700'
              }`}
            >
              <span>←</span>
              <span>ก่อนหน้า</span>
            </button>

            {/* Center - Complete & Next */}
            <div className="flex items-center gap-3">
              {currentLesson && !isLessonComplete(currentLesson.id) && !isLastLesson && (
                <button
                  onClick={handleCompleteAndNext}
                  className={`px-6 py-2.5 bg-gradient-to-r ${colors.buttonGradient} hover:opacity-90 ${brandColor === 'yellow' || brandColor === 'cyan' ? 'text-black' : 'text-white'} rounded-lg font-medium transition-all shadow-lg`}
                >
                  ✓ เรียนจบ → ถัดไป
                </button>
              )}
              {currentLesson && !isLessonComplete(currentLesson.id) && isLastLesson && (
                <button
                  onClick={() => markLessonComplete(currentLesson.id)}
                  className={`px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all shadow-lg`}
                >
                  ✓ เรียนจบหลักสูตร! 🎉
                </button>
              )}
              {currentLesson && isLessonComplete(currentLesson.id) && (
                <span className="text-green-500 font-medium">✓ เรียนจบแล้ว</span>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNext}
              disabled={isLastLesson}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isLastLesson
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-300 hover:bg-slate-700'
              }`}
            >
              <span>ถัดไป</span>
              <span>→</span>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
