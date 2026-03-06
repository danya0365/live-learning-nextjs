import { BlogPost, IBlogRepository } from '@/src/application/repositories/IBlogRepository';
import { MOCK_BLOGS } from '@/src/data/mock/blogs';

export class MockBlogRepository implements IBlogRepository {
  async getAll(): Promise<BlogPost[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return [...MOCK_BLOGS];
  }

  async getById(id: string): Promise<BlogPost | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return MOCK_BLOGS.find((b) => b.id === id) || null;
  }
}
