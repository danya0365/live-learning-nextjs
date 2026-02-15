/**
 * IFAQRepository
 * Repository interface for FAQ data access
 * Following Clean Architecture - this is in the Application layer
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  order: number;
}

export interface FAQStats {
  totalItems: number;
  categories: string[];
}

export interface CreateFAQData {
  question: string;
  answer: string;
  category: string;
  order?: number;
}

export interface UpdateFAQData {
  question?: string;
  answer?: string;
  category?: string;
  isActive?: boolean;
  order?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface IFAQRepository {
  /**
   * Get item by ID
   */
  getById(id: string): Promise<FAQItem | null>;

  /**
   * Get all items, optionally filtered by category
   */
  getAll(category?: string): Promise<FAQItem[]>;

  /**
   * Get paginated items
   */
  getPaginated(page: number, perPage: number, category?: string): Promise<PaginatedResult<FAQItem>>;

  /**
   * Create a new item
   */
  create(data: CreateFAQData): Promise<FAQItem>;

  /**
   * Update an existing item
   */
  update(id: string, data: UpdateFAQData): Promise<FAQItem>;

  /**
   * Delete an item
   */
  delete(id: string): Promise<boolean>;

  /**
   * Get statistics
   */
  getStats(): Promise<FAQStats>;
}
