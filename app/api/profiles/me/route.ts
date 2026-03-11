
import { SupabaseProfileRepository } from "@/src/infrastructure/repositories/supabase/SupabaseProfileRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const repo = new SupabaseProfileRepository(supabase);
  
  const profile = await repo.getProfile();
  
  if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }
  
  return NextResponse.json(profile);
}
