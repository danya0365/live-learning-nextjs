import { BlogView } from '@/src/presentation/components/blog/BlogView';
import { createServerBlogPresenter } from '@/src/presentation/presenters/blog/BlogPresenterServerFactory';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const presenter = await createServerBlogPresenter();
  return presenter.generateMetadata();
}

/**
 * Blog Page - Server Component
 */
export default async function BlogPage() {
  const presenter = await createServerBlogPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <BlogView initialViewModel={viewModel} />;
  } catch (error) {
    console.error('Error fetching blog data:', error);
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
