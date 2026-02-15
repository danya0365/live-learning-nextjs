
import { SupabaseProfileRepository } from "@/src/infrastructure/repositories/supabase/SupabaseProfileRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const repo = new SupabaseProfileRepository(supabase);
  
  const profiles = await repo.getProfiles();
  
  return NextResponse.json(profiles);
}
