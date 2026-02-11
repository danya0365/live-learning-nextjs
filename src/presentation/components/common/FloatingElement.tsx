/**
 * FloatingElement
 * Decorative floating element with looping y-translation animation
 * Used for background decoration: stars, shapes, emojis
 */

'use client';

import { animated, useSpring } from '@react-spring/web';
import { useEffect } from 'react';

interface FloatingElementProps {
  children: React.ReactNode;
  /** Amplitude of float in px (default 15) */
  amplitude?: number;
  /** Duration of float cycle in ms (default 3000) */
  duration?: number;
  /** Delay before start in ms (default 0) */
  delay?: number;
  className?: string;
}

export function FloatingElement({
  children,
  amplitude = 15,
  duration = 3000,
  delay = 0,
  className = '',
}: FloatingElementProps) {
  const [spring, api] = useSpring(() => ({
    y: 0,
    rotate: 0,
    config: { duration: duration / 2 },
  }));

  useEffect(() => {
    let cancelled = false;

    const animate = async () => {
      if (delay > 0) {
        await new Promise((r) => setTimeout(r, delay));
      }

      while (!cancelled) {
        await api.start({ y: -amplitude, rotate: 3, config: { duration: duration / 2 } });
        if (cancelled) break;
        await api.start({ y: 0, rotate: -3, config: { duration: duration / 2 } });
      }
    };

    animate();

    return () => {
      cancelled = true;
    };
  }, [api, amplitude, duration, delay]);

  return (
    <animated.div
      style={{
        transform: spring.y.to(
          (y) => `translateY(${y}px) rotate(${spring.rotate.get()}deg)`
        ),
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </animated.div>
  );
}
