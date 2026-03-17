import { createServerMyBookingsPresenter } from "@/src/presentation/presenters/my-bookings/MyBookingsPresenterServerFactory";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const presenter = await createServerMyBookingsPresenter();

  try {
    const result = await presenter.getStats();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
