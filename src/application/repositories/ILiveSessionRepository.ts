import { LiveSession as DomainLiveSession } from '@/src/presentation/presenters/live/LiveSessionsPresenter';

export interface ILiveSessionRepository {
  getActiveSessions(): Promise<DomainLiveSession[]>;
}
