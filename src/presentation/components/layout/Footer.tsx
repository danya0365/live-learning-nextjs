/**
 * Footer — Redesigned with premium styling
 */

'use client';

import Link from 'next/link';

const FOOTER_LINKS = {
  เรียนรู้: [
    { href: '/courses', label: 'คอร์สทั้งหมด' },
    { href: '/instructors', label: 'อาจารย์ผู้สอน' },
    { href: '/schedule', label: 'ตารางเรียน' },
    { href: '/categories', label: 'หมวดหมู่' },
  ],
  ช่วยเหลือ: [
    { href: '/faq', label: 'คำถามที่พบบ่อย' },
    { href: '/support', label: 'ศูนย์ช่วยเหลือ' },
    { href: '/terms', label: 'ข้อกำหนดการใช้งาน' },
    { href: '/privacy', label: 'นโยบายความเป็นส่วนตัว' },
  ],
  ชุมชน: [
    { href: '/blog', label: 'บทความ' },
    { href: '/events', label: 'กิจกรรม' },
    { href: '/discord', label: 'Discord Community' },
    { href: '/feedback', label: 'แจ้งปัญหา/แนะนำ' },
  ],
};

const SOCIAL_LINKS = [
  { icon: '💬', label: 'Discord', href: '#' },
  { icon: '🐦', label: 'Twitter', href: '#' },
  { icon: '📺', label: 'YouTube', href: '#' },
  { icon: '📘', label: 'Facebook', href: '#' },
];

export function Footer() {
  return (
    <footer id="main-footer" className="relative mt-auto">
      {/* Top gradient divider */}
      <div
        className="h-px"
        style={{
          background: 'linear-gradient(to right, transparent, var(--color-primary), var(--color-secondary), var(--color-accent), transparent)',
          opacity: 0.4,
        }}
      />

      <div className="glass border-t border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-3xl">🎮</span>
                <span className="text-xl font-bold gradient-text tracking-tight">Live Learning</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-sm">
                แพลตฟอร์มเรียนรู้สดออนไลน์ เลือกคอร์สที่ชอบ เรียนกับอาจารย์ตัวจริง
                พร้อมระบบจองเวลาเรียนอัจฉริยะ 🚀
              </p>

              <div className="flex gap-2">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-lg hover:border-primary/50 hover:scale-110 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-text-secondary hover:text-primary transition-colors duration-200 inline-flex items-center gap-1 group/flink"
                      >
                        <span className="group-hover/flink:translate-x-0.5 transition-transform duration-200">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-14 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-text-muted">© 2025 Live Learning Platform. สงวนลิขสิทธิ์ทุกประการ.</p>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span>สร้างด้วย</span>
              <span className="text-error animate-pulse">❤️</span>
              <span>โดยทีม Live Learning</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
