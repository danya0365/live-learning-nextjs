
import { SupabaseProfileRepository } from "@/src/infrastructure/repositories/supabase/SupabaseProfileRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { profileId } = body;
  
  if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const repo = new SupabaseProfileRepository(supabase);
  
  const success = await repo.switchProfile(profileId);
  
  if (!success) {
      return NextResponse.json({ error: 'Failed to switch profile' }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}
