/**
 * ContactPresenterClientFactory
 * Factory for creating ContactPresenter instances on the client side
 * ✅ Injects the appropriate repository (Mock)
 */

'use client';

import { ContactPresenter } from './ContactPresenter';
import { MockContactRepository } from '@/src/infrastructure/repositories/mock/MockContactRepository';

export class ContactPresenterClientFactory {
  static create(): ContactPresenter {
    // ✅ Use Mock Repository for development
    const repository = new MockContactRepository();
    
    // ⏳ TODO: Switch to Supabase Repository when backend is ready
    // const repository = new SupabaseContactRepository(supabase);

    return new ContactPresenter(repository);
  }
}

export function createClientContactPresenter(): ContactPresenter {
  return ContactPresenterClientFactory.create();
}
