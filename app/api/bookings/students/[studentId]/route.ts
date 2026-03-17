import { createServerMyBookingsPresenter } from "@/src/presentation/presenters/my-bookings/MyBookingsPresenterServerFactory";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const { studentId } = await params;

  const presenter = await createServerMyBookingsPresenter();

  try {
    const result = await presenter.getByStudentId(studentId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
