import { createServerInstructorsPresenter } from "@/src/presentation/presenters/instructors/InstructorsPresenterServerFactory";
import { createServerProfilePresenter } from "@/src/presentation/presenters/profile/ProfilePresenterServerFactory";
import { createServerCoursesPresenter } from "@/src/presentation/presenters/courses/CoursesPresenterServerFactory";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const presenter = await createServerCoursesPresenter();
  const instructorsPresenter = await createServerInstructorsPresenter();

  try {
    const profilePresenter = await createServerProfilePresenter();
    const profile = await profilePresenter.getProfile();
    
    if (!profile) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // SECURE: Verify user is an instructor
    const currentInstructor = await instructorsPresenter.getByProfileId(profile.id);
    
    if (!currentInstructor) {
        return NextResponse.json({ error: 'Unauthorized: You must be a registered instructor' }, { status: 403 });
    }

    const courses = await presenter.getByInstructorId(currentInstructor.id);
    return NextResponse.json(courses);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
