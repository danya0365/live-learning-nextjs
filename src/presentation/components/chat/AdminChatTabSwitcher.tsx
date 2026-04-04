"use client";

import { MessageSquare, Inbox, Star, CheckCircle, Bot, ChevronDown } from "lucide-react";
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
}

interface AdminChatTabSwitcherProps {
  activeTab: string;
  counts: Record<string, number>;
}

const TABS = [
  { id: "active", label: "กำลังดำเนินการ", icon: MessageSquare },
  { id: "new", label: "มาใหม่", icon: Inbox },
  { id: "follow_up", label: "รอดำเนินการ", icon: Star },
  { id: "resolved", label: "ปิดงานแล้ว", icon: CheckCircle },
  { id: "all", label: "ทั้งหมด", icon: Bot },
];

export function AdminChatTabSwitcher({ activeTab, counts }: AdminChatTabSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentTab = TABS.find(t => t.id === activeTab) || TABS[0];
  const CurrentIcon = currentTab.icon;
  const currentCount = counts[activeTab] || 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mb-10" ref={dropdownRef}>
      {/* Desktop Navigation (md+) */}
      <nav className="hidden md:flex items-center gap-2 glass p-2 rounded-[2.5rem] border shadow-2xl overflow-x-auto no-scrollbar animate-in zoom-in-95 duration-500">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = counts[tab.id] || 0;
          return (
            <Link
              key={tab.id}
              href={`/admin/chat?status=${tab.id}`}
              className={`flex items-center gap-2.5 px-6 py-4 rounded-[1.5rem] text-sm font-black transition-all group whitespace-nowrap ${
                isActive 
                ? "btn-game scale-105 shadow-xl shadow-primary/30" 
                : "text-text-muted hover:bg-white/10 hover:text-text-primary"
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-text-muted"}`} />
              <span>{tab.label}</span>
              {count > 0 && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive 
                  ? "bg-white text-primary ring-2 ring-white/20" 
                  : "bg-primary/10 text-primary group-hover:bg-primary/20"
                }`}>
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Navigation (<md) */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-6 py-4 glass rounded-[2.2rem] border-2 border-white/20 shadow-xl group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
               <CurrentIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
               <div className="flex items-center gap-2 mb-1">
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none">หมวดหมู่ปัจจุบัน</p>
                 {currentCount > 0 && (
                   <span className="bg-primary/20 text-primary text-[8px] font-black px-1.5 py-0.5 rounded-md leading-none">
                     {currentCount}
                   </span>
                 )}
               </div>
               <h3 className="text-base font-black text-text-primary tracking-tight">{currentTab.label}</h3>
            </div>
          </div>
          <div className={`p-2 glass rounded-full transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
            <ChevronDown className="w-5 h-5 text-text-muted" />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-[calc(100%+0.75rem)] left-0 right-0 z-50 glass rounded-[2.5rem] p-3 shadow-2xl border-white/30 backdrop-blur-2xl overflow-hidden"
            >
              <div className="grid gap-1">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const count = counts[tab.id] || 0;
                  return (
                    <Link
                      key={tab.id}
                      href={`/admin/chat?status=${tab.id}`}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-5 py-3.5 rounded-3xl transition-all ${
                        isActive 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-text-muted hover:bg-white/10 hover:text-text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-text-muted"}`} />
                        <span className="text-sm font-black tracking-tight">{tab.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {count > 0 && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isActive ? "bg-primary text-white" : "bg-primary/10 text-primary"
                          }`}>
                            {count}
                          </span>
                        )}
                        {isActive && (
                          <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--color-primary),0.5)]" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
