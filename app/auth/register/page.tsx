/**
 * Register Page — Auth
 * Connected to Zustand auth store
 */

'use client';

import { DEMO_ACCOUNTS, type DemoAccountKey, useAuthStore } from '@/src/stores/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const DEMO_CARDS: { key: DemoAccountKey; label: string; desc: string }[] = [
  { key: 'student', label: '🧑‍💻 นักเรียน', desc: 'ดูคอร์ส จอง เรียนสด' },
  { key: 'instructor', label: '👨‍🏫 อาจารย์', desc: 'จัดการคอร์ส สอนสด' },
  { key: 'admin', label: '🛡️ แอดมิน', desc: 'จัดการระบบทั้งหมด' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginAsDemo, isAuthenticated, isLoading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function getPasswordStrength(): { label: string; color: string; pct: number } {
    const p = form.password;
    if (!p) return { label: '', color: '', pct: 0 };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    if (score <= 1) return { label: 'อ่อน', color: 'bg-error', pct: 20 };
    if (score <= 2) return { label: 'ปานกลาง', color: 'bg-warning', pct: 40 };
    if (score <= 3) return { label: 'ดี', color: 'bg-primary', pct: 70 };
    return { label: 'แข็งแรง', color: 'bg-success', pct: 100 };
  }

  const strength = getPasswordStrength();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }
    if (form.password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (!agreed) {
      setError('กรุณายอมรับเงื่อนไขการใช้งาน');
      return;
    }
    const result = await register(form.name, form.email, form.password);
    if (!result.success) {
      setError(result.error || 'เกิดข้อผิดพลาด');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Decorative orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30 blur-3xl animate-float" style={{ background: 'linear-gradient(135deg, hsl(150,70%,50%), hsl(200,80%,60%))' }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'var(--gradient-primary)', animation: 'float 4s ease-in-out infinite 1.5s' }} />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 hover:scale-105 transition-transform">
            <span className="text-4xl">🎮</span>
            <span className="text-2xl font-bold gradient-text">Live Learning</span>
          </Link>
          <p className="text-text-secondary mt-2 text-sm">สร้างบัญชีเพื่อเริ่มเรียนรู้กับเรา</p>
        </div>

        {/* Demo one-click */}
        <div className="glass rounded-2xl p-5 border border-border/50 shadow-lg mb-6">
          <h2 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
            ⚡ ทดลองใช้งานทันที
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_CARDS.map((demo) => {
              const account = DEMO_ACCOUNTS[demo.key];
              return (
                <button
                  key={demo.key}
                  onClick={() => loginAsDemo(demo.key)}
                  disabled={isLoading}
                  className="group relative overflow-hidden rounded-xl p-3 text-center hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                  <div className="relative">
                    <div className="text-2xl mb-1">{account.user.avatar}</div>
                    <p className="text-xs font-bold text-text-primary">{demo.label.split(' ')[1]}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{demo.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Register card */}
        <div className="glass rounded-2xl p-8 border border-border/50 shadow-xl">
          <h1 className="text-2xl font-extrabold text-text-primary text-center mb-6">
            สมัครสมาชิก
          </h1>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-error/10 border border-error/30 text-sm text-error text-center animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium text-text-secondary mb-1.5">ชื่อ-นามสกุล</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">👤</span>
                <input id="reg-name" type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="ชื่อของคุณ" autoComplete="name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-text-secondary mb-1.5">อีเมล</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">📧</span>
                <input id="reg-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-text-secondary mb-1.5">รหัสผ่าน</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🔒</span>
                <input id="reg-password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="อย่างน้อย 6 ตัวอักษร" autoComplete="new-password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-surface border border-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-lg hover:scale-110 transition-transform" tabIndex={-1}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                    <div className={`h-full rounded-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.pct}%` }} />
                  </div>
                  <p className="text-xs text-text-muted mt-1">ความแข็งแรง: <span className="font-semibold">{strength.label}</span></p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="reg-confirm" className="block text-sm font-medium text-text-secondary mb-1.5">ยืนยันรหัสผ่าน</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🔐</span>
                <input id="reg-confirm" type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="กรอกรหัสผ่านอีกครั้ง" autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
                {form.confirmPassword && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">
                    {form.password === form.confirmPassword ? '✅' : '❌'}
                  </span>
                )}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 mt-0.5 rounded border-border accent-primary" />
              <span className="text-xs text-text-secondary leading-relaxed">
                ฉันยอมรับ{' '}
                <Link href="/terms" className="text-primary hover:underline">เงื่อนไขการใช้งาน</Link>
                {' '}และ{' '}
                <Link href="/privacy" className="text-primary hover:underline">นโยบายความเป็นส่วนตัว</Link>
              </span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              className="w-full btn-game py-3 rounded-xl text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> กำลังสมัคร...
                </span>
              ) : (
                'สมัครเรียนฟรี 🎓'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-text-muted">หรือ</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass border border-border hover:border-primary/50 hover:scale-[1.02] transition-all text-sm font-medium text-text-secondary">
              <span className="text-lg">🔵</span> Google
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass border border-border hover:border-primary/50 hover:scale-[1.02] transition-all text-sm font-medium text-text-secondary">
              <span className="text-lg">⚫</span> GitHub
            </button>
          </div>
        </div>

        {/* Login link */}
        <p className="text-center mt-6 text-sm text-text-secondary">
          มีบัญชีอยู่แล้ว?{' '}
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
