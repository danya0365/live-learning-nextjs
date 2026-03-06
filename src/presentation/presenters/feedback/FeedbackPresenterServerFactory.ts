import { StaticFeedbackRepository } from '@/src/infrastructure/repositories/static/StaticFeedbackRepository';
import { FeedbackPresenter } from './FeedbackPresenter';

export class FeedbackPresenterServerFactory {
  static create(): FeedbackPresenter {
    const repository = new StaticFeedbackRepository();
    return new FeedbackPresenter(repository);
  }
}

export function createServerFeedbackPresenter(): FeedbackPresenter {
  return FeedbackPresenterServerFactory.create();
}
