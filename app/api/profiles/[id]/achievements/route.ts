
import { SupabaseProfileRepository } from "@/src/infrastructure/repositories/supabase/SupabaseProfileRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseProfileRepository(supabase);

  try {
    const achievements = await repository.getAchievements(id);
    return NextResponse.json(achievements);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
