"use client";

import { LabSidebarItem } from "@/src/domain/types/learn-content";
import { useLearnModeStore } from "@/src/presentation/stores/learnModeStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { LineOALabView } from "./labs/LineOALabView";

interface LearnLabViewProps {
  courseSlug: string;
}

export function LearnLabView({ courseSlug }: LearnLabViewProps) {
  const { setViewMode, reset } = useLearnModeStore();

  const colorMap: Record<string, "yellow" | "blue" | "cyan" | "orange" | "green"> = {
    javascript: "yellow",
    typescript: "blue",
    html: "orange",
    go: "cyan",
    "line-oa": "green",
  };
  const brandColor = colorMap[courseSlug] || "yellow";

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarItems, setSidebarItems] = useState<LabSidebarItem[]>([]);
  const [activeItemId, setActiveItemId] = useState<string>("");

  // Refs for scrolling
  const listRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const contentRef = useRef<HTMLDivElement>(null);

  // Group items
  const groupedItems = sidebarItems.reduce((acc, item) => {
    const groupName = item.group || "Default";
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(item);
    return acc;
  }, {} as Record<string, LabSidebarItem[]>);

  // Auto-scroll sidebar when active item changes (if not collapsed)
  useEffect(() => {
    if (activeItemId && !sidebarCollapsed) {
      setTimeout(() => {
         const el = listRefs.current.get(activeItemId);
         if (el) {
           el.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }
      }, 100);
    }
  }, [activeItemId, sidebarCollapsed]);

  // Click handler
  const handleItemClick = useCallback((id: string) => {
    setActiveItemId(id);
  }, []);

  const setItemRef = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) {
      listRefs.current.set(id, el);
    } else {
      listRefs.current.delete(id);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we are focusing on input
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      
      if (e.key === "Escape") {
        e.preventDefault();
        reset();
        setViewMode("normal");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [reset, setViewMode]);

  // Exit lab mode
  const handleExit = () => {
    reset();
    setViewMode("normal");
  };

  const handleSidebarUpdate = useCallback((items: LabSidebarItem[], activeId: string) => {
    setSidebarItems(items);
    setActiveItemId(activeId);
  }, []);

  // Calculate progress
  const activeIndex = sidebarItems.findIndex(i => i.id === activeItemId);
  const progressPercent = sidebarItems.length > 0 ? ((activeIndex + 1) / sidebarItems.length) * 100 : 0;

  const colorClasses = {
    yellow: {
      gradient: "from-yellow-600 to-orange-600",
      bg: "bg-yellow-500",
      text: "text-yellow-400",
      border: "border-yellow-500",
      activeBg: "bg-yellow-500/20",
    },
    blue: {
      gradient: "from-blue-600 to-indigo-600",
      bg: "bg-blue-500",
      text: "text-blue-400",
      border: "border-blue-500",
      activeBg: "bg-blue-500/20",
    },
    cyan: {
      gradient: "from-cyan-600 to-teal-600",
      bg: "bg-cyan-500",
      text: "text-cyan-400",
      border: "border-cyan-500",
      activeBg: "bg-cyan-500/20",
    },
    orange: {
      gradient: "from-orange-600 to-red-600",
      bg: "bg-orange-500",
      text: "text-orange-400",
      border: "border-orange-500",
      activeBg: "bg-orange-500/20",
    },
    green: {
      gradient: "from-green-600 to-emerald-600",
      bg: "bg-green-500",
      text: "text-green-400",
      border: "border-green-500",
      activeBg: "bg-green-500/20",
    },
  };

  const colors = colorClasses[brandColor] || colorClasses.yellow;

  // Render specific lab content based on course slug
  const renderLabContent = () => {
    switch (courseSlug) {
      case "line-oa":
        return <LineOALabView onSidebarUpdate={handleSidebarUpdate} activeSidebarItemId={activeItemId} onExit={handleExit} />;
      // Add new course labs here as they are developed
      default:
        return (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-slate-900 text-white min-h-[400px]">
            <div className="max-w-md space-y-4">
              <h2 className="text-2xl font-bold">Lab Not Available</h2>
              <p className="text-gray-400">
                A specialized lab environment has not been configured for this course yet.
              </p>
            </div>
          </div>
        );
    }
  };

  // Find active item for header title
  const activeItem = sidebarItems.find(i => i.id === activeItemId);

  return (
    <div className="dark fixed inset-0 z-50 flex bg-slate-900">
      {/* Left Sidebar */}
      <aside 
        className={`flex-shrink-0 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-80'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <h2 className="font-bold text-white flex items-center gap-2">
            <span className="text-lg">💻</span>
            <span>Lab Mode</span>
          </h2>
          <button
            onClick={handleExit}
            className="text-gray-400 hover:text-white transition-colors"
            title="ออกจาก Lab Mode"
          >
            ✕
          </button>
        </div>
        
        {/* Progress bar */}
        {sidebarItems.length > 0 && (
          <div className="px-4 py-2 border-b border-slate-700 bg-slate-900/30">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>ความคืบหน้า</span>
              <span>{Math.max(activeIndex + 1, 0)} / {sidebarItems.length}</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${colors.gradient} transition-all duration-300`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Topics & Lessons Tree */}
        <div className="flex-1 overflow-y-auto hidden-scrollbar">
           {Object.keys(groupedItems).map((groupName) => (
             <div key={groupName} className="border-b border-slate-700/50 pb-2">
               {groupName !== "Default" && (
                 <div className="px-4 py-2 mt-2">
                   <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{groupName}</h3>
                 </div>
               )}
               <div className="pt-1">
                 {groupedItems[groupName].map((item) => {
                   const isSelected = activeItemId === item.id;
                   
                   return (
                     <button
                       key={item.id}
                       ref={(el) => setItemRef(item.id, el)}
                       onClick={() => handleItemClick(item.id)}
                       className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left ${
                         isSelected 
                           ? `${colors.activeBg} border-l-4 ${colors.border}` 
                           : 'hover:bg-slate-700/30 border-l-4 border-transparent'
                       }`}
                     >
                       <span className="text-lg overflow-hidden flex-shrink-0 w-6 text-center">
                         {item.icon}
                       </span>
                       <span className={`flex-1 text-sm truncate ${
                         isSelected 
                           ? `${colors.text} font-medium` 
                           : 'text-gray-300'
                       }`}>
                         {item.title}
                       </span>
                     </button>
                   );
                 })}
               </div>
             </div>
           ))}
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
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-900 relative">
        {/* Header */}
        <header className="flex-shrink-0 px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div>
            {activeItem ? (
              <>
                {activeItem.group && activeItem.group !== "Default" && (
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <span>{activeItem.group}</span>
                  </div>
                )}
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-lg">{activeItem.icon}</span>
                  {activeItem.title}
                  <span className="text-xs px-2 py-0.5 rounded-full border border-slate-600 bg-slate-700 text-slate-300 ml-2">Lab</span>
                </h1>
              </>
            ) : (
               <div className="text-xl font-bold text-white flex items-center gap-2">
                  Lab Environment
               </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExit}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors border border-slate-600 flex items-center gap-2"
            >
              <span>🚪</span> ออกจาก Lab
            </button>
          </div>
        </header>

        {/* Lab Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          {renderLabContent()}
        </div>
      </main>
    </div>
  );
}

