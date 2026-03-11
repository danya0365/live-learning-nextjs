'use client';

import { ILiveSessionRepository } from '@/src/application/repositories/ILiveSessionRepository';
import { LiveSession as DomainLiveSession } from '@/src/presentation/presenters/live/LiveSessionsPresenter';

export class ApiLiveSessionRepository implements ILiveSessionRepository {
  private baseUrl = '/api/live/sessions';

  async getActiveSessions(): Promise<DomainLiveSession[]> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) throw new Error('Failed to fetch live sessions');
    return res.json();
  }
}
