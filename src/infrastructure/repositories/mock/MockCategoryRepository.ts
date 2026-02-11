/**
 * MockCategoryRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure layer
 */

import {
    Category,
    CategoryStats,
    CreateCategoryData,
    ICategoryRepository,
    UpdateCategoryData,
} from '@/src/application/repositories/ICategoryRepository';

const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-001',
    name: 'Web Development',
    icon: '🌐',
    description: 'พัฒนาเว็บแอปพลิเคชัน Frontend & Backend',
    courseCount: 12,
    color: 'hsl(210, 80%, 60%)',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2025-06-15T00:00:00.000Z',
  },
  {
    id: 'cat-002',
    name: 'Data Science & AI',
    icon: '🤖',
    description: 'วิทยาศาสตร์ข้อมูล ปัญญาประดิษฐ์ และ Machine Learning',
    courseCount: 8,
    color: 'hsl(280, 70%, 60%)',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2025-07-10T00:00:00.000Z',
  },
  {
    id: 'cat-003',
    name: 'Design',
    icon: '🎨',
    description: 'UX/UI Design, Graphic Design และ Design Thinking',
    courseCount: 6,
    color: 'hsl(330, 80%, 60%)',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2025-08-20T00:00:00.000Z',
  },
  {
    id: 'cat-004',
    name: 'Mobile Development',
    icon: '📱',
    description: 'พัฒนาแอปมือถือ iOS, Android และ Cross-platform',
    courseCount: 5,
    color: 'hsl(150, 70%, 50%)',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2025-09-05T00:00:00.000Z',
  },
  {
    id: 'cat-005',
    name: 'Cybersecurity',
    icon: '🛡️',
    description: 'ความปลอดภัยทางไซเบอร์ Ethical Hacking และ Network Security',
    courseCount: 3,
    color: 'hsl(0, 70%, 55%)',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2025-10-01T00:00:00.000Z',
  },
  {
    id: 'cat-006',
    name: 'DevOps & Cloud',
    icon: '☁️',
    description: 'Docker, Kubernetes, AWS, CI/CD Pipeline',
    courseCount: 4,
    color: 'hsl(45, 90%, 55%)',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2025-10-15T00:00:00.000Z',
  },
];

export class MockCategoryRepository implements ICategoryRepository {
  private items: Category[] = [...MOCK_CATEGORIES];

  async getById(id: string): Promise<Category | null> {
    await this.delay(100);
    return this.items.find((item) => item.id === id) || null;
  }

  async getAll(): Promise<Category[]> {
    await this.delay(100);
    return [...this.items];
  }

  async getPaginated(page: number, perPage: number) {
    await this.delay(100);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return { data: this.items.slice(start, end), total: this.items.length, page, perPage };
  }

  async create(data: CreateCategoryData): Promise<Category> {
    await this.delay(200);
    const newItem: Category = {
      id: `cat-${Date.now()}`,
      name: data.name,
      icon: data.icon || '📁',
      description: data.description || '',
      courseCount: 0,
      color: data.color || 'hsl(200, 60%, 50%)',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.unshift(newItem);
    return newItem;
  }

  async update(id: string, data: UpdateCategoryData): Promise<Category> {
    await this.delay(200);
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Category not found');
    const updatedItem: Category = { ...this.items[index], ...data, updatedAt: new Date().toISOString() };
    this.items[index] = updatedItem;
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    await this.delay(200);
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  async getStats(): Promise<CategoryStats> {
    await this.delay(100);
    const totalItems = this.items.length;
    const activeItems = this.items.filter((item) => item.isActive).length;
    return { totalItems, activeItems, inactiveItems: totalItems - activeItems };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockCategoryRepository = new MockCategoryRepository();
