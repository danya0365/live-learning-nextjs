import { StaticBlogRepository } from '@/src/infrastructure/repositories/static/StaticBlogRepository';
import { BlogPresenter } from './BlogPresenter';

export class BlogPresenterServerFactory {
  static create(): BlogPresenter {
    const repository = new StaticBlogRepository();
    return new BlogPresenter(repository);
  }
}

export function createServerBlogPresenter(): BlogPresenter {
  return BlogPresenterServerFactory.create();
}
