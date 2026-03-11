"use client";

import { ComponentType } from "react";
import { create } from "zustand";

interface Slide {
  html: string;
  title?: string;
}

interface PresentationState {
  // State
  isPresenting: boolean;
  currentSlide: number;
  slides: Slide[];
  lessonComponent: ComponentType | null;

  // Actions
  enterPresentation: (slides: Slide[], component?: ComponentType) => void;
  exitPresentation: () => void;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
}

export const usePresentationStore = create<PresentationState>()((set, get) => ({
  // Initial state
  isPresenting: false,
  currentSlide: 0,
  slides: [],
  lessonComponent: null,

  // Enter presentation mode with slides data and optional component
  enterPresentation: (slides, component) =>
    set({
      isPresenting: true,
      currentSlide: 0,
      slides,
      lessonComponent: component || null,
    }),

  // Exit presentation mode
  exitPresentation: () =>
    set({
      isPresenting: false,
      currentSlide: 0,
      slides: [],
      lessonComponent: null,
    }),

  // Navigate to specific slide
  goToSlide: (index) => {
    const { slides, lessonComponent } = get();
    // Allow navigation even when using component-based rendering
    if (index >= 0) {
      set({ currentSlide: index });
    }
  },

  // Next slide
  nextSlide: () => {
    const { currentSlide } = get();
    set({ currentSlide: currentSlide + 1 });
  },

  // Previous slide
  prevSlide: () => {
    const { currentSlide } = get();
    if (currentSlide > 0) {
      set({ currentSlide: currentSlide - 1 });
    }
  },
}));
