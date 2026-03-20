'use client';

import { useEffect, useState } from 'react';
import { useQAChecklistStore, TestCase } from '@/src/stores/useQAChecklistStore';
import Link from 'next/link';

export function QAView() {
  const store = useQAChecklistStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null; // Prevent hydration mismatch

  const { testCases, toggleTest, resetAll, getProgress, getCategoryProgress, addNote } = store;
  const progress = getProgress();

  // Group by category, preserve order of appearance
  const categories = Array.from(new Set(testCases.map(tc => tc.category)));

  const handleSaveNote = (id: string, currentNote: string) => {
    addNote(id, currentNote);
    // don't clear it so the input stays in sync, or just rely on the store
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in-up pb-32">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2 flex items-center gap-3">
            <span>🛡️</span> QA Testing Checklist
          </h1>
          <p className="text-text-secondary">
            ระบบตรวจสอบและติดตามการทดสอบระบบก่อนขึ้น Production (Zustand Store)
          </p>
        </div>

        {/* Global Progress */}
        <div className="glass rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 min-w-[280px]">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-border/50"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="text-primary transition-all duration-1000 ease-out"
                  strokeDasharray={`${progress.percentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-text-primary">
                {progress.percentage}%
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">ภาพรวมความพร้อม</p>
              <p className="text-xs text-text-muted">
                ผ่านแล้ว {progress.completed} / {progress.total} หัวข้อ
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตผลการทดสอบทั้งหมด?')) resetAll();
            }}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-error/10 text-error hover:bg-error/20 hover:scale-105 transition-all w-fit"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((category, index) => {
          const catTests = testCases.filter(tc => tc.category === category);
          const catProgress = getCategoryProgress(category);
          const isComplete = catProgress.completed === catProgress.total;

          // Determine color scheme based on index
          const hue1 = index * 45 + 180;
          const hue2 = index * 45 + 240;

          return (
            <div key={category} className="glass rounded-2xl p-6 border border-border/50 relative overflow-hidden">
               {/* Decorative Blur */}
               <div 
                className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-10 pointer-events-none"
                style={{ background: `linear-gradient(135deg, hsl(${hue1}, 80%, 60%), hsl(${hue2}, 80%, 40%))` }}
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10 border-b border-border/50 pb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-3">
                    <span 
                        className="w-4 h-4 rounded-full" 
                        style={{ background: `linear-gradient(135deg, hsl(${hue1}, 80%, 60%), hsl(${hue2}, 80%, 40%))` }}
                    />
                    {category}
                  </h3>
                  <p className="text-sm text-text-muted mt-1 ml-7">
                    กำลังทดสอบ Flow {category.split(':')[0]} — ผ่านแล้ว <span className="text-text-primary font-bold">{catProgress.completed}</span> จาก <span className="font-bold">{catProgress.total}</span>
                  </p>
                </div>
                {isComplete && (
                  <div className="px-4 py-1.5 rounded-full bg-success/10 text-success text-sm font-bold border border-success/20 flex items-center gap-2 shadow-sm">
                    <span>✅</span> ทดสอบผ่าน 100%
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
                {catTests.map((test) => (
                  <div 
                    key={test.id} 
                    className={`p-5 rounded-2xl border transition-all ${
                        test.completed 
                          ? 'bg-success/5 border-success/30 shadow-[inset_0_0_20px_rgba(0,255,100,0.05)]' 
                          : 'bg-surface/60 border-border/40 hover:border-primary/40 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start gap-4 h-full">
                        <div className="mt-1 cursor-pointer" onClick={() => toggleTest(test.id)}>
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors ${
                                test.completed 
                                    ? 'bg-success border-success text-white' 
                                    : 'border-border hover:border-primary/50'
                            }`}>
                                {test.completed && (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col h-full">
                            <h4 
                              className={`text-lg font-bold mb-1 cursor-pointer transition-colors ${test.completed ? 'text-success/90 line-through opacity-80' : 'text-text-primary hover:text-primary'}`}
                              onClick={() => toggleTest(test.id)}
                            >
                                {test.title}
                            </h4>
                            <p className="text-sm text-text-secondary mb-4">{test.description}</p>
                            
                            <div className="bg-background/80 rounded-xl p-3 border border-border/30 mb-4">
                                <p className="text-[10px] font-extrabold text-text-muted mb-2 uppercase tracking-widest">🧪 Steps to Test</p>
                                <ul className="list-decimal list-inside text-xs sm:text-sm text-text-secondary space-y-1.5 marker:text-text-muted marker:font-bold">
                                    {test.steps.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex items-start gap-2 text-sm mb-4">
                                <span className={test.completed ? 'text-success grayscale-0' : 'text-text-muted grayscale'}>🎯</span>
                                <div>
                                    <p className="font-extrabold text-text-muted text-[10px] uppercase tracking-widest">Expected Result</p>
                                    <p className={`font-medium text-sm ${test.completed ? 'text-success' : 'text-text-primary'}`}>{test.expectedResult}</p>
                                </div>
                            </div>

                            {/* Note Section */}
                            <div className="mt-auto pt-4 border-t border-border/40">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-extrabold text-text-muted text-[10px] uppercase tracking-widest">📝 Testing Notes</p>
                                {test.testedAt && (
                                  <p className="text-[10px] text-text-muted">
                                    ทดสอบเมื่อ: {new Date(test.testedAt).toLocaleString('th-TH')}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={noteInputs[test.id] !== undefined ? noteInputs[test.id] : (test.notes || '')}
                                  onChange={(e) => setNoteInputs(prev => ({ ...prev, [test.id]: e.target.value }))}
                                  placeholder="บันทึกย่อ หรือปัญหาที่เจอ..."
                                  className="flex-1 bg-background/50 border border-border/50 rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                                />
                                <button
                                  onClick={() => handleSaveNote(test.id, noteInputs[test.id] || '')}
                                  className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors"
                                >
                                  บันทึก
                                </button>
                              </div>
                            </div>

                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {progress.percentage === 100 && (
          <div className="mt-12 text-center flex flex-col items-center gap-4 animate-fade-in-up">
            <div className="p-8 glass rounded-3xl border border-success/30 shadow-[0_0_50px_rgba(0,255,100,0.1)] inline-block bg-success/5">
                <div className="text-6xl mb-4">🎉🚀</div>
                <h2 className="text-3xl font-extrabold text-success mb-2">ผ่านการทดสอบ 100%</h2>
                <p className="text-text-secondary font-medium text-lg">
                    ระบบพร้อมที่จะนำขึ้นสู่ Production (Launch) อย่างเป็นทางการแล้วครับ!
                </p>
            </div>
          </div>
      )}

      {/* Floating Shortcuts Menu */}
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
        <div className="glass rounded-2xl p-4 shadow-2xl border border-primary/20 flex flex-col gap-3 min-w-[150px]">
          <p className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1">⚡ Shortcuts Menu</p>
          <Link href="/" target="_blank" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-2">
            <span>🏠</span> หน้าหลัก (Home)
          </Link>
          <Link href="/auth/login" target="_blank" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-2">
            <span>🔐</span> เข้าสู่ระบบ
          </Link>
          <Link href="/courses" target="_blank" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-2">
            <span>📚</span> คอร์สทั้งหมด
          </Link>
          <Link href="/consultations" target="_blank" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-2">
            <span>🤝</span> บอร์ดคำปรึกษา
          </Link>
          <Link href="/my-bookings" target="_blank" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-2">
            <span>📅</span> ตารางเรียน
          </Link>
        </div>
      </div>
    </div>
  );
}
