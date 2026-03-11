export default function NewConsultationSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="h-4 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-4 animate-pulse" />
        <div className="h-10 w-64 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-2 animate-pulse" />
        <div className="h-4 w-96 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-full bg-slate-200/50 dark:bg-slate-700/50 animate-pulse" />
            <div className="h-4 w-16 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse hidden sm:block" />
            {s < 3 && <div className="flex-1 h-0.5 bg-slate-200/50 dark:bg-slate-700/50" />}
          </div>
        ))}
      </div>

      {/* Form content */}
      <div className="space-y-6">
        <div>
          <div className="h-4 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-3 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-slate-200/50 dark:bg-slate-700/50 animate-pulse" />
            ))}
          </div>
        </div>

        <div>
          <div className="h-4 w-40 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-1.5 animate-pulse" />
          <div className="h-12 w-full rounded-xl bg-slate-200/50 dark:bg-slate-700/50 animate-pulse" />
        </div>

        <div>
          <div className="h-4 w-40 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-1.5 animate-pulse" />
          <div className="h-32 w-full rounded-xl bg-slate-200/50 dark:bg-slate-700/50 animate-pulse" />
        </div>

        <div className="h-12 w-full rounded-xl bg-slate-200/50 dark:bg-slate-700/50 animate-pulse mt-8" />
      </div>
    </div>
  );
}
