"use client";

import { create } from "zustand";

interface CinemaState {
  // Playback state
  isPlaying: boolean;
  currentLessonIndex: number;
  currentSlideIndex: number;
  
  // TTS settings
  voiceType: 'male' | 'female';
  speechRate: number; // 0.5 - 2.0
  isSpeaking: boolean;
  
  // Music settings
  isMusicEnabled: boolean;
  musicVolume: number; // 0 - 1
  
  // Auto-play settings
  autoAdvanceDelay: number; // seconds after TTS ends
  
  // Actions
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  
  setLessonIndex: (index: number) => void;
  setSlideIndex: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  
  setVoiceType: (type: 'male' | 'female') => void;
  setSpeechRate: (rate: number) => void;
  setIsSpeaking: (speaking: boolean) => void;
  
  toggleMusic: () => void;
  setMusicVolume: (volume: number) => void;
  
  setAutoAdvanceDelay: (delay: number) => void;
  
  reset: () => void;
}

const initialState = {
  isPlaying: false,
  currentLessonIndex: 0,
  currentSlideIndex: 0,
  voiceType: 'female' as const,
  speechRate: 1.0,
  isSpeaking: false,
  isMusicEnabled: true,
  musicVolume: 0.3,
  autoAdvanceDelay: 2, // 2 seconds after TTS ends
};

export const useCinemaStore = create<CinemaState>()((set, get) => ({
  ...initialState,

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setLessonIndex: (index) => set({ currentLessonIndex: index, currentSlideIndex: 0 }),
  setSlideIndex: (index) => set({ currentSlideIndex: index }),
  
  nextSlide: () => set((state) => ({ currentSlideIndex: state.currentSlideIndex + 1 })),
  prevSlide: () => set((state) => ({ 
    currentSlideIndex: Math.max(0, state.currentSlideIndex - 1) 
  })),

  setVoiceType: (type) => set({ voiceType: type }),
  setSpeechRate: (rate) => set({ speechRate: Math.min(2, Math.max(0.5, rate)) }),
  setIsSpeaking: (speaking) => set({ isSpeaking: speaking }),

  toggleMusic: () => set((state) => ({ isMusicEnabled: !state.isMusicEnabled })),
  setMusicVolume: (volume) => set({ musicVolume: Math.min(1, Math.max(0, volume)) }),

  setAutoAdvanceDelay: (delay) => set({ autoAdvanceDelay: delay }),

  reset: () => set(initialState),
}));
