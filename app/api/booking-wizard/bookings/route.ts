import { CreateWizardBookingData } from '@/src/application/repositories/IBookingWizardRepository';
import { StripeRepository } from '@/src/infrastructure/repositories/stripe/StripeRepository';
import { SupabaseBookingWizardRepository } from '@/src/infrastructure/repositories/supabase/SupabaseBookingWizardRepository';
import { SupabaseCourseRepository } from '@/src/infrastructure/repositories/supabase/SupabaseCourseRepository';
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

    // 1. Core Logic: Process metadata and create pending/free record
    const wizardRepo = new SupabaseBookingWizardRepository(supabase);
    const result = await wizardRepo.createBooking(body);

    // 2. Stripe Logic: If Price > 0, generate checkout session
    if (result.status === 'awaiting_payment' && result.paymentId) {
      const courseRepo = new SupabaseCourseRepository(supabase);
      const course = await courseRepo.getById(body.courseId);
      
      const stripeRepo = new StripeRepository(process.env.STRIPE_SECRET_KEY || '');
      const origin = req.nextUrl.origin;

      const session = await stripeRepo.createCheckoutSession({
        paymentId: result.paymentId,
        courseTitle: course?.title || 'Course Booking',
        amount: result.finalPrice,
        currency: 'thb',
        customerEmail: user.email,
        successUrl: `${origin}/book/success?payment_id=${result.paymentId}&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/book?error=payment_cancelled`,
        metadata: {
          instructorId: body.instructorId,
          slotId: body.slotId,
          scheduledDate: body.date,
          courseId: body.courseId
        }
      });

      return NextResponse.json({
        ...result,
        checkoutUrl: session.url
      }, { status: 201 });
    }

    // 3. Free Booking: Return success immediately
    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    console.error('Create wizard booking error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
