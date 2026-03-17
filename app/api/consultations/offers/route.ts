import { createServerConsultationsPresenter } from "@/src/presentation/presenters/consultations/ConsultationsPresenterServerFactory";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const instructorId = searchParams.get('instructorId');
  const presenter = await createServerConsultationsPresenter();

  try {
    if (instructorId) {
        const results = await presenter.getOffersByInstructorId(instructorId);
        return NextResponse.json(results);
    }
    return NextResponse.json([]); // Or throw error?
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
