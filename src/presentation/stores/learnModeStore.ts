"use client";

import { create } from "zustand";

export type LearnViewMode = "normal" | "focus" | "presentation" | "cinema" | "podcast";

interface LearnModeState {
  // View mode
  viewMode: LearnViewMode;
  setViewMode: (mode: LearnViewMode) => void;

  // Slide navigation
  currentLessonIndex: number;
  currentSlideIndex: number;
  setLessonIndex: (index: number) => void;
  setSlideIndex: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;

  // Playback (for Cinema/Podcast)
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;

  // Voice settings
  voiceType: "male" | "female";
  speechRate: number;
  setVoiceType: (type: "male" | "female") => void;
  setSpeechRate: (rate: number) => void;

  // Music (Cinema mode)
  isMusicEnabled: boolean;
  musicVolume: number;
  toggleMusic: () => void;
  setMusicVolume: (volume: number) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  viewMode: "normal" as LearnViewMode,
  currentLessonIndex: 0,
  currentSlideIndex: 0,
  isPlaying: false,
  voiceType: "female" as const,
  speechRate: 1.0,
  isMusicEnabled: false,
  musicVolume: 0.3,
};

export const useLearnModeStore = create<LearnModeState>()((set, get) => ({
  ...initialState,

  setViewMode: (mode) => set({ viewMode: mode, isPlaying: false }),

  setLessonIndex: (index) => set({ currentLessonIndex: index, currentSlideIndex: 0 }),
  setSlideIndex: (index) => set({ currentSlideIndex: index }),
  
  nextSlide: () => set((state) => ({ currentSlideIndex: state.currentSlideIndex + 1 })),
  prevSlide: () => set((state) => ({ 
    currentSlideIndex: Math.max(0, state.currentSlideIndex - 1) 
  })),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setVoiceType: (type) => set({ voiceType: type }),
  setSpeechRate: (rate) => set({ speechRate: rate }),

  toggleMusic: () => set((state) => ({ isMusicEnabled: !state.isMusicEnabled })),
  setMusicVolume: (volume) => set({ musicVolume: volume }),

  reset: () => set(initialState),
}));
