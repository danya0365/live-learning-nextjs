import { EventView } from '@/src/presentation/components/events/EventView';
import { createServerEventPresenter } from '@/src/presentation/presenters/events/EventPresenterServerFactory';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const presenter = await createServerEventPresenter();
  return presenter.generateMetadata();
}

/**
 * Events Page - Server Component
 */
export default async function EventsPage() {
  const presenter = await createServerEventPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <EventView initialViewModel={viewModel} />;
  } catch (error) {
    console.error('Error fetching event data:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">ไม่สามารถโหลดข้อมูลได้</h1>
          <p className="text-text-muted">กรุณาลองใหม่อีกครั้งภายหลัง</p>
        </div>
      </div>
    );
  }
}
