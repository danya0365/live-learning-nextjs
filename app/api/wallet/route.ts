import { SupabaseWalletRepository } from '@/src/infrastructure/repositories/supabase/SupabaseWalletRepository';
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const walletRepo = new SupabaseWalletRepository(supabase);
    
    // Fetch wallet and transactions in parallel
    const [wallet, transactions] = await Promise.all([
      walletRepo.getWallet(),
      walletRepo.getTransactions(50) // Fetch latest 50 transactions
    ]);

    return NextResponse.json({
      wallet: wallet || { balance: 0 },
      transactions
    });
    
  } catch (error: any) {
    console.error('Wallet API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
