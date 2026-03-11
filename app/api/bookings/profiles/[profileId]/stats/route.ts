import { SupabaseBookingRepository } from "@/src/infrastructure/repositories/supabase/SupabaseBookingRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ profileId: string }> }) {
  const resolvedParams = await params;
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseBookingRepository(supabase);
  
  const result = await repository.getStatsByProfile(resolvedParams.profileId);
  return NextResponse.json(result);
}
