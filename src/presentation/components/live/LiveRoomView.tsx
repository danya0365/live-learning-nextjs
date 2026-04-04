'use client';

import { useLiveRoomPresenter } from '@/src/presentation/presenters/live/useLiveRoomPresenter';
import {
  LocalVideoTrack,
  RemoteVideoTrack,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers
} from 'agora-rtc-react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Agora App ID - Should be in .env.local
const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || '7a87e83464f84f0fb8e4986641b656b2'; // Placeholder for demo

interface LiveRoomViewProps {
  roomId: string;
}

export function LiveRoomView({ roomId }: LiveRoomViewProps) {
  const router = useRouter();
  const { state, actions } = useLiveRoomPresenter(roomId);
  const {
    room, messages, participants, loading, error, newMessage, isMuted, isVideoOn,
    isHandRaised, showChat, showParticipants, viewerCount, elapsedTime, showLeaveModal, isReacting, chatEndRef
  } = state;

  // TODO: Implement Agora RTC setup
  const [joined, setJoined] = useState(false);

  // Join the channel
  useJoin(
    {
      appid: AGORA_APP_ID,
      channel: roomId,
      token: null, // Should fetch from API for production
    },
    joined
  );

  // Local Tracks
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(!isMuted);
  const { localCameraTrack } = useLocalCameraTrack(isVideoOn);
  
  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Remote Tracks
  const remoteUsers = useRemoteUsers();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-text-primary">กำลังเข้าห้องเรียน...</div>;
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">ไม่พบห้องเรียนนี้</h1>
          <p className="text-text-secondary mb-6">ห้องเรียนอาจจบไปแล้วหรือ URL ไม่ถูกต้อง</p>
          <Link href="/live" className="btn-game px-6 py-3 text-white rounded-xl inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> กลับไปห้องเรียนสด
          </Link>
        </div>
      </div>
    );
  }

  // Auto-join when room is ready
  if (!joined && room) {
    setJoined(true);
  }

  function handleLeave() {
    router.push('/live');
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)] overflow-hidden">
      {/* Top bar */}
      <div className="flex-shrink-0 h-14 glass border-b border-border/50 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => actions.setShowLeaveModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-text-secondary hover:text-error hover:bg-error/10 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" /> ออก
          </button>
          <div className="h-5 w-px bg-border/50 hidden sm:block" />
          <h1 className="text-sm font-bold text-text-primary truncate hidden sm:block">{room.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* LIVE badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-error/90 text-white text-xs font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            LIVE
          </div>

          {/* Timer */}
          <span className="text-xs font-mono text-text-muted hidden sm:inline">
            ⏱ {actions.formatTime(elapsedTime)}
          </span>

          {/* Viewers */}
          <span className="flex items-center gap-1 text-xs text-text-muted">
            👁️ {viewerCount}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Main video area */}
          <div className="flex-1 relative overflow-hidden bg-black">
            {remoteUsers.length > 0 ? (
              <div className="w-full h-full flex flex-wrap items-center justify-center gap-2 p-4">
                {remoteUsers.map((user) => (
                  <div key={user.uid} className="relative aspect-video flex-1 min-w-[300px] max-w-full rounded-xl overflow-hidden bg-surface border border-white/10">
                    <RemoteVideoTrack track={user.videoTrack as any} play className="w-full h-full object-cover" />
                    <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-black/50 text-[10px] text-white backdrop-blur-sm">
                      {user.uid === '1' ? 'อาจารย์ (Instructor)' : `นักเรียน (${user.uid})`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${room.color} flex items-center justify-center`}>
                <div className="text-center text-white/90 pointer-events-none select-none">
                  <div className="text-8xl mb-6 animate-float">{room.instructorAvatar}</div>
                  <h2 className="text-2xl font-bold mb-1">{room.instructor}</h2>
                  <p className="text-sm text-white/60 mb-3">กำลังเริ่มการสอนสด...</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {room.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-xs backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reaction animation */}
            {isReacting && (
              <div className="absolute bottom-20 right-10 text-6xl animate-bounce-soft pointer-events-none z-20">
                {isReacting}
              </div>
            )}

            {/* Self-view camera */}
            <div className={`absolute top-4 right-4 w-40 h-28 rounded-xl shadow-2xl overflow-hidden border-2 z-20 transition-all ${isVideoOn ? 'border-primary' : 'border-border/50'}`}>
              {isVideoOn ? (
                <LocalVideoTrack track={localCameraTrack} play className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center flex-col gap-1">
                  <span className="text-3xl">🧑‍💻</span>
                  <span className="text-[10px] text-gray-400 mt-1">กล้องปิด</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/50 text-[9px] text-white">
                คุณ (You)
              </div>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="flex-shrink-0 h-16 glass border-t border-border/50 flex items-center justify-center gap-2 sm:gap-3 px-4 z-10">
            {/* Mic */}
            <button
              onClick={() => actions.setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 ${
                isMuted ? 'bg-error text-white' : 'bg-success/20 text-success border border-success/30'
              }`}
              title={isMuted ? 'เปิดไมค์' : 'ปิดไมค์'}
            >
              {isMuted ? '🔇' : '🎙️'}
            </button>

            {/* Camera */}
            <button
              onClick={() => actions.setIsVideoOn(!isVideoOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 ${
                !isVideoOn ? 'bg-error text-white' : 'bg-success/20 text-success border border-success/30'
              }`}
              title={isVideoOn ? 'ปิดกล้อง' : 'เปิดกล้อง'}
            >
              {isVideoOn ? '📹' : '📷'}
            </button>

            {/* Hand raise */}
            <button
              onClick={() => actions.setIsHandRaised(!isHandRaised)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 ${
                isHandRaised ? 'bg-warning text-white animate-bounce-soft' : 'bg-surface text-text-secondary border border-border/50'
              }`}
              title={isHandRaised ? 'เอามือลง' : 'ยกมือ'}
            >
              {isHandRaised ? '✋' : '🤚'}
            </button>

            {/* Divider */}
            <div className="h-8 w-px bg-border/30 hidden sm:block" />

            {/* Reactions */}
            <div className="hidden sm:flex items-center gap-1">
              {['👍', '❤️', '🎉', '😂', '🤔'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => actions.handleReaction(emoji)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-surface hover:bg-surface/80 hover:scale-125 transition-all border border-border/30"
                  title="ส่งรีแอคชัน"
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="h-8 w-px bg-border/30 hidden sm:block" />

            {/* Toggle panels */}
            <button
              onClick={() => { actions.setShowChat(!showChat); actions.setShowParticipants(false); }}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 ${
                showChat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface text-text-secondary border border-border/50'
              }`}
              title="แชท"
            >
              💬
            </button>

            <button
              onClick={() => { actions.setShowParticipants(!showParticipants); actions.setShowChat(false); }}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 ${
                showParticipants ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface text-text-secondary border border-border/50'
              }`}
              title="ผู้เข้าร่วม"
            >
              👥
            </button>

            {/* Leave */}
            <button
              onClick={() => actions.setShowLeaveModal(true)}
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg bg-error/90 text-white hover:bg-error hover:scale-110 transition-all shadow-lg shadow-error/20"
              title="ออกจากห้อง"
            >
              📞
            </button>
          </div>
        </div>

        {/* Side panel — Chat or Participants */}
        {(showChat || showParticipants) && (
          <div className="w-80 flex-shrink-0 border-l border-border/50 glass flex flex-col hidden md:flex">
            {/* Panel header */}
            <div className="flex-shrink-0 h-12 px-4 flex items-center justify-between border-b border-border/30">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { actions.setShowChat(true); actions.setShowParticipants(false); }}
                  className={`text-sm font-medium transition-colors ${showChat ? 'text-primary' : 'text-text-muted hover:text-text-primary'}`}
                >
                  💬 แชท
                </button>
                <button
                  onClick={() => { actions.setShowParticipants(true); actions.setShowChat(false); }}
                  className={`text-sm font-medium transition-colors ${showParticipants ? 'text-primary' : 'text-text-muted hover:text-text-primary'}`}
                >
                  👥 ผู้เข้าร่วม ({viewerCount})
                </button>
              </div>
              <button
                onClick={() => { actions.setShowChat(false); actions.setShowParticipants(false); }}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Chat panel */}
            {showChat && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                      <div className="text-4xl mb-3 opacity-20">💬</div>
                      <p className="text-xs text-text-muted">ยังไม่มีข้อความ... เริ่มคุยกันเลย!</p>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-2 animate-fadeIn">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-surface-variant flex items-center justify-center text-sm border border-border/30">
                        {msg.avatar || '👤'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-xs font-bold truncate max-w-[120px] ${msg.isInstructor ? 'text-primary' : 'text-text-primary'}`}>
                            {msg.user}
                          </span>
                          {msg.isInstructor && (
                            <span className="px-1 py-0.5 rounded bg-primary/10 text-[9px] font-bold text-primary flex-shrink-0">อาจารย์</span>
                          )}
                          <span className="text-[9px] text-text-muted flex-shrink-0">{msg.time}</span>
                        </div>
                        <p className="text-sm text-text-secondary leading-snug break-words">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat input */}
                <form onSubmit={actions.sendMessage} className="flex-shrink-0 p-3 border-t border-border/30">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => actions.setNewMessage(e.target.value)}
                      placeholder="พิมพ์ข้อความ..."
                      className="flex-1 px-3 py-2 rounded-xl bg-surface border border-border text-text-primary text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="w-10 h-10 rounded-xl btn-game text-white text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                    >
                      📤
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Participants panel */}
            {showParticipants && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface/50 transition-colors border border-transparent hover:border-border/30">
                    <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-lg border border-border/30">
                      {p.avatar || '👤'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${p.isInstructor ? 'text-primary' : 'text-text-primary'}`}>
                        {p.name}
                      </p>
                      {p.isInstructor && (
                        <p className="text-[10px] text-primary">อาจารย์ผู้สอน</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Leave modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="glass rounded-2xl p-8 border border-border/50 shadow-2xl max-w-sm w-full mx-4 text-center">
            <div className="text-5xl mb-4 text-error">🚪</div>
            <h2 className="text-xl font-bold text-text-primary mb-2">ออกจากห้องเรียน?</h2>
            <p className="text-text-secondary text-sm mb-6">คุณแน่ใจว่าต้องการออกจากห้องเรียนสดนี้?</p>
            <div className="flex gap-3">
              <button
                onClick={() => actions.setShowLeaveModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl glass border border-border text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                อยู่ต่อ
              </button>
              <button
                onClick={handleLeave}
                className="flex-1 px-4 py-2.5 rounded-xl bg-error text-white text-sm font-bold hover:scale-[1.02] active:scale-95 transition-transform"
              >
                ออกจากห้อง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
