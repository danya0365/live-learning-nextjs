/**
 * SettingsSkeleton — consistent with redesigned SettingsView
 */
export default function SettingsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="h-10 w-56 bg-surface rounded-xl animate-pulse mb-2" />
        <div className="h-5 w-96 bg-surface rounded-lg animate-pulse" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 text-center space-y-2">
            <div className="h-8 w-8 mx-auto bg-surface rounded-full animate-pulse" />
            <div className="h-4 w-20 mx-auto bg-surface rounded animate-pulse" />
            <div className="h-3 w-16 mx-auto bg-surface rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Tabs + Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="glass rounded-2xl p-3 sm:p-4">
            <div className="flex lg:flex-col gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 w-full bg-surface rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="h-4 w-40 bg-surface rounded animate-pulse mb-4" />

          <div className="glass rounded-2xl p-6 sm:p-8">
            <div className="h-7 w-48 bg-surface rounded-lg mb-8 animate-pulse" />

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-surface animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-surface rounded animate-pulse" />
                  <div className="h-3 w-48 bg-surface rounded animate-pulse" />
                </div>
              </div>

              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-32 bg-surface rounded animate-pulse" />
                  <div className="h-12 w-full bg-surface rounded-xl animate-pulse" />
                </div>
              ))}

              <div className="h-11 w-40 bg-surface rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
