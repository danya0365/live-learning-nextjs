import { MockWalletRepository } from '@/src/infrastructure/repositories/mock/MockWalletRepository';
import { SupabaseWalletRepository } from '@/src/infrastructure/repositories/supabase/SupabaseWalletRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { WalletPresenter } from './WalletPresenter';

export class WalletPresenterServerFactory {
  static async create(): Promise<WalletPresenter> {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (useMock) {
      return new WalletPresenter(new MockWalletRepository());
    } else {
      const supabase = await createServerSupabaseClient();
      return new WalletPresenter(new SupabaseWalletRepository(supabase));
    }
  }
}

export async function createServerWalletPresenter(): Promise<WalletPresenter> {
  return WalletPresenterServerFactory.create();
}
