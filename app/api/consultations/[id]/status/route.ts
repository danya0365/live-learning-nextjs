
import { ConsultationRequestStatus } from "@/src/application/repositories/IConsultationRepository";
import { SupabaseConsultationRepository } from "@/src/infrastructure/repositories/supabase/SupabaseConsultationRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const status: ConsultationRequestStatus = body.status;

  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseConsultationRepository(supabase);

  try {
    const result = await repository.updateRequestStatus(id, status);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
