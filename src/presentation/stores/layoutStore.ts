"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LayoutType = "main" | "retro";

interface LayoutState {
  layout: LayoutType;
  setLayout: (layout: LayoutType) => void;
  toggleLayout: () => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      layout: "main",
      setLayout: (layout) => set({ layout }),
      toggleLayout: () =>
        set({ layout: get().layout === "main" ? "retro" : "main" }),
    }),
    {
      name: "play-stack-layout",
    }
  )
);
