export default function InstructorDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-20 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <div className="h-4 w-40 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
      </div>

      {/* Profile Header */}
      <div className="glass rounded-3xl p-6 sm:p-8 mb-8 animate-pulse">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-2xl bg-slate-200/50 dark:bg-slate-700/50" />
          
          {/* Info */}
          <div className="text-center sm:text-left flex-1 min-w-0 w-full space-y-3">
            <div className="h-8 w-64 mx-auto sm:mx-0 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-2" />
            <div className="h-6 w-3/4 mx-auto sm:mx-0 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-2" />
            <div className="h-4 w-1/2 mx-auto sm:mx-0 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-4" />
            
            <div className="flex justify-center sm:justify-start gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 w-20 bg-slate-200/50 dark:bg-slate-700/50 rounded-full" />
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex sm:flex-col gap-4 sm:gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-xl p-3 text-center min-w-[80px]">
                <div className="h-6 w-12 mx-auto mb-1 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
                <div className="h-3 w-8 mx-auto bg-slate-200/50 dark:bg-slate-700/50 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Courses section */}
        <div>
          <div className="h-8 w-48 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-4 animate-pulse" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-xl p-4 flex gap-4 animate-pulse">
                <div className="w-16 h-16 rounded-lg bg-slate-200/50 dark:bg-slate-700/50 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
                  <div className="h-4 w-1/2 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeslots section */}
        <div>
          <div className="h-8 w-40 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-4 animate-pulse" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-xl p-4 animate-pulse">
                <div className="flex justify-between mb-2">
                  <div className="h-4 w-20 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
                  <div className="h-4 w-12 bg-slate-200/50 dark:bg-slate-700/50 rounded-full" />
                </div>
                <div className="h-6 w-40 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-1" />
                <div className="h-8 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
