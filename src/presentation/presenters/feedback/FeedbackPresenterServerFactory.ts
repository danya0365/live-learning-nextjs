import { MockFeedbackRepository } from '@/src/infrastructure/repositories/mock/MockFeedbackRepository';
import { FeedbackPresenter } from './FeedbackPresenter';

export class FeedbackPresenterServerFactory {
  static create(): FeedbackPresenter {
    const repository = new MockFeedbackRepository();
    return new FeedbackPresenter(repository);
  }
}

export function createServerFeedbackPresenter(): FeedbackPresenter {
  return FeedbackPresenterServerFactory.create();
}
