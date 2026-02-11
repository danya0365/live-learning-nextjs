/**
 * ICategoryRepository
 * Repository interface for Category data access
 * Following Clean Architecture - Application layer
 */

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  courseCount: number;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryStats {
  totalItems: number;
  activeItems: number;
  inactiveItems: number;
}

export interface CreateCategoryData {
  name: string;
  icon?: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryData {
  name?: string;
  icon?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

export interface ICategoryRepository {
  getById(id: string): Promise<Category | null>;
  getAll(): Promise<Category[]>;
  getPaginated(page: number, perPage: number): Promise<{ data: Category[]; total: number; page: number; perPage: number }>;
  create(data: CreateCategoryData): Promise<Category>;
  update(id: string, data: UpdateCategoryData): Promise<Category>;
  delete(id: string): Promise<boolean>;
  getStats(): Promise<CategoryStats>;
}
