import { ContactView } from '@/src/presentation/components/contact/ContactView';
import { createServerContactPresenter } from '@/src/presentation/presenters/contact/ContactPresenterServerFactory';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerContactPresenter();
  return presenter.generateMetadata();
}

/**
 * Contact Page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function ContactPage() {
  const presenter = createServerContactPresenter();
  
  try {
    const viewModel = await presenter.getViewModel();
    
    return <ContactView initialViewModel={viewModel} />;
  } catch (error) {
    console.error('Error fetching contact data:', error);
    
    // Fallback UI or simple message
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">ขออภัย</h1>
          <p className="text-slate-600">ไม่สามารถโหลดข้อมูลหน้าติดต่อเราได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง</p>
        </div>
      </div>
    );
  }
}
