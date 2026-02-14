export default function HomeSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">
        <div className="flex-1 w-full space-y-4">
          <div className="h-12 w-3/4 bg-slate-200/50 rounded-xl animate-pulse" />
          <div className="h-12 w-2/3 bg-slate-200/50 rounded-xl animate-pulse" />
          <div className="h-6 w-full bg-slate-200/50 rounded-lg animate-pulse" />
          <div className="h-6 w-5/6 bg-slate-200/50 rounded-lg animate-pulse" />
          <div className="pt-4 flex gap-4">
            <div className="h-12 w-32 bg-slate-200/50 rounded-xl animate-pulse" />
            <div className="h-12 w-32 bg-slate-200/50 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="flex-1 w-full flex justify-center lg:justify-end">
           <div className="w-[400px] h-[400px] bg-slate-200/50 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-6 text-center animate-pulse">
            <div className="h-8 w-16 bg-slate-200/50 rounded-lg mx-auto mb-2" />
            <div className="h-4 w-24 bg-slate-200/50 rounded-lg mx-auto" />
          </div>
        ))}
      </div>

      {/* Featured Courses */}
      <div className="mb-16">
        <div className="h-10 w-48 bg-slate-200/50 rounded-xl mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
               <div className="h-48 w-full bg-slate-200/50" />
               <div className="p-6 space-y-3">
                 <div className="h-6 w-3/4 bg-slate-200/50 rounded-lg" />
                 <div className="h-4 w-full bg-slate-200/50 rounded-lg" />
                 <div className="h-4 w-2/3 bg-slate-200/50 rounded-lg" />
                 <div className="pt-4 flex justify-between">
                   <div className="h-8 w-20 bg-slate-200/50 rounded-lg" />
                   <div className="h-8 w-24 bg-slate-200/50 rounded-lg" />
                 </div>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
