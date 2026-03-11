import { EventItem, IEventRepository } from '@/src/application/repositories/IEventRepository';

export class MockEventRepository implements IEventRepository {
  async getAll(): Promise<EventItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return []; // Empty for now
  }
}
