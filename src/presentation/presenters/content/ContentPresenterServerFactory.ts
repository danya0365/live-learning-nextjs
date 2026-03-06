import { StaticContentRepository } from '@/src/infrastructure/repositories/static/StaticContentRepository';
import { ContentPresenter } from './ContentPresenter';

export class ContentPresenterServerFactory {
  static create(): ContentPresenter {
    const repository = new StaticContentRepository();
    return new ContentPresenter(repository);
  }
}

export function createServerContentPresenter(): ContentPresenter {
  return ContentPresenterServerFactory.create();
}
