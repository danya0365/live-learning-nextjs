import { createServerProfilePresenter } from "@/src/presentation/presenters/profile/ProfilePresenterServerFactory";
import { NextResponse } from "next/server";

export async function GET() {
  const presenter = await createServerProfilePresenter();
  const profile = await presenter.getProfile();
  
  if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }
  
  return NextResponse.json(profile);
}
