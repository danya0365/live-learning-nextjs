import { createServerInstructorsPresenter } from "@/src/presentation/presenters/instructors/InstructorsPresenterServerFactory";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const presenter = await createServerInstructorsPresenter();
  
  const slots = await presenter.getAvailabilities(id);
  
  return NextResponse.json(slots);
}
