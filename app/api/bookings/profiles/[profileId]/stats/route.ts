import { createServerMyBookingsPresenter } from "@/src/presentation/presenters/my-bookings/MyBookingsPresenterServerFactory";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ profileId: string }> }) {
  const resolvedParams = await params;
  const presenter = await createServerMyBookingsPresenter();
  
  const result = await presenter.getStatsByProfile(resolvedParams.profileId);
  return NextResponse.json(result);
}
