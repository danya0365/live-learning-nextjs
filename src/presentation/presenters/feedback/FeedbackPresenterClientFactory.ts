'use client';

import { MockFeedbackRepository } from '@/src/infrastructure/repositories/mock/MockFeedbackRepository';
import { FeedbackPresenter } from './FeedbackPresenter';

export class FeedbackPresenterClientFactory {
  static create(): FeedbackPresenter {
    const repository = new MockFeedbackRepository();
    return new FeedbackPresenter(repository);
  }
}

export function createClientFeedbackPresenter(): FeedbackPresenter {
  return FeedbackPresenterClientFactory.create();
}
