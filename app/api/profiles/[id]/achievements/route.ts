
import { SupabaseAchievementRepository } from '@/src/infrastructure/repositories/supabase/SupabaseAchievementRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/profiles/[id]/achievements
 * Returns achievements for a given user from Supabase.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseAchievementRepository(supabase);
    const achievements = await repository.getByUserId(id);
    return NextResponse.json(achievements);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
