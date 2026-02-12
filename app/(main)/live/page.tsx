import { LiveSessionsView } from '@/src/presentation/components/live/LiveSessionsView';
import { createServerLiveSessionsPresenter } from '@/src/presentation/presenters/live/LiveSessionsPresenterServerFactory';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ห้องเรียนสด — Live Learning',
  description: 'คอร์สเรียนสดออนไลน์ที่กำลังสอนอยู่ตอนนี้ เข้าร่วมเรียนได้ทันที',
};

export const dynamic = 'force-dynamic';

export default async function LiveSessionsPage() {
  const presenter = createServerLiveSessionsPresenter();
  const viewModel = await presenter.getViewModel();
  return <LiveSessionsView initialViewModel={viewModel} />;
}
