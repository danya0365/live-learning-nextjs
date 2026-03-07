import { CreateWizardBookingData } from '@/src/application/repositories/IBookingWizardRepository';
import { SupabaseBookingWizardRepository } from '@/src/infrastructure/repositories/supabase/SupabaseBookingWizardRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateWizardBookingData = await req.json();

    if (!body.courseId || !body.instructorId || !body.slotId || !body.date) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const wizardRepo = new SupabaseBookingWizardRepository(supabase);
    // This executes the transaction: calculate price, validate coupon, create payment, create booking
    const result = await wizardRepo.createBooking(body);

    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    console.error('Create wizard booking error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
