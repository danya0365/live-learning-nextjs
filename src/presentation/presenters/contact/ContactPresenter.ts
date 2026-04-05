/**
 * ContactPresenter
 * Handles business logic for Contact page
 * Receives repository via dependency injection
 */

import { Metadata } from 'next';
import {
  IContactRepository,
  CreateContactMessageData,
} from '@/src/application/repositories/IContactRepository';

export interface ContactViewModel {
  title: string;
  description: string;
}

export class ContactPresenter {
  constructor(private readonly repository: IContactRepository) {}

  /**
   * Get view model for the page
   */
  async getViewModel(): Promise<ContactViewModel> {
    return {
      title: 'ติดต่อเรา',
      description: 'หากคุณมีข้อสงสัยหรือต้องการสอบถามข้อมูลเพิ่มเติม สามารถติดต่อเราได้ทางฟอร์มด้านล่างนี้',
    };
  }

  /**
   * Generate metadata for the page
   */
  generateMetadata(): Metadata {
    return {
      title: 'ติดต่อเรา | Live Learning',
      description: 'ติดต่อทีมงาน Live Learning เพื่อสอบถามข้อมูลเพิ่มเติม',
    };
  }

  /**
   * Send contact message
   */
  async sendMessage(data: CreateContactMessageData): Promise<boolean> {
    try {
      await this.repository.send(data);
      return true;
    } catch (error) {
      console.error('Error sending contact message:', error);
      throw error;
    }
  }
}
