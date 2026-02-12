/**
 * Forgot Password Page — Auth
 * Simulates sending a password reset email
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';

type Step = 'form' | 'sent';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('form');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('กรุณากรอกอีเมล');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }

    setIsLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setStep('sent');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Decorative orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 blur-3xl animate-float"
          style={{ background: 'var(--gradient-primary)' }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'linear-gradient(135deg, hsl(200,80%,60%), hsl(170,70%,50%))',
            animation: 'float 4s ease-in-out infinite 1.5s',
          }}
        />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 hover:scale-105 transition-transform">
            <span className="text-4xl">🎮</span>
            <span className="text-2xl font-bold gradient-text">Live Learning</span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-border/50 shadow-xl">
          {step === 'form' ? (
            <>
              {/* Icon */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                  <span className="text-3xl">🔑</span>
                </div>
                <h1 className="text-2xl font-extrabold text-text-primary">ลืมรหัสผ่าน?</h1>
                <p className="text-text-secondary text-sm mt-2">
                  กรอกอีเมลของคุณ เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่
                </p>
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-error/10 border border-error/30 text-sm text-error text-center animate-fadeIn">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-text-secondary mb-1.5">
                    อีเมล
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">📧</span>
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      autoFocus
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-game py-3 rounded-xl text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span> กำลังส่ง...
                    </span>
                  ) : (
                    'ส่งลิงก์รีเซ็ต 📩'
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="text-center py-4 animate-fadeIn">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
                <span className="text-5xl animate-bounce">📩</span>
              </div>
              <h2 className="text-xl font-extrabold text-text-primary mb-2">ส่งอีเมลแล้ว!</h2>
              <p className="text-text-secondary text-sm mb-2">
                เราส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปที่
              </p>
              <p className="text-primary font-semibold text-sm mb-6">{email}</p>

              <div className="glass rounded-xl p-4 border border-border/30 text-left mb-6">
                <p className="text-xs text-text-muted leading-relaxed">
                  💡 <strong className="text-text-secondary">ไม่เห็นอีเมล?</strong> ตรวจสอบโฟลเดอร์สแปมหรือขยะ
                  หรือลองส่งอีกครั้ง
                </p>
              </div>

              <button
                onClick={() => { setStep('form'); setEmail(''); }}
                className="text-sm text-primary font-medium hover:underline"
              >
                ← ส่งอีกครั้ง
              </button>
            </div>
          )}
        </div>

        {/* Back to login */}
        <p className="text-center mt-6 text-sm text-text-secondary">
          จำรหัสผ่านได้แล้ว?{' '}
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
