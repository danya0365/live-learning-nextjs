
import { CreateConsultationOfferPayload } from "@/src/application/repositories/IConsultationRepository";
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/supabase/SupabaseAuthRepository";
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
  const body: CreateConsultationOfferPayload = await request.json();
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseConsultationRepository(supabase);
  const instructorRepo = new SupabaseInstructorRepository(supabase);

  try {
    const authRepo = new SupabaseAuthRepository(supabase);
    const profile = await authRepo.getProfile();

    if (!profile) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // SECURE: Verify user is an instructor
    const instructor = await instructorRepo.getByProfileId(profile.id);
    if (!instructor) {
        return NextResponse.json({ error: 'Unauthorized: Only instructors can create offers' }, { status: 403 });
    }

    // 🔒 Server-Injected Identity: pass instructorId as separate parameter
    const safeBody = {
        ...body,
        requestId: id,
    };

    const result = await repository.createOffer(safeBody, instructor.id);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
