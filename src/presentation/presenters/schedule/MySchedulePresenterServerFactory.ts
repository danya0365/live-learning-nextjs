import { SupabaseBookingRepository } from '@/src/infrastructure/repositories/supabase/SupabaseBookingRepository';
import { SupabaseCourseRepository } from '@/src/infrastructure/repositories/supabase/SupabaseCourseRepository';
import { SupabaseInstructorRepository } from '@/src/infrastructure/repositories/supabase/SupabaseInstructorRepository';
import { SupabaseProfileRepository } from '@/src/infrastructure/repositories/supabase/SupabaseProfileRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { MySchedulePresenter } from './MySchedulePresenter';

export async function createServerMySchedulePresenter() {
  const supabase = await createServerSupabaseClient();
  const instructorRepository = new SupabaseInstructorRepository(supabase);
  const bookingRepository = new SupabaseBookingRepository(supabase);
  const courseRepository = new SupabaseCourseRepository(supabase);
  const profileRepository = new SupabaseProfileRepository(supabase);

  return new MySchedulePresenter(
    instructorRepository,
    bookingRepository,
    courseRepository,
    profileRepository
  );
}
