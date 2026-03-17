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
    // Overwrite the payment method parameter for process_wizard_transaction based on the frontend selection
    const paymentMethodToUse = body.paymentMethod === 'wallet' ? 'wallet' : 'stripe';
    
    // To cleanly pass the payment method to the RPC, we might need to modify the createBooking payload
    // The previous implementation hardcoded 'free' as default, but we'll try to pass our intent. 
    // Since SupabaseBookingWizardRepository's createBooking hardcodes 'free', let's temporarily monkeypatch or directly call RPC here if we must, 
    // but the cleanest way is calling creatingBooking on repo and then handling the wallet logic.
    const result = await wizardRepo.createBooking(body);

    // Update payment method in Payments table to reflect 'wallet' or 'stripe'
    if (result.paymentId && result.status === 'awaiting_payment') {
      await supabase.from('payments').update({ payment_method: paymentMethodToUse }).eq('id', result.paymentId);
    }

    // 2. Stripe Logic: If Price > 0 and method is stripe, generate checkout session
    if (result.status === 'awaiting_payment' && result.paymentId && paymentMethodToUse === 'stripe') {
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

    // 2b. Wallet Logic: If Price > 0 and method is wallet, deduct and fulfill
    if (result.status === 'awaiting_payment' && result.paymentId && paymentMethodToUse === 'wallet') {
      // Step A: Deduct wallet
      const { data: activeProfileId } = await supabase.rpc('get_active_profile_id').single();
      const profileId = activeProfileId as unknown as string;
      if (!profileId) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 400 });
      }

      const { data: txId, error: walletError } = await supabase.rpc('pay_with_wallet', {
          p_profile_id: profileId,
          p_amount: result.finalPrice,
          p_reference_type: 'wizard_payment',
          p_reference_id: result.paymentId,
          p_description: 'ชำระค่าคอร์สเรียนผ่านกระเป๋าเงิน'
      });

      if (walletError || !txId) {
          // Attempt to fail the payment explicitly to free up resources 
          await supabase.from('payments').update({ status: 'failed' }).eq('id', result.paymentId);
          return NextResponse.json({ error: walletError?.message || 'Insufficient wallet balance' }, { status: 400 });
      }

      // Step B: Fulfill the payment and create booking dynamically via the webhook fallback RPC
      const { data: fulfillment, error: fulfillmentError } = await supabase.rpc('fulfill_stripe_payment', {
          p_payment_id: result.paymentId,
          p_transaction_id: txId, // Using the wallet tx ID instead of stripe session ID
          p_instructor_id: body.instructorId,
          p_slot_id: body.slotId,
          p_scheduled_date: body.date
      });

      if (fulfillmentError) {
          console.error("Wallet Fulfillment Error:", fulfillmentError);
          return NextResponse.json({ error: 'Failed to fulfill booking after wallet deduction' }, { status: 500 });
      }

      // Success using Wallet
      return NextResponse.json({
          ...result,
          status: 'success',
          bookingId: (fulfillment as any)?.booking_id,
          enrollmentId: (fulfillment as any)?.enrollment_id
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
