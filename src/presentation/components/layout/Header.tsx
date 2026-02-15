'use client';

import { HydrationGuard } from '@/src/presentation/components/common/HydrationGuard';
import { LoadingOverlay } from '@/src/presentation/components/common/LoadingOverlay';
import { ThemeToggle } from '@/src/presentation/components/common/ThemeToggle';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useHeader } from './useHeader';

/* ── Component ─────────────────────────────── */
export function Header() {
  const {
    // State
    mobileMenuOpen,
    moreOpen,
    authMenuOpen,
    isSwitchingProfile,
    isAuthenticated,
    user,
    profiles,
    role,

    // Derived
    primaryLinks,
    moreLinks,
    roleInfo,

    // Refs
    moreRef,
    authRef,

    // Setters
    setMobileMenuOpen,
    setMoreOpen,
    setAuthMenuOpen,

    // Methods
    isActive,
    handleLogout,
    handleSwitchProfile,
  } = useHeader();

  /* ── Scroll-aware header ────────────────── */
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // check initial
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      id="main-header"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'blur(12px) saturate(1.2)',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'blur(12px) saturate(1.2)',
        background: scrolled
          ? 'var(--header-bg-scrolled, rgba(var(--header-rgb, 255, 255, 255), 0.85))'
          : 'var(--header-bg, rgba(var(--header-rgb, 255, 255, 255), 0.4))',
        boxShadow: scrolled
          ? '0 4px 30px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)'
          : 'none',
      }}
    >
      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="flex items-center gap-2.5 hover:scale-105 transition-transform duration-200">
              <div className="relative">
                <span className="text-2xl drop-shadow-sm">🎮</span>
                <div
                  className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10"
                  style={{ background: 'var(--gradient-primary)' }}
                />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block tracking-tight">
                Live Learning
              </span>
            </div>
          </Link>

          {/* Desktop Nav — role-based primary links */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 group/link ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {/* Active indicator pill */}
                {isActive(link.href) && (
                  <span
                    className="absolute inset-0 rounded-xl opacity-[0.08]"
                    style={{ background: 'var(--gradient-primary)' }}
                  />
                )}
                <span className="relative z-10 text-base group-hover/link:scale-110 transition-transform duration-200">
                  {link.icon}
                </span>
                <span className="relative z-10">{link.label}</span>
                {/* Active bottom dot */}
                {isActive(link.href) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            ))}

            {/* More dropdown — only if there are more links */}
            {moreLinks.length > 0 && (
              <div ref={moreRef} className="relative">
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                    moreLinks.some((l) => isActive(l.href))
                      ? 'text-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {moreLinks.some((l) => isActive(l.href)) && (
                    <span
                      className="absolute inset-0 rounded-xl opacity-[0.08]"
                      style={{ background: 'var(--gradient-primary)' }}
                    />
                  )}
                  <span className="relative z-10">⋯</span>
                  <span className="relative z-10">เพิ่มเติม</span>
                  <svg
                    className={`relative z-10 w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                <div
                  className="absolute right-0 top-full mt-3 w-72 rounded-2xl border border-border/40 shadow-2xl overflow-hidden transition-all duration-200 origin-top-right"
                  style={{
                    opacity: moreOpen ? 1 : 0,
                    transform: moreOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
                    pointerEvents: moreOpen ? 'auto' : 'none',
                    backdropFilter: 'blur(24px) saturate(1.5)',
                    WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
                    background: 'var(--glass-bg)',
                  }}
                >
                  <div className="p-2">
                    {moreLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-150 group/more ${
                          isActive(link.href)
                            ? 'bg-primary/10 text-primary'
                            : 'text-text-secondary hover:bg-surface/80 hover:text-text-primary'
                        }`}
                      >
                        <span className="text-xl mt-0.5 group-hover/more:scale-110 transition-transform duration-200">
                          {link.icon}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{link.label}</p>
                          <p className="text-xs text-text-muted mt-0.5">{link.desc}</p>
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
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-surface/60 transition-all duration-200 group/auth"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-base shadow-md ring-2 ring-transparent group-hover/auth:ring-primary/30 transition-all duration-200">
                      {user.avatar}
                    </div>
                    {/* Online indicator */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-background" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-text-primary max-w-[80px] truncate">
                    {user.name}
                  </span>
                  <svg
                    className={`hidden sm:block w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${authMenuOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Auth dropdown */}
                <div
                  className="absolute right-0 top-full mt-3 w-60 rounded-2xl border border-border/40 shadow-2xl overflow-hidden transition-all duration-200 origin-top-right"
                  style={{
                    opacity: authMenuOpen ? 1 : 0,
                    transform: authMenuOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
                    pointerEvents: authMenuOpen ? 'auto' : 'none',
                    backdropFilter: 'blur(24px) saturate(1.5)',
                    WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
                    background: 'var(--glass-bg)',
                  }}
                >
                  {/* User info */}
                  <div className="px-4 py-3.5 border-b border-border/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg shadow-md">
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-text-primary truncate">{user.name}</p>
                        <p className="text-xs text-text-muted">
                          {user.level} • <span className={roleInfo.color}>{roleInfo.label}</span>
                        </p>
                        <p className="text-[10px] text-text-muted mt-0.5 truncate">{user.email}</p>
                      </div>
                    </div>
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
                            if (p.profileId) {
                              handleSwitchProfile(p.profileId);
                            }
                          }}
                          className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-all duration-150 ${
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
                      <Link href="/my-bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-surface/80 hover:text-text-primary transition-all duration-150">
                        <span>📋</span> การจองของฉัน
                      </Link>
                    )}
                    {role === 'instructor' && (
                      <Link href="/schedule" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-surface/80 hover:text-text-primary transition-all duration-150">
                        <span>📅</span> ตารางสอนของฉัน
                      </Link>
                    )}
                    <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-surface/80 hover:text-text-primary transition-all duration-150">
                      <span>⚙️</span> ตั้งค่า
                    </Link>
                  </div>

                  <div className="p-2 border-t border-border/30">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-error hover:bg-error/10 transition-all duration-150 text-left"
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
                  className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface/60 transition-all duration-200"
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
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface/60 transition-all duration-200"
              aria-label="เมนู"
            >
              <div className="flex flex-col gap-1.5">
                <span className={`block w-5 h-0.5 bg-text-primary rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 h-0.5 bg-text-primary rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-text-primary rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Gradient bottom line — subtle glow accent */}
      <div
        className="h-px w-full transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to right, transparent, var(--color-primary), var(--color-secondary), var(--color-accent), transparent)',
          opacity: scrolled ? 0.5 : 0.2,
        }}
      />

      {/* Mobile Menu */}
      <div
        className="lg:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: mobileMenuOpen ? '80vh' : '0',
          opacity: mobileMenuOpen ? 1 : 0,
          backdropFilter: 'blur(24px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
          background: 'var(--glass-bg)',
        }}
      >
        <div className="border-t border-border/30" />
        <nav className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
          {/* Section: หลัก */}
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold px-3 pt-1 pb-2">
            เมนูหลัก
          </p>
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-150 ${
                isActive(link.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-primary hover:bg-surface/60'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="text-sm">{link.label}</span>
              {isActive(link.href) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}

          {/* Section: เพิ่มเติม — only if has more links */}
          {moreLinks.length > 0 && (
            <>
              <div className="h-px bg-border/30 my-3" />
              <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold px-3 pt-1 pb-2">
                เพิ่มเติม
              </p>
              {moreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-150 ${
                    isActive(link.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-primary hover:bg-surface/60'
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="text-sm">{link.label}</span>
                  {isActive(link.href) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              ))}
            </>
          )}

          <HydrationGuard>
          {isAuthenticated && user ? (
            <>
              <div className="h-px bg-border/30 my-3" />
              <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold px-3 pt-1 pb-2">
                บัญชีของฉัน
              </p>
              {/* User card mobile */}
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-surface/40 mb-2">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg shadow-md">
                    {user.avatar}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-background" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{user.name}</p>
                  <p className="text-[10px] text-text-muted">{user.level} • <span className={roleInfo.color}>{roleInfo.label}</span></p>
                </div>
              </div>

              {/* Profile Switcher in Mobile */}
              {profiles.length > 1 && (
                <div className="px-1 mb-2">
                  <div className="flex gap-1.5">
                    {profiles.map((p) => (
                      <button
                        key={p.role}
                        onClick={() => {
                          if (p.profileId) {
                            handleSwitchProfile(p.profileId);
                          }
                        }}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                          user.role === p.role
                            ? 'bg-primary/10 text-primary font-bold ring-1 ring-primary/30'
                            : 'text-text-secondary hover:bg-surface/60 hover:text-text-primary'
                        }`}
                      >
                        <span className="text-base">{p.avatar}</span>
                        <span>{p.role}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {role === 'student' && (
                <Link href="/my-bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-primary hover:bg-surface/60 font-medium transition-all duration-150">
                  <span className="text-lg">📋</span><span className="text-sm">การจองของฉัน</span>
                </Link>
              )}
              {role === 'instructor' && (
                <Link href="/schedule" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-primary hover:bg-surface/60 font-medium transition-all duration-150">
                  <span className="text-lg">📅</span><span className="text-sm">ตารางสอนของฉัน</span>
                </Link>
              )}
              <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-primary hover:bg-surface/60 font-medium transition-all duration-150">
                <span className="text-lg">⚙️</span><span className="text-sm">ตั้งค่า</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-error hover:bg-error/10 font-medium transition-all duration-150"
              >
                <span className="text-lg">🚪</span><span className="text-sm">ออกจากระบบ</span>
              </button>
            </>
          ) : (
            <>
              <div className="h-px bg-border/30 my-3" />
              <div className="flex gap-2 px-3">
                <Link href="/auth/login" className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary border border-border hover:bg-surface/60 transition-all duration-150">
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

      <LoadingOverlay isLoading={isSwitchingProfile} message="กำลังสลับโปรไฟล์..." />
    </header>
  );
}
