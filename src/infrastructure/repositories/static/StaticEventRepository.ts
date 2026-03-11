/**
 * StaticEventRepository
 * Static implementation — read-only, no mutable state
 * Following Clean Architecture - Infrastructure layer
 */

import { EventItem, IEventRepository } from '@/src/application/repositories/IEventRepository';

export class StaticEventRepository implements IEventRepository {
  async getAll(): Promise<EventItem[]> {
    return [];
  }
}
