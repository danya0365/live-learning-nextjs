import { createServerCategoriesPresenter } from "@/src/presentation/presenters/categories/CategoriesPresenterServerFactory";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const presenter = await createServerCategoriesPresenter();
  
  const category = await presenter.getById(id);
  
  if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }
  
  return NextResponse.json(category);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const presenter = await createServerCategoriesPresenter();
  
  try {
      // TODO: Permissions check
      
      const updated = await presenter.update(id, body);
      return NextResponse.json(updated);
  } catch (error) {
      console.error('Update failed', error);
      return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const presenter = await createServerCategoriesPresenter();
  
  // TODO: Permissions check
  
  const success = await presenter.delete(id);
  
  if (!success) {
      return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}
