'use client';

import { StaticFeedbackRepository } from '@/src/infrastructure/repositories/static/StaticFeedbackRepository';
import { FeedbackPresenter } from './FeedbackPresenter';

export class FeedbackPresenterClientFactory {
  static create(): FeedbackPresenter {
    const repository = new StaticFeedbackRepository();
    return new FeedbackPresenter(repository);
  }
}

export function createClientFeedbackPresenter(): FeedbackPresenter {
  return FeedbackPresenterClientFactory.create();
}
