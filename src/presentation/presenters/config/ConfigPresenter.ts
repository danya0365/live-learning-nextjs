import { Category, IConfigRepository, Level } from '@/src/application/repositories/IConfigRepository';

export class ConfigPresenter {
  constructor(private readonly configRepository: IConfigRepository) {}

  async getCategories(): Promise<Category[]> {
    return this.configRepository.getCategories();
  }

  async getLevels(): Promise<Level[]> {
    return this.configRepository.getLevels();
  }
}
