import { StripeRepository } from '@/src/infrastructure/repositories/stripe/StripeRepository';
import { createServerWalletPresenter } from '@/src/presentation/presenters/wallet/WalletPresenterServerFactory';
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

    const body = await request.json();
    const { amount, description, isTestMode } = body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Bypass for local testing without Stripe
    if (isTestMode && process.env.NODE_ENV !== 'production') {
      const presenter = await createServerWalletPresenter();
      const result = await presenter.topUp(Number(amount), description || 'Test Top-up via UI');
      return NextResponse.json({ success: true, ...result });
    }

    // Get Active Profile ID for metadata
    const { data: activeProfileId } = await supabase.rpc('get_active_profile_id').single();
    const profileId = activeProfileId as unknown as string;

    if (!profileId) {
       return NextResponse.json({ error: 'Profile not found' }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const stripeRepo = new StripeRepository(process.env.STRIPE_SECRET_KEY || '');
    const origin = new URL(request.url).origin;

    // Use a short unique ID for the generated paymentId just for reference, or just leave it empty.
    const referenceId = `topup_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const session = await stripeRepo.createCheckoutSession({
      paymentId: referenceId,
      courseTitle: 'เติมเงิน Live Learning Wallet', // Product Name
      amount: Number(amount),
      currency: 'thb',
      customerEmail: user.email,
      successUrl: `${origin}/wallet?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/wallet?canceled=true`,
      metadata: {
        type: 'wallet_topup',
        profileId: profileId,
        amount: Number(amount).toString(), // Store amount in metadata for verification if needed
      }
    });

    return NextResponse.json({
        checkoutUrl: session.url
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Wallet TopUp API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
