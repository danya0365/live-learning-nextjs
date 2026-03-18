import { createServerBookingWizardPresenter } from "@/src/presentation/presenters/booking/BookingWizardPresenterServerFactory";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Extract date constraints from URL
    const searchParams = request.nextUrl.searchParams;
    const startDateIso = searchParams.get('startDateIso') || undefined;
    const endDateIso = searchParams.get('endDateIso') || undefined;
    
    const supabase = await createServerSupabaseClient();
    const presenter = await createServerBookingWizardPresenter();
    
    const slots = await presenter.getSlotsByInstructor(id, startDateIso, endDateIso);
    
    return NextResponse.json(slots);
  } catch (error) {
    console.error('Error fetching wizard slots:', error);
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}
