
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/supabase/SupabaseAuthRepository";
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
      const authRepo = new SupabaseAuthRepository(supabase);
      const profile = await authRepo.getProfile();

      if (!profile) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // SECURE: Permissions check
      const currentInstructor = await repository.getByProfileId(profile.id);
      
      if (!currentInstructor || currentInstructor.id !== id) {
          return NextResponse.json({ error: 'Unauthorized: You can only update your own profile' }, { status: 403 });
      }
      
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
  
  const authRepo = new SupabaseAuthRepository(supabase);
  const profile = await authRepo.getProfile();

  if (!profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // SECURE: Permissions check
  const currentInstructor = await repository.getByProfileId(profile.id);
  
  if (!currentInstructor || currentInstructor.id !== id) {
      return NextResponse.json({ error: 'Unauthorized: You can only delete your own profile' }, { status: 403 });
  }
  
  const success = await repository.delete(id);
  
  if (!success) {
      return NextResponse.json({ error: 'Failed to delete instructor' }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}
