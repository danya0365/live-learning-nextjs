
import { UpdateProfileData } from "@/src/application/repositories/ISettingsRepository";
import { SupabaseSettingsRepository } from "@/src/infrastructure/repositories/supabase/SupabaseSettingsRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseSettingsRepository(supabase);
  
  try {
    const body: UpdateProfileData = await request.json();
    const result = await repository.updateProfile(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
