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
const MOCK_FAQS: FAQItem[] = [
  {
    id: 'faq-001',
    question: 'Live Learning คืออะไร?',
    answer: 'Live Learning คือแพลตฟอร์มการเรียนรู้ออนไลน์ที่เน้นการเรียนสดกับอาจารย์ผู้เชี่ยวชาญ เพื่อให้ผู้เรียนสามารถโต้ตอบและสอบถามได้ทันที',
    category: 'ทั่วไป',
    isActive: true,
    order: 1,
  },
  {
    id: 'faq-002',
    question: 'ฉันจะสมัครเรียนได้อย่างไร?',
    answer: 'คุณสามารถเลือกคอร์สที่สนใจ และกดปุ่ม "สมัครเรียน" หรือ "จองเวลาเรียน" จากหน้ารายละเอียดคอร์สได้เลย',
    category: 'การสมัครเรียน',
    isActive: true,
    order: 2,
  },
  {
    id: 'faq-003',
    question: 'มีค่าใช้จ่ายในการสมัครสมาชิกหรือไม่?',
    answer: 'การสมัครสมาชิก Live Learning ไม่มีค่าใช้จ่าย คุณจะเสียค่าใช้จ่ายเฉพาะเมื่อลงทะเบียนเรียนในคอร์สเท่านั้น',
    category: 'การสมัครเรียน',
    isActive: true,
    order: 3,
  },
  {
    id: 'faq-004',
    question: 'ฉันสามารถขอคืนเงินได้หรือไม่?',
    answer: 'เรามีนโยบายคืนเงินภายใน 7 วัน หากคุณไม่พอใจในการเรียนการสอน หรือมีเหตุผลอันสมควร',
    category: 'การชำระเงิน',
    isActive: true,
    order: 4,
  },
  {
    id: 'faq-005',
    question: 'เรียนผ่านอุปกรณ์ใดได้บ้าง?',
    answer: 'รองรับการใช้งานผ่านคอมพิวเตอร์ แท็บเล็ต และสมาร์ทโฟน ทั้งระบบ iOS และ Android ผ่านเว็บเบราว์เซอร์',
    category: 'เทคนิค',
    isActive: true,
    order: 5,
  },
];

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
