export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readTimeMinutes: number;
  imageUrl: string;
}

export interface IBlogRepository {
  getAll(): Promise<BlogPost[]>;
  getById(id: string): Promise<BlogPost | null>;
}
