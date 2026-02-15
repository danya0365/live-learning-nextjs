import { MockEventRepository } from '@/src/infrastructure/repositories/mock/MockEventRepository';
import { EventPresenter } from './EventPresenter';

export class EventPresenterServerFactory {
  static create(): EventPresenter {
    const repository = new MockEventRepository();
    return new EventPresenter(repository);
  }
}

export function createServerEventPresenter(): EventPresenter {
  return EventPresenterServerFactory.create();
}
