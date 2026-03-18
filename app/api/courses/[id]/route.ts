import { createServerInstructorsPresenter } from "@/src/presentation/presenters/instructors/InstructorsPresenterServerFactory";
import { createServerProfilePresenter } from "@/src/presentation/presenters/profile/ProfilePresenterServerFactory";
import { createServerCoursesPresenter } from '@/src/presentation/presenters/courses/CoursesPresenterServerFactory';
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


export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const supabase = await createServerSupabaseClient();
  const presenter = await createServerCoursesPresenter();
  const instructorsPresenter = await createServerInstructorsPresenter();
  
  try {
      const profilePresenter = await createServerProfilePresenter();
      const profile = await profilePresenter.getProfile();

      if (!profile) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // SECURE: Verify ownership
      const instructor = await instructorsPresenter.getByProfileId(profile.id);
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
  const instructorsPresenter = await createServerInstructorsPresenter();
  
  try {
      const profilePresenter = await createServerProfilePresenter();
      const profile = await profilePresenter.getProfile();

      if (!profile) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // SECURE: Verify ownership
      const instructor = await instructorsPresenter.getByProfileId(profile.id);
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
