/**
 * ThemeProvider
 * Wraps next-themes provider for dark/light mode
 * attribute="class" matches TailwindCSS v4 @custom-variant dark
 */

'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="live-learning-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
