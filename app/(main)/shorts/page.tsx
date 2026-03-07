import Link from 'next/link';

export const metadata = {
  title: 'Coming Soon | Live Learning',
  description: 'หน้านี้กำลังอยู่ระหว่างการพัฒนา',
};

export default function ComingSoonPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl mb-6">📱</div>
      <h1 className="text-4xl font-extrabold text-text-primary mb-4">
        คลิปสั้น... เร็วๆ นี้!
      </h1>
      <p className="text-xl text-text-secondary max-w-md mb-8">
        พบกับเทคนิคการเรียนรู้ไวๆ ผ่านวิดีโอสั้น กำลังเตรียมข้อมูลให้คุณอยู่ครับ
      </p>
      <Link 
        href="/" 
        className="btn-game px-8 py-3 text-white rounded-2xl font-bold transition-transform hover:scale-105"
      >
        กลับหน้าหลัก
      </Link>
    </div>
  );
}
