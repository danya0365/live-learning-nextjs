import { createServerCategoriesPresenter } from "@/src/presentation/presenters/categories/CategoriesPresenterServerFactory";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const presenter = await createServerCategoriesPresenter();
  const stats = await presenter.getStats();
  
  return NextResponse.json(stats);
}
