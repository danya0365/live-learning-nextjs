import { SupabaseInstructorRepository } from '@/src/infrastructure/repositories/supabase/SupabaseInstructorRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { InstructorsPresenter } from './InstructorsPresenter';

export async function createServerInstructorsPresenter(): Promise<InstructorsPresenter> {
  const supabase = await createServerSupabaseClient();
  return new InstructorsPresenter(new SupabaseInstructorRepository(supabase));
}
