import { CourseDetailView } from '@/src/presentation/components/course-detail/CourseDetailView';
import { createServerCourseDetailPresenter } from '@/src/presentation/presenters/course-detail/CourseDetailPresenterServerFactory';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const presenter = await createServerCourseDetailPresenter();
  return presenter.generateMetadata(id);
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const presenter = await createServerCourseDetailPresenter();

  try {
    const viewModel = await presenter.getViewModel(id);
    if (!viewModel) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😢</div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">ไม่พบคอร์สนี้</h1>
            <p className="text-text-muted">คอร์สที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่</p>
          </div>
        </div>
      );
    }
    return <CourseDetailView courseId={id} initialViewModel={viewModel} />;
  } catch (error) {
    console.error('Error fetching course detail:', error);
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
