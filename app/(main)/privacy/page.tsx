import { ContentView } from '@/src/presentation/components/content/ContentView';
import { createServerContentPresenter } from '@/src/presentation/presenters/content/ContentPresenterServerFactory';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const presenter = await createServerContentPresenter();
  const meta = await presenter.generateMetadata('privacy');
  if (!meta) return {};
  return meta;
}

export default async function PrivacyPage() {
  const presenter = await createServerContentPresenter();
  
  try {
    const viewModel = await presenter.getViewModel('privacy');
    if (!viewModel) return notFound();
    
    return <ContentView initialViewModel={viewModel} />;
  } catch (error) {
    return notFound();
  }
}
