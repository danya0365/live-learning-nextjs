import { FeedbackView } from '@/src/presentation/components/feedback/FeedbackView';
import { createServerFeedbackPresenter } from '@/src/presentation/presenters/feedback/FeedbackPresenterServerFactory';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const presenter = await createServerFeedbackPresenter();
  return presenter.generateMetadata();
}

/**
 * Feedback Page - Server Component for SEO
 */
export default function FeedbackPage() {
  return <FeedbackView />;
}
