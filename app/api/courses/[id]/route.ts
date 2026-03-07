
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

import { SupabaseInstructorRepository } from "@/src/infrastructure/repositories/supabase/SupabaseInstructorRepository";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseCourseRepository(supabase);
  const instructorRepo = new SupabaseInstructorRepository(supabase);
  
  try {
      // SECURE: Verify ownership
      const instructor = await instructorRepo.getMe();
      if (!instructor) {
          return NextResponse.json({ error: 'Unauthorized: Only instructors can update courses' }, { status: 403 });
      }

      const existing = await repository.getById(id);
      if (!existing) {
          return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }

      // Check ownership through instructor_courses junction table
      const instructorCourses = await repository.getByInstructorId(instructor.id);
      const isOwner = instructorCourses.some(c => c.id === id);
      if (!isOwner) {
          return NextResponse.json({ error: 'Unauthorized: You can only update courses you teach' }, { status: 403 });
      }

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
  const instructorRepo = new SupabaseInstructorRepository(supabase);
  
  try {
      // SECURE: Verify ownership
      const instructor = await instructorRepo.getMe();
      if (!instructor) {
          return NextResponse.json({ error: 'Unauthorized: Only instructors can delete courses' }, { status: 403 });
      }

      const existing = await repository.getById(id);
      if (!existing) {
          return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }

      const instructorCourses = await repository.getByInstructorId(instructor.id);
      const isOwner = instructorCourses.some(c => c.id === id);
      if (!isOwner) {
          return NextResponse.json({ error: 'Unauthorized: You can only delete courses you teach' }, { status: 403 });
      }
      
      const success = await repository.delete(id);
      
      if (!success) {
          return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
      }
      
      return NextResponse.json({ success: true });
  } catch (error) {
      return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
