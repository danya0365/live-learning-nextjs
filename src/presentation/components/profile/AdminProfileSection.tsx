import Link from 'next/link';
import { ADMIN_TOOLS } from './profileConstants';

export function AdminProfileSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Admin Tools */}
      <div className="glass rounded-2xl p-6 border border-border/50 h-fit">
        <h3 className="text-xl font-bold text-text-primary mb-4">🔗 เครื่องมือจัดการระบบ</h3>
        <div className="space-y-2">
          {ADMIN_TOOLS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-4 px-4 py-3 rounded-xl bg-surface/50 border border-border/30 hover:bg-surface hover:border-primary/30 transition-all text-text-secondary hover:text-text-primary group"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform bg-surface p-2 rounded-lg border border-border">{link.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-bold">{link.label}</p>
                <p className="text-xs text-text-muted mt-0.5">{link.desc}</p>
              </div>
              <span className="text-text-muted group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Admin System Status / Quick Metrics */}
      <div className="glass rounded-2xl p-6 border border-border/50 h-fit">
        <h3 className="text-xl font-bold text-text-primary mb-4">🛡️ สถานะแพลตฟอร์ม</h3>
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-success/10 border border-success/20 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-bold text-success text-lg mb-1">ระบบทำงานปกติ (All Systems Operational)</p>
            <p className="text-sm text-text-muted">ตรวจสอบล่าสุดเมื่อ: {new Date().toLocaleTimeString('th-TH')}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-surface/50 border border-border/30 p-4 rounded-xl text-center">
              <p className="text-xs text-text-muted font-bold mb-1 uppercase tracking-wider">แอดมินที่ล็อกอิน</p>
              <p className="text-2xl font-extrabold text-text-primary">1 <span className="text-sm font-normal text-text-secondary">คน</span></p>
            </div>
            <div className="bg-surface/50 border border-border/30 p-4 rounded-xl text-center">
              <p className="text-xs text-text-muted font-bold mb-1 uppercase tracking-wider">เซิร์ฟเวอร์</p>
              <p className="text-lg font-extrabold text-primary flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> Online
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
