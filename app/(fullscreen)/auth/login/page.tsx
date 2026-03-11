/**
 * Login Page — Auth
 * Connected to Zustand auth store
 * Includes demo one-click login buttons
 */

'use client';

import { IS_DEV, useAuthStore } from '@/src/stores/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDevAdmin, isAuthenticated, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'เกิดข้อผิดพลาด');
    }
    // redirect handled by useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Decorative orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 blur-3xl animate-float" style={{ background: 'var(--gradient-primary)' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'linear-gradient(135deg, hsl(330,80%,70%), hsl(280,70%,60%))', animation: 'float 4s ease-in-out infinite 1.5s' }} />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 hover:scale-105 transition-transform">
            <span className="text-4xl">🎮</span>
            <span className="text-2xl font-bold gradient-text">Live Learning</span>
          </Link>
          <p className="text-text-secondary mt-2 text-sm">เข้าสู่ระบบเพื่อเริ่มเรียนรู้</p>
        </div>

        {/* Demo one-click login (Dev Only) */}
        {IS_DEV && (
          <div className="glass rounded-2xl p-5 border border-border/50 shadow-lg mb-6">
            <h2 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              ⚡ Dev Mode Login
            </h2>
            <button
              type="button"
              onClick={() => loginAsDevAdmin()}
              disabled={isLoading}
              className="w-full group relative overflow-hidden rounded-xl p-4 text-left border border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 transition-all"
            >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🚀
                 </div>
                 <div>
                    <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                      เข้าใช้งานแบบ Admin (Super User)
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      บัญชีเดียว สลับได้ครบทุก Role (นักเรียน/อาจารย์)
                    </p>
                 </div>
              </div>
            </button>
          </div>
        )}

        {/* Login card */}
        <div className="glass rounded-2xl p-8 border border-border/50 shadow-xl">
          <h1 className="text-2xl font-extrabold text-text-primary text-center mb-6">
            เข้าสู่ระบบ
          </h1>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-error/10 border border-error/30 text-sm text-error text-center animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-text-secondary mb-1.5">อีเมล</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">📧</span>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-text-secondary mb-1.5">รหัสผ่าน</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🔒</span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-surface border border-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lg hover:scale-110 transition-transform"
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
                <span className="text-xs text-text-secondary">จดจำฉัน</span>
              </label>
              <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">ลืมรหัสผ่าน?</Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-game py-3 rounded-xl text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> กำลังเข้าสู่ระบบ...
                </span>
              ) : (
                'เข้าสู่ระบบ 🚀'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-text-muted">หรือ</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass border border-border hover:border-primary/50 hover:scale-[1.02] transition-all text-sm font-medium text-text-secondary">
              <span className="text-lg">🔵</span> Google
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass border border-border hover:border-primary/50 hover:scale-[1.02] transition-all text-sm font-medium text-text-secondary">
              <span className="text-lg">⚫</span> GitHub
            </button>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-4 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-[10px] text-text-muted text-center">
              💡 Demo: <code className="text-primary">min@demo.com</code> / <code className="text-primary">demo1234</code>
            </p>
          </div>
        </div>

        {/* Register link */}
        <p className="text-center mt-6 text-sm text-text-secondary">
          ยังไม่มีบัญชี?{' '}
          <Link href="/auth/register" className="text-primary font-semibold hover:underline">
            สมัครเรียนฟรี
          </Link>
        </p>
      </div>
    </div>
  );
}
