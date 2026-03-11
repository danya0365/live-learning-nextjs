
import { SupabaseLiveRoomRepository } from "@/src/infrastructure/repositories/supabase/SupabaseLiveRoomRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseLiveRoomRepository(supabase);

  try {
    const participants = await repository.getParticipants(id);
    return NextResponse.json(participants);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
