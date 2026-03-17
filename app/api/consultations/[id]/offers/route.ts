import { createServerInstructorsPresenter } from "@/src/presentation/presenters/instructors/InstructorsPresenterServerFactory";
import { createServerProfilePresenter } from "@/src/presentation/presenters/profile/ProfilePresenterServerFactory";
import { createServerConsultationsPresenter } from "@/src/presentation/presenters/consultations/ConsultationsPresenterServerFactory";
import { CreateConsultationOfferPayload } from "@/src/application/repositories/IConsultationRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const presenter = await createServerConsultationsPresenter();

  try {
    const results = await presenter.getOffersByRequestId(id);
    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body: CreateConsultationOfferPayload = await request.json();
  const supabase = await createServerSupabaseClient();
  const presenter = await createServerConsultationsPresenter();
  const instructorsPresenter = await createServerInstructorsPresenter();

  try {
    const profilePresenter = await createServerProfilePresenter();
    const profile = await profilePresenter.getProfile();

    if (!profile) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // SECURE: Verify user is an instructor
    const instructor = await instructorsPresenter.getByProfileId(profile.id);
    if (!instructor) {
        return NextResponse.json({ error: 'Unauthorized: Only instructors can create offers' }, { status: 403 });
    }

    // 🔒 Server-Injected Identity: pass instructorId as separate parameter
    const safeBody = {
        ...body,
        requestId: id,
    };

    const result = await presenter.createOffer(safeBody, instructor.id);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
