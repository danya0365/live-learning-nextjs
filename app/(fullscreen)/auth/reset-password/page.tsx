/**
 * Reset Password Page — Auth
 * Simulates resetting the password with a new one
 * Users land here after clicking a reset link from email
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type Step = 'form' | 'success';

/* ── Password strength ────────────────────── */
function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: 'อ่อนมาก', color: 'bg-red-400' };
  if (score === 2) return { score, label: 'อ่อน', color: 'bg-orange-400' };
  if (score === 3) return { score, label: 'ปานกลาง', color: 'bg-yellow-400' };
  if (score === 4) return { score, label: 'แข็งแรง', color: 'bg-green-400' };
  return { score, label: 'แข็งแรงมาก', color: 'bg-emerald-500' };
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const strength = useMemo(() => getStrength(password), [password]);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('กรุณากรอกรหัสผ่านทั้ง 2 ช่อง');
      return;
    }
    if (password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setStep('success');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Decorative orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30 blur-3xl animate-float"
          style={{ background: 'var(--gradient-primary)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'linear-gradient(135deg, hsl(160,80%,55%), hsl(120,60%,50%))',
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10 mb-4">
                  <span className="text-3xl">🔐</span>
                </div>
                <h1 className="text-2xl font-extrabold text-text-primary">ตั้งรหัสผ่านใหม่</h1>
                <p className="text-text-secondary text-sm mt-2">
                  กรอกรหัสผ่านใหม่ของคุณด้านล่าง
                </p>
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-error/10 border border-error/30 text-sm text-error text-center animate-fadeIn">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-text-secondary mb-1.5">
                    รหัสผ่านใหม่
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🔒</span>
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="อย่างน้อย 6 ตัวอักษร"
                      autoComplete="new-password"
                      autoFocus
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

                  {/* Strength meter */}
                  {password.length > 0 && (
                    <div className="mt-2 animate-fadeIn">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              i <= strength.score ? strength.color : 'bg-border'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-text-muted">
                        ความแข็งแรง: <span className="font-medium text-text-secondary">{strength.label}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-text-secondary mb-1.5">
                    ยืนยันรหัสผ่าน
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🔒</span>
                    <input
                      id="confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="กรอกรหัสผ่านอีกครั้ง"
                      autoComplete="new-password"
                      className={`w-full pl-10 pr-12 py-3 rounded-xl bg-surface border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                        confirmPassword.length > 0
                          ? passwordsMatch
                            ? 'border-green-400 focus:border-green-400'
                            : 'border-red-400 focus:border-red-400'
                          : 'border-border focus:border-primary'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-lg hover:scale-110 transition-transform"
                      tabIndex={-1}
                    >
                      {showConfirm ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {/* Match indicator */}
                  {confirmPassword.length > 0 && (
                    <p className={`text-[10px] mt-1 animate-fadeIn ${passwordsMatch ? 'text-green-500' : 'text-red-400'}`}>
                      {passwordsMatch ? '✅ รหัสผ่านตรงกัน' : '❌ รหัสผ่านไม่ตรงกัน'}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-game py-3 rounded-xl text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span> กำลังบันทึก...
                    </span>
                  ) : (
                    'บันทึกรหัสผ่านใหม่ ✨'
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="text-center py-4 animate-fadeIn">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
                <span className="text-5xl">🎉</span>
              </div>
              <h2 className="text-xl font-extrabold text-text-primary mb-2">เปลี่ยนรหัสผ่านสำเร็จ!</h2>
              <p className="text-text-secondary text-sm mb-6">
                ตอนนี้คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว
              </p>

              <button
                onClick={() => router.push('/auth/login')}
                className="w-full btn-game py-3 rounded-xl text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-transform"
              >
                ไปเข้าสู่ระบบ 🚀
              </button>
            </div>
          )}
        </div>

        {/* Back to login */}
        <p className="text-center mt-6 text-sm text-text-secondary">
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            ← กลับไปเข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
