import { SupabaseEnrollmentRepository } from '@/src/infrastructure/repositories/supabase/SupabaseEnrollmentRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { EnrollmentsPresenter } from './EnrollmentsPresenter';

export async function createServerEnrollmentsPresenter(): Promise<EnrollmentsPresenter> {
  const supabase = await createServerSupabaseClient();
  return new EnrollmentsPresenter(new SupabaseEnrollmentRepository(supabase));
}
