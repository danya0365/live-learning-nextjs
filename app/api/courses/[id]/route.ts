
import { SupabaseCourseRepository } from "@/src/infrastructure/repositories/supabase/SupabaseCourseRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseCourseRepository(supabase);
  
  const course = await repository.getById(id);
  
  if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }
  
  return NextResponse.json(course);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseCourseRepository(supabase);
  
  try {
      const updated = await repository.update(id, body);
      return NextResponse.json(updated);
  } catch (error) {
      console.error('Update failed', error);
      return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseCourseRepository(supabase);
  
  const success = await repository.delete(id);
  
  if (!success) {
      return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}
