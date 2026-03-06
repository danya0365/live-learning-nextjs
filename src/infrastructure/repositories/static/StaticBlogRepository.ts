/**
 * StaticBlogRepository
 * Static implementation — read-only from static data files
 * Following Clean Architecture - Infrastructure layer
 */

import { BlogPost, IBlogRepository } from '@/src/application/repositories/IBlogRepository';
import { MOCK_BLOGS } from '@/src/data/mock/blogs';

export class StaticBlogRepository implements IBlogRepository {
  async getAll(): Promise<BlogPost[]> {
    return [...MOCK_BLOGS];
  }

  async getById(id: string): Promise<BlogPost | null> {
    return MOCK_BLOGS.find((b) => b.id === id) || null;
  }
}
