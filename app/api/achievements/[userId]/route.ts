import { createServerAchievementsPresenter } from '@/src/presentation/presenters/achievements/AchievementsPresenterServerFactory';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/achievements/[userId]
 * Returns achievements for a given user from Supabase.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  try {
    const presenter = await createServerAchievementsPresenter();
    const achievements = await presenter.getByUserId(userId);
    return NextResponse.json(achievements);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
