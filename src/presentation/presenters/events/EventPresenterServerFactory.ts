import { SupabaseEventRepository } from '@/src/infrastructure/repositories/supabase/SupabaseEventRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { EventPresenter } from './EventPresenter';

export class EventPresenterServerFactory {
  static async create(): Promise<EventPresenter> {
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseEventRepository(supabase);
    return new EventPresenter(repository);
  }
}

export async function createServerEventPresenter(): Promise<EventPresenter> {
  return EventPresenterServerFactory.create();
}
