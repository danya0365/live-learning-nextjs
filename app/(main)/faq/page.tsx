import { FAQView } from '@/src/presentation/components/faq/FAQView';
import { createServerFAQPresenter } from '@/src/presentation/presenters/faq/FAQPresenterServerFactory';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const presenter = await createServerFAQPresenter();
  return presenter.generateMetadata();
}

/**
 * FAQ Page - Server Component
 * Uses Clean Architecture pattern
 */
export default async function FAQPage() {
  const presenter = await createServerFAQPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <FAQView initialViewModel={viewModel} />;
  } catch (error) {
    console.error('Error fetching FAQ data:', error);
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
