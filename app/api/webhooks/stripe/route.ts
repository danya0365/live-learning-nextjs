import { createAdminStripePresenter } from '@/src/presentation/presenters/stripe/StripePresenterAdminFactory';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const presenter = createAdminStripePresenter();
    const result = await presenter.handleWebhook(request);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Webhook processing error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
