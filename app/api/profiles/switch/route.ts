import { createServerProfilePresenter } from "@/src/presentation/presenters/profile/ProfilePresenterServerFactory";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { profileId } = body;
  
  if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
  }

  const presenter = await createServerProfilePresenter();
  const success = await presenter.switchProfile(profileId);
  
  if (!success) {
      return NextResponse.json({ error: 'Failed to switch profile' }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}
