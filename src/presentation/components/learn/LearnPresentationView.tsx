"use client";

import { getCourseBySlug, getTopicFilterForCourse } from "@/src/data/master/learnCourses";
import { LearnLesson, getLessonsByTopic } from "@/src/data/master/learnLessons";
import { LearnTopic, learnTopics } from "@/src/data/master/learnTopics";
import { useLearnModeStore } from "@/src/presentation/stores/learnModeStore";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface LearnPresentationViewProps {
  courseSlug: string;
}

interface Slide {
  title: string;
  content: string;
  lessonTitle: string;
  lessonId: string;
  lessonIndex: number;
  topicTitle: string;
}

interface LessonWithTopic {
  lesson: LearnLesson;
  topic: LearnTopic;
  globalIndex: number;
  startSlideIndex: number;
}

export function LearnPresentationView({ courseSlug }: LearnPresentationViewProps) {
  const { currentSlideIndex, setSlideIndex, nextSlide, prevSlide, setViewMode, reset } = useLearnModeStore();
  const { markLessonComplete, isLessonComplete } = useProgressStore();

  const course = getCourseBySlug(courseSlug);
  const colorMap: Record<string, "yellow" | "blue" | "cyan" | "orange"> = {
    javascript: "yellow",
    typescript: "blue",
    html: "orange",
    go: "cyan",
  };
  const brandColor = colorMap[courseSlug] || "yellow";

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  
  // Refs for scrolling
  const lessonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Get topics dynamically based on course
  const topics = useMemo(() => {
    const topicFilter = getTopicFilterForCourse(courseSlug);
    return learnTopics.filter(t => topicFilter(t.id));
  }, [courseSlug]);

  // Get all lessons with their topics
  const lessonsWithTopics = useMemo(() => {
    const result: LessonWithTopic[] = [];
    let globalIndex = 0;
    let slideIndex = 0;
    
    topics.forEach(topic => {
      const topicLessons = getLessonsByTopic(topic.id);
      topicLessons.forEach(lesson => {
        result.push({ 
          lesson, 
          topic, 
          globalIndex,
          startSlideIndex: slideIndex
        });
        globalIndex++;
        // Count slides for this lesson
        const parts = lesson.content.split(/(?=##\s)/);
        slideIndex += parts.filter(p => p.trim()).length;
      });
    });
    return result;
  }, [topics]);

  // Parse content into slides
  const slides = useMemo(() => {
    const result: Slide[] = [];
    lessonsWithTopics.forEach(({ lesson, topic }, lessonIndex) => {
      const parts = lesson.content.split(/(?=##\s)/);
      parts.forEach((part) => {
        const lines = part.trim().split('\n');
        const title = lines[0]?.replace(/^#+\s*/, '') || lesson.titleTh;
        const content = lines.slice(1).join('\n').trim();
        if (content || title) {
          result.push({
            title,
            content,
            lessonTitle: lesson.titleTh,
            lessonId: lesson.id,
            lessonIndex,
            topicTitle: topic.titleTh,
          });
        }
      });
    });
    return result;
  }, [lessonsWithTopics]);

  const currentSlide = slides[currentSlideIndex];
  const totalSlides = slides.length;

  // Get current lesson from slide
  const currentLessonInfo = useMemo(() => {
    if (!currentSlide) return null;
    return lessonsWithTopics[currentSlide.lessonIndex];
  }, [currentSlide, lessonsWithTopics]);

  // Auto-expand topic and scroll to lesson when slide changes
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
    }
  }, [currentSlideIndex, currentLessonInfo, sidebarCollapsed]);

  // Jump to lesson
  const handleSelectLesson = useCallback((lessonWithTopic: LessonWithTopic) => {
    setSlideIndex(lessonWithTopic.startSlideIndex);
  }, [setSlideIndex]);

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          if (currentSlideIndex < totalSlides - 1) {
            nextSlide();
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevSlide();
          break;
        case "Escape":
          e.preventDefault();
          reset();
          setViewMode("normal");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlideIndex, totalSlides, nextSlide, prevSlide, reset, setViewMode]);

  // Mark lesson complete when advancing past its slides
  useEffect(() => {
    if (currentSlide) {
      const lesson = lessonsWithTopics[currentSlide.lessonIndex]?.lesson;
      if (lesson) {
        markLessonComplete(lesson.id);
      }
    }
  }, [currentSlideIndex, currentSlide, lessonsWithTopics, markLessonComplete]);

  const progressPercent = totalSlides > 0 ? ((currentSlideIndex + 1) / totalSlides) * 100 : 0;

  const colorClasses = {
    yellow: {
      gradient: "from-yellow-600 to-orange-600",
      bg: "bg-yellow-500",
      text: "text-yellow-400",
      border: "border-yellow-500/30",
      activeBg: "bg-yellow-500/20",
      activeBorder: "border-yellow-500",
    },
    blue: {
      gradient: "from-blue-600 to-indigo-600",
      bg: "bg-blue-500",
      text: "text-blue-400",
      border: "border-blue-500/30",
      activeBg: "bg-blue-500/20",
      activeBorder: "border-blue-500",
    },
    cyan: {
      gradient: "from-cyan-600 to-teal-600",
      bg: "bg-cyan-500",
      text: "text-cyan-400",
      border: "border-cyan-500/30",
      activeBg: "bg-cyan-500/20",
      activeBorder: "border-cyan-500",
    },
    orange: {
      gradient: "from-orange-600 to-red-600",
      bg: "bg-orange-500",
      text: "text-orange-400",
      border: "border-orange-500/30",
      activeBg: "bg-orange-500/20",
      activeBorder: "border-orange-500",
    },
  };

  const colors = colorClasses[brandColor] || colorClasses.yellow;

  return (
    <div className="fixed inset-0 z-50 flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Left Sidebar */}
      <aside 
        className={`flex-shrink-0 bg-slate-800/80 backdrop-blur-sm border-r border-white/10 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-72'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h2 className="font-bold text-white text-sm">📚 เนื้อหา</h2>
          <button
            onClick={() => {
              reset();
              setViewMode("normal");
            }}
            className="text-white/50 hover:text-white transition-colors"
            title="ออกจาก Presentation"
          >
            ✕
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="px-4 py-2 border-b border-white/10 bg-black/20">
          <div className="flex justify-between text-xs text-white/50 mb-1">
            <span>ความคืบหน้า</span>
            <span>{currentSlideIndex + 1} / {totalSlides}</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
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
              <div key={topic.id} className="border-b border-white/5">
                {/* Topic Header */}
                <button
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-white/5 transition-colors text-left"
                >
                  <span className={`text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                  <span className="text-lg">{topic.icon}</span>
                  <span className="flex-1 text-sm font-medium text-white/90 truncate">
                    {topic.titleTh}
                  </span>
                  <span className="text-xs text-white/40">{completedCount}/{topicLessons.length}</span>
                </button>

                {/* Lessons */}
                {isExpanded && (
                  <div className="bg-black/10">
                    {topicLessons.map((lessonWithTopic) => {
                      const isComplete = isLessonComplete(lessonWithTopic.lesson.id);
                      const isSelected = currentLessonInfo?.lesson.id === lessonWithTopic.lesson.id;
                      
                      return (
                        <button
                          key={lessonWithTopic.lesson.id}
                          ref={(el) => setLessonRef(lessonWithTopic.lesson.id, el)}
                          onClick={() => handleSelectLesson(lessonWithTopic)}
                          className={`w-full pl-10 pr-4 py-2 flex items-center gap-2 transition-colors text-left ${
                            isSelected 
                              ? `${colors.activeBg} border-l-2 ${colors.activeBorder}` 
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                            isComplete 
                              ? 'bg-green-500 text-white' 
                              : isSelected
                                ? `${colors.bg} text-white`
                                : 'border border-white/30'
                          }`}>
                            {isComplete ? '✓' : isSelected ? '●' : ''}
                          </span>
                          <span className={`flex-1 text-xs truncate ${
                            isSelected 
                              ? `${colors.text} font-medium` 
                              : 'text-white/60'
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
        className="absolute top-1/2 -translate-y-1/2 z-10 w-6 h-12 bg-slate-700/80 hover:bg-slate-600 backdrop-blur-sm rounded-r-lg flex items-center justify-center transition-all"
        style={{ left: sidebarCollapsed ? 0 : '288px' }}
      >
        <span className={`text-xs text-white transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`}>▶</span>
      </button>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 h-14 px-4 flex items-center justify-between bg-black/30 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center gap-2">
            {!sidebarCollapsed && <div className="w-0" />}
            <div className="text-white">
              <div className="text-xs text-white/50">📊 Presentation Mode</div>
              <div className="font-medium text-sm">{course?.title || courseSlug}</div>
            </div>
          </div>

          <div className="text-white/60 text-sm">
            {currentSlideIndex + 1} / {totalSlides}
          </div>

          <button
            onClick={() => {
              reset();
              setViewMode("normal");
            }}
            className="flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <span className="hidden sm:inline">ออก</span>
            <span>✕</span>
          </button>
        </header>

        {/* Slide Content */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
          <div 
            className={`max-w-4xl w-full bg-gradient-to-br ${colors.gradient} rounded-3xl p-8 md:p-12 shadow-2xl transform transition-all duration-300`}
            style={{
              animation: "slideIn 0.3s ease-out",
            }}
          >
            {currentSlide ? (
              <div className="text-white">
                {/* Lesson badge */}
                <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-4">
                  📖 {currentSlide.lessonTitle}
                </div>
                
                {/* Slide title */}
                <h1 className="text-3xl md:text-4xl font-bold mb-6">
                  {currentSlide.title}
                </h1>
                
                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none">
                  {currentSlide.content.split('\n').map((line, i) => {
                    // Handle code blocks
                    if (line.startsWith('```')) {
                      return null; // Skip code fence markers
                    }
                    // Handle bullet points
                    if (line.startsWith('- ')) {
                      return (
                        <li key={i} className="text-white/90 text-lg">
                          {line.substring(2)}
                        </li>
                      );
                    }
                    // Handle inline code
                    if (line.includes('`')) {
                      const parts = line.split(/(`[^`]+`)/);
                      return (
                        <p key={i} className="text-white/90 text-lg mb-2">
                          {parts.map((part, j) =>
                            part.startsWith('`') ? (
                              <code key={j} className="px-2 py-0.5 bg-black/30 rounded text-yellow-300 font-mono text-base">
                                {part.slice(1, -1)}
                              </code>
                            ) : (
                              part
                            )
                          )}
                        </p>
                      );
                    }
                    // Regular text
                    if (line.trim()) {
                      return (
                        <p key={i} className="text-white/90 text-lg mb-2">
                          {line}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center text-white">
                <div className="text-6xl mb-4">📊</div>
                <p>ไม่มีเนื้อหา</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="flex-shrink-0 h-20 px-4 bg-black/30 backdrop-blur-sm border-t border-white/10">
          {/* Progress bar */}
          <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full bg-gradient-to-r ${colors.gradient} transition-all duration-300`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 transition-all"
            >
              ←
            </button>

            <div className="text-white/60 text-sm px-4">
              ใช้ปุ่มลูกศร ← → หรือ Space เพื่อเลื่อน
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlideIndex >= totalSlides - 1}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 transition-all"
            >
              →
            </button>
          </div>
        </footer>
      </main>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
