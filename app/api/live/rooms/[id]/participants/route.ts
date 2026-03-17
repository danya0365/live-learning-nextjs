import { createServerLiveRoomPresenter } from "@/src/presentation/presenters/live/LiveRoomPresenterServerFactory";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const presenter = await createServerLiveRoomPresenter();

  try {
    const participants = await presenter.getParticipants(id);
    return NextResponse.json(participants);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
