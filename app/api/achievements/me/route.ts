import { SupabaseAchievementRepository } from '@/src/infrastructure/repositories/supabase/SupabaseAchievementRepository';
import { SupabaseAuthRepository } from '@/src/infrastructure/repositories/supabase/SupabaseAuthRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/achievements/me
 * Returns achievements for the currently authenticated user (session-based, no ID needed)
 */
export async function GET() {
  const supabase = await createServerSupabaseClient();
  const authRepo = new SupabaseAuthRepository(supabase);
  const achievementRepo = new SupabaseAchievementRepository(supabase);

  try {
    const profile = await authRepo.getProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const achievements = await achievementRepo.getByUserId(profile.id);
    return NextResponse.json(achievements);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
