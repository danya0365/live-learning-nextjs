
import { UpdateProfileData } from "@/src/application/repositories/ISettingsRepository";
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/supabase/SupabaseAuthRepository";
import { SupabaseSettingsRepository } from "@/src/infrastructure/repositories/supabase/SupabaseSettingsRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseSettingsRepository(supabase);
  const authRepo = new SupabaseAuthRepository(supabase);
  
  try {
    const profile = await authRepo.getProfile();
    
    if (!profile) {
        return NextResponse.json({ error: 'Unauthorized: No active profile' }, { status: 401 });
    }

    const body: UpdateProfileData = await request.json();
    
    // SECURE: Force update to target the active profile
    const safeBody = {
        ...body,
        userId: profile.id
    };
    
    const result = await repository.updateProfile(safeBody);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
