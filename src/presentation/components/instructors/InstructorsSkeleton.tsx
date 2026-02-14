export default function InstructorsSkeleton() {
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
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-24 bg-slate-200/50 dark:bg-slate-700/50 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="flex gap-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-slate-200/50 dark:bg-slate-700/50 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="h-5 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mb-6 animate-pulse" />

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-6 text-center animate-pulse">
            <div className="w-24 h-24 rounded-full bg-slate-200/50 dark:bg-slate-700/50 mx-auto mb-4" />
            <div className="h-6 w-3/4 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mx-auto mb-2" />
            <div className="h-4 w-1/2 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mx-auto mb-4" />
            
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-6 w-16 bg-slate-200/50 dark:bg-slate-700/50 rounded-full" />
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200/30 dark:border-slate-700/30">
               <div className="h-4 w-12 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
               <div className="h-4 w-12 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
