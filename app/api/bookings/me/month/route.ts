import { createServerMyBookingsPresenter } from "@/src/presentation/presenters/my-bookings/MyBookingsPresenterServerFactory";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  if (!month || !year) {
      return NextResponse.json({ error: 'Missing month or year' }, { status: 400 });
  }

  const presenter = await createServerMyBookingsPresenter();
  
  const result = await presenter.getMyBookingsByMonth(parseInt(month), parseInt(year));
  return NextResponse.json(result);
}
