import { createServerLiveSessionsPresenter } from '@/src/presentation/presenters/live/LiveSessionsPresenterServerFactory';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const presenter = await createServerLiveSessionsPresenter();
    
    const sessions = await presenter.getActiveSessions();
    
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch live sessions' }, { status: 500 });
  }
}
