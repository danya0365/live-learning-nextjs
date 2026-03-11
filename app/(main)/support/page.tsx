import { SupportView } from '@/src/presentation/components/support/SupportView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ศูนย์ช่วยเหลือ | Live Learning',
  description: 'ติดต่อสอบถามและขอความช่วยเหลือจาก Live Learning',
};

export default function SupportPage() {
  return <SupportView />;
}
