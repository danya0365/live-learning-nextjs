import { SupabaseBlogRepository } from '@/src/infrastructure/repositories/supabase/SupabaseBlogRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { BlogPresenter } from './BlogPresenter';

export class BlogPresenterServerFactory {
  static async create(): Promise<BlogPresenter> {
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseBlogRepository(supabase);
    return new BlogPresenter(repository);
  }
}

export async function createServerBlogPresenter(): Promise<BlogPresenter> {
  return BlogPresenterServerFactory.create();
}
