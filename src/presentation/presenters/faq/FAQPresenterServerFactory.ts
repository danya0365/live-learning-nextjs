/**
 * FAQPresenterServerFactory
 * Factory for creating FAQPresenter instances on the server side
 * ✅ Injects Mock or Real implementation
 */

import { MockFAQRepository } from '@/src/infrastructure/repositories/mock/MockFAQRepository';
import { FAQPresenter } from './FAQPresenter';

export class FAQPresenterServerFactory {
  static create(): FAQPresenter {
    // ✅ Use Mock Repository for development
    const repository = new MockFAQRepository();
    
    // ⏳ TODO: Switch to Supabase
    // const supabase = createServerSupabaseClient();
    // const repository = new SupabaseFAQRepository(supabase);

    return new FAQPresenter(repository);
  }
}

export function createServerFAQPresenter(): FAQPresenter {
  return FAQPresenterServerFactory.create();
}
