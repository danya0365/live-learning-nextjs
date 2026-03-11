import { SupabaseFeedbackRepository } from '@/src/infrastructure/repositories/supabase/SupabaseFeedbackRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { FeedbackPresenter } from './FeedbackPresenter';

export class FeedbackPresenterServerFactory {
  static async create(): Promise<FeedbackPresenter> {
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseFeedbackRepository(supabase);
    return new FeedbackPresenter(repository);
  }
}

export async function createServerFeedbackPresenter(): Promise<FeedbackPresenter> {
  return FeedbackPresenterServerFactory.create();
}
