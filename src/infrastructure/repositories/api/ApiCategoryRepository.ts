/**
 * ApiCategoryRepository
 * Implements ICategoryRepository using API calls
 * 
 * ✅ For CLIENT-SIDE use
 */

import {
  Category,
  CategoryStats,
  CreateCategoryData,
  ICategoryRepository,
  UpdateCategoryData,
} from '@/src/application/repositories/ICategoryRepository';

export class ApiCategoryRepository implements ICategoryRepository {
  private baseUrl = '/api/categories';

  async getById(id: string): Promise<Category | null> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch category');
    return res.json();
  }

  async getAll(): Promise<Category[]> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  }

  async getPaginated(page: number, perPage: number): Promise<{ data: Category[]; total: number; page: number; perPage: number }> {
    const res = await fetch(`${this.baseUrl}?page=${page}&perPage=${perPage}`);
    if (!res.ok) throw new Error('Failed to fetch paginated categories');
    return res.json();
  }

  async create(data: CreateCategoryData): Promise<Category> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  }

  async update(id: string, data: UpdateCategoryData): Promise<Category> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  }

  async getStats(): Promise<CategoryStats> {
    const res = await fetch(`${this.baseUrl}/stats`);
    if (!res.ok) {
        return {
            totalItems: 0,
            activeItems: 0,
            inactiveItems: 0
        };
    }
    return res.json();
  }
}
