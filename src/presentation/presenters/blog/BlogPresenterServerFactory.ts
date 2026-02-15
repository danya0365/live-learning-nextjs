import { MockBlogRepository } from '@/src/infrastructure/repositories/mock/MockBlogRepository';
import { BlogPresenter } from './BlogPresenter';

export class BlogPresenterServerFactory {
  static create(): BlogPresenter {
    const repository = new MockBlogRepository();
    return new BlogPresenter(repository);
  }
}

export function createServerBlogPresenter(): BlogPresenter {
  return BlogPresenterServerFactory.create();
}
