export default function SettingsSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative py-12 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-200/50 dark:bg-slate-700/50 animate-pulse" />
            <div className="space-y-2">
              <div className="h-8 w-48 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
              <div className="h-4 w-64 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar tabs */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="flex lg:flex-col gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="h-8 w-48 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-8 animate-pulse" />
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-slate-200/50 dark:bg-slate-700/50 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
                    <div className="h-3 w-48 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
                  </div>
                </div>

                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
                    <div className="h-12 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-xl animate-pulse" />
                  </div>
                ))}
                
                <div className="h-12 w-40 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
