/**
 * MainLayout
 * Wraps pages with Header + Footer + decorative floating elements
 * Game-inspired aesthetic with vibrant colors
 */

'use client';

import { type ReactNode } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      {/* Decorative background orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Top-left orb */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float"
          style={{ background: 'var(--gradient-primary)' }}
        />
        {/* Bottom-right orb */}
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{
            background: 'linear-gradient(135deg, hsl(330, 80%, 70%), hsl(280, 70%, 60%))',
            animationDelay: '1.5s',
            animation: 'float 4s ease-in-out infinite',
          }}
        />
        {/* Center orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
          style={{ background: 'var(--gradient-primary)' }}
        />
      </div>

      <Header />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
