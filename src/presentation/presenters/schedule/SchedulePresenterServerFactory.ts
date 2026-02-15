import { SupabaseBookingRepository } from '@/src/infrastructure/repositories/supabase/SupabaseBookingRepository';
import { SupabaseCourseRepository } from '@/src/infrastructure/repositories/supabase/SupabaseCourseRepository';
import { SupabaseInstructorRepository } from '@/src/infrastructure/repositories/supabase/SupabaseInstructorRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { SchedulePresenter } from './SchedulePresenter';

export async function createServerSchedulePresenter(): Promise<SchedulePresenter> {
  const supabase = await createServerSupabaseClient();
  return new SchedulePresenter(
    new SupabaseInstructorRepository(supabase),
    new SupabaseBookingRepository(supabase),
    new SupabaseCourseRepository(supabase),
  );
}
