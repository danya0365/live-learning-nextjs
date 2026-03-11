import { SupabaseBookingRepository } from "@/src/infrastructure/repositories/supabase/SupabaseBookingRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  if (!month || !year) {
      return NextResponse.json({ error: 'Missing month or year' }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseBookingRepository(supabase);
  
  const result = await repository.getMyBookingsByMonth(parseInt(month), parseInt(year));
  return NextResponse.json(result);
}
