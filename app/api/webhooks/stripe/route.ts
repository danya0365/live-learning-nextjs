import { StripeRepository } from '@/src/infrastructure/repositories/stripe/StripeRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  const stripeRepo = new StripeRepository(process.env.STRIPE_SECRET_KEY || '');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  try {
    const event = await stripeRepo.constructEvent(payload, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata;

      if (!metadata) {
        console.error('Webhook: Missing metadata in session', session.id);
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
      }

      const supabaseAdmin = createAdminSupabaseClient();

      // Case 1: Wallet Top-up
      if (metadata.type === 'wallet_topup') {
        const { profileId, amount } = metadata;
        
        if (!profileId || !amount) {
           console.error('Webhook: Missing profileId or amount for wallet_topup');
           return NextResponse.json({ error: 'Invalid wallet_topup metadata' }, { status: 400 });
        }

        console.log(`Webhook: Processing wallet top-up for profile ${profileId}, amount: ${amount}`);

        const { data, error } = await (supabaseAdmin as any).rpc('credit_wallet', {
          p_profile_id: profileId,
          p_amount: Number(amount),
          p_type: 'topup',
          p_description: 'เติมเงินผ่านระบบออนไลน์ (Stripe)'
        });

        if (error) {
          console.error('Webhook: Wallet Top-up RPC Error:', error);
          throw new Error(error.message);
        }

        console.log('Webhook: Wallet Top-up successful, Transaction ID:', data);
        return NextResponse.json({ received: true });
      }

      // Case 2: Course Booking Fulfillment
      if (!metadata.paymentId) {
        console.error('Webhook: Missing paymentId in session', session.id);
        return NextResponse.json({ error: 'Missing paymentId' }, { status: 400 });
      }

      console.log('Webhook: Processing payment fulfillment for', metadata.paymentId);

      // Finalize the transaction in Supabase
      const { data, error } = await (supabaseAdmin as any).rpc('fulfill_stripe_payment', {
        p_payment_id: metadata.paymentId,
        p_transaction_id: session.id, // The Stripe Session ID
        p_instructor_id: metadata.instructorId,
        p_slot_id: metadata.slotId,
        p_scheduled_date: metadata.scheduledDate
      });

      if (error) {
        console.error('Webhook: RPC Fulfillment Error:', error);
        throw new Error(error.message);
      }

      console.log('Webhook: Fulfillment successful:', data);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
