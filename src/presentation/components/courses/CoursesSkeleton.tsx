export default function CoursesSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="h-10 w-64 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl mb-4 animate-pulse" />
        <div className="h-6 w-96 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg animate-pulse" />
      </div>

      {/* Filters Bar */}
      <div className="glass rounded-2xl p-4 sm:p-6 mb-8 flex flex-col gap-4">
        {/* Search */}
        <div className="h-12 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-xl animate-pulse" />

        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-24 bg-slate-200/50 dark:bg-slate-700/50 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-slate-200/50 dark:bg-slate-700/50 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="h-5 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mb-6 animate-pulse" />

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
            <div className="h-44 bg-slate-200/50 dark:bg-slate-700/50" />
            <div className="p-5 space-y-3">
              <div className="h-6 w-3/4 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
              <div className="h-4 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
              <div className="h-4 w-1/2 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
              <div className="flex items-center gap-2 pt-2">
                <div className="h-7 w-7 rounded-full bg-slate-200/50 dark:bg-slate-700/50" />
                <div className="h-4 w-24 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
              </div>
              <div className="flex justify-between pt-4 border-t border-slate-200/30">
                <div className="h-6 w-12 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
                <div className="h-6 w-20 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
