import { InstructorDetailView } from '@/src/presentation/components/instructor-detail/InstructorDetailView';
import { createServerInstructorDetailPresenter } from '@/src/presentation/presenters/instructor-detail/InstructorDetailPresenterServerFactory';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const presenter = await createServerInstructorDetailPresenter();
  return presenter.generateMetadata(id);
}

export default async function InstructorDetailPage({ params }: PageProps) {
  const { id } = await params;
  const presenter = await createServerInstructorDetailPresenter();

  try {
    const viewModel = await presenter.getViewModel(id);
    if (!viewModel) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😢</div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">ไม่พบอาจารย์ท่านนี้</h1>
            <p className="text-text-muted">ข้อมูลอาจารย์อาจถูกลบหรือไม่มีอยู่</p>
          </div>
        </div>
      );
    }
    return <InstructorDetailView instructorId={id} initialViewModel={viewModel} />;
  } catch (error) {
    console.error('Error fetching instructor detail:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">เกิดข้อผิดพลาด</h1>
          <p className="text-text-muted">กรุณาลองใหม่อีกครั้ง</p>
        </div>
      </div>
    );
  }
}
