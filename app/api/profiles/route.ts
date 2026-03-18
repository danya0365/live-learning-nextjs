import { createServerProfilePresenter } from "@/src/presentation/presenters/profile/ProfilePresenterServerFactory";
import { NextResponse } from "next/server";

export async function GET() {
  const presenter = await createServerProfilePresenter();
  const profiles = await presenter.getProfiles();
  
  return NextResponse.json(profiles);
}
