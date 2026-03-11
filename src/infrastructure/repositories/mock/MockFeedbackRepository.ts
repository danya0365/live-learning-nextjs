import {
    CreateFeedbackData,
    FeedbackItem,
    IFeedbackRepository,
} from '@/src/application/repositories/IFeedbackRepository';

export class MockFeedbackRepository implements IFeedbackRepository {
  async create(data: CreateFeedbackData): Promise<FeedbackItem> {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
    console.log('Mock Feedback Submitted:', data);

    return {
      id: `feedback-${Date.now()}`,
      category: data.category,
      topic: data.topic,
      email: data.email,
      message: data.message,
      createdAt: new Date().toISOString(),
    };
  }
}
