import { SupabaseCourseRepository } from '@/src/infrastructure/repositories/supabase/SupabaseCourseRepository';
import { SupabaseEnrollmentRepository } from '@/src/infrastructure/repositories/supabase/SupabaseEnrollmentRepository';
import { SupabaseInstructorRepository } from '@/src/infrastructure/repositories/supabase/SupabaseInstructorRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { CourseDetailPresenter } from './CourseDetailPresenter';

export async function createServerCourseDetailPresenter(): Promise<CourseDetailPresenter> {
  const supabase = await createServerSupabaseClient();
  return new CourseDetailPresenter(
    new SupabaseCourseRepository(supabase),
    new SupabaseInstructorRepository(supabase),
    new SupabaseEnrollmentRepository(supabase),
  );
}
