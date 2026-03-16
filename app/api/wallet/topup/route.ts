import { SupabaseWalletRepository } from '@/src/infrastructure/repositories/supabase/SupabaseWalletRepository';
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow bypassing/testing in non-production environments
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Top-up endpoint not available directly in production' }, { status: 403 });
    }

    const body = await request.json();
    const { amount, description } = body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const walletRepo = new SupabaseWalletRepository(supabase);
    const result = await walletRepo.topUp(Number(amount), description || 'Test Top-up');

    return NextResponse.json({ success: true, ...result });
    
  } catch (error: any) {
    console.error('Wallet TopUp API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
