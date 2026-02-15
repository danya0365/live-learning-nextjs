/**
 * FAQPresenter
 * Handles business logic for FAQ management
 * Receives repository via dependency injection
 */

import {
    FAQItem,
    FAQStats,
    IFAQRepository,
} from '@/src/application/repositories/IFAQRepository';

export interface FAQViewModel {
  items: FAQItem[];
  stats: FAQStats;
  currentCategory: string | null;
}

export class FAQPresenter {
  constructor(
    private readonly repository: IFAQRepository
  ) {}

  /**
   * Get view model for the page
   */
  async getViewModel(category: string | null = null): Promise<FAQViewModel> {
    try {
      const allItems = await this.repository.getAll(category || undefined);
      const stats = await this.repository.getStats();

      return {
        items: allItems,
        stats,
        currentCategory: category,
      };
    } catch (error) {
      console.error('Error getting FAQ view model:', error);
      throw error;
    }
  }

  /**
   * Generate metadata for the page
   */
  generateMetadata() {
    return {
      title: "คำถามที่พบบ่อย | Live Learning",
      description: "รวมคำถามที่พบบ่อยเกี่ยวกับการใช้งาน Live Learning การสมัครเรียน และการชำระเงิน",
    };
  }
}
