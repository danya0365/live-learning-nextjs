'use client';

import { HydrationGuard } from '@/src/presentation/components/common/HydrationGuard';
import { LoadingOverlay } from '@/src/presentation/components/common/LoadingOverlay';
import { ThemeToggle } from '@/src/presentation/components/common/ThemeToggle';
import { cn } from '@/src/presentation/utils/cn';
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
    >
      {/* 
          ── GLASS BACKGROUND LAYER ──
          We move the blur and background into a sibling div instead of the header tag.
          This solves 'Nested Backdrop Filters' bug in Chrome because dropdowns 
          are no longer descendants of the element with the blur, but siblings.
      */}
      <div 
        className={cn(
          "absolute inset-0 -z-10 transition-all duration-300",
          scrolled
            ? "backdrop-blur-[14px] backdrop-saturate-[1.4] bg-transparent shadow-[0_4px_30px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)]"
            : "backdrop-blur-[12px] backdrop-saturate-[1.2] bg-transparent shadow-none"
        )}
      />

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
                className={cn(
                  "relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 group/link",
                  isActive(link.href)
                    ? "text-primary"
                    : "text-text-secondary hover:text-text-primary"
                )}
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
                  className={cn(
                    "absolute right-0 top-full mt-3 w-72 rounded-2xl border border-border/40 shadow-2xl transition-all duration-200 origin-top-right",
                    "backdrop-blur-[14px] backdrop-saturate-[1.4] bg-transparent",
                    moreOpen
                      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  )}
                >
                  <div className="p-2">
                    {moreLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-150 group/more",
                          isActive(link.href)
                            ? "bg-primary/10 text-primary"
                            : "text-text-secondary hover:bg-surface/80 hover:text-text-primary"
                        )}
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
                  className={cn(
                    "flex items-center gap-2 p-1 rounded-full hover:bg-surface-elevated transition-all duration-200 group/auth ring-2 ring-transparent hover:ring-primary/20"
                  )}
                >
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg shadow-md transition-transform duration-200 group-hover/auth:scale-105">
                      {user.avatar}
                    </div>
                    {/* Online indicator */}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-background shadow-sm" />
                  </div>
                </button>

                {/* Auth dropdown */}
                <div
                  className={cn(
                    "absolute right-0 top-full mt-3 w-60 rounded-2xl border border-border/40 shadow-2xl transition-all duration-200 origin-top-right",
                    "backdrop-blur-[14px] backdrop-saturate-[1.4] bg-transparent",
                    authMenuOpen
                      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  )}
                >
                  {/* User info */}
                  <div className="px-4 py-3.5 border-b border-border/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg shadow-md">
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-text-primary truncate">{user.name}</p>
                        <div className="mt-1">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${
                            user.role === 'instructor' 
                              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' 
                              : user.role === 'admin'
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                          }`}>
                            <span>{user.role === 'instructor' ? '👨‍🏫' : user.role === 'admin' ? '🛡️' : '🎓'}</span>
                            <span>{roleInfo.label}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Switcher (if multiple profiles exist) */}
                  {profiles.length > 1 && (
                    <div className="p-2 border-b border-border/30">
                      <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold px-2 mb-1.5 flex items-center justify-between">
                        <span>สลับโปรไฟล์</span>
                        <span className="text-[10px] bg-surface-elevated px-1.5 py-0.5 rounded text-text-muted">{profiles.length}</span>
                      </p>
                      <div className="space-y-1">
                        {profiles.map((p) => {
                          const isCurrent = user.role === p.role;
                          const roleLabel = p.role === 'instructor' ? 'อาจารย์' : p.role === 'admin' ? 'แอดมิน' : 'นักเรียน';
                          const roleIcon = p.role === 'instructor' ? '👨‍🏫' : p.role === 'admin' ? '🛡️' : '🎓';
                          
                          return (
                            <button
                              key={p.role}
                              onClick={() => {
                                if (p.profileId) {
                                  handleSwitchProfile(p.profileId);
                                }
                              }}
                              className={cn(
                                "w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-all duration-150 group",
                                isCurrent
                                  ? "bg-primary/5 ring-1 ring-primary/20"
                                  : "hover:bg-surface"
                              )}
                            >
                              {/* Avatar */}
                              <div className="relative shrink-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm ${
                                  isCurrent ? 'bg-gradient-to-br from-primary to-secondary text-white' : 'bg-surface-elevated text-text-secondary grayscale group-hover:grayscale-0 transition-all'
                                }`}>
                                  {p.avatar}
                                </div>
                                {isCurrent && (
                                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-background shadow-sm" />
                                )}
                              </div>
                              
                              {/* Info */}
                              <div className="flex-1 text-left min-w-0">
                                <p className={`text-xs font-bold truncate ${isCurrent ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
                                  {p.name}
                                </p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <span className={`text-[10px] flex items-center gap-1 px-1.5 py-0.5 rounded-md ${
                                    p.role === 'instructor' 
                                      ? 'bg-purple-100/50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300' 
                                      : 'bg-blue-100/50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300'
                                  }`}>
                                    <span>{roleIcon}</span>
                                    <span>{roleLabel}</span>
                                  </span>
                                </div>
                              </div>
                              
                              {/* Checkmark */}
                              {isCurrent && (
                                <div className="text-primary shrink-0">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
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
                    {(role === 'student' || role === 'instructor') && (
                      <Link href="/wallet" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-surface/80 hover:text-text-primary transition-all duration-150">
                        <span>💳</span> กระเป๋าเงิน
                      </Link>
                    )}
                    <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-surface/80 hover:text-text-primary transition-all duration-150">
                      <span>⚙️</span> ตั้งค่า
                    </Link>
                  </div>

                  <div className="p-2 border-t border-border/30">
                    <button
                      onClick={handleLogout}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-error hover:bg-error/10 transition-all duration-150 text-left"
                      )}
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

      {/* Mobile Menu Background (Sibling) */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden absolute inset-0 -z-10 backdrop-blur-[24px] backdrop-saturate-[1.5] bg-transparent"
          style={{ height: '100vh' }}
        />
      )}

      {/* Mobile Menu Content */}
      <div
        className="lg:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: mobileMenuOpen ? '80vh' : '0',
          opacity: mobileMenuOpen ? 1 : 0,
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
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-150",
                isActive(link.href)
                  ? "bg-primary/10 text-primary"
                  : "text-text-primary hover:bg-surface/60"
              )}
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
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-150",
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-text-primary hover:bg-surface/60"
                  )}
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
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-background shadow-sm" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{user.name}</p>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${
                      user.role === 'instructor' 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' 
                        : user.role === 'admin'
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                    }`}>
                      <span>{user.role === 'instructor' ? '👨‍🏫' : user.role === 'admin' ? '🛡️' : '🎓'}</span>
                      <span>{roleInfo.label}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Switcher in Mobile */}
              {profiles.length > 1 && (
                <div className="px-1 mb-2 mt-2">
                  <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold px-2 mb-2">
                    สลับโปรไฟล์
                  </p>
                  <div className="space-y-2">
                    {profiles.map((p) => {
                      const isCurrent = user.role === p.role;
                      const roleLabel = p.role === 'instructor' ? 'อาจารย์' : p.role === 'admin' ? 'แอดมิน' : 'นักเรียน';
                      const roleIcon = p.role === 'instructor' ? '👨‍🏫' : p.role === 'admin' ? '🛡️' : '🎓';

                      return (
                        <button
                          key={p.role}
                          onClick={() => {
                            if (p.profileId) {
                              handleSwitchProfile(p.profileId);
                            }
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 border",
                            isCurrent
                              ? "bg-primary/5 border-primary/20 shadow-sm"
                              : "bg-surface/50 border-transparent hover:bg-surface"
                          )}
                        >
                          {/* Avatar */}
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base shadow-sm shrink-0 ${
                            isCurrent ? 'bg-gradient-to-br from-primary to-secondary text-white' : 'bg-surface-elevated text-text-secondary'
                          }`}>
                            {p.avatar}
                          </div>

                          {/* Info */}
                          <div className="flex-1 text-left min-w-0">
                            <p className={`text-sm font-bold truncate ${isCurrent ? 'text-text-primary' : 'text-text-secondary'}`}>
                              {p.name}
                            </p>
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] mt-0.5 ${
                                p.role === 'instructor' 
                                  ? 'bg-purple-100/50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300' 
                                  : 'bg-blue-100/50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300'
                              }`}>
                              <span>{roleIcon}</span>
                              <span>{roleLabel}</span>
                            </span>
                          </div>

                           {/* Checkmark */}
                           {isCurrent && (
                            <div className="text-primary shrink-0 bg-primary/10 p-1 rounded-full">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
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
              {(role === 'student' || role === 'instructor') && (
                <Link href="/wallet" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-primary hover:bg-surface/60 font-medium transition-all duration-150">
                  <span className="text-lg">💳</span><span className="text-sm">กระเป๋าเงิน (Wallet)</span>
                </Link>
              )}
              <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-primary hover:bg-surface/60 font-medium transition-all duration-150">
                <span className="text-lg">⚙️</span><span className="text-sm">ตั้งค่า</span>
              </Link>
              <button
                onClick={handleLogout}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-error hover:bg-error/10 font-medium transition-all duration-150"
                )}
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
