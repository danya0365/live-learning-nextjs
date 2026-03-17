import { createServerConsultationsPresenter } from "@/src/presentation/presenters/consultations/ConsultationsPresenterServerFactory";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const presenter = await createServerConsultationsPresenter();

  try {
    const result = await presenter.withdrawOffer(id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
