export default function ConsultationDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <div className="h-4 w-40 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Details & Messages */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6 sm:p-8">
            <div className="h-8 w-3/4 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mb-4 animate-pulse" />
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="h-6 w-20 bg-slate-200/50 dark:bg-slate-700/50 rounded-full animate-pulse" />
              <div className="h-6 w-24 bg-slate-200/50 dark:bg-slate-700/50 rounded-full animate-pulse" />
            </div>
            
            <div className="space-y-2 mb-8">
              <div className="h-4 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
              <div className="h-4 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse" />
            </div>

            <div className="h-px bg-slate-200/30 dark:bg-slate-700/30 mb-8" />

            {/* Messages Area */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200/50 dark:bg-slate-700/50 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-1" />
                  <div className="h-20 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-xl" />
                </div>
              </div>
              <div className="flex gap-4 flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-slate-200/50 dark:bg-slate-700/50 flex-shrink-0" />
                <div className="space-y-2 flex-1 flex flex-col items-end">
                  <div className="h-4 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-1" />
                  <div className="h-16 w-3/4 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl" />
                </div>
              </div>
            </div>
            
            {/* Input Box Skeleton */}
            <div className="mt-8 pt-4">
              <div className="h-32 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>

        {/* Sidebar: Status & Info */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <div className="h-6 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mb-6 animate-pulse" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
                <div className="h-6 w-24 bg-slate-200/50 dark:bg-slate-700/50 rounded-full" />
              </div>
              
              <div className="h-px bg-slate-200/30 dark:bg-slate-700/30 my-4" />
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-200/50 dark:bg-slate-700/50" />
                <div>
                  <div className="h-4 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-1" />
                  <div className="h-3 w-20 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
                </div>
              </div>
              
              <div className="mt-6">
                <div className="h-10 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
