/**
 * StaticFAQRepository
 * Static implementation — read-only from static data files
 * Write operations throw errors (not supported in static mode)
 * Following Clean Architecture - Infrastructure layer
 */

import {
    CreateFAQData,
    FAQItem,
    FAQStats,
    IFAQRepository,
    PaginatedResult,
    UpdateFAQData,
} from '@/src/application/repositories/IFAQRepository';
import { MOCK_FAQS } from '@/src/data/mock/faqs';

export class StaticFAQRepository implements IFAQRepository {
  private readonly items: FAQItem[] = [...MOCK_FAQS];

  async getById(id: string): Promise<FAQItem | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async getAll(category?: string): Promise<FAQItem[]> {
    if (category) {
      return this.items.filter((item) => item.category === category);
    }
    return [...this.items];
  }

  async getPaginated(page: number, perPage: number, category?: string): Promise<PaginatedResult<FAQItem>> {
    let filteredItems = this.items;
    if (category) {
      filteredItems = this.items.filter((item) => item.category === category);
    }

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedItems = filteredItems.slice(start, end);

    return {
      data: paginatedItems,
      total: filteredItems.length,
      page,
      perPage,
    };
  }

  async create(_data: CreateFAQData): Promise<FAQItem> {
    throw new Error('StaticFAQRepository: create is not supported in static mode');
  }

  async update(_id: string, _data: UpdateFAQData): Promise<FAQItem> {
    throw new Error('StaticFAQRepository: update is not supported in static mode');
  }

  async delete(_id: string): Promise<boolean> {
    throw new Error('StaticFAQRepository: delete is not supported in static mode');
  }

  async getStats(): Promise<FAQStats> {
    const categories = Array.from(new Set(this.items.map((item) => item.category)));
    return {
      totalItems: this.items.length,
      categories,
    };
  }
}
