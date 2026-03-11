export default function CategoriesSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="h-10 w-64 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl mx-auto mb-4 animate-pulse" />
        <div className="h-6 w-96 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mx-auto animate-pulse" />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-6 text-center animate-pulse flex flex-col items-center justify-center aspect-square">
            <div className="w-16 h-16 rounded-full bg-slate-200/50 dark:bg-slate-700/50 mb-4" />
            <div className="h-5 w-24 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg mb-2" />
            <div className="h-4 w-16 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
