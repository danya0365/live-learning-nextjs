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

      if (!metadata || !metadata.paymentId) {
        console.error('Webhook: Missing metadata in session', session.id);
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
      }

      console.log('Webhook: Processing payment fulfillment for', metadata.paymentId);

      // Finalize the transaction in Supabase
      const supabaseAdmin = createAdminSupabaseClient();
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
