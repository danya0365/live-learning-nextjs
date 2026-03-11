
import { SupabaseConsultationRepository } from "@/src/infrastructure/repositories/supabase/SupabaseConsultationRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseConsultationRepository(supabase);

  try {
    const result = await repository.getRequestById(id);
    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/supabase/SupabaseAuthRepository";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    // Treat delete as cancel if implemented? Or soft delete. Logic assumes cancel.
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseConsultationRepository(supabase);
  const authRepo = new SupabaseAuthRepository(supabase);

  try {
    const profile = await authRepo.getProfile();
    if (!profile) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const request = await repository.getRequestById(id);
    if (!request) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (request.studentId !== profile.id) {
        return NextResponse.json({ error: 'Unauthorized: You can only cancel your own requests' }, { status: 403 });
    }

    const result = await repository.cancelRequest(id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
