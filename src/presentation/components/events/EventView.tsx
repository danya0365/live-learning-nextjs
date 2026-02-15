'use client';

import { EventViewModel } from '@/src/presentation/presenters/events/EventPresenter';

interface EventViewProps {
  initialViewModel: EventViewModel;
}

export function EventView({ initialViewModel }: EventViewProps) {
  const { events } = initialViewModel;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          📅 กิจกรรมและเวิร์กช็อป
        </h1>
        <p className="text-text-secondary">
          เรียนรู้ทักษะใหม่ๆ และพบปะกับผู้เชี่ยวชาญในกิจกรรมออนไลน์ของเรา
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-surface/50 rounded-3xl border border-dashed border-border/50">
          <div className="text-6xl mb-6 grayscale opacity-50">🎪</div>
          <h3 className="text-xl font-bold text-text-primary mb-2">ยังไม่มีกิจกรรมเร็วๆ นี้</h3>
          <p className="text-text-muted">โปรดติดตามข่าวสารผ่านทาง Discord หรือ Newsletter</p>
          
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/discord"
              className="px-6 py-2.5 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
            >
              เข้า Discord
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            // Render events here if any
            <div key={event.id}>{event.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
