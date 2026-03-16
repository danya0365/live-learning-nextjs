export default function WalletSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-24">
      {/* Page Header */}
      <div className="mb-8 space-y-3">
        <div className="h-10 w-48 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg animate-pulse" />
        <div className="h-5 w-72 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Balance Card Skeleton */}
          <div className="glass rounded-2xl p-6 sm:p-8 h-64 bg-slate-200/20 dark:bg-slate-700/20 animate-pulse border border-border/50" />
          {/* Quick Info Skeleton */}
          <div className="glass rounded-2xl p-6 h-32 bg-slate-200/20 dark:bg-slate-700/20 animate-pulse border border-border/50" />
        </div>

        {/* Right Column (Transactions) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6 sm:p-8 border border-border/50 min-h-[400px]">
            <div className="h-8 w-48 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-6 animate-pulse" />
            
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-200/10 dark:bg-slate-700/10 animate-pulse border border-border/20 gap-4 sm:gap-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-200/50 dark:bg-slate-700/50 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-5 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
                      <div className="h-4 w-24 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="text-left sm:text-right pl-16 sm:pl-0 space-y-2">
                    <div className="h-5 w-24 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse sm:ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
