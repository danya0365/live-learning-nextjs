
import { UserPreferences } from "@/src/application/repositories/ISettingsRepository";
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/supabase/SupabaseAuthRepository";
import { SupabaseSettingsRepository } from "@/src/infrastructure/repositories/supabase/SupabaseSettingsRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseSettingsRepository(supabase);
  const authRepo = new SupabaseAuthRepository(supabase);
  
  const profile = await authRepo.getProfile();

  if (!profile) {
     return NextResponse.json({ error: 'Unauthorized: No active profile' }, { status: 401 });
  }

  // SECURE: Use Active Profile ID
  const targetUserId = profile.id;

  try {
    const result = await repository.getPreferences(targetUserId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseSettingsRepository(supabase);
  const authRepo = new SupabaseAuthRepository(supabase);
  
  try {
    const profile = await authRepo.getProfile();
    
    if (!profile) {
        return NextResponse.json({ error: 'Unauthorized: No active profile' }, { status: 401 });
    }

    const body: UserPreferences = await request.json();
    
    // SECURE: Force update to target the active profile
    const safeBody = {
        ...body,
        userId: profile.id
    };

    const result = await repository.updatePreferences(safeBody);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
