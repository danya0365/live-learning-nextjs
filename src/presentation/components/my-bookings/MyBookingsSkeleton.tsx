export default function MyBookingsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="h-10 w-64 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl mb-4 animate-pulse" />
        <div className="h-6 w-96 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg animate-pulse" />
      </div>
      
      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200/30 dark:border-slate-700/30 mb-8 pb-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-6 flex flex-col md:flex-row gap-6 animate-pulse">
            {/* Date/Time Column */}
            <div className="md:w-48 flex-shrink-0 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-200/30 dark:border-slate-700/30 pb-4 md:pb-0 md:pr-6">
              <div className="h-6 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-2" />
              <div className="h-4 w-24 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
            </div>

            {/* Info Column */}
            <div className="flex-1 min-w-0">
              <div className="h-4 w-20 bg-slate-200/50 dark:bg-slate-700/50 rounded-full mb-3" />
              <div className="h-6 w-3/4 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mb-2" />
              <div className="flex items-center gap-3 mt-3">
                <div className="w-8 h-8 rounded-full bg-slate-200/50 dark:bg-slate-700/50" />
                <div className="h-4 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
              </div>
            </div>

            {/* Action Column */}
            <div className="flex items-center md:items-start pt-4 md:pt-0">
              <div className="h-10 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
