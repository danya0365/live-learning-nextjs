/**
 * ContactPresenterServerFactory
 * Factory for creating ContactPresenter instances on the server side
 * ✅ Injects the appropriate repository (Mock)
 */

import { ContactPresenter } from './ContactPresenter';
import { MockContactRepository } from '@/src/infrastructure/repositories/mock/MockContactRepository';

export class ContactPresenterServerFactory {
  static create(): ContactPresenter {
    // ✅ Use Mock Repository for development
    const repository = new MockContactRepository();
    
    // ⏳ TODO: Switch to Supabase/Email Repository when ready
    // const repository = new SupabaseContactRepository(supabase);

    return new ContactPresenter(repository);
  }
}

export function createServerContactPresenter(): ContactPresenter {
  return ContactPresenterServerFactory.create();
}
