import { InstructorsView } from '@/src/presentation/components/instructors/InstructorsView';
import { createServerInstructorsPresenter } from '@/src/presentation/presenters/instructors/InstructorsPresenterServerFactory';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerInstructorsPresenter();
  return presenter.generateMetadata();
}

export default async function InstructorsPage() {
  const presenter = createServerInstructorsPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <InstructorsView initialViewModel={viewModel} />;
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">ไม่สามารถโหลดอาจารย์ได้</h1>
          <p className="text-text-muted">กรุณาลองใหม่อีกครั้ง</p>
        </div>
      </div>
    );
  }
}
