import { StaticEventRepository } from '@/src/infrastructure/repositories/static/StaticEventRepository';
import { EventPresenter } from './EventPresenter';

export class EventPresenterServerFactory {
  static create(): EventPresenter {
    const repository = new StaticEventRepository();
    return new EventPresenter(repository);
  }
}

export function createServerEventPresenter(): EventPresenter {
  return EventPresenterServerFactory.create();
}
