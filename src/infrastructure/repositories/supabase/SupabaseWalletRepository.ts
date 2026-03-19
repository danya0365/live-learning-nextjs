import { IWalletRepository } from '@/src/application/repositories/IWalletRepository';
import { Database } from '@/src/domain/types/supabase';
import { Wallet, WalletTransaction } from '@/src/domain/types/wallet';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseWalletRepository implements IWalletRepository {
  private supabase: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
  }

  async getWallet(): Promise<Wallet | null> {
    const { data: userResponse, error: authError } = await this.supabase.auth.getUser();
    if (authError || !userResponse.user) {
      throw new Error('Unauthorized');
    }

    // Get Active Profile using SQL Function via RPC
    const { data: activeProfileId, error: profileError } = await this.supabase
      .rpc('get_active_profile_id')
      .single();

    let profileId: string | null = activeProfileId as string | null;

    if (profileError || !profileId) {
       // Also attempt to fallback to user id if no active profile
       const { data: profile } = await this.supabase
         .from('profiles')
         .select('id')
         .eq('user_id', userResponse.user.id)
         .single();
       if (!profile) return null;
       profileId = profile.id;
    }

    if (!profileId) return null;

    const { data, error } = await this.supabase
      .from('wallets')
      .select('*')
      .eq('profile_id', profileId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('getWallet Error:', error);
      throw new Error('Failed to fetch wallet');
    }

    return data as Wallet | null;
  }

  async getTransactions(limit = 20): Promise<WalletTransaction[]> {
    const wallet = await this.getWallet();

    if (!wallet) return [];

    const { data, error } = await this.supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', wallet.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('getTransactions Error:', error);
      throw new Error('Failed to fetch wallet transactions');
    }

    return data as WalletTransaction[];
  }

  async topUp(amount: number, description = 'Top-up'): Promise<{ transactionId: string }> {
    const { data: profileId, error: profileError } = await this.supabase
      .rpc('get_active_profile_id')
      .single();

    if (profileError || !profileId) {
      throw new Error('Profile not found');
    }

    const { data, error } = await this.supabase.rpc('credit_wallet', {
      p_profile_id: profileId,
      p_amount: amount,
      p_type: 'topup',
      p_description: description,
    });

    if (error) {
       console.error('topUp Error:', error);
       throw new Error(`Failed to top up wallet: ${error.message}`);
    }

    return { transactionId: data as string };
  }

  async fulfillTopUp(profileId: string, amount: number): Promise<string> {
    const { data, error } = await this.supabase.rpc('credit_wallet', {
      p_profile_id: profileId,
      p_amount: amount,
      p_type: 'topup',
      p_description: 'เติมเงินผ่านระบบออนไลน์ (Stripe)'
    });

    if (error) {
       console.error('fulfillTopUp Error:', error);
       throw new Error(`Failed to fulfill top up: ${error.message}`);
    }

    return data as string;
  }
}
