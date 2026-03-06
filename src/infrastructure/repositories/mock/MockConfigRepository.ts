import { Category, IConfigRepository, Level } from '@/src/application/repositories/IConfigRepository';

import { MOCK_CATEGORIES, MOCK_LEVELS } from '@/src/data/mock/configs';

export class MockConfigRepository implements IConfigRepository {
  async getCategories(): Promise<Category[]> {
    return MOCK_CATEGORIES;
  }

  async getLevels(): Promise<Level[]> {
    return MOCK_LEVELS;
  }
}
