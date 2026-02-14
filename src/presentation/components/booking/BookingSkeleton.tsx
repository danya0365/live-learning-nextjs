export default function BookingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Top bar ── */}
      <div className="h-14 border-b border-border/50 flex items-center justify-between px-4 max-w-3xl mx-auto w-full">
        <div className="h-4 w-24 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-slate-200/50 dark:bg-slate-700/50 animate-pulse" />
          <div className="h-4 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 sm:py-10">
        {/* Progress bar */}
        <div className="mb-8 flex items-center justify-between">
          {[1, 2, 3, 4].map((s, i) => (
            <div key={s} className="flex items-center gap-1.5 flex-1">
              <div className="w-9 h-9 rounded-full bg-slate-200/50 dark:bg-slate-700/50 animate-pulse flex-shrink-0" />
              <div className="h-3 w-16 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse hidden sm:block" />
              {i < 3 && <div className="flex-1 h-0.5 mx-2 bg-slate-200/50 dark:bg-slate-700/50 rounded" />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="h-8 w-64 bg-slate-200/50 dark:bg-slate-700/50 rounded mx-auto mb-2 animate-pulse" />
            <div className="h-4 w-48 bg-slate-200/50 dark:bg-slate-700/50 rounded mx-auto animate-pulse" />
          </div>

          <div className="h-12 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-2xl mb-6 animate-pulse" />

          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
