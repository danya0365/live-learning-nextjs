
import { SupabaseCourseRepository } from "@/src/infrastructure/repositories/supabase/SupabaseCourseRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseCourseRepository(supabase);
  
  const stats = await repository.getStats();
  
  return NextResponse.json(stats);
}
