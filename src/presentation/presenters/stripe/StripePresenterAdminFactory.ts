import { StripeRepository } from '@/src/infrastructure/repositories/stripe/StripeRepository';
import { SupabaseBookingRepository } from '@/src/infrastructure/repositories/supabase/SupabaseBookingRepository';
import { SupabasePaymentRepository } from '@/src/infrastructure/repositories/supabase/SupabasePaymentRepository';
import { SupabaseWalletRepository } from '@/src/infrastructure/repositories/supabase/SupabaseWalletRepository';
import { SupabaseBookingWizardRepository } from '@/src/infrastructure/repositories/supabase/SupabaseBookingWizardRepository';
import { createAdminSupabaseClient } from '@/src/infrastructure/supabase/admin';
import { StripePresenter } from './StripePresenter';

export class StripePresenterAdminFactory {
  static create(): StripePresenter {
    // Initialize Supabase Admin Client for system-level operations (webhooks)
    const supabaseAdmin = createAdminSupabaseClient();

    const paymentRepo = new SupabasePaymentRepository(supabaseAdmin);
    const bookingRepo = new SupabaseBookingRepository(supabaseAdmin);
    const walletRepo = new SupabaseWalletRepository(supabaseAdmin);
    const bookingWizardRepo = new SupabaseBookingWizardRepository(supabaseAdmin);
    const stripeRepo = new StripeRepository(process.env.STRIPE_SECRET_KEY!);
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    return new StripePresenter(
      stripeRepo,
      paymentRepo,
      bookingRepo,
      walletRepo,
      bookingWizardRepo,
      webhookSecret
    );
  }
}

export function createAdminStripePresenter(): StripePresenter {
  return StripePresenterAdminFactory.create();
}
