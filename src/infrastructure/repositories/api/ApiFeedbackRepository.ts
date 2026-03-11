/**
 * ApiFeedbackRepository
 * Implements IFeedbackRepository using API calls
 *
 * ✅ For use in CLIENT-SIDE components only
 */

'use client';

import {
    CreateFeedbackData,
    FeedbackItem,
    IFeedbackRepository,
} from '@/src/application/repositories/IFeedbackRepository';

export class ApiFeedbackRepository implements IFeedbackRepository {
  private baseUrl = '/api/feedback';

  async create(data: CreateFeedbackData): Promise<FeedbackItem> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to submit feedback');
    }

    return res.json();
  }
}
