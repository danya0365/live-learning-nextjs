/**
 * SupabaseConfigRepository
 * Implementation of IConfigRepository using SupabaseCategoryRepository for real data
 * 
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 */

import { Category, IConfigRepository, Level } from "@/src/application/repositories/IConfigRepository";
import { Database } from "@/src/domain/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseCategoryRepository } from "./SupabaseCategoryRepository";

// Static levels (same as client for consistency)
const LEVELS: Level[] = [
  { value: 'beginner', label: 'เริ่มต้น', icon: '🌱', desc: 'ยังไม่มีพื้นฐาน อยากเรียนจาก 0', color: 'text-success' },
  { value: 'intermediate', label: 'ปานกลาง', icon: '📈', desc: 'มีพื้นฐานแล้ว อยากเรียนเชิงลึก', color: 'text-warning' },
  { value: 'advanced', label: 'ขั้นสูง', icon: '🚀', desc: 'มีประสบการณ์ ต้องการระดับ Expert', color: 'text-error' },
];

export class SupabaseConfigRepository implements IConfigRepository {
  private categoryRepo: SupabaseCategoryRepository;

  constructor(supabase: SupabaseClient<Database>) {
      this.categoryRepo = new SupabaseCategoryRepository(supabase);
  }

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
