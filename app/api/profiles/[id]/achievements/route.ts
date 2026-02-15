
import { MockProfileRepository } from "@/src/infrastructure/repositories/mock/MockProfileRepository";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/profiles/[id]/achievements
 * Returns achievements for a given user.
 * ⏳ Uses Mock until Supabase achievements table is created.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repository = new MockProfileRepository();

  try {
    const achievements = await repository.getAchievements(id);
    return NextResponse.json(achievements);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
