import { SupabaseBookingWizardRepository } from "@/src/infrastructure/repositories/supabase/SupabaseBookingWizardRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseBookingWizardRepository(supabase);
    
    const slots = await repository.getSlotsByInstructor(id);
    
    return NextResponse.json(slots);
  } catch (error) {
    console.error('Error fetching wizard slots:', error);
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}
