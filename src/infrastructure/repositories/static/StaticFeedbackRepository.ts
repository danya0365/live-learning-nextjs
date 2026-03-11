/**
 * StaticFeedbackRepository
 * Static implementation — returns a dummy result without side effects
 * Following Clean Architecture - Infrastructure layer
 */

import {
    CreateFeedbackData,
    FeedbackItem,
    IFeedbackRepository,
} from '@/src/application/repositories/IFeedbackRepository';

export class StaticFeedbackRepository implements IFeedbackRepository {
  async create(data: CreateFeedbackData): Promise<FeedbackItem> {
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
