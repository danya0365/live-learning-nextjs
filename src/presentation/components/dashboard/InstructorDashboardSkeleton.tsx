export default function InstructorDashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <div className="h-10 w-64 bg-slate-200/50 rounded-xl mb-4 animate-pulse" />
          <div className="h-6 w-96 bg-slate-200/50 rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-4">
          <div className="h-12 w-32 bg-slate-200/50 rounded-xl animate-pulse" />
          <div className="h-12 w-32 bg-slate-200/50 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-6 flex items-center justify-between text-center animate-pulse">
            <div className="flex-1 space-y-2">
              <div className="h-8 w-16 bg-slate-200/50 rounded-lg mx-auto" />
              <div className="h-4 w-24 bg-slate-200/50 rounded-lg mx-auto" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Schedule & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Schedule Today */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="h-8 w-48 bg-slate-200/50 rounded-lg animate-pulse" />
              <div className="h-8 w-12 bg-slate-200/50 rounded-lg animate-pulse" />
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/50 border border-slate-200/50 rounded-xl p-4 flex gap-4 animate-pulse">
                  <div className="w-16 flex flex-col items-center justify-center border-r border-slate-300/30 pr-4">
                    <div className="h-6 w-10 bg-slate-200/50 rounded-lg mb-1" />
                    <div className="h-4 w-12 bg-slate-200/50 rounded-lg" />
                  </div>
                  <div className="flex-1 pl-4 space-y-2">
                    <div className="h-5 w-3/4 bg-slate-200/50 rounded-lg" />
                    <div className="h-4 w-1/2 bg-slate-200/50 rounded-lg" />
                    <div className="pt-2 flex gap-2">
                      <div className="h-6 w-24 bg-slate-200/50 rounded-full" />
                      <div className="h-6 w-20 bg-slate-200/50 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Revenue & Notifications */}
        <div className="space-y-8">
          <div className="glass rounded-2xl p-6">
            <div className="h-8 w-32 bg-slate-200/50 rounded-lg mb-6 animate-pulse" />
            <div className="h-40 w-full bg-slate-200/50 rounded-xl mb-4 animate-pulse" />
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="h-8 w-40 bg-slate-200/50 rounded-lg mb-6 animate-pulse" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="h-10 w-10 bg-slate-200/50 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 w-5/6 bg-slate-200/50 rounded-lg" />
                    <div className="h-3 w-1/2 bg-slate-200/50 rounded-lg" />
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
