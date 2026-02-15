import { SupabaseBookingRepository } from '@/src/infrastructure/repositories/supabase/SupabaseBookingRepository';
import { SupabaseCourseRepository } from '@/src/infrastructure/repositories/supabase/SupabaseCourseRepository';
import { SupabaseProfileRepository } from '@/src/infrastructure/repositories/supabase/SupabaseProfileRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { ProfilePresenter } from './ProfilePresenter';

export async function createServerProfilePresenter(): Promise<ProfilePresenter> {
  const supabase = await createServerSupabaseClient();
  return new ProfilePresenter(
    new SupabaseBookingRepository(supabase),
    new SupabaseCourseRepository(supabase),
    new SupabaseProfileRepository(supabase),
  );
}
