'use client';

import { ContentViewModel } from '@/src/presentation/presenters/content/ContentPresenter';

interface ContentViewProps {
  initialViewModel: ContentViewModel;
}

export function ContentView({ initialViewModel }: ContentViewProps) {
  const { item } = initialViewModel;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          {item.title}
        </h1>
        <p className="text-text-secondary">
          อัปเดตล่าสุด: {item.lastUpdated}
        </p>
      </div>

      <div 
        className="prose prose-lg dark:prose-invert max-w-none glass rounded-3xl p-8 sm:p-12 border border-border/50"
        dangerouslySetInnerHTML={{ __html: item.body }}
      />
    </div>
  );
}
