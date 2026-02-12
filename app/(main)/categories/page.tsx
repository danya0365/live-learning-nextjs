import { CategoriesView } from '@/src/presentation/components/categories/CategoriesView';
import { createServerCategoriesPresenter } from '@/src/presentation/presenters/categories/CategoriesPresenterServerFactory';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'หมวดหมู่คอร์สเรียน — Live Learning',
  description: 'เลือกหมวดหมู่คอร์สเรียนที่สนใจ Web, AI, Design, Mobile, Security และอื่นๆ',
};

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const presenter = createServerCategoriesPresenter();
  const viewModel = await presenter.getViewModel();
  return <CategoriesView initialViewModel={viewModel} />;
}
