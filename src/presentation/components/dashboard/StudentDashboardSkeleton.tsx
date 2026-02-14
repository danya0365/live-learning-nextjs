export default function StudentDashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Welcome Banner */}
      <div className="mb-8">
        <div className="h-10 w-64 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl mb-4 animate-pulse" />
        <div className="h-6 w-96 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg animate-pulse" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 flex items-center justify-between animate-pulse">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
              <div className="h-8 w-16 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
            </div>
            <div className="h-12 w-12 bg-slate-200/50 dark:bg-slate-700/50 rounded-full" />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upcoming Classes */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="h-8 w-48 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg animate-pulse" />
              <div className="h-8 w-24 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg animate-pulse" />
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass border border-slate-200/50 rounded-xl p-4 flex gap-4 animate-pulse">
                  <div className="w-16 h-16 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
                    <div className="h-4 w-1/2 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
                    <div className="flex gap-2 pt-1">
                      <div className="h-6 w-20 bg-slate-200/50 dark:bg-slate-700/50 rounded-full" />
                      <div className="h-6 w-20 bg-slate-200/50 dark:bg-slate-700/50 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="space-y-8">
          <div className="glass rounded-2xl p-6">
            <div className="h-8 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mb-6 animate-pulse" />
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="glass border border-slate-200/50 rounded-xl p-4 animate-pulse">
                  <div className="h-32 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mb-3" />
                  <div className="h-5 w-3/4 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mb-2" />
                  <div className="h-4 w-1/2 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
