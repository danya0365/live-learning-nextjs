import { SupabaseCategoryRepository } from '@/src/infrastructure/repositories/supabase/SupabaseCategoryRepository';
import { SupabaseCourseRepository } from '@/src/infrastructure/repositories/supabase/SupabaseCourseRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { CoursesPresenter } from './CoursesPresenter';

export async function createServerCoursesPresenter(): Promise<CoursesPresenter> {
  const supabase = await createServerSupabaseClient();
  return new CoursesPresenter(new SupabaseCourseRepository(supabase), new SupabaseCategoryRepository(supabase));
}
