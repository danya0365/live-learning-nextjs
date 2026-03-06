"use client";

import { getCourseBySlug, getTopicFilterForCourse } from "@/src/data/master/learnCourses";
import { LearnLesson, getLessonsByTopic } from "@/src/data/master/learnLessons";
import { learnTopics } from "@/src/data/master/learnTopics";
import { useTTS } from "@/src/presentation/hooks/useTTS";
import { useLearnModeStore } from "@/src/presentation/stores/learnModeStore";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface LearnPodcastViewProps {
  courseSlug: string;
}

interface Slide {
  text: string;
  lessonIndex: number;
  lessonTitle: string;
}

export function LearnPodcastView({ courseSlug }: LearnPodcastViewProps) {
  const store = useLearnModeStore();
  const { markLessonComplete } = useProgressStore();
  const tts = useTTS();

  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [sleepTimeRemaining, setSleepTimeRemaining] = useState<number | null>(null);
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);

  const course = getCourseBySlug(courseSlug);
  const colorMap: Record<string, "yellow" | "blue" | "cyan" | "orange"> = {
    javascript: "yellow",
    typescript: "blue",
    html: "orange",
    go: "cyan",
  };
  const brandColor = colorMap[courseSlug] || "yellow";

  // Get all lessons dynamically based on course
  const allLessons = useMemo(() => {
    const topicFilter = getTopicFilterForCourse(courseSlug);
    const topics = learnTopics.filter(t => topicFilter(t.id));
    const lessons: LearnLesson[] = [];
    topics.forEach(topic => {
      lessons.push(...getLessonsByTopic(topic.id));
    });
    return lessons;
  }, [courseSlug]);

  // Parse content into slides
  const slides = useMemo(() => {
    const result: Slide[] = [];
    allLessons.forEach((lesson, lessonIndex) => {
      const parts = lesson.content.split(/(?=##\s)/);
      parts.forEach((part) => {
        const text = part.replace(/^#+\s*[^\n]+\n/, '').replace(/`[^`]+`/g, '').replace(/[#*_]/g, '').trim();
        if (text) {
          result.push({ text, lessonIndex, lessonTitle: lesson.titleTh });
        }
      });
    });
    return result;
  }, [allLessons]);

  const currentSlide = slides[store.currentSlideIndex];
  const totalSlides = slides.length;
  const currentLesson = currentSlide ? allLessons[currentSlide.lessonIndex] : null;

  // Sleep timer logic
  useEffect(() => {
    if (sleepTimer !== null && store.isPlaying) {
      setSleepTimeRemaining(sleepTimer * 60);
      
      sleepTimerRef.current = setInterval(() => {
        setSleepTimeRemaining(prev => {
          if (prev === null || prev <= 0) {
            store.pause();
            tts.stop();
            setSleepTimer(null);
            if (sleepTimerRef.current) {
              clearInterval(sleepTimerRef.current);
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        if (sleepTimerRef.current) {
          clearInterval(sleepTimerRef.current);
        }
      };
    }
  }, [sleepTimer, store.isPlaying]);

  // Advance to next
  const advanceToNext = useCallback(() => {
    const isLastSlide = store.currentSlideIndex >= slides.length - 1;
    
    if (isLastSlide) {
      store.pause();
    } else {
      store.nextSlide();
    }
  }, [store, slides.length]);

  // Speak current content
  const speakCurrent = useCallback(async () => {
    if (!store.isPlaying || slides.length === 0) return;
    
    const currentText = slides[store.currentSlideIndex]?.text;
    if (!currentText) {
      advanceToNext();
      return;
    }
    
    try {
      await tts.speak(currentText, {
        voiceType: store.voiceType,
        rate: store.speechRate,
      });

      // Mark lesson complete
      if (currentLesson) {
        markLessonComplete(currentLesson.id);
      }
      
      if (store.isPlaying) {
        setTimeout(advanceToNext, 1000);
      }
    } catch {
      if (store.isPlaying) {
        setTimeout(advanceToNext, 2000);
      }
    }
  }, [store, slides, tts, currentLesson, markLessonComplete, advanceToNext]);

  // Auto-play effect
  useEffect(() => {
    if (store.isPlaying && slides.length > 0) {
      speakCurrent();
    }
  }, [store.isPlaying, store.currentSlideIndex, slides.length]);

  // Cleanup
  useEffect(() => {
    return () => {
      tts.stop();
      if (sleepTimerRef.current) {
        clearInterval(sleepTimerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalSlides > 0 ? ((store.currentSlideIndex + 1) / totalSlides) * 100 : 0;

  const colorClasses = {
    yellow: {
      gradient: "from-yellow-500 to-orange-600",
      glow: "shadow-yellow-500/30",
    },
    blue: {
      gradient: "from-blue-500 to-indigo-600",
      glow: "shadow-blue-500/30",
    },
    cyan: {
      gradient: "from-cyan-500 to-teal-600",
      glow: "shadow-cyan-500/30",
    },
    orange: {
      gradient: "from-orange-500 to-red-600",
      glow: "shadow-orange-500/30",
    },
  };

  const colors = colorClasses[brandColor] || colorClasses.yellow;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900">
      {/* Header */}
      <header className="flex-shrink-0 p-4 flex items-center justify-between">
        <button
          onClick={() => {
            tts.stop();
            store.reset();
            store.setViewMode('normal');
          }}
          className="flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <span>←</span>
          <span className="hidden sm:inline">ออก</span>
        </button>
        
        {/* Sleep Timer */}
        <div className="flex items-center gap-2">
          {sleepTimeRemaining && (
            <span className="text-white/70 text-sm">
              💤 {formatTime(sleepTimeRemaining)}
            </span>
          )}
          <select
            value={sleepTimer || ""}
            onChange={(e) => setSleepTimer(e.target.value ? parseInt(e.target.value) : null)}
            className="bg-white/10 text-white text-sm px-3 py-1.5 rounded-lg border border-white/20"
          >
            <option value="">ไม่จับเวลา</option>
            <option value="5">5 นาที</option>
            <option value="15">15 นาที</option>
            <option value="30">30 นาที</option>
            <option value="60">1 ชั่วโมง</option>
          </select>
        </div>
      </header>
      
      {/* Main Content - Album Art Style */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {/* Artwork */}
        <div className={`w-64 h-64 md:w-80 md:h-80 rounded-3xl bg-gradient-to-br ${colors.gradient} shadow-2xl ${colors.glow} flex items-center justify-center mb-8 ${store.isPlaying ? 'animate-pulse-slow' : ''}`}>
          <span className="text-8xl md:text-9xl">🎧</span>
        </div>
        
        {/* Lesson Info */}
        <div className="text-white mb-2">
          <div className="text-white/50 text-sm mb-1">
            {course?.icon} {course?.title || courseSlug}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {currentSlide?.lessonTitle || "กำลังโหลด..."}
          </h1>
          <p className="text-white/60 text-sm">
            ส่วนที่ {store.currentSlideIndex + 1} / {totalSlides}
          </p>
        </div>
        
        {/* Speaking indicator */}
        {tts.isSpeaking && (
          <div className="flex items-center gap-2 text-green-400 mt-4">
            <div className="flex gap-1">
              <span className="w-1 h-4 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-6 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-4 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm">กำลังอ่าน...</span>
          </div>
        )}
      </main>
      
      {/* Footer Controls */}
      <footer className="flex-shrink-0 p-6 bg-black/30 backdrop-blur-sm">
        {/* Progress */}
        <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-4">
          <div 
            className={`h-full bg-gradient-to-r ${colors.gradient} transition-all duration-300`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        {/* Controls Row */}
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Voice */}
          <button
            onClick={() => store.setVoiceType(store.voiceType === 'male' ? 'female' : 'male')}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
              store.voiceType === 'female' 
                ? 'bg-pink-500/30 text-pink-300' 
                : 'bg-blue-500/30 text-blue-300'
            }`}
          >
            {store.voiceType === 'female' ? '👩' : '👨'}
          </button>
          
          {/* Skip Back */}
          <button
            onClick={() => {
              tts.stop();
              store.prevSlide();
            }}
            disabled={store.currentSlideIndex === 0}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-all disabled:opacity-30"
          >
            ⏮
          </button>
          
          {/* Play/Pause */}
          <button
            onClick={() => {
              if (store.isPlaying) {
                tts.stop();
              }
              store.togglePlayPause();
            }}
            className="w-20 h-20 rounded-full bg-white text-purple-900 flex items-center justify-center text-3xl shadow-lg shadow-white/20 hover:scale-105 transition-all"
          >
            {store.isPlaying ? '⏸' : '▶️'}
          </button>
          
          {/* Skip Forward */}
          <button
            onClick={() => {
              tts.stop();
              advanceToNext();
            }}
            disabled={store.currentSlideIndex >= slides.length - 1}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-all disabled:opacity-30"
          >
            ⏭
          </button>
          
          {/* Speed */}
          <button
            onClick={() => {
              const speeds = [0.75, 1, 1.25, 1.5, 2];
              const currentIdx = speeds.indexOf(store.speechRate);
              const nextIdx = (currentIdx + 1) % speeds.length;
              store.setSpeechRate(speeds[nextIdx]);
            }}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all"
          >
            {store.speechRate}x
          </button>
        </div>
        
        {/* TTS Status */}
        {!tts.isSupported && (
          <div className="text-center mt-4 text-yellow-400 text-sm">
            ⚠️ เบราว์เซอร์ไม่รองรับการอ่านออกเสียง
          </div>
        )}
      </footer>
      
      {/* Pulse animation */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
