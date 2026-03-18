import { createServerMyBookingsPresenter } from "@/src/presentation/presenters/my-bookings/MyBookingsPresenterServerFactory";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ profileId: string }> }) {
  const searchParams = request.nextUrl.searchParams;
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  if (!month || !year) {
      return NextResponse.json({ error: 'Missing month or year' }, { status: 400 });
  }

  const resolvedParams = await params;
  const presenter = await createServerMyBookingsPresenter();
  
  const result = await presenter.getByMonthByProfile(resolvedParams.profileId, parseInt(month), parseInt(year));
  return NextResponse.json(result);
}
