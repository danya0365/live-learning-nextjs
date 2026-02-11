/**
 * Header — CSS only, no react-spring
 */

'use client';

import { ThemeToggle } from '@/src/presentation/components/common/ThemeToggle';
import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'หน้าแรก', icon: '🏠' },
  { href: '/courses', label: 'คอร์สเรียน', icon: '📚' },
  { href: '/instructors', label: 'อาจารย์', icon: '👨‍🏫' },
  { href: '/schedule', label: 'ตารางเรียน', icon: '📅' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                <span className="text-2xl">🎮</span>
                <span className="text-xl font-bold gradient-text hidden sm:block">Live Learning</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface/80 transition-all hover:-translate-y-0.5"
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {/* Live indicator */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-error/10 border border-error/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-error" />
                </span>
                <span className="text-xs font-semibold text-error">LIVE</span>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface transition-colors"
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
          className="md:hidden overflow-hidden border-t border-border/30 transition-all duration-300"
          style={{ maxHeight: mobileMenuOpen ? '300px' : '0', opacity: mobileMenuOpen ? 1 : 0 }}
        >
          <nav className="px-4 py-4 flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface transition-colors text-text-primary font-medium"
              >
                <span className="text-xl">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
