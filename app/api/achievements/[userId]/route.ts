import { SupabaseAchievementRepository } from '@/src/infrastructure/repositories/supabase/SupabaseAchievementRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/achievements/[userId]
 * Returns achievements for a given user from Supabase.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  try {
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseAchievementRepository(supabase);
    const achievements = await repository.getByUserId(userId);
    return NextResponse.json(achievements);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
