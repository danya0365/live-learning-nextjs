/**
 * Header — Role-based navigation
 *
 * Student:    🏠 หน้าหลัก, ➕ จองคลาส, 👤 โปรไฟล์
 * Instructor: 🏠 หน้าหลัก, 📅 ตารางสอน, 👤 โปรไฟล์
 * Guest:      🏠 หน้าหลัก, 🔑 เข้าสู่ระบบ
 *
 * All existing pages are kept in the "More" menu
 */

'use client';

import { HydrationGuard } from '@/src/presentation/components/common/HydrationGuard';
import { ThemeToggle } from '@/src/presentation/components/common/ThemeToggle';
import { useAuthStore, UserRole } from '@/src/stores/authStore';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/* ── Nav config per role ──────────────────── */

interface NavLink {
  href: string;
  label: string;
  icon: string;
}

interface MoreLink extends NavLink {
  desc: string;
}

const NAV_BY_ROLE: Record<UserRole | 'guest', NavLink[]> = {
  student: [
    { href: '/', label: 'หน้าหลัก', icon: '🏠' },
    { href: '/book', label: 'จองคลาส', icon: '➕' },
    { href: '/consultations', label: 'ปรึกษา', icon: '💬' },
    { href: '/courses', label: 'คอร์สเรียน', icon: '📚' },
    { href: '/profile', label: 'โปรไฟล์', icon: '👤' },
  ],
  instructor: [
    { href: '/', label: 'หน้าหลัก', icon: '🏠' },
    { href: '/schedule', label: 'ตารางสอน', icon: '📅' },
    { href: '/consultations/board', label: 'บอร์ดปรึกษา', icon: '📋' },
    { href: '/courses', label: 'คอร์สเรียน', icon: '📚' },
    { href: '/profile', label: 'โปรไฟล์', icon: '👤' },
  ],
  admin: [
    { href: '/', label: 'หน้าหลัก', icon: '🏠' },
    { href: '/schedule', label: 'ตาราง', icon: '📅' },
    { href: '/courses', label: 'คอร์สเรียน', icon: '📚' },
    { href: '/profile', label: 'โปรไฟล์', icon: '👤' },
  ],
  guest: [
    { href: '/', label: 'หน้าหลัก', icon: '🏠' },
    { href: '/schedule', label: 'ตารางเรียน', icon: '📅' },
    { href: '/courses', label: 'คอร์สเรียน', icon: '📚' },
  ],
};

const MORE_BY_ROLE: Record<UserRole | 'guest', MoreLink[]> = {
  student: [
    { href: '/my-bookings', label: 'การจองของฉัน', icon: '📋', desc: 'ดูสถานะการจองทั้งหมด' },
    { href: '/instructors', label: 'อาจารย์', icon: '📚', desc: 'ดูอาจารย์ทั้งหมด' },
    { href: '/schedule', label: 'ตารางเรียน', icon: '📅', desc: 'ดูตารางเวลาสอนทั้งหมด' },
    { href: '/live', label: 'LIVE', icon: '🔴', desc: 'คลาสที่กำลังสอนอยู่' },
    { href: '/consultations/board', label: 'บอร์ดปรึกษา', icon: '📋', desc: 'ดูคำขอจากนักเรียน' },
  ],
  instructor: [
    { href: '/live', label: 'LIVE', icon: '🔴', desc: 'คลาสที่กำลังสอนอยู่' },
    { href: '/consultations', label: 'คำขอของนักเรียน', icon: '💬', desc: 'ดูคำขอปรึกษาทั้งหมด' },
    { href: '/instructors', label: 'อาจารย์', icon: '📚', desc: 'ดูอาจารย์ทั้งหมด' },
  ],
  admin: [
    { href: '/instructors', label: 'อาจารย์', icon: '📚', desc: 'ดูอาจารย์ทั้งหมด' },
    { href: '/schedule', label: 'ตาราง', icon: '�', desc: 'ดูตารางทั้งหมด' },
    { href: '/live', label: 'LIVE', icon: '🔴', desc: 'คลาสที่กำลังสอน' },
  ],
  guest: [
    { href: '/instructors', label: 'อาจารย์', icon: '📚', desc: 'ดูอาจารย์ทั้งหมด' },
    { href: '/schedule', label: 'ตาราง', icon: '�', desc: 'ดูตารางทั้งหมด' },
    { href: '/live', label: 'LIVE', icon: '🔴', desc: 'คลาสที่กำลังสอน' },
  ],
};

/* ── Hook: click outside to close ──────────── */
function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onClose]);
}

/* ── Role badges ───────────────────────────── */
const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  student: { label: 'นักเรียน', color: 'text-blue-400' },
  instructor: { label: 'อาจารย์', color: 'text-purple-400' },
  admin: { label: 'แอดมิน', color: 'text-amber-400' },
};

/* ── Component ─────────────────────────────── */
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);

  const moreRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLDivElement>(null);

  useClickOutside(moreRef, () => setMoreOpen(false));
  useClickOutside(authRef, () => setAuthMenuOpen(false));

  // Auth state from Zustand
  const { user, profiles, switchProfile, isAuthenticated, logout } = useAuthStore();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreOpen(false);
    setAuthMenuOpen(false);
  }, [pathname]);

  const role: UserRole | 'guest' = isAuthenticated && user ? user.role : 'guest';
  const primaryLinks = NAV_BY_ROLE[role];
  const moreLinks = MORE_BY_ROLE[role];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  function handleLogout() {
    logout();
    router.push('/auth/login');
  }

  const roleInfo = user ? ROLE_LABELS[user.role] || ROLE_LABELS.student : ROLE_LABELS.student;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                <span className="text-2xl">🎮</span>
                <span className="text-xl font-bold gradient-text hidden sm:block">Live Learning</span>
              </div>
            </Link>

            {/* Desktop Nav — role-based primary links */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5 ${
                    isActive(link.href)
                      ? 'text-primary bg-primary/10 shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface/80'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* More dropdown — only if there are more links */}
              {moreLinks.length > 0 && (
                <div ref={moreRef} className="relative">
                  <button
                    onClick={() => setMoreOpen(!moreOpen)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5 ${
                      moreLinks.some((l) => isActive(l.href))
                        ? 'text-primary bg-primary/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface/80'
                    }`}
                  >
                    <span>⋯</span>
                    <span>เพิ่มเติม</span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  <div
                    className="absolute right-0 top-full mt-2 w-64 glass rounded-2xl border border-border/50 shadow-xl overflow-hidden transition-all origin-top-right"
                    style={{
                      opacity: moreOpen ? 1 : 0,
                      transform: moreOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
                      pointerEvents: moreOpen ? 'auto' : 'none',
                      transitionDuration: '200ms',
                    }}
                  >
                    <div className="p-2">
                      {moreLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                            isActive(link.href)
                              ? 'bg-primary/10 text-primary'
                              : 'text-text-secondary hover:bg-surface/80 hover:text-text-primary'
                          }`}
                        >
                          <span className="text-xl mt-0.5">{link.icon}</span>
                          <div>
                            <p className="text-sm font-semibold">{link.label}</p>
                            <p className="text-xs text-text-muted">{link.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* Auth section — wrapped in HydrationGuard to prevent SSR mismatch */}
              <HydrationGuard fallback={
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-surface animate-pulse" />
                </div>
              }>
              {isAuthenticated && user ? (
                <div ref={authRef} className="relative">
                  <button
                    onClick={() => setAuthMenuOpen(!authMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-surface/80 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-base shadow-md">
                      {user.avatar}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-text-primary max-w-[80px] truncate">
                      {user.name}
                    </span>
                    <svg
                      className={`hidden sm:block w-3.5 h-3.5 text-text-muted transition-transform ${authMenuOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Auth dropdown */}
                  <div
                    className="absolute right-0 top-full mt-2 w-56 glass rounded-2xl border border-border/50 shadow-xl overflow-hidden transition-all origin-top-right"
                    style={{
                      opacity: authMenuOpen ? 1 : 0,
                      transform: authMenuOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
                      pointerEvents: authMenuOpen ? 'auto' : 'none',
                      transitionDuration: '200ms',
                    }}
                  >
                    {/* User info */}
                      <div className="px-4 py-3 border-b border-border/30">
                        <p className="text-sm font-bold text-text-primary">{user.name}</p>
                        <p className="text-xs text-text-muted">
                          {user.level} • <span className={roleInfo.color}>{roleInfo.label}</span>
                        </p>
                        <p className="text-[10px] text-text-muted mt-0.5">{user.email}</p>
                      </div>

                      {/* Profile Switcher (if multiple profiles exist) */}
                      {profiles.length > 1 && (
                        <div className="p-2 border-b border-border/30">
                          <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold px-2 mb-1">
                            สลับโปรไฟล์
                          </p>
                          {profiles.map((p) => (
                            <button
                              key={p.role}
                              onClick={() => {
                                if (p.profileId) switchProfile(p.profileId);
                              }}
                              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                                user.role === p.role 
                                  ? 'bg-primary/10 text-primary font-bold' 
                                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                              }`}
                            >
                              <span className="text-base">{p.avatar}</span>
                              <span>{p.role}</span>
                              {user.role === p.role && <span className="ml-auto text-primary">✓</span>}
                            </button>
                          ))}
                        </div>
                      )}

                    <div className="p-2">
                      {role === 'student' && (
                        <Link href="/my-bookings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-text-secondary hover:bg-surface/80 hover:text-text-primary transition-colors">
                          <span>�</span> การจองของฉัน
                        </Link>
                      )}
                      {role === 'instructor' && (
                        <Link href="/schedule" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-text-secondary hover:bg-surface/80 hover:text-text-primary transition-colors">
                          <span>�</span> ตารางสอนของฉัน
                        </Link>
                      )}
                      <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-text-secondary hover:bg-surface/80 hover:text-text-primary transition-colors">
                        <span>⚙️</span> ตั้งค่า
                      </Link>
                    </div>

                    <div className="p-2 border-t border-border/30">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-error hover:bg-error/10 transition-colors text-left"
                      >
                        <span>🚪</span> ออกจากระบบ
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface/80 transition-colors"
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-game px-4 py-2 rounded-xl text-sm font-bold text-white"
                  >
                    สมัครเรียน
                  </Link>
                </div>
              )}
              </HydrationGuard>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface transition-colors"
                aria-label="เมนู"
              >
                <div className="flex flex-col gap-1.5">
                  <span className={`block w-5 h-0.5 bg-text-primary transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`block w-5 h-0.5 bg-text-primary transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block w-5 h-0.5 bg-text-primary transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className="lg:hidden overflow-hidden border-t border-border/30 transition-all duration-300"
          style={{ maxHeight: mobileMenuOpen ? '600px' : '0', opacity: mobileMenuOpen ? 1 : 0 }}
        >
          <nav className="px-4 py-3 space-y-1">
            {/* Section: หลัก */}
            <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold px-3 pt-1 pb-2">
              เมนูหลัก
            </p>
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-primary hover:bg-surface'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-sm">{link.label}</span>
              </Link>
            ))}

            {/* Section: เพิ่มเติม — only if has more links */}
            {moreLinks.length > 0 && (
              <>
                <div className="h-px bg-border/30 my-2" />
                <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold px-3 pt-1 pb-2">
                  เพิ่มเติม
                </p>
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-primary hover:bg-surface'
                    }`}
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span className="text-sm">{link.label}</span>
                  </Link>
                ))}
              </>
            )}

            <HydrationGuard>
            {isAuthenticated && user ? (
              <>
                <div className="h-px bg-border/30 my-2" />
                <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold px-3 pt-1 pb-2">
                  บัญชีของฉัน
                </p>
                {/* User card mobile */}
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-surface/50 mb-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-base">
                    {user.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{user.name}</p>
                    <p className="text-[10px] text-text-muted">{user.level} • <span className={roleInfo.color}>{roleInfo.label}</span></p>
                  </div>
                </div>
                {role === 'student' && (
                  <Link href="/my-bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-primary hover:bg-surface font-medium transition-colors">
                    <span className="text-lg">📋</span><span className="text-sm">การจองของฉัน</span>
                  </Link>
                )}
                {role === 'instructor' && (
                  <Link href="/schedule" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-primary hover:bg-surface font-medium transition-colors">
                    <span className="text-lg">�</span><span className="text-sm">ตารางสอนของฉัน</span>
                  </Link>
                )}
                <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-primary hover:bg-surface font-medium transition-colors">
                  <span className="text-lg">⚙️</span><span className="text-sm">ตั้งค่า</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-error hover:bg-error/10 font-medium transition-colors"
                >
                  <span className="text-lg">🚪</span><span className="text-sm">ออกจากระบบ</span>
                </button>
              </>
            ) : (
              <>
                <div className="h-px bg-border/30 my-2" />
                <div className="flex gap-2 px-3">
                  <Link href="/auth/login" className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary border border-border hover:bg-surface transition-colors">
                    เข้าสู่ระบบ
                  </Link>
                  <Link href="/auth/register" className="flex-1 text-center btn-game px-4 py-2.5 rounded-xl text-sm font-bold text-white">
                    สมัครเรียน
                  </Link>
                </div>
              </>
            )}
            </HydrationGuard>
          </nav>
        </div>
      </div>
    </header>
  );
}
