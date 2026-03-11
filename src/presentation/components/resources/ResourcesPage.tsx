'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

// Mock Data
type ResourceCategory = 'All' | 'Cheat Sheets' | 'Roadmaps' | 'PDF Books' | 'Tools';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: Exclude<ResourceCategory, 'All'>;
  icon: string;
  author: string;
  downloads: number;
  color: string;
}

const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'React 19 Cheat Sheet',
    description: 'สรุป Hooks และฟีเจอร์ใหม่ใน React 19 แบบกระชับ เข้าใจง่าย',
    category: 'Cheat Sheets',
    icon: '⚛️',
    author: 'Khun Dev',
    downloads: 1250,
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
  },
  {
    id: '2',
    title: 'Frontend Developer Roadmap 2026',
    description: 'เส้นทางการเรียนรู้สู่การเป็น Frontend Developer ระดับโปร',
    category: 'Roadmaps',
    icon: '🗺️',
    author: 'CodeMaster',
    downloads: 3400,
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
  },
  {
    id: '3',
    title: 'Mastering Tailwind CSS 4',
    description: 'E-Book สอนเขียน Tailwind CSS 4 ตั้งแต่พื้นฐานจนถึงขั้นสูง',
    category: 'PDF Books',
    icon: '📘',
    author: 'UI Design Pro',
    downloads: 890,
    color: 'from-teal-500/20 to-emerald-500/20 border-teal-500/30'
  },
  {
    id: '4',
    title: 'Next.js 16 App Router Guide',
    description: 'เจาะลึกการใช้งาน App Router และ Server Actions',
    category: 'Cheat Sheets',
    icon: '🚀',
    author: 'Next Ninja',
    downloads: 2100,
    color: 'from-gray-500/20 to-slate-500/20 border-gray-500/30'
  },
  {
    id: '5',
    title: 'UI Colors Palette Generator',
    description: 'เครื่องมือสร้างชุดสีที่เข้ากันสำหรับงานออกแบบ UI',
    category: 'Tools',
    icon: '🎨',
    author: 'DesignHub',
    downloads: 5600,
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30'
  },
  {
    id: '6',
    title: 'Backend Developer Roadmap 2026',
    description: 'เส้นทางการเรียนรู้สู่การเป็น Backend Developer',
    category: 'Roadmaps',
    icon: '🛤️',
    author: 'ServerGuru',
    downloads: 2800,
    color: 'from-green-500/20 to-lime-500/20 border-green-500/30'
  }
];

const CATEGORIES: ResourceCategory[] = ['All', 'Cheat Sheets', 'Roadmaps', 'PDF Books', 'Tools'];

export function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter resources
  const filteredResources = MOCK_RESOURCES.filter(res => {
    const matchesCategory = activeCategory === 'All' || res.category === activeCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20 backdrop-blur-md">
          <span className="animate-pulse">✨</span>
          <span>Free Learning Resources</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-4">
          คลังความรู้ <span className="gradient-text">แจกฟรี!</span>
        </h1>
        <p className="text-lg md:text-xl text-text-secondary">
          ดาวน์โหลดเอกสารประกอบการเรียน Cheat Sheet และ Roadmap เพื่อเสริมสร้างทักษะระหว่างรอคลาสเรียนสด
        </p>

        {/* Search Bar */}
        <div className="mt-8 relative max-w-xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-xl opacity-50">🔍</span>
            </div>
            <input 
                type="text" 
                placeholder="ค้นหาเอกสาร, บทความ, หรือเครื่องมือ..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-surface/50 border border-border/50 rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-sm backdrop-blur-sm"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-10" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeCategory === category
                ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                : 'bg-surface/50 text-text-secondary hover:bg-surface border border-border/50 hover:text-text-primary hover:border-border'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Resource Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          <AnimatePresence mode="popLayout">
            {filteredResources.map((resource) => (
              <motion.div
                key={resource.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`group relative flex flex-col p-6 rounded-3xl border bg-surface/30 backdrop-blur-sm hover:bg-surface/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden ${resource.color}`}
              >
                {/* Background gradient hint */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${resource.color} rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-surface/80 border border-border/50 shadow-sm flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {resource.icon}
                  </div>
                  <span className="px-3 py-1 bg-surface-elevated/80 border border-border/50 rounded-full text-xs font-semibold text-text-secondary backdrop-blur-md">
                    {resource.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-text-primary mb-2 line-clamp-2 relative z-10 group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                
                <p className="text-text-secondary text-sm flex-1 mb-6 line-clamp-3 relative z-10">
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-border/30 mt-auto relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-surface-elevated flex items-center justify-center text-xs">
                       👤
                    </div>
                    <span className="text-xs font-medium text-text-secondary">{resource.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
                    <span>⬇️</span>
                    <span>{resource.downloads.toLocaleString()}</span>
                  </div>
                </div>

                {/* Hover action button (fake download) */}
                 <div className="absolute inset-x-4 bottom-4 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <button className="w-full py-3 bg-text-primary text-background font-bold rounded-xl shadow-lg ring-1 ring-white/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                        <span>ดาวน์โหลดฟรี</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </button>
                </div>
                {/* Mask to hide inner content when button comes up */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent translate-y-24 group-hover:translate-y-0 transition-transform duration-300 z-10 pointer-events-none" />

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-24 bg-surface/30 rounded-3xl border border-border/50 backdrop-blur-sm relative z-10">
            <span className="text-6xl mb-4 block opacity-50">🔍📄</span>
            <h3 className="text-xl font-bold text-text-primary mb-2">ไม่พบเอกสาร</h3>
            <p className="text-text-secondary">ไม่มีข้อมูลที่ตรงกับคำค้นหาของคุณ ลองเปลี่ยนคำค้นหาใหม่</p>
            <button 
                onClick={() => {setSearchQuery(''); setActiveCategory('All')}}
                className="mt-6 px-6 py-2 bg-surface-elevated hover:bg-surface border border-border rounded-xl font-medium transition-colors inline-block"
            >
                ล้างการค้นหา
            </button>
        </div>
      )}
    </div>
  );
}
