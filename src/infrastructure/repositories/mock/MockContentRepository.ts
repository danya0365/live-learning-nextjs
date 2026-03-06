import { ContentItem, IContentRepository } from '@/src/application/repositories/IContentRepository';
import { MOCK_CONTENT } from '@/src/data/mock/content';

export class MockContentRepository implements IContentRepository {
  async getBySlug(slug: string): Promise<ContentItem | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return MOCK_CONTENT[slug] || null;
  }
}
