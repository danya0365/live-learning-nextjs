import { CoursesView } from '@/src/presentation/components/courses/CoursesView';
import { createServerCoursesPresenter } from '@/src/presentation/presenters/courses/CoursesPresenterServerFactory';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerCoursesPresenter();
  return presenter.generateMetadata();
}

export default async function CoursesPage() {
  const presenter = createServerCoursesPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <CoursesView initialViewModel={viewModel} />;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">ไม่สามารถโหลดคอร์สได้</h1>
          <p className="text-text-muted">กรุณาลองใหม่อีกครั้ง</p>
        </div>
      </div>
    );
  }
}
