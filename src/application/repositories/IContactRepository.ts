/**
 * IContactRepository
 * Repository interface for Contact data access
 * Following Clean Architecture - this is in the Application layer
 */

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface CreateContactMessageData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface IContactRepository {
  /**
   * Send a contact message
   */
  send(data: CreateContactMessageData): Promise<ContactMessage>;
}
