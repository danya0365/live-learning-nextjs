import { SupabaseContentRepository } from '@/src/infrastructure/repositories/supabase/SupabaseContentRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { ContentPresenter } from './ContentPresenter';

export class ContentPresenterServerFactory {
  static async create(): Promise<ContentPresenter> {
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseContentRepository(supabase);
    return new ContentPresenter(repository);
  }
}

export async function createServerContentPresenter(): Promise<ContentPresenter> {
  return ContentPresenterServerFactory.create();
}
