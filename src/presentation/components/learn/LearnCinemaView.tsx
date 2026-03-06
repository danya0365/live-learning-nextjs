"use client";

import { getCourseBySlug, getTopicFilterForCourse } from "@/src/data/master/learnCourses";
import { LearnLesson, getLessonsByTopic } from "@/src/data/master/learnLessons";
import { learnTopics } from "@/src/data/master/learnTopics";
import { useBackgroundMusic } from "@/src/presentation/hooks/useBackgroundMusic";
import { useTTS } from "@/src/presentation/hooks/useTTS";
import { useLearnModeStore } from "@/src/presentation/stores/learnModeStore";
import { useProgressStore } from "@/src/presentation/stores/progressStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface LearnCinemaViewProps {
  courseSlug: string;
}

interface Slide {
  text: string;
  title: string;
  lessonIndex: number;
}

export function LearnCinemaView({ courseSlug }: LearnCinemaViewProps) {
  const store = useLearnModeStore();
  const { markLessonComplete } = useProgressStore();
  const tts = useTTS();
  const music = useBackgroundMusic();
  
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [autoAdvanceDelay] = useState(2); // seconds after TTS

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
        const lines = part.trim().split('\n');
        const title = lines[0]?.replace(/^#+\s*/, '') || lesson.titleTh;
        const text = lines.slice(1).join(' ').replace(/`[^`]+`/g, '').replace(/[#*_]/g, '').trim();
        if (text) {
          result.push({ text, title, lessonIndex });
        }
      });
    });
    return result;
  }, [allLessons]);

  const currentSlide = slides[store.currentSlideIndex];
  const totalSlides = slides.length;
  const currentLesson = currentSlide ? allLessons[currentSlide.lessonIndex] : null;
  const isLastSlide = store.currentSlideIndex >= totalSlides - 1;

  // Advance to next slide
  const advanceToNext = useCallback(() => {
    if (!isLastSlide) {
      store.nextSlide();
    } else {
      store.pause();
    }
  }, [isLastSlide, store]);

  // Speak current slide and auto-advance
  const speakAndAdvance = useCallback(async () => {
    if (!currentSlide || !store.isPlaying) return;

    // Fade out music while speaking
    if (store.isMusicEnabled) {
      music.fadeOut(300);
    }

    try {
      await tts.speak(currentSlide.text, {
        voiceType: store.voiceType,
        rate: store.speechRate,
      });

      // Fade in music after speaking
      if (store.isMusicEnabled) {
        music.fadeIn(store.musicVolume, 300);
      }

      // Mark lesson complete
      if (currentLesson) {
        markLessonComplete(currentLesson.id);
      }

      // Wait before advancing
      if (store.isPlaying) {
        autoAdvanceTimerRef.current = setTimeout(() => {
          if (store.isPlaying) {
            advanceToNext();
          }
        }, autoAdvanceDelay * 1000);
      }
    } catch (e) {
      console.error('TTS error:', e);
      if (store.isPlaying) {
        autoAdvanceTimerRef.current = setTimeout(advanceToNext, 2000);
      }
    }
  }, [currentSlide, store, tts, music, currentLesson, markLessonComplete, advanceToNext, autoAdvanceDelay]);

  // Auto-play effect
  useEffect(() => {
    if (store.isPlaying && currentSlide) {
      speakAndAdvance();
    }
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, [store.isPlaying, store.currentSlideIndex, currentSlide]);

  // Handle music play/pause
  useEffect(() => {
    if (store.isPlaying && store.isMusicEnabled) {
      music.play();
    } else {
      music.pause();
    }
  }, [store.isPlaying, store.isMusicEnabled]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          store.togglePlayPause();
          if (!store.isPlaying) {
            tts.stop();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          tts.stop();
          advanceToNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          tts.stop();
          store.prevSlide();
          break;
        case 'Escape':
          e.preventDefault();
          store.pause();
          tts.stop();
          store.reset();
          store.setViewMode('normal');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [store, tts, advanceToNext]);

  // Cleanup
  useEffect(() => {
    return () => {
      tts.stop();
      music.pause();
    };
  }, []);

  const progressPercent = totalSlides > 0 ? ((store.currentSlideIndex + 1) / totalSlides) * 100 : 0;

  const colorClasses = {
    yellow: {
      gradient: "from-yellow-600 to-orange-600",
      glow: "shadow-yellow-500/30",
    },
    blue: {
      gradient: "from-blue-600 to-indigo-600",
      glow: "shadow-blue-500/30",
    },
    cyan: {
      gradient: "from-cyan-600 to-teal-600",
      glow: "shadow-cyan-500/30",
    },
    orange: {
      gradient: "from-orange-600 to-red-600",
      glow: "shadow-orange-500/30",
    },
  };

  const colors = colorClasses[brandColor] || colorClasses.yellow;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="flex-shrink-0 h-16 px-4 md:px-6 flex items-center justify-between bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              tts.stop();
              music.pause();
              store.reset();
              store.setViewMode('normal');
            }}
            className="flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <span>←</span>
            <span className="hidden sm:inline">ออก</span>
          </button>
          
          <div className="text-white">
            <div className="text-xs text-white/50">🎬 Cinema Mode</div>
            <div className="font-medium">{currentLesson?.titleTh || "กำลังโหลด..."}</div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => store.setVoiceType(store.voiceType === 'male' ? 'female' : 'male')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              store.voiceType === 'female' 
                ? 'bg-pink-500/20 text-pink-300' 
                : 'bg-blue-500/20 text-blue-300'
            }`}
          >
            {store.voiceType === 'female' ? '👩' : '👨'}
          </button>
          
          <select
            value={store.speechRate}
            onChange={(e) => store.setSpeechRate(parseFloat(e.target.value))}
            className="bg-white/10 text-white text-sm px-2 py-1.5 rounded-lg border border-white/20"
          >
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
          </select>
          
          <button
            onClick={() => store.toggleMusic()}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              store.isMusicEnabled 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-white/10 text-white/50'
            }`}
          >
            {store.isMusicEnabled ? '🎵' : '🔇'}
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-4 md:p-8 flex items-center justify-center">
        <div className={`max-w-4xl mx-auto w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl ${colors.glow} p-6 md:p-12`}>
          {currentSlide ? (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {currentSlide.title}
              </h2>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                {currentSlide.text}
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-pulse">🎬</div>
              <p className="text-slate-500">กำลังโหลดเนื้อหา...</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="flex-shrink-0 h-24 px-4 md:px-6 bg-black/30 backdrop-blur-sm border-t border-white/10">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-4">
          <div 
            className={`h-full bg-gradient-to-r ${colors.gradient} transition-all duration-300`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-white/60 text-sm">
            <span>สไลด์ {store.currentSlideIndex + 1}/{totalSlides}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                tts.stop();
                store.prevSlide();
              }}
              disabled={store.currentSlideIndex === 0}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 transition-all"
            >
              ⏮
            </button>
            
            <button
              onClick={() => {
                if (store.isPlaying) {
                  tts.stop();
                }
                store.togglePlayPause();
              }}
              className={`w-16 h-16 rounded-full bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white text-2xl flex items-center justify-center shadow-lg ${colors.glow} transition-all`}
            >
              {store.isPlaying ? '⏸' : '▶️'}
            </button>
            
            <button
              onClick={() => {
                tts.stop();
                advanceToNext();
              }}
              disabled={isLastSlide}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 transition-all"
            >
              ⏭
            </button>
          </div>
          
          <div className="text-white/60 text-sm flex items-center gap-2">
            {tts.isSpeaking && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                กำลังพูด...
              </span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
