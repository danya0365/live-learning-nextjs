
import { UpdatePasswordData } from "@/src/application/repositories/ISettingsRepository";
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/supabase/SupabaseAuthRepository";
import { SupabaseSettingsRepository } from "@/src/infrastructure/repositories/supabase/SupabaseSettingsRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseSettingsRepository(supabase);
  
  try {
    const authRepo = new SupabaseAuthRepository(supabase);
    const profile = await authRepo.getProfile();
    
    if (!profile) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: UpdatePasswordData = await request.json();
    await repository.updatePassword({ userId: profile.id, ...body });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
