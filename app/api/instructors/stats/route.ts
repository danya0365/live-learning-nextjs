
import { SupabaseInstructorRepository } from "@/src/infrastructure/repositories/supabase/SupabaseInstructorRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseInstructorRepository(supabase);
  
  const stats = await repository.getStats();
  
  return NextResponse.json(stats);
}
