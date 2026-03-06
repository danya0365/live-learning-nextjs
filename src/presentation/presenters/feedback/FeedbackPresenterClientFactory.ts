'use client';

import { ApiFeedbackRepository } from '@/src/infrastructure/repositories/api/ApiFeedbackRepository';
import { FeedbackPresenter } from './FeedbackPresenter';

export class FeedbackPresenterClientFactory {
  static create(): FeedbackPresenter {
    const repository = new ApiFeedbackRepository();
    return new FeedbackPresenter(repository);
  }
}

export function createClientFeedbackPresenter(): FeedbackPresenter {
  return FeedbackPresenterClientFactory.create();
}
