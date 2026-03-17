import { createServerInstructorsPresenter } from "@/src/presentation/presenters/instructors/InstructorsPresenterServerFactory";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: instructorId } = await params;
    const body = await request.json();
    const { dayOfWeek, startTime, endTime } = body;

    const presenter = await createServerInstructorsPresenter();
    
    const availability = await presenter.addAvailability(instructorId, dayOfWeek, startTime, endTime);
    
    return NextResponse.json(availability);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
