import { createServerProfilePresenter } from "@/src/presentation/presenters/profile/ProfilePresenterServerFactory";

import { UpdatePasswordData } from "@/src/application/repositories/ISettingsRepository";
import { createServerSettingsPresenter } from "@/src/presentation/presenters/settings/SettingsPresenterServerFactory";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const presenter = await createServerSettingsPresenter();
  
  try {
    const profilePresenter = await createServerProfilePresenter();
    const profile = await profilePresenter.getProfile();
    
    if (!profile) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: UpdatePasswordData = await request.json();
    await presenter.updatePassword({ userId: profile.id, ...body });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
