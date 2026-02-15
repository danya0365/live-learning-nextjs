
import { CreateConsultationOfferData } from "@/src/application/repositories/IConsultationRepository";
import { SupabaseConsultationRepository } from "@/src/infrastructure/repositories/supabase/SupabaseConsultationRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseConsultationRepository(supabase);

  try {
    const results = await repository.getOffersByRequestId(id);
    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body: CreateConsultationOfferData = await request.json();
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseConsultationRepository(supabase);

  // Ideally, validate logged in user = instructor
  // For now rely on frontend validation + simple repo call
  try {
    const result = await repository.createOffer({ ...body, requestId: id });
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
