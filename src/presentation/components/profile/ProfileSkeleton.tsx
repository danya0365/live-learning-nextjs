export default function ProfileSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Profile header */}
      <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-slate-200/50 dark:bg-slate-700/50 animate-pulse" />

          <div className="text-center sm:text-left flex-1 space-y-3">
            <div className="h-8 w-48 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mx-auto sm:mx-0 animate-pulse" />
            <div className="h-4 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded mx-auto sm:mx-0 animate-pulse" />
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <div className="h-6 w-20 bg-slate-200/50 dark:bg-slate-700/50 rounded-full animate-pulse" />
              <div className="h-4 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="h-10 w-24 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl animate-pulse" />
            <div className="h-10 w-24 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-xl p-4 text-center">
            <div className="h-8 w-8 mx-auto bg-slate-200/50 dark:bg-slate-700/50 rounded mb-2 animate-pulse" />
            <div className="h-6 w-16 mx-auto bg-slate-200/50 dark:bg-slate-700/50 rounded mb-1 animate-pulse" />
            <div className="h-3 w-12 mx-auto bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Achievements */}
          <div className="glass rounded-2xl p-6">
            <div className="h-6 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-4 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass rounded-xl p-3 text-center h-24 bg-slate-200/20 dark:bg-slate-700/20 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Recent bookings */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
              <div className="h-4 w-16 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl">
                  <div className="h-12 w-14 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 h-64 bg-slate-200/20 dark:bg-slate-700/20 animate-pulse" />
          <div className="glass rounded-2xl p-6 h-48 bg-slate-200/20 dark:bg-slate-700/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
