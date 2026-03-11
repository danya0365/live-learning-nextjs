import { SupabaseCategoryRepository } from '@/src/infrastructure/repositories/supabase/SupabaseCategoryRepository';
import { SupabaseCourseRepository } from '@/src/infrastructure/repositories/supabase/SupabaseCourseRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { CategoriesPresenter } from './CategoriesPresenter';

export async function createServerCategoriesPresenter(): Promise<CategoriesPresenter> {
  const supabase = await createServerSupabaseClient();
  return new CategoriesPresenter(new SupabaseCategoryRepository(supabase), new SupabaseCourseRepository(supabase));
}
