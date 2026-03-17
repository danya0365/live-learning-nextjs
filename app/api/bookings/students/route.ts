import { createServerProfilePresenter } from "@/src/presentation/presenters/profile/ProfilePresenterServerFactory";
import { createServerMyBookingsPresenter } from "@/src/presentation/presenters/my-bookings/MyBookingsPresenterServerFactory";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const presenter = await createServerMyBookingsPresenter();
  const profilePresenter = await createServerProfilePresenter();

  try {
    const profile = await profilePresenter.getProfile();
    if (!profile) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await presenter.getByStudentId(profile.id);
    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
