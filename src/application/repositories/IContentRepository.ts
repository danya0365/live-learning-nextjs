export interface ContentItem {
  slug: string;
  title: string;
  body: string; // HTML string or plain text
  lastUpdated: string;
}

export interface IContentRepository {
  getBySlug(slug: string): Promise<ContentItem | null>;
}
