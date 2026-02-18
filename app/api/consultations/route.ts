
import { CreateConsultationRequestPayload } from "@/src/application/repositories/IConsultationRepository";
import { SupabaseConsultationRepository } from "@/src/infrastructure/repositories/supabase/SupabaseConsultationRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseConsultationRepository(supabase);

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
        const requests = await repository.getRequestsByCategory(categoryId);
        return NextResponse.json(requests);
    }

    if (status === 'open') {
        const requests = await repository.getOpenRequests();
        return NextResponse.json(requests);
    }
    
    // Default: all requests (admin view or similar)
    const requests = await repository.getAllRequests();
    return NextResponse.json(requests);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/supabase/SupabaseAuthRepository";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseConsultationRepository(supabase);
  const authRepo = new SupabaseAuthRepository(supabase);

  try {
    const profile = await authRepo.getProfile();

    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized: No active profile found' }, { status: 401 });
    }

    const body: CreateConsultationRequestPayload = await request.json();
    
    // 🔒 Server-Injected Identity: pass studentId as separate parameter
    const result = await repository.createRequest(body, profile.id);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } 
}
