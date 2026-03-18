import { SupabaseBookingWizardRepository } from '@/src/infrastructure/repositories/supabase/SupabaseBookingWizardRepository';
import { SupabaseEnrollmentRepository } from '@/src/infrastructure/repositories/supabase/SupabaseEnrollmentRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { BookingWizardPresenter } from './BookingWizardPresenter';

export async function createServerBookingWizardPresenter() {
  const supabase = await createServerSupabaseClient();
  return new BookingWizardPresenter(
    new SupabaseBookingWizardRepository(supabase),
    new SupabaseEnrollmentRepository(supabase)
  );
}
