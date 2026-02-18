import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Deprecated endpoint. Use /api/bookings/students or /api/bookings/instructors' },
    { status: 410 } // Gone
  );
}

import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/supabase/SupabaseAuthRepository";
import { SupabaseBookingRepository } from "@/src/infrastructure/repositories/supabase/SupabaseBookingRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseBookingRepository(supabase);
  const authRepo = new SupabaseAuthRepository(supabase);

  try {
    const profile = await authRepo.getProfile();

    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized: No active profile found' }, { status: 401 });
    }

    const body = await request.json();
    
    // 🔒 Server-Injected Identity: pass studentId as separate parameter
    const result = await repository.create(body, profile.id);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
