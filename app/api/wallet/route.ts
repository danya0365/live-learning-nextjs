import { createServerWalletPresenter } from '@/src/presentation/presenters/wallet/WalletPresenterServerFactory';
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

    const presenter = await createServerWalletPresenter();
    
    // Fetch wallet and transactions in parallel
    const [wallet, transactions] = await Promise.all([
      presenter.getWallet(),
      presenter.getTransactions(50) // Fetch latest 50 transactions
    ]);

    return NextResponse.json({
      wallet: wallet || { balance: 0 },
      transactions: transactions
    });
    
  } catch (error: any) {
    console.error('Wallet API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
