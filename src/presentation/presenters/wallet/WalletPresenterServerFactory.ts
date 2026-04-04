import { SupabaseWalletRepository } from '@/src/infrastructure/repositories/supabase/SupabaseWalletRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { WalletPresenter } from './WalletPresenter';

export class WalletPresenterServerFactory {
  static async create(): Promise<WalletPresenter> {
    const supabase = await createServerSupabaseClient();
    return new WalletPresenter(new SupabaseWalletRepository(supabase));
  }
}

export async function createServerWalletPresenter(): Promise<WalletPresenter> {
  return WalletPresenterServerFactory.create();
}
