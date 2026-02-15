export interface FeedbackItem {
  id: string;
  topic: string;
  email?: string;
  message: string;
  category: string;
  createdAt: string;
}

export interface CreateFeedbackData {
  topic: string;
  email?: string;
  message: string;
  category: string;
}

export interface IFeedbackRepository {
  create(data: CreateFeedbackData): Promise<FeedbackItem>;
}
