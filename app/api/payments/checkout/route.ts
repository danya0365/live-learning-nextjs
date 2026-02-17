import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { createServerPaymentPresenter } from '@/src/presentation/presenters/payment/PaymentPresenterServerFactory';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';
    
    // Initialize Presenter via Factory
    const presenter = await createServerPaymentPresenter();

    // Delegate Logic to Presenter
    const session = await presenter.processCheckout(user.id, user.email, bookingId, origin);

    return NextResponse.json({ url: session.url, sessionId: session.sessionId });
  } catch (error: any) {
    console.error('Checkout error:', error);
    const status = error.message === 'Unauthorized access to this booking' ? 403 : 
                   error.message === 'Booking not found' || error.message === 'Course not found' ? 404 : 
                   500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
