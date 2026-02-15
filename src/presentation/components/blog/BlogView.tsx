'use client';

import { BlogViewModel } from '@/src/presentation/presenters/blog/BlogPresenter';
import Link from 'next/link';

interface BlogViewProps {
  initialViewModel: BlogViewModel;
}

export function BlogView({ initialViewModel }: BlogViewProps) {
  const { posts } = initialViewModel;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          📝 บทความและเคล็ดลับ
        </h1>
        <p className="text-text-secondary">
          อัปเดตความรู้ใหม่ๆ เทคนิคการเรียน และข่าวสารในวงการ Tech
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`} className="group block glass rounded-2xl overflow-hidden hover:translate-y-[-4px] hover:shadow-xl transition-all duration-300 border border-border/50">
            <div className="h-48 relative overflow-hidden" style={{ background: post.imageUrl }}>
              <div className="absolute top-4 left-4">
                 <span className="bg-white/90 backdrop-blur-sm text-text-primary px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                   {post.category}
                 </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
                <span>{new Date(post.publishedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</span>
                <span>•</span>
                <span>{post.readTimeMinutes} นาที</span>
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-text-secondary text-sm line-clamp-3 mb-4">
                {post.excerpt}
              </p>
              
              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/30">
                <div className="w-6 h-6 rounded-full bg-surface-elevated flex items-center justify-center text-xs">👤</div>
                <span className="text-xs font-medium text-text-primary">{post.author}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
