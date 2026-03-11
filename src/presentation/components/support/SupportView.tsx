'use client';

import Link from 'next/link';

export function SupportView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          🆘 ศูนย์ช่วยเหลือ
        </h1>
        <p className="text-text-secondary">
          ติดปัญหาการใช้งาน? สอบถามข้อมูลเพิ่มเติม? ทีมงาน Live Learning พร้อมให้บริการตลอด 24 ชั่วโมง
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Support Option 1: FAQ */}
        <Link href="/faq" className="glass rounded-2xl p-8 hover:scale-[1.02] transition-transform group border border-border/50">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">❓</div>
          <h3 className="text-xl font-bold text-text-primary mb-2">
            คำถามที่พบบ่อย
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            ค้นหาคำตอบสำหรับคำถามทั่วไปเกี่ยวกับการสมัครสมาชิก การจองคอร์ส และการชำระเงิน
          </p>
        </Link>
        
        {/* Support Option 2: Email */}
        <a href="mailto:support@live-learning.com" className="glass rounded-2xl p-8 hover:scale-[1.02] transition-transform group border border-border/50">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📧</div>
          <h3 className="text-xl font-bold text-text-primary mb-2">
            อีเมลหาเรา
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            ส่งอีเมลหาเรา ทีมงานจะตอบกลับภายใน 24 ชั่วโมง
            <br/><span className="text-primary font-bold mt-1 inline-block">support@live-learning.com</span>
          </p>
        </a>

        {/* Support Option 3: Feedback Form */}
        <Link href="/feedback" className="glass rounded-2xl p-8 hover:scale-[1.02] transition-transform group border border-border/50">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💬</div>
          <h3 className="text-xl font-bold text-text-primary mb-2">
            แจ้งปัญหา/แนะนำ
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            กรอกแบบฟอร์มเพื่อแจ้งปัญหา ข้อผิดพลาด หรือเสนอแนะการปรับปรุงบริการ
          </p>
        </Link>
      </div>

      <div className="glass rounded-2xl p-8 border border-border/50">
        <h3 className="text-lg font-bold text-text-primary mb-4">ช่องทางอื่นๆ ในการติดตามข่าวสาร</h3>
        <div className="flex gap-4">
          <a href="#" className="w-12 h-12 rounded-xl bg-surface hover:bg-surface-elevated flex items-center justify-center text-2xl transition-all hover:scale-110 border border-border">
            📘
          </a>
          <a href="#" className="w-12 h-12 rounded-xl bg-surface hover:bg-surface-elevated flex items-center justify-center text-2xl transition-all hover:scale-110 border border-border">
            🐦
          </a>
          <a href="#" className="w-12 h-12 rounded-xl bg-surface hover:bg-surface-elevated flex items-center justify-center text-2xl transition-all hover:scale-110 border border-border">
            📸
          </a>
          <a href="/discord" className="w-12 h-12 rounded-xl bg-surface hover:bg-surface-elevated flex items-center justify-center text-2xl transition-all hover:scale-110 border border-border">
            👾
          </a>
        </div>
      </div>
    </div>
  );
}
