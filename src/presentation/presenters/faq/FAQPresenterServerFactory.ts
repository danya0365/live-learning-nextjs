/**
 * FAQPresenterServerFactory
 * Factory for creating FAQPresenter instances on the server side
 * ✅ Injects Supabase repository for production
 */

import { SupabaseFAQRepository } from '@/src/infrastructure/repositories/supabase/SupabaseFAQRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { FAQPresenter } from './FAQPresenter';

export class FAQPresenterServerFactory {
  static async create(): Promise<FAQPresenter> {
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseFAQRepository(supabase);
    return new FAQPresenter(repository);
  }
}

export async function createServerFAQPresenter(): Promise<FAQPresenter> {
  return FAQPresenterServerFactory.create();
}
