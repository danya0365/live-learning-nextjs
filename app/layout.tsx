import '@/public/styles/index.css';
import { MainLayout } from '@/src/presentation/components/layout/MainLayout';
import { ThemeProvider } from '@/src/presentation/providers/ThemeProvider';
import type { Metadata } from "next";
import { Noto_Sans_Thai } from 'next/font/google';

// ✅ Next.js best practice: ใช้ next/font/google สำหรับ font optimization
const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-noto-sans-thai',
  preload: true,
});

export const metadata: Metadata = {
  title: "Live Learning — เรียนสดออนไลน์กับอาจารย์ตัวจริง",
  description: "แพลตฟอร์มเรียนรู้สดออนไลน์ เลือกคอร์สที่ชอบ จองเวลาเรียนกับอาจารย์ผู้เชี่ยวชาญ พร้อมระบบจัดการเวลาอัจฉริยะ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={notoSansThai.variable} suppressHydrationWarning>
      <body className={`${notoSansThai.className} antialiased`}>
        <ThemeProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
