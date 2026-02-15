import { SupabaseCourseRepository } from '@/src/infrastructure/repositories/supabase/SupabaseCourseRepository';
import { SupabaseInstructorRepository } from '@/src/infrastructure/repositories/supabase/SupabaseInstructorRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { InstructorDetailPresenter } from './InstructorDetailPresenter';

export async function createServerInstructorDetailPresenter(): Promise<InstructorDetailPresenter> {
  const supabase = await createServerSupabaseClient();
  return new InstructorDetailPresenter(new SupabaseInstructorRepository(supabase), new SupabaseCourseRepository(supabase));
}
