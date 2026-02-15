
import { CreateConsultationRequestData } from "@/src/application/repositories/IConsultationRepository";
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
    if (studentId) {
        const requests = await repository.getRequestsByStudentId(studentId);
        return NextResponse.json(requests);
    }
    
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

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseConsultationRepository(supabase);

  try {
    const body: CreateConsultationRequestData = await request.json();
    const result = await repository.createRequest(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } 
}
