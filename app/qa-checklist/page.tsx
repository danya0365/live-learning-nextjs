
'use client';

/**
 * QA Checklist Page
 * Manual testing checklist for the Live Learning system
 */

import { AnimatedCard } from '@/src/presentation/components/ui/AnimatedCard';
import { GlowButton } from '@/src/presentation/components/ui/GlowButton';
import { useQAChecklistStore } from '@/src/stores/useQAChecklistStore';
import { useEffect, useState } from 'react';

export default function QAChecklistPage() {
  const { testCases, toggleTest, resetAll, getProgress, getCategoryProgress, addNote } = useQAChecklistStore();
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500">Loading checklist...</div>
      </div>
    );
  }

  const progress = getProgress();
  const categories = [...new Set(testCases.map(tc => tc.category))];

  const handleSaveNote = (id: string) => {
    addNote(id, noteInput);
    setNoteInput('');
    setExpandedId(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  🧪 QA Checklist
                </span>
              </h1>
              <p className="text-zinc-500 text-sm mt-1">Manual Testing for Live Learning System</p>
            </div>
            <GlowButton
              color="red"
              size="sm"
              onClick={() => {
                if (confirm('Are you sure you want to reset all progress?')) {
                  resetAll();
                }
              }}
            >
              🔄 Reset
            </GlowButton>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <section className="max-w-4xl mx-auto px-4 py-6">
        <AnimatedCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Overall Progress</h2>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              {progress.percentage}%
            </span>
          </div>
          
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          
          <div className="flex justify-between mt-2 text-sm text-zinc-500">
            <span>{progress.completed} / {progress.total} tests</span>
            <span>
              {progress.completed === progress.total && progress.total > 0 ? (
                <span className="text-emerald-500 font-bold">✅ All Systems Go!</span>
              ) : (
                <span>{progress.total - progress.completed} remaining</span>
              )}
            </span>
          </div>
        </AnimatedCard>
      </section>

      {/* Test Cases by Category */}
      <section className="max-w-4xl mx-auto px-4 space-y-6">
        {categories.map(category => {
          const categoryProgress = getCategoryProgress(category);
          const categoryTests = testCases.filter(tc => tc.category === category);
          const isComplete = categoryProgress.completed === categoryProgress.total;

          return (
            <AnimatedCard key={category} className="overflow-hidden">
              {/* Category Header */}
              <div className={`px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 ${
                isComplete ? 'bg-emerald-500/10' : 'bg-zinc-100 dark:bg-zinc-900/50'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    {isComplete ? '✅' : '📋'} {category}
                  </h3>
                  <span className={`text-sm font-medium ${
                    isComplete ? 'text-emerald-500' : 'text-zinc-500'
                  }`}>
                    {categoryProgress.completed}/{categoryProgress.total}
                  </span>
                </div>
              </div>

              {/* Test Cases */}
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {categoryTests.map(tc => (
                  <div
                    key={tc.id}
                    className={`p-4 transition-colors ${
                      tc.completed ? 'bg-emerald-500/5' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleTest(tc.id)}
                        className={`w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          tc.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-zinc-300 dark:border-zinc-600 hover:border-blue-500'
                        }`}
                      >
                        {tc.completed && '✓'}
                      </button>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className={`font-medium ${
                              tc.completed ? 'text-zinc-500 line-through' : ''
                            }`}>
                              {tc.title}
                            </h4>
                            <p className="text-sm text-zinc-500 mt-1">{tc.description}</p>
                          </div>
                          <button
                            onClick={() => setExpandedId(expandedId === tc.id ? null : tc.id)}
                            className="text-zinc-400 hover:text-blue-500 text-sm whitespace-nowrap"
                          >
                            {expandedId === tc.id ? '▲ Hide' : '▼ Details'}
                          </button>
                        </div>

                        {/* Expanded Details */}
                        {expandedId === tc.id && (
                          <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                            {/* Steps */}
                            <div>
                              <h5 className="text-sm font-medium mb-2">📝 Steps:</h5>
                              <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-500">
                                {tc.steps.map((step, idx) => (
                                  <li key={idx}>{step}</li>
                                ))}
                              </ol>
                            </div>

                            {/* Expected Result */}
                            <div>
                              <h5 className="text-sm font-medium mb-2">✅ Expected Result:</h5>
                              <p className="text-sm text-emerald-600 dark:text-emerald-400">{tc.expectedResult}</p>
                            </div>

                            {/* Notes */}
                            <div>
                              <h5 className="text-sm font-medium mb-2">📌 Notes:</h5>
                              {tc.notes ? (
                                <p className="text-sm text-zinc-500 bg-zinc-100 dark:bg-zinc-800 p-2 rounded">{tc.notes}</p>
                              ) : (
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={noteInput}
                                    onChange={(e) => setNoteInput(e.target.value)}
                                    placeholder="Add a note..."
                                    className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  <button
                                    onClick={() => handleSaveNote(tc.id)}
                                    className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50"
                                  >
                                    Save
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Tested At */}
                            {tc.testedAt && (
                              <div className="text-xs text-zinc-400">
                                Last tested: {new Date(tc.testedAt).toLocaleString()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedCard>
          );
        })}
      </section>

      {/* Quick Navigation Footer */}
      <section className="fixed bottom-4 right-4 z-40">
        <AnimatedCard className="p-4 shadow-2xl border-blue-200 dark:border-blue-900">
          <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">Shortcuts</h4>
          <div className="space-y-2 text-sm flex flex-col">
            <a href="/" target="_blank" className="text-blue-500 hover:underline">🏠 Home</a>
            <a href="/auth/login" target="_blank" className="text-blue-500 hover:underline">🔐 Login</a>
            <a href="/courses" target="_blank" className="text-blue-500 hover:underline">📚 Courses</a>
            <a href="/my-bookings" target="_blank" className="text-blue-500 hover:underline">📅 Bookings</a>
          </div>
        </AnimatedCard>
      </section>
    </div>
  );
}
