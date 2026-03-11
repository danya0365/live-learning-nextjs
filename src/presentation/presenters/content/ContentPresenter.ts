import { ContentItem, IContentRepository } from '@/src/application/repositories/IContentRepository';
import { Metadata } from 'next';

export interface ContentViewModel {
  item: ContentItem;
}

export class ContentPresenter {
  constructor(private readonly repository: IContentRepository) {}

  async getViewModel(slug: string): Promise<ContentViewModel | null> {
    const item = await this.repository.getBySlug(slug);
    if (!item) return null;
    return { item };
  }

  async generateMetadata(slug: string): Promise<Metadata> {
    const item = await this.repository.getBySlug(slug);
    if (!item) {
      return {
        title: 'ไม่พบเนื้อหา | Live Learning',
      };
    }
    
    return {
      title: `${item.title.replace(/^[^\w\u0E00-\u0E7F]+/, '')} | Live Learning`, // Strip leading emoji for title tag if needed, but keeping simplistic here
      description: `อ่านรายละเอียดเกี่ยวกับ ${item.title} ของ Live Learning`,
    };
  }
}
