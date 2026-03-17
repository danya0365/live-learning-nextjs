import { createServerCoursesPresenter } from '@/src/presentation/presenters/courses/CoursesPresenterServerFactory';
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/supabase/SupabaseAuthRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const presenter = await createServerCoursesPresenter();
  
  const course = await presenter.getById(id);
  
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
  const presenter = await createServerCoursesPresenter();
  const instructorRepo = new SupabaseInstructorRepository(supabase);
  
  try {
      const authRepo = new SupabaseAuthRepository(supabase);
      const profile = await authRepo.getProfile();

      if (!profile) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // SECURE: Verify ownership
      const instructor = await instructorRepo.getByProfileId(profile.id);
      if (!instructor) {
          return NextResponse.json({ error: 'Unauthorized: Only instructors can update courses' }, { status: 403 });
      }

      const existing = await presenter.getById(id);
      if (!existing) {
          return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }

      // Check ownership through instructor_courses junction table
      const instructorCourses = await presenter.getByInstructorId(instructor.id);
      const isOwner = instructorCourses.some(c => c.id === id);
      if (!isOwner) {
          return NextResponse.json({ error: 'Unauthorized: You can only update courses you teach' }, { status: 403 });
      }

      const updated = await presenter.update(id, body);
      return NextResponse.json(updated);
  } catch (error) {
      console.error('Update failed', error);
      return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const presenter = await createServerCoursesPresenter();
  const instructorRepo = new SupabaseInstructorRepository(supabase);
  
  try {
      const authRepo = new SupabaseAuthRepository(supabase);
      const profile = await authRepo.getProfile();

      if (!profile) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // SECURE: Verify ownership
      const instructor = await instructorRepo.getByProfileId(profile.id);
      if (!instructor) {
          return NextResponse.json({ error: 'Unauthorized: Only instructors can delete courses' }, { status: 403 });
      }

      const existing = await presenter.getById(id);
      if (!existing) {
          return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }

      const instructorCourses = await presenter.getByInstructorId(instructor.id);
      const isOwner = instructorCourses.some(c => c.id === id);
      if (!isOwner) {
          return NextResponse.json({ error: 'Unauthorized: You can only delete courses you teach' }, { status: 403 });
      }
      
      const success = await presenter.delete(id);
      
      if (!success) {
          return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
      }
      
      return NextResponse.json({ success: true });
  } catch (error) {
      return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
