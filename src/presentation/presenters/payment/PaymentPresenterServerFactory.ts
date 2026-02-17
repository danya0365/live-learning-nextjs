import { StripeRepository } from '@/src/infrastructure/repositories/stripe/StripeRepository';
import { SupabaseBookingRepository } from '@/src/infrastructure/repositories/supabase/SupabaseBookingRepository';
import { SupabaseCourseRepository } from '@/src/infrastructure/repositories/supabase/SupabaseCourseRepository';
import { SupabasePaymentRepository } from '@/src/infrastructure/repositories/supabase/SupabasePaymentRepository';
import { SupabaseProfileRepository } from '@/src/infrastructure/repositories/supabase/SupabaseProfileRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { PaymentPresenter } from './PaymentPresenter';

export class PaymentPresenterServerFactory {
  static async create(): Promise<PaymentPresenter> {
    const supabase = await createServerSupabaseClient();
    
    const paymentRepo = new SupabasePaymentRepository(supabase);
    const bookingRepo = new SupabaseBookingRepository(supabase);
    const courseRepo = new SupabaseCourseRepository(supabase);
    const profileRepo = new SupabaseProfileRepository(supabase);
    const stripeRepo = new StripeRepository(process.env.STRIPE_SECRET_KEY!);

    return new PaymentPresenter(
      paymentRepo,
      bookingRepo,
      courseRepo,
      profileRepo,
      stripeRepo
    );
  }
}

export async function createServerPaymentPresenter(): Promise<PaymentPresenter> {
  return PaymentPresenterServerFactory.create();
}
