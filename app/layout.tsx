import '@/public/styles/index.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/src/presentation/providers/AuthProvider';
import { ThemeProvider } from '@/src/presentation/providers/ThemeProvider';
import type { Metadata } from "next";
import { Noto_Sans_Thai } from 'next/font/google';

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  variable: '--font-noto-sans-thai',
  preload: true,
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: "%s | Live Learning - เรียนสดออนไลน์กับอาจารย์ตัวจริง",
    default: "Live Learning — เรียนสดออนไลน์กับอาจารย์ตัวจริง",
  },
  description: "แพลตฟอร์มเรียนรู้สดออนไลน์ เลือกคอร์สที่ชอบ จองเวลาเรียนกับอาจารย์ผู้เชี่ยวชาญ พร้อมระบบจัดการเวลาอัจฉริยะ",
  keywords: [
    "เรียนออนไลน์",
    "คอร์สออนไลน์",
    "เรียนสด",
    "จองเวลาเรียน",
    "Thailand",
    "Education",
    "Live Learning",
  ],
  authors: [{ name: "Live Learning Team" }],
  creator: "Live Learning Developers",
  publisher: "Live Learning",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://live-learning-nextjs.vercel.app"
  ),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      // Note: Add detailed icons (16x16, 32x32) to /public as needed
    ],
    shortcut: ["/favicon.ico"],
    apple: ["/favicon.ico"], // Placeholder until apple-touch-icon is available
  },
  openGraph: {
    title: "Live Learning — เรียนสดออนไลน์กับอาจารย์ตัวจริง",
    description: "แพลตฟอร์มเรียนรู้สดออนไลน์ สั่งงาน หรือจองเวลาเรียนกับอาจารย์ผู้เชี่ยวชาญ",
    type: "website",
    siteName: "Live Learning",
    images: [
      {
        url: "/next.svg", // Placeholder, recommend adding a proper OG image
        width: 1200,
        height: 630,
        alt: "Live Learning Logo",
      },
    ],
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Learning — เรียนสดออนไลน์กับอาจารย์ตัวจริง",
    description: "แพลตฟอร์มเรียนรู้สดออนไลน์ เลือกคอร์สที่ชอบ จองเวลาเรียนกับอาจารย์ผู้เชี่ยวชาญ",
    images: ["/next.svg"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Live Learning",
  },
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
          <AuthProvider>
            {children}
            <Toaster position="top-right" expand={true} richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
