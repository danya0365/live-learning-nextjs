export default function ConsultationsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="h-10 w-64 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl mb-4 animate-pulse" />
          <div className="h-6 w-96 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-40 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl animate-pulse" />
      </div>

      {/* Tabs / Filters */}
      <div className="mb-6 flex gap-4 border-b border-slate-200/30 dark:border-slate-700/30 pb-4">
        {[...Array(3)].map((_, i) => (
           <div key={i} className="h-8 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Consultation Board Columns (Kanban style or List) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, colIndex) => (
          <div key={colIndex} className="glass rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="h-5 w-32 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mb-4 animate-pulse" />
            
            <div className="space-y-4">
              {[...Array(3)].map((_, cardIndex) => (
                <div key={cardIndex} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm animate-pulse border border-slate-200/50 dark:border-slate-700/50">
                   <div className="flex gap-3 mb-2">
                     <div className="h-8 w-8 rounded-full bg-slate-200/50 dark:bg-slate-700/50" />
                     <div className="flex-1 space-y-1">
                       <div className="h-4 w-3/4 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
                       <div className="h-3 w-1/2 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
                     </div>
                   </div>
                   <div className="h-3 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded mb-2" />
                   <div className="h-3 w-5/6 bg-slate-200/50 dark:bg-slate-700/50 rounded mb-4" />
                   
                   <div className="flex justify-between items-center">
                     <div className="h-5 w-16 bg-slate-200/50 dark:bg-slate-700/50 rounded-full" />
                     <div className="h-4 w-12 bg-slate-200/50 dark:bg-slate-700/50 rounded" />
                   </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
