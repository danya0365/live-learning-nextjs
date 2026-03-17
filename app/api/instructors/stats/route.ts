import { createServerInstructorsPresenter } from "@/src/presentation/presenters/instructors/InstructorsPresenterServerFactory";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const presenter = await createServerInstructorsPresenter();
  
  const stats = await presenter.getStats();
  
  return NextResponse.json(stats);
}
