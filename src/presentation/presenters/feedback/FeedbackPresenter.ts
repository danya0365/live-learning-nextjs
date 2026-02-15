import { IFeedbackRepository } from '@/src/application/repositories/IFeedbackRepository';
import { Metadata } from 'next';

export class FeedbackPresenter {
  constructor(private readonly repository: IFeedbackRepository) {}

  async submitFeedback(topic: string, email: string | undefined, message: string, category: string): Promise<void> {
    try {
      await this.repository.create({ topic, email, message, category });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }

  generateMetadata(): Metadata {
    return {
      title: 'แจ้งปัญหา / แนะนำบริการ | Live Learning',
      description: 'ส่งคำแนะนำหรือแจ้งปัญหาการใช้งาน',
    };
  }
}
