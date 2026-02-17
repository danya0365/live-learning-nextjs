
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

import { SupabaseInstructorRepository } from "@/src/infrastructure/repositories/supabase/SupabaseInstructorRepository";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body: CreateConsultationOfferData = await request.json();
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseConsultationRepository(supabase);
  const instructorRepo = new SupabaseInstructorRepository(supabase);

  try {
    // SECURE: Verify user is an instructor
    const instructor = await instructorRepo.getMe();
    if (!instructor) {
        return NextResponse.json({ error: 'Unauthorized: Only instructors can create offers' }, { status: 403 });
    }

    // SECURE: Overwrite instructorId with authenticated user's instructor ID
    const safeBody = {
        ...body,
        requestId: id,
        instructorId: instructor.id
    };

    const result = await repository.createOffer(safeBody);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
