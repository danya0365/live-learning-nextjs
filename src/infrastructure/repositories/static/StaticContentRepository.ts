/**
 * StaticContentRepository
 * Static implementation — read-only from static data files
 * Following Clean Architecture - Infrastructure layer
 */

import { ContentItem, IContentRepository } from '@/src/application/repositories/IContentRepository';
import { MOCK_CONTENT } from '@/src/data/mock/content';

export class StaticContentRepository implements IContentRepository {
  async getBySlug(slug: string): Promise<ContentItem | null> {
    return MOCK_CONTENT[slug] || null;
  }
}
