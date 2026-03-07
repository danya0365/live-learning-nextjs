import { SupabaseBookingRepository } from '@/src/infrastructure/repositories/supabase/SupabaseBookingRepository';
import { SupabaseCourseRepository } from '@/src/infrastructure/repositories/supabase/SupabaseCourseRepository';
import { SupabaseInstructorRepository } from '@/src/infrastructure/repositories/supabase/SupabaseInstructorRepository';
import { SupabaseLiveSessionRepository } from '@/src/infrastructure/repositories/supabase/SupabaseLiveSessionRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { LiveSessionsPresenter } from './LiveSessionsPresenter';

export async function createServerLiveSessionsPresenter(): Promise<LiveSessionsPresenter> {
  const supabase = await createServerSupabaseClient();
  return new LiveSessionsPresenter(
    new SupabaseCourseRepository(supabase),
    new SupabaseInstructorRepository(supabase),
    new SupabaseBookingRepository(supabase),
    new SupabaseLiveSessionRepository(supabase),
  );
}
