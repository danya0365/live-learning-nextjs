import { EventItem, IEventRepository } from '@/src/application/repositories/IEventRepository';
import { Metadata } from 'next';

export interface EventViewModel {
  events: EventItem[];
}

export class EventPresenter {
  constructor(private readonly repository: IEventRepository) {}

  async getViewModel(): Promise<EventViewModel> {
    const events = await this.repository.getAll();
    return { events };
  }

  generateMetadata(): Metadata {
    return {
      title: 'กิจกรรมและเวิร์กช็อป | Live Learning',
      description: 'เข้าร่วมกิจกรรมและเวิร์กช็อปออนไลน์จาก Live Learning',
    };
  }
}
