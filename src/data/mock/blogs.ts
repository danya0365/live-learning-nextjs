import { BlogPost } from '@/src/application/repositories/IBlogRepository';

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: '5 เทคนิคเรียนออนไลน์ให้เก่งขึ้น',
    excerpt: 'เรียนรู้เคล็ดลับในการจัดการเวลาและตั้งสมาธิให้พร้อมสำหรับการเรียนสดออนไลน์',
    category: 'เคล็ดลับการเรียน',
    author: 'Admin',
    publishedAt: '2026-08-15',
    readTimeMinutes: 5,
    imageUrl: 'linear-gradient(135deg, hsl(200 80% 60%), hsl(240 80% 60%))',
  },
  {
    id: 'blog-2',
    title: 'เริ่มต้นเขียนโค้ดภาษา Python ฉบับมือใหม่',
    excerpt: 'คู่มือสำหรับผู้ที่อยากเริ่มต้นเป็นโปรแกรมเมอร์ด้วยภาษาที่ได้รับความนิยมที่สุดในโลก',
    category: 'Programming',
    author: 'Instructor Dave',
    publishedAt: '2026-08-12',
    readTimeMinutes: 8,
    imageUrl: 'linear-gradient(135deg, hsl(50 80% 60%), hsl(30 80% 60%))',
  },
  {
    id: 'blog-3',
    title: 'ทำไม UX/UI Design ถึงสำคัญในปี 2025?',
    excerpt: 'เจาะลึกเทรนด์การออกแบบและทำไมทุกธุรกิจต้องการ UX/UI Designer',
    category: 'Design',
    author: 'Jane Doe',
    publishedAt: '2026-08-10',
    readTimeMinutes: 6,
    imageUrl: 'linear-gradient(135deg, hsl(320 80% 60%), hsl(280 80% 60%))',
  },
];
