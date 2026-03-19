import { createAdminStripePresenter } from '@/src/presentation/presenters/stripe/StripePresenterAdminFactory';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const stripePresenter = createAdminStripePresenter();
    const result = await stripePresenter.handleWebhook(req);
    
    return NextResponse.json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Webhook Error:', errorMessage);
    
    // Stripe requires 400 for signature validation failures
    const isSignatureError = errorMessage.includes('signature');
    return NextResponse.json({ error: errorMessage }, { status: isSignatureError ? 400 : 500 });
  }
}
