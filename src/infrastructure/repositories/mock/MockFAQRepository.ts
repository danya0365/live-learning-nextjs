/**
 * MockFAQRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - this is in the Infrastructure layer
 */

import {
    CreateFAQData,
    FAQItem,
    FAQStats,
    IFAQRepository,
    PaginatedResult,
    UpdateFAQData,
} from '@/src/application/repositories/IFAQRepository';

// Mock data for development
import { MOCK_FAQS } from '@/src/data/mock/faqs';

export class MockFAQRepository implements IFAQRepository {
  private items: FAQItem[] = [...MOCK_FAQS];

  async getById(id: string): Promise<FAQItem | null> {
    await this.delay(100);
    return this.items.find((item) => item.id === id) || null;
  }

  async getAll(category?: string): Promise<FAQItem[]> {
    await this.delay(100);
    if (category) {
      return this.items.filter((item) => item.category === category);
    }
    return [...this.items];
  }

  async getPaginated(page: number, perPage: number, category?: string): Promise<PaginatedResult<FAQItem>> {
    await this.delay(100);

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

  async create(data: CreateFAQData): Promise<FAQItem> {
    await this.delay(200);
    
    const newItem: FAQItem = {
      id: `faq-${Date.now()}`,
      isActive: true,
      order: data.order || this.items.length + 1,
      ...data,
    };

    this.items.push(newItem);
    return newItem;
  }

  async update(id: string, data: UpdateFAQData): Promise<FAQItem> {
    await this.delay(200);
    
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('FAQ not found');
    }

    const updatedItem: FAQItem = {
      ...this.items[index],
      ...data,
    };

    this.items[index] = updatedItem;
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    await this.delay(200);
    
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    this.items.splice(index, 1);
    return true;
  }

  async getStats(): Promise<FAQStats> {
    await this.delay(100);
    
    const categories = Array.from(new Set(this.items.map((item) => item.category)));

    return {
      totalItems: this.items.length,
      categories,
    };
  }

  // Helper method to simulate network delay
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
