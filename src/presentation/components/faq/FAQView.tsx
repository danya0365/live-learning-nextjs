'use client';

import { FAQViewModel } from '@/src/presentation/presenters/faq/FAQPresenter';
import { useState } from 'react';

interface FAQViewProps {
  initialViewModel: FAQViewModel;
}

export function FAQView({ initialViewModel }: FAQViewProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [openItem, setOpenItem] = useState<string | null>(null);

  const categories = ['all', ...initialViewModel.stats.categories];

  const filteredItems = activeTab === 'all' 
    ? initialViewModel.items 
    : initialViewModel.items.filter(item => item.category === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header — consistent with CoursesView */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          ❓ คำถามที่พบบ่อย
        </h1>
        <p className="text-text-secondary">
          รวบรวมข้อสงสัยและคำแนะนำในการใช้งาน Live Learning เพื่อให้คุณเริ่มต้นเรียนรู้ได้อย่างราบรื่น
        </p>
      </div>

      {/* Category Tabs */}
      <div className="glass rounded-2xl p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveTab(cat);
                setOpenItem(null);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === cat
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-surface/50 text-text-secondary hover:text-text-primary hover:bg-surface border border-border/50'
              }`}
            >
              {cat === 'all' ? 'ทั้งหมด' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4 mb-12">
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            className={`glass rounded-2xl overflow-hidden transition-all duration-300 border ${
              openItem === item.id ? 'border-primary/30 shadow-lg shadow-primary/5 bg-surface/80' : 'border-border/30 hover:border-primary/20'
            }`}
          >
            <button
              onClick={() => setOpenItem(openItem === item.id ? null : item.id)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <span className="font-bold text-lg text-text-primary pr-8 leading-snug">
                {item.question}
              </span>
              <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-surface border border-border ${
                openItem === item.id ? 'rotate-180 bg-primary text-white border-primary' : 'text-text-muted'
              }`}>
                ▼
              </span>
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openItem === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-6 pt-0 text-text-secondary leading-relaxed border-t border-border/10 mt-2">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Support CTA */}
      <div className="glass rounded-2xl p-8 sm:p-12 border border-border/50 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="relative z-10 max-w-xl">
          <h3 className="text-2xl font-extrabold text-text-primary mb-2">ยังไม่พบคำตอบที่คุณต้องการ?</h3>
          <p className="text-text-secondary">ทีมงานของเราพร้อมช่วยเหลือคุณตลอด 24 ชั่วโมง ผ่านช่องทางต่างๆ</p>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 flex-shrink-0">
          <a 
            href="/contact" 
            className="btn-game px-6 py-3 rounded-xl text-white font-bold inline-flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-primary/20"
          >
            💬 ติดต่อฝ่ายบริการลูกค้า
          </a>
          <a 
            href="/discord" 
            className="px-6 py-3 rounded-xl bg-surface border border-border text-text-primary font-bold inline-flex items-center justify-center gap-2 hover:bg-surface-elevated transition-colors"
          >
            👾 เข้าร่วม Discord
          </a>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
