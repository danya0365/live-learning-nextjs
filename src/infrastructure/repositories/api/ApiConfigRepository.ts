/**
 * ApiConfigRepository
 * Implements IConfigRepository using ApiCategoryRepository for real data
 * 
 * ✅ For use in CLIENT-SIDE components only
 */

'use client';

import { Category, IConfigRepository, Level } from "@/src/application/repositories/IConfigRepository";
import { ApiCategoryRepository } from "./ApiCategoryRepository";

// Static levels (could optionally come from API/DB too)
const LEVELS: Level[] = [
  { value: 'beginner', label: 'เริ่มต้น', icon: '🌱', desc: 'ยังไม่มีพื้นฐาน อยากเรียนจาก 0', color: 'text-success' },
  { value: 'intermediate', label: 'ปานกลาง', icon: '📈', desc: 'มีพื้นฐานแล้ว อยากเรียนเชิงลึก', color: 'text-warning' },
  { value: 'advanced', label: 'ขั้นสูง', icon: '🚀', desc: 'มีประสบการณ์ ต้องการระดับ Expert', color: 'text-error' },
];

export class ApiConfigRepository implements IConfigRepository {
  private categoryRepo = new ApiCategoryRepository();

  async getCategories(): Promise<Category[]> {
    try {
        const categories = await this.categoryRepo.getAll();
        return categories.map(c => ({
            id: c.id,
            label: c.name,
            icon: c.icon
        }));
    } catch (error) {
        console.error('Failed to fetch config categories', error);
        return [];
    }
  }

  async getLevels(): Promise<Level[]> {
    return LEVELS;
  }
}
