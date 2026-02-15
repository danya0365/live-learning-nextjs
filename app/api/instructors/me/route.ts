
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  
  // Get Auth User
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Get Profile ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  // Get Instructor Profile
  const { data: instructor } = await supabase
    .from('instructor_profiles')
    .select('*')
    .eq('profile_id', profile.id)
    .single();

  if (!instructor) {
      return NextResponse.json({ error: 'Instructor profile not found' }, { status: 404 });
  }

  return NextResponse.json(instructor);
}
