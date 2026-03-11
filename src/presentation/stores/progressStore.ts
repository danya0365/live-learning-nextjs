"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LearningProgress {
  lessonId: string;
  completedAt: string;
  score?: number;
}

export interface ModuleProgress {
  moduleId: string;
  completedAt: string;
  projectCompleted: boolean;
}

export interface PhaseProgress {
  phaseId: string;
  completedAt: string;
  certificateEarned: boolean;
}

interface ProgressState {
  // Progress data
  completedLessons: Record<string, LearningProgress>;
  completedModules: Record<string, ModuleProgress>;
  completedPhases: Record<string, PhaseProgress>;
  
  // Stats
  totalPoints: number;
  streak: number;
  lastStudyDate: string | null;
  
  // Current position
  currentLessonId: string | null;
  currentModuleId: string | null;
  currentPhaseId: string | null;
  
  // Actions
  markLessonComplete: (lessonId: string, score?: number) => void;
  markModuleComplete: (moduleId: string) => void;
  markPhaseComplete: (phaseId: string) => void;
  setCurrentLesson: (lessonId: string, moduleId: string, phaseId: string) => void;
  isLessonComplete: (lessonId: string) => boolean;
  isModuleComplete: (moduleId: string) => boolean;
  isPhaseComplete: (phaseId: string) => boolean;
  getCompletedLessonCount: () => number;
  getCompletedModuleCount: () => number;
  resetProgress: () => void;
  updateStreak: () => void;
}

const getToday = () => new Date().toISOString().split("T")[0];

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // Initial state
      completedLessons: {},
      completedModules: {},
      completedPhases: {},
      totalPoints: 0,
      streak: 0,
      lastStudyDate: null,
      currentLessonId: null,
      currentModuleId: null,
      currentPhaseId: null,

      // Mark lesson as complete
      markLessonComplete: (lessonId: string, score?: number) => {
        const today = getToday();
        set((state) => {
          // Don't re-add if already completed
          if (state.completedLessons[lessonId]) {
            return state;
          }
          
          // Calculate points (10 per lesson, bonus for score)
          const basePoints = 10;
          const bonusPoints = score ? Math.floor(score / 10) : 0;
          
          return {
            completedLessons: {
              ...state.completedLessons,
              [lessonId]: {
                lessonId,
                completedAt: today,
                score,
              },
            },
            totalPoints: state.totalPoints + basePoints + bonusPoints,
            lastStudyDate: today,
          };
        });
        
        // Update streak after lesson complete
        get().updateStreak();
      },

      // Mark module as complete
      markModuleComplete: (moduleId: string) => {
        const today = getToday();
        set((state) => {
          if (state.completedModules[moduleId]) {
            return state;
          }
          
          return {
            completedModules: {
              ...state.completedModules,
              [moduleId]: {
                moduleId,
                completedAt: today,
                projectCompleted: true,
              },
            },
            totalPoints: state.totalPoints + 50, // 50 points per module
          };
        });
      },

      // Mark phase as complete
      markPhaseComplete: (phaseId: string) => {
        const today = getToday();
        set((state) => {
          if (state.completedPhases[phaseId]) {
            return state;
          }
          
          return {
            completedPhases: {
              ...state.completedPhases,
              [phaseId]: {
                phaseId,
                completedAt: today,
                certificateEarned: true,
              },
            },
            totalPoints: state.totalPoints + 200, // 200 points per phase
          };
        });
      },

      // Set current position
      setCurrentLesson: (lessonId: string, moduleId: string, phaseId: string) => {
        set({
          currentLessonId: lessonId,
          currentModuleId: moduleId,
          currentPhaseId: phaseId,
        });
      },

      // Check completion status
      isLessonComplete: (lessonId: string) => {
        return !!get().completedLessons[lessonId];
      },

      isModuleComplete: (moduleId: string) => {
        return !!get().completedModules[moduleId];
      },

      isPhaseComplete: (phaseId: string) => {
        return !!get().completedPhases[phaseId];
      },

      // Get counts
      getCompletedLessonCount: () => {
        return Object.keys(get().completedLessons).length;
      },

      getCompletedModuleCount: () => {
        return Object.keys(get().completedModules).length;
      },

      // Update streak
      updateStreak: () => {
        const today = getToday();
        set((state) => {
          if (!state.lastStudyDate) {
            return { streak: 1, lastStudyDate: today };
          }
          
          const lastDate = new Date(state.lastStudyDate);
          const todayDate = new Date(today);
          const diffDays = Math.floor(
            (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          if (diffDays === 0) {
            // Same day, no change
            return state;
          } else if (diffDays === 1) {
            // Consecutive day, increase streak
            return { streak: state.streak + 1, lastStudyDate: today };
          } else {
            // Streak broken
            return { streak: 1, lastStudyDate: today };
          }
        });
      },

      // Reset all progress
      resetProgress: () => {
        set({
          completedLessons: {},
          completedModules: {},
          completedPhases: {},
          totalPoints: 0,
          streak: 0,
          lastStudyDate: null,
          currentLessonId: null,
          currentModuleId: null,
          currentPhaseId: null,
        });
      },
    }),
    {
      name: "play-stack-progress",
    }
  )
);
