import { createServerConsultationsPresenter } from "@/src/presentation/presenters/consultations/ConsultationsPresenterServerFactory";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const presenter = await createServerConsultationsPresenter();

  try {
    const result = await presenter.getOfferById(id);
    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
