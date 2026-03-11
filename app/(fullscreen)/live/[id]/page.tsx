/**
 * Live Room Page — Simulated Live Classroom
 * Interactive video-class experience with chat, participants, and live controls
 */

'use client';

import { LiveRoomView } from '@/src/presentation/components/live/LiveRoomView';
import { use } from 'react';

export default function LiveRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return <LiveRoomView roomId={id} />;
}
