/**
 * MockContactRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - this is in the Infrastructure layer
 */

import {
  IContactRepository,
  ContactMessage,
  CreateContactMessageData,
} from '@/src/application/repositories/IContactRepository';

export class MockContactRepository implements IContactRepository {
  private messages: ContactMessage[] = [];

  async send(data: CreateContactMessageData): Promise<ContactMessage> {
    // Simulate network delay
    await this.delay(800);

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };

    this.messages.push(newMessage);
    console.log('[MockContactRepository] Message sent:', newMessage);
    
    return newMessage;
  }

  // Helper method to simulate network delay
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance for convenience
export const mockContactRepository = new MockContactRepository();
