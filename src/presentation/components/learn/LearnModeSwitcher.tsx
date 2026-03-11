"use client";

import { LearnViewMode, useLearnModeStore } from "@/src/presentation/stores/learnModeStore";

const baseModes: { mode: LearnViewMode; icon: string; label: string }[] = [
  { mode: "normal", icon: "📋", label: "ปกติ" },
  { mode: "focus", icon: "🎯", label: "Focus" },
  { mode: "presentation", icon: "📊", label: "Presentation" },
  { mode: "cinema", icon: "🎬", label: "Cinema" },
  { mode: "podcast", icon: "🎧", label: "Podcast" },
];

interface LearnModeSwitcherProps {
  brandColor: "yellow" | "blue" | "cyan" | "orange";
  hasLab?: boolean;
}

export function LearnModeSwitcher({ brandColor, hasLab }: LearnModeSwitcherProps) {
  const { viewMode, setViewMode, reset } = useLearnModeStore();

  const handleModeChange = (mode: LearnViewMode) => {
    if (mode !== viewMode) {
      reset();
      setViewMode(mode);
    }
  };

  const colorClasses = {
    yellow: {
      active: "bg-yellow-500 text-black",
      hover: "hover:bg-yellow-100 dark:hover:bg-yellow-500/20 hover:text-yellow-700 dark:hover:text-yellow-300",
    },
    blue: {
      active: "bg-blue-500 text-white",
      hover: "hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:text-blue-700 dark:hover:text-blue-300",
    },
    cyan: {
      active: "bg-cyan-500 text-black",
      hover: "hover:bg-cyan-100 dark:hover:bg-cyan-500/20 hover:text-cyan-700 dark:hover:text-cyan-300",
    },
    orange: {
      active: "bg-orange-500 text-white",
      hover: "hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:text-orange-700 dark:hover:text-orange-300",
    },
  };

  const colors = colorClasses[brandColor] || colorClasses.blue;

  const availableModes = hasLab 
    ? [...baseModes, { mode: "lab" as LearnViewMode, icon: "💻", label: "Lab" }]
    : baseModes;

  return (
    <div className="flex flex-wrap justify-center items-center gap-1 p-1 bg-gray-100 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
      {availableModes.map(({ mode, icon, label }) => (
        <button
          key={mode}
          onClick={() => handleModeChange(mode)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === mode
              ? colors.active
              : `text-gray-600 dark:text-gray-400 ${colors.hover}`
          }`}
        >
          <span>{icon}</span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
