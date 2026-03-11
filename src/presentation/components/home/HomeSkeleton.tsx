export default function HomeSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
            {/* Badge */}
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-full mb-8" />
            
            {/* Title */}
            <div className="h-12 sm:h-20 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-xl mb-6" />
            
            {/* Subtitle */}
            <div className="h-6 sm:h-8 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg mb-10" />
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <div className="h-14 w-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="h-14 w-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderSkeleton />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderSkeleton />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl overflow-hidden h-[340px]">
                <div className="h-40 bg-slate-200 dark:bg-slate-700 w-full" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="flex justify-between items-center pt-3 mt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderSkeleton />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 mb-3" />
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
                <div className="flex gap-1 mb-3">
                  <div className="h-4 w-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="h-4 w-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-8 flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 mb-4" />
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderSkeleton />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-6 h-48">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 mb-4" />
                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-16 w-full bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl py-12 sm:py-16 px-6 flex flex-col items-center">
             <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-full mb-4" />
             <div className="h-8 sm:h-10 w-3/4 max-w-lg bg-slate-200 dark:bg-slate-700 rounded-xl mb-4" />
             <div className="h-5 w-2/3 max-w-md bg-slate-200 dark:bg-slate-700 rounded-lg mb-8" />
             <div className="flex gap-4">
               <div className="h-12 w-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />
               <div className="h-12 w-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeaderSkeleton() {
  return (
    <div className="flex items-end justify-between mb-8 sm:mb-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
      <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded hidden sm:block" />
    </div>
  );
}
