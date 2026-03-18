import { createServerCoursesPresenter } from "@/src/presentation/presenters/courses/CoursesPresenterServerFactory";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const presenter = await createServerCoursesPresenter();
  const stats = await presenter.getStats();
  
  return NextResponse.json(stats);
}
