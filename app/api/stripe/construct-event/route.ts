import { StripeRepository } from '@/src/infrastructure/repositories/stripe/StripeRepository';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { payload, signature, secret } = body;

    if (!payload || !signature || !secret) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Initialize StripeRepository (assuming it can handle static constructEvent or instance method)
    // Note: constructEvent in StripeRepository likely uses the stripe instance.
    const stripeRepo = new StripeRepository(process.env.STRIPE_SECRET_KEY!);
    
    // We use the passed secret, or we could fallback to env if logic dictates (but interface accepts secret)
    const event = await stripeRepo.constructEvent(payload, signature, secret);

    return NextResponse.json(event);
  } catch (error: any) {
    console.error('Stripe event construction error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
