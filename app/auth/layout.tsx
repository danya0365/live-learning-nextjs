import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'เข้าสู่ระบบ — Live Learning',
  description: 'เข้าสู่ระบบหรือสมัครสมาชิกเพื่อเริ่มเรียนรู้',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
