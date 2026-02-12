/**
 * LiveSessionsView
 * Shows currently active live courses that students can join
 * Pure CSS — no react-spring
 */

'use client';

import { LiveSessionsViewModel } from '@/src/presentation/presenters/live/LiveSessionsPresenter';
import { useLiveSessionsPresenter } from '@/src/presentation/presenters/live/useLiveSessionsPresenter';
import Link from 'next/link';

interface LiveSessionsViewProps {
  initialViewModel?: LiveSessionsViewModel;
}

export function LiveSessionsView({ initialViewModel }: LiveSessionsViewProps) {
  const state = useLiveSessionsPresenter(initialViewModel);
  const vm = state.viewModel;

  if (state.loading && !vm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-soft">🔴</div>
          <p className="text-text-secondary text-lg">กำลังโหลดห้องเรียนสด...</p>
        </div>
      </div>
    );
  }

  if (state.error && !vm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-error font-medium mb-2">เกิดข้อผิดพลาด</p>
          <p className="text-text-secondary mb-4">{state.error}</p>
          <button onClick={() => state.refresh()} className="btn-game px-6 py-2 text-white rounded-xl">ลองใหม่</button>
        </div>
      </div>
    );
  }

  if (!vm) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2 flex items-center gap-3">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-error" />
            </span>
            ห้องเรียนสด
          </h1>
          <p className="text-text-secondary">
            มี {vm.totalLive} คอร์สกำลังสอนสดอยู่ตอนนี้ • เข้าร่วมเรียนได้ทันที
          </p>
        </div>
        <button
          onClick={() => state.refresh()}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          🔄 รีเฟรช
        </button>
      </div>

      {/* Live sessions grid */}
      {vm.sessions.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📺</div>
          <p className="text-text-secondary text-lg mb-2">ไม่มีคอร์สสดในขณะนี้</p>
          <p className="text-text-muted text-sm mb-6">ดูตารางเรียนเพื่อเช็คคอร์สที่กำลังจะเริ่ม</p>
          <Link href="/schedule" className="btn-game px-6 py-3 text-white rounded-xl inline-block">
            📅 ดูตารางเรียน
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vm.sessions.map((session) => (
            <div key={session.course.id} className="glass rounded-2xl overflow-hidden group hover:scale-[1.02] transition-transform">
              {/* Thumbnail with LIVE badge */}
              <Link
                href={`/courses/${session.course.id}`}
                className="relative h-44 overflow-hidden block"
                style={{
                  background: `linear-gradient(135deg, hsl(${session.course.id.charCodeAt(session.course.id.length - 1) * 15 + 200}, 70%, 55%), hsl(${session.course.id.charCodeAt(session.course.id.length - 1) * 15 + 250}, 60%, 40%))`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl opacity-80 group-hover:scale-110 transition-transform">
                    {session.course.tags[0] === 'React' ? '⚛️' : session.course.tags[0] === 'Python' ? '🐍' : session.course.tags[0] === 'UX' ? '🎨' : session.course.tags[0] === 'Flutter' ? '📱' : '📚'}
                  </span>
                </div>

                {/* LIVE badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error/90 text-white text-sm font-bold shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  LIVE
                </div>

                {/* Viewer count */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg glass text-white text-xs font-medium">
                  👁️ {session.viewerCount} คนกำลังดู
                </div>

                {/* Bottom gradient */}
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 flex gap-1">
                  {session.course.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-black/30 text-white text-[10px] font-medium backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-bold text-text-primary mb-2 line-clamp-2 leading-snug">
                  {session.course.title}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <Link href={`/instructors/${session.instructor.id}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-sm">👨‍🏫</div>
                    <span className="text-sm text-text-secondary">{session.instructor.name}</span>
                  </Link>
                  {session.instructor.isOnline && (
                    <span className="px-2 py-0.5 rounded-full bg-success/10 border border-success/30 text-[10px] font-bold text-success flex items-center gap-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
                      </span>
                      ONLINE
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-text-muted mb-4">
                  <span>⭐ {session.course.rating}</span>
                  <span>👥 {session.course.totalStudents.toLocaleString()} นักเรียน</span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/live/${session.course.id}`} className="flex-1 btn-game py-2.5 text-white rounded-xl font-bold text-sm hover:scale-105 transition-transform text-center">
                    🔴 เข้าร่วมเรียนสด
                  </Link>
                  <Link
                    href={`/courses/${session.course.id}`}
                    className="px-3 py-2.5 rounded-xl glass text-xs font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center"
                  >
                    📖
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
