import { ContentView } from '@/src/presentation/components/content/ContentView';
import { createServerContentPresenter } from '@/src/presentation/presenters/content/ContentPresenterServerFactory';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerContentPresenter();
  const meta = await presenter.generateMetadata('terms');
  if (!meta) return {};
  return meta;
}

export default async function TermsPage() {
  const presenter = createServerContentPresenter();
  
  try {
    const viewModel = await presenter.getViewModel('terms');
    if (!viewModel) return notFound();
    
    return <ContentView initialViewModel={viewModel} />;
  } catch (error) {
    return notFound();
  }
}
