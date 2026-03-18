import { createServerProfilePresenter } from "@/src/presentation/presenters/profile/ProfilePresenterServerFactory";

import { UpdateProfileData } from "@/src/application/repositories/ISettingsRepository";
import { createServerSettingsPresenter } from "@/src/presentation/presenters/settings/SettingsPresenterServerFactory";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const presenter = await createServerSettingsPresenter();
  const profilePresenter = await createServerProfilePresenter();
  
  try {
    const profile = await profilePresenter.getProfile();
    
    if (!profile) {
        return NextResponse.json({ error: 'Unauthorized: No active profile' }, { status: 401 });
    }

    const body: UpdateProfileData = await request.json();
    
    // SECURE: Force update to target the active profile
    const safeBody = {
        ...body,
        userId: profile.id
    };
    
    const result = await presenter.updateProfile(safeBody);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
