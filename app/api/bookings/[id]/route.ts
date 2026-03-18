import { createServerInstructorsPresenter } from "@/src/presentation/presenters/instructors/InstructorsPresenterServerFactory";
import { createServerProfilePresenter } from "@/src/presentation/presenters/profile/ProfilePresenterServerFactory";
import { createServerMyBookingsPresenter } from "@/src/presentation/presenters/my-bookings/MyBookingsPresenterServerFactory";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const presenter = await createServerMyBookingsPresenter();
  const profilePresenter = await createServerProfilePresenter();
  const instructorsPresenter = await createServerInstructorsPresenter();

  try {
    const profile = await profilePresenter.getProfile();
    if (!profile) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await presenter.getById(id);
    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // SECURE: Check ownership (Student OR Instructor)
    // 1. Is Student?
    if (result.studentId === profile.id) {
        return NextResponse.json(result);
    }

    // 2. Is Instructor?
    const instructor = await instructorsPresenter.getByProfileId(profile.id);
    if (instructor && result.instructorId === instructor.id) {
        return NextResponse.json(result);
    }
    
    // 3. Is Admin?
    if (profile.role === 'admin') {
        return NextResponse.json(result);
    }
    
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const presenter = await createServerMyBookingsPresenter();
  const profilePresenter = await createServerProfilePresenter();

  try {
    const profile = await profilePresenter.getProfile();
    if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const existing = await presenter.getById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Only allow Student (Owner) to update? Or Instructor?
    // Usually updates are status changes. 
    // Let's assume for now only Student Cancellation or Instructor Approval?
    // Without specific business logic, restricting to involved parties is safer.
    
    if (existing.studentId !== profile.id) {
         // TODO: Add Instructor check here too if they need to update status
         return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const result = await presenter.update(id, body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const presenter = await createServerMyBookingsPresenter();
  const profilePresenter = await createServerProfilePresenter();

  try {
    const profile = await profilePresenter.getProfile();
    if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const existing = await presenter.getById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (existing.studentId !== profile.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const success = await presenter.delete(id);
    if (!success) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
