/**
 * ThemeToggle — CSS only, no react-spring
 */

'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isDark = resolvedTheme === 'dark';

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full bg-surface animate-pulse" />;
  }

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-10 h-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center cursor-pointer transition-all hover:border-primary hover:scale-110 hover:shadow-[0_0_20px_rgba(130,100,255,0.4)]"
      aria-label={isDark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
      title={isDark ? 'Light Mode' : 'Dark Mode'}
    >
      <span className="text-lg leading-none transition-transform duration-300" style={{ transform: isDark ? 'rotate(360deg)' : 'rotate(0deg)' }}>
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
