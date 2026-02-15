
import { SupabaseInstructorRepository } from "@/src/infrastructure/repositories/supabase/SupabaseInstructorRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseInstructorRepository(supabase);
  
  const instructor = await repository.getById(id);
  
  if (!instructor) {
      return NextResponse.json({ error: 'Instructor not found' }, { status: 404 });
  }
  
  return NextResponse.json(instructor);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseInstructorRepository(supabase);
  
  try {
      // TODO: Permissions check
      
      const updated = await repository.update(id, body);
      return NextResponse.json(updated);
  } catch (error) {
      console.error('Update failed', error);
      return NextResponse.json({ error: 'Failed to update instructor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseInstructorRepository(supabase);
  
  // TODO: Permissions check
  
  const success = await repository.delete(id);
  
  if (!success) {
      return NextResponse.json({ error: 'Failed to delete instructor' }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}
