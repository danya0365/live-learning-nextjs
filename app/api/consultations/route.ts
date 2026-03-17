import { createServerProfilePresenter } from "@/src/presentation/presenters/profile/ProfilePresenterServerFactory";
import { createServerConsultationsPresenter } from "@/src/presentation/presenters/consultations/ConsultationsPresenterServerFactory";
import { CreateConsultationRequestPayload } from "@/src/application/repositories/IConsultationRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const presenter = await createServerConsultationsPresenter();

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const studentId = searchParams.get('studentId');
  const categoryId = searchParams.get('categoryId');

  try {
    // if (studentId) {
    //    // MOVED TO /api/consultations/student
    //    return NextResponse.json({ error: 'Use /api/consultations/student' }, { status: 410 });
    // }
    
    if (categoryId) {
        // Assuming we want open requests only for category view unless specified?
        const requests = await presenter.getRequestsByCategory(categoryId);
        return NextResponse.json(requests);
    }

    if (status === 'open') {
        const requests = await presenter.getOpenRequests();
        return NextResponse.json(requests);
    }
    
    // Default: all requests (admin view or similar)
    const requests = await presenter.getAllRequests();
    return NextResponse.json(requests);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const presenter = await createServerConsultationsPresenter();
  const profilePresenter = await createServerProfilePresenter();

  try {
    const profile = await profilePresenter.getProfile();

    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized: No active profile found' }, { status: 401 });
    }

    const body: CreateConsultationRequestPayload = await request.json();
    
    // 🔒 Server-Injected Identity: pass studentId as separate parameter
    const result = await presenter.createRequest(body, profile.id);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } 
}
