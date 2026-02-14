export default function LiveSessionsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="h-10 w-64 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl mb-4 animate-pulse" />
        <div className="h-6 w-96 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg animate-pulse" />
      </div>

      {/* Featured/Live Now */}
      <div className="mb-12">
        <div className="h-8 w-48 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mb-6 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
              <div className="h-56 w-full bg-slate-200/50 dark:bg-slate-700/50" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                   <div className="h-6 w-3/4 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
                   <div className="h-6 w-16 bg-slate-200/50 dark:bg-slate-700/50 rounded-full" />
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="h-10 w-10 bg-slate-200/50 dark:bg-slate-700/50 rounded-full" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 w-1/2 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
                    <div className="h-3 w-1/3 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
                  </div>
                </div>
                <div className="h-10 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div>
        <div className="h-8 w-48 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mb-6 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
              <div className="h-40 w-full bg-slate-200/50 dark:bg-slate-700/50" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
                <div className="h-4 w-1/2 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
                <div className="pt-4 flex justify-between border-t border-slate-200/30 dark:border-slate-700/30">
                  <div className="h-4 w-20 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
                  <div className="h-4 w-16 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
