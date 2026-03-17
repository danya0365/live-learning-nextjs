import { createServerProfilePresenter } from "@/src/presentation/presenters/profile/ProfilePresenterServerFactory";
import { createServerConsultationsPresenter } from "@/src/presentation/presenters/consultations/ConsultationsPresenterServerFactory";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const presenter = await createServerConsultationsPresenter();

  try {
    const result = await presenter.getRequestById(id);
    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    // Treat delete as cancel if implemented? Or soft delete. Logic assumes cancel.
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const presenter = await createServerConsultationsPresenter();
  const profilePresenter = await createServerProfilePresenter();

  try {
    const profile = await profilePresenter.getProfile();
    if (!profile) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const request = await presenter.getRequestById(id);
    if (!request) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (request.studentId !== profile.id) {
        return NextResponse.json({ error: 'Unauthorized: You can only cancel your own requests' }, { status: 403 });
    }

    const result = await presenter.cancelRequest(id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
