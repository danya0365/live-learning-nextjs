export default function ScheduleSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="h-10 w-64 bg-slate-200/50 rounded-xl mb-4 animate-pulse" />
        <div className="h-6 w-96 bg-slate-200/50 rounded-lg animate-pulse" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 text-center h-[90px] flex flex-col items-center justify-center animate-pulse">
            <div className="h-8 w-12 bg-slate-200/50 rounded-lg mb-2" />
            <div className="h-4 w-20 bg-slate-200/50 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 sm:p-6 mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-24 bg-slate-200/50 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-slate-200/50 rounded-full animate-pulse" />
          ))}
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="space-y-8">
        {[...Array(2)].map((_, dayIndex) => (
          <div key={dayIndex}>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-8 w-8 rounded-lg bg-slate-200/50 animate-pulse" />
              <div className="h-8 w-32 bg-slate-200/50 rounded-lg animate-pulse" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, cardIndex) => (
                <div key={cardIndex} className="glass rounded-2xl p-5 h-[160px] animate-pulse">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-6 w-6 rounded-full bg-slate-200/50" />
                    <div className="h-6 w-16 rounded-full bg-slate-200/50" />
                  </div>
                  <div className="h-5 w-48 bg-slate-200/50 rounded-lg mb-3" />
                  <div className="h-5 w-32 bg-slate-200/50 rounded-lg mb-4" />
                  <div className="h-10 w-full bg-slate-200/50 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
