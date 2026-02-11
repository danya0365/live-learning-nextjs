/**
 * GlowOrb
 * Animated gradient orb for atmospheric background decoration
 * Creates a game-like ambient lighting effect
 */

'use client';

import { animated, useSpring } from '@react-spring/web';
import { useEffect } from 'react';

interface GlowOrbProps {
  /** Size in pixels */
  size?: number;
  /** CSS color or gradient */
  color?: string;
  /** Position from top (CSS value) */
  top?: string;
  /** Position from left (CSS value) */
  left?: string;
  /** Opacity (0-1) */
  opacity?: number;
  /** Pulse duration in ms */
  pulseDuration?: number;
  /** Blur amount in px */
  blur?: number;
}

export function GlowOrb({
  size = 300,
  color = 'var(--color-primary)',
  top = '50%',
  left = '50%',
  opacity = 0.15,
  pulseDuration = 4000,
  blur = 60,
}: GlowOrbProps) {
  const [spring, api] = useSpring(() => ({
    scale: 1,
    opacity,
    config: { duration: pulseDuration / 2 },
  }));

  useEffect(() => {
    let cancelled = false;

    const animate = async () => {
      while (!cancelled) {
        await api.start({
          scale: 1.2,
          opacity: opacity * 1.3,
          config: { duration: pulseDuration / 2 },
        });
        if (cancelled) break;
        await api.start({
          scale: 1,
          opacity,
          config: { duration: pulseDuration / 2 },
        });
      }
    };

    animate();
    return () => { cancelled = true; };
  }, [api, opacity, pulseDuration]);

  return (
    <animated.div
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        filter: `blur(${blur}px)`,
        transform: spring.scale.to((s) => `translate(-50%, -50%) scale(${s})`),
        opacity: spring.opacity,
        pointerEvents: 'none' as const,
      }}
    />
  );
}
