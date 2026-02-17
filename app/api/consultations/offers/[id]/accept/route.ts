
import { SupabaseConsultationRepository } from "@/src/infrastructure/repositories/supabase/SupabaseConsultationRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/supabase/SupabaseAuthRepository";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseConsultationRepository(supabase);
  const authRepo = new SupabaseAuthRepository(supabase);

  try {
    const profile = await authRepo.getProfile();
    if (!profile) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get the offer to find the request ID
    const offer = await repository.getOfferById(id);
    if (!offer) {
        return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // 2. Get the request to check student ownership
    const consultationRequest = await repository.getRequestById(offer.requestId);
    if (!consultationRequest) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // 3. Verify ownership
    if (consultationRequest.studentId !== profile.id) {
        return NextResponse.json({ error: 'Unauthorized: You can only accept offers for your own requests' }, { status: 403 });
    }

    const result = await repository.acceptOffer(id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
