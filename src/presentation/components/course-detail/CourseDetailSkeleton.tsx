export default function CourseDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-20 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <div className="h-4 w-40 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - left 2 cols */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero banner */}
          <div className="relative rounded-3xl overflow-hidden h-56 sm:h-72 bg-slate-200/50 dark:bg-slate-700/50 animate-pulse" />

          {/* Title & tags */}
          <div>
            <div className="h-8 sm:h-10 w-3/4 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl mb-4 animate-pulse" />
            <div className="flex flex-wrap gap-2 mb-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 w-16 bg-slate-200/50 dark:bg-slate-700/50 rounded-full animate-pulse" />
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-xl p-4 text-center animate-pulse">
                <div className="h-8 w-8 mx-auto mb-2 bg-slate-200/50 dark:bg-slate-700/50 rounded-full" />
                <div className="h-6 w-16 mx-auto mb-1 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
                <div className="h-3 w-12 mx-auto bg-slate-200/50 dark:bg-slate-700/50 rounded" />
              </div>
            ))}
          </div>

          {/* Instructor timeslots */}
          <div>
            <div className="h-7 w-48 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mb-4 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass rounded-xl p-4 animate-pulse">
                  <div className="flex justify-between mb-2">
                    <div className="h-4 w-16 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
                    <div className="h-4 w-12 bg-slate-200/50 dark:bg-slate-700/50 rounded-full" />
                  </div>
                  <div className="h-6 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-2" />
                  <div className="h-8 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - right col */}
        <div className="space-y-6">
          {/* Price card */}
          <div className="glass rounded-2xl p-6">
            <div className="text-center mb-6">
              <div className="h-10 w-32 mx-auto bg-slate-200/50 dark:bg-slate-700/50 rounded-xl mb-2 animate-pulse" />
              <div className="h-3 w-16 mx-auto bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
            </div>
            <div className="h-12 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-xl mb-3 animate-pulse" />
            
            <div className="mt-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-20 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Instructor card */}
          <div className="glass rounded-2xl p-6 text-center animate-pulse">
            <div className="h-4 w-32 mx-auto mb-4 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-200/50 dark:bg-slate-700/50" />
            <div className="h-6 w-40 mx-auto mb-2 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
            <div className="flex justify-center gap-2 mb-3">
              <div className="h-4 w-12 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
              <div className="h-4 w-8 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
            </div>
            <div className="flex justify-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-5 w-16 bg-slate-200/50 dark:bg-slate-700/50 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
