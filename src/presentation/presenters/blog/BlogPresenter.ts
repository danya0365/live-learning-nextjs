import { BlogPost, IBlogRepository } from '@/src/application/repositories/IBlogRepository';
import { Metadata } from 'next';

export interface BlogViewModel {
  posts: BlogPost[];
}

export class BlogPresenter {
  constructor(private readonly repository: IBlogRepository) {}

  async getViewModel(): Promise<BlogViewModel> {
    const posts = await this.repository.getAll();
    return { posts };
  }

  generateMetadata(): Metadata {
    return {
      title: 'บทความและเคล็ดลับ | Live Learning',
      description: 'สาระความรู้ เทคนิคการเรียน และข่าวสารด้านเทคโนโลยีอัปเดตใหม่ทุกสัปดาห์',
    };
  }
}
