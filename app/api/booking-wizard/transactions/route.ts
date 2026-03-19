import { InitiateWizardTransactionData } from '@/src/application/repositories/IBookingWizardRepository';
import { createServerBookingWizardPresenter } from '@/src/presentation/presenters/booking/BookingWizardPresenterServerFactory';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: InitiateWizardTransactionData = await req.json();

    if (!body.courseId || !body.instructorId || !body.slotId || !body.date) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 1. Core Logic: Delegate to Presenter for Single Source of Truth Orchestration
    const presenter = await createServerBookingWizardPresenter();
    
    const result = await presenter.processTransaction(
      body,
      { email: user.email },
      req.nextUrl.origin
    );

    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    console.error('Process wizard booking error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.message?.includes('Insufficient wallet balance') ? 400 : 500 }
    );
  }
}
