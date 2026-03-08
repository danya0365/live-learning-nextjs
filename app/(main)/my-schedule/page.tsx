import { MyScheduleView } from '@/src/presentation/components/my-schedule/MyScheduleView';
import { createServerMySchedulePresenter } from '@/src/presentation/presenters/schedule/MySchedulePresenterServerFactory';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const presenter = await createServerMySchedulePresenter();
  return presenter.generateMetadata();
}

export default async function MySchedulePage() {
  const presenter = await createServerMySchedulePresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <MyScheduleView initialViewModel={viewModel} />;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">ไม่สามารถโหลดตารางเรียนได้</h1>
          <p className="text-text-muted">กรุณาลองใหม่อีกครั้ง</p>
        </div>
      </div>
    );
  }
}
