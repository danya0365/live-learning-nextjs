import { MockContentRepository } from '@/src/infrastructure/repositories/mock/MockContentRepository';
import { ContentPresenter } from './ContentPresenter';

export class ContentPresenterServerFactory {
  static create(): ContentPresenter {
    const repository = new MockContentRepository();
    return new ContentPresenter(repository);
  }
}

export function createServerContentPresenter(): ContentPresenter {
  return ContentPresenterServerFactory.create();
}
