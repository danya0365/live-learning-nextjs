/**
 * Live Room Page — Simulated Live Classroom
 * Interactive video-class experience with chat, participants, and live controls
 */

'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

/* ── Types ─────────────────────────────────── */
interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  isInstructor?: boolean;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isInstructor?: boolean;
}

/* ── Mock Data ─────────────────────────────── */
const COURSE_DATA: Record<string, { title: string; instructor: string; instructorAvatar: string; tags: string[]; color: string }> = {
  'course-001': { title: 'พื้นฐาน React.js สำหรับผู้เริ่มต้น', instructor: 'อ.สมชาย พัฒนาเว็บ', instructorAvatar: '👨‍🏫', tags: ['React', 'JavaScript'], color: 'from-blue-500 to-purple-600' },
  'course-003': { title: 'UX/UI Design Masterclass', instructor: 'อ.พิมพ์ลดา ดีไซน์', instructorAvatar: '👩‍🎨', tags: ['UX', 'UI', 'Figma'], color: 'from-pink-500 to-orange-400' },
  'course-005': { title: 'Flutter Mobile App Development', instructor: 'อ.ธนกร โมบาย', instructorAvatar: '👨‍💻', tags: ['Flutter', 'Dart'], color: 'from-cyan-500 to-blue-600' },
};

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: '1', user: 'อ.สมชาย', avatar: '👨‍🏫', text: 'สวัสดีครับ ยินดีต้อนรับเข้าห้องเรียนสด!', time: '10:00', isInstructor: true },
  { id: '2', user: 'น้องมิน', avatar: '🧑‍💻', text: 'สวัสดีครับอาจารย์ 🙏', time: '10:01' },
  { id: '3', user: 'น้องแพร', avatar: '👩‍🎓', text: 'พร้อมเรียนค่ะ!', time: '10:01' },
  { id: '4', user: 'อ.สมชาย', avatar: '👨‍🏫', text: 'วันนี้เราจะมาเรียนเรื่อง Component Lifecycle กัน ทุกคนเปิด VS Code ได้เลยครับ', time: '10:02', isInstructor: true },
  { id: '5', user: 'กอล์ฟ', avatar: '🧑', text: 'พร้อมแล้วครับ', time: '10:02' },
];

const PARTICIPANTS: Participant[] = [
  { id: '1', name: 'อ.สมชาย', avatar: '👨‍🏫', isInstructor: true },
  { id: '2', name: 'น้องมิน', avatar: '🧑‍💻' },
  { id: '3', name: 'น้องแพร', avatar: '👩‍🎓' },
  { id: '4', name: 'กอล์ฟ', avatar: '🧑' },
  { id: '5', name: 'เบลล์', avatar: '👧' },
  { id: '6', name: 'ไบร์ท', avatar: '🧑‍🦱' },
  { id: '7', name: 'มายด์', avatar: '👩' },
  { id: '8', name: 'โอ๊ต', avatar: '🧔' },
];

const AUTO_MESSAGES = [
  { user: 'น้องแพร', avatar: '👩‍🎓', text: 'อาจารย์ขอถามเรื่อง useEffect ค่ะ' },
  { user: 'อ.สมชาย', avatar: '👨‍🏫', text: 'ได้เลยครับ เดี๋ยวอธิบายให้', isInstructor: true },
  { user: 'กอล์ฟ', avatar: '🧑', text: 'dependency array ใส่อะไรได้บ้างครับ?' },
  { user: 'อ.สมชาย', avatar: '👨‍🏫', text: 'ใส่ได้ทั้ง state, props, และตัวแปรภายนอกครับ', isInstructor: true },
  { user: 'เบลล์', avatar: '👧', text: 'เข้าใจแล้วค่ะ ขอบคุณค่ะ 🙏' },
  { user: 'ไบร์ท', avatar: '🧑‍🦱', text: 'cleanup function ใช้ตอนไหนครับ?' },
  { user: 'อ.สมชาย', avatar: '👨‍🏫', text: 'ใช้ตอน unmount หรือก่อนที่ effect จะรันใหม่ครับ เช่น cancel subscription', isInstructor: true },
  { user: 'มายด์', avatar: '👩', text: 'ถ้าลืมใส่ dependency จะเป็นยังไงคะ?' },
  { user: 'อ.สมชาย', avatar: '👨‍🏫', text: 'ถ้าใส่ [] ว่างจะรันแค่ครั้งเดียว ถ้าไม่ใส่เลยจะรันทุก render ครับ ⚠️', isInstructor: true },
];

/* ── Component ─────────────────────────────── */
export default function LiveRoomPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const course = COURSE_DATA[courseId];

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [viewerCount, setViewerCount] = useState(PARTICIPANTS.length);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isReacting, setIsReacting] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const autoMsgIndex = useRef(0);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Elapsed timer
  useEffect(() => {
    const timer = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulated auto messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoMsgIndex.current < AUTO_MESSAGES.length) {
        const msg = AUTO_MESSAGES[autoMsgIndex.current];
        const now = new Date();
        setMessages((prev) => [
          ...prev,
          {
            id: `auto-${Date.now()}`,
            user: msg.user,
            avatar: msg.avatar,
            text: msg.text,
            time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
            isInstructor: msg.isInstructor,
          },
        ]);
        autoMsgIndex.current++;
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Random viewer count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((v) => v + (Math.random() > 0.5 ? 1 : -1));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const now = new Date();
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        user: 'คุณ',
        avatar: '🧑‍💻',
        text: newMessage.trim(),
        time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      },
    ]);
    setNewMessage('');
  }

  function handleReaction(emoji: string) {
    setIsReacting(emoji);
    setTimeout(() => setIsReacting(''), 1500);
  }

  function handleLeave() {
    router.push('/live');
  }

  // 404 — course not found
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">ไม่พบห้องเรียนนี้</h1>
          <p className="text-text-secondary mb-6">ห้องเรียนอาจจบไปแล้วหรือ URL ไม่ถูกต้อง</p>
          <Link href="/live" className="btn-game px-6 py-3 text-white rounded-xl inline-block">
            ← กลับไปห้องเรียนสด
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)] overflow-hidden">
      {/* Top bar */}
      <div className="flex-shrink-0 h-14 glass border-b border-border/50 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setShowLeaveModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-text-secondary hover:text-error hover:bg-error/10 transition-colors"
          >
            ← ออก
          </button>
          <div className="h-5 w-px bg-border/50 hidden sm:block" />
          <h1 className="text-sm font-bold text-text-primary truncate hidden sm:block">{course.title}</h1>
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
            ⏱ {formatTime(elapsedTime)}
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
          {/* Main video */}
          <div className="flex-1 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${course.color} flex items-center justify-center`}>
              {/* Simulated video content */}
              <div className="text-center text-white/90 pointer-events-none select-none">
                <div className="text-8xl mb-6 animate-float">{course.instructorAvatar}</div>
                <h2 className="text-2xl font-bold mb-1">{course.instructor}</h2>
                <p className="text-sm text-white/60 mb-3">กำลังสอนสด...</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {course.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-xs backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Code overlay — simulated screen share */}
              <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-80 glass rounded-xl p-4 text-left border border-white/10 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-[10px] text-white/50 ml-1">App.tsx</span>
                </div>
                <pre className="text-[11px] text-green-300 font-mono leading-relaxed overflow-hidden">
{`useEffect(() => {
  const data = fetchAPI();
  setItems(data);
  
  return () => {
    // cleanup 🧹
    cancel(data);
  };
}, []);`}
                </pre>
              </div>
            </div>

            {/* Reaction animation */}
            {isReacting && (
              <div className="absolute bottom-20 right-10 text-6xl animate-bounce-soft pointer-events-none">
                {isReacting}
              </div>
            )}

            {/* Self-view camera */}
            <div className={`absolute top-4 right-4 w-32 h-24 rounded-xl shadow-xl overflow-hidden border-2 ${isVideoOn ? 'border-primary/50' : 'border-border/50'}`}>
              {isVideoOn ? (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <span className="text-3xl">🧑‍💻</span>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center flex-col gap-1">
                  <span className="text-xl">📷</span>
                  <span className="text-[9px] text-gray-400">กล้องปิด</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom controls */}
          <div className="flex-shrink-0 h-16 glass border-t border-border/50 flex items-center justify-center gap-2 sm:gap-3 px-4">
            {/* Mic */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 ${
                isMuted ? 'bg-error/20 text-error' : 'bg-success/20 text-success'
              }`}
              title={isMuted ? 'เปิดไมค์' : 'ปิดไมค์'}
            >
              {isMuted ? '🔇' : '🎙️'}
            </button>

            {/* Camera */}
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 ${
                !isVideoOn ? 'bg-error/20 text-error' : 'bg-success/20 text-success'
              }`}
              title={isVideoOn ? 'ปิดกล้อง' : 'เปิดกล้อง'}
            >
              {isVideoOn ? '📹' : '📷'}
            </button>

            {/* Hand raise */}
            <button
              onClick={() => setIsHandRaised(!isHandRaised)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 ${
                isHandRaised ? 'bg-warning/20 text-warning animate-bounce-soft' : 'bg-surface text-text-secondary'
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
                  onClick={() => handleReaction(emoji)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-surface hover:bg-surface/80 hover:scale-125 transition-all"
                  title="ส่งรีแอคชัน"
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="h-8 w-px bg-border/30 hidden sm:block" />

            {/* Toggle panels */}
            <button
              onClick={() => { setShowChat(!showChat); setShowParticipants(false); }}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 ${
                showChat ? 'bg-primary/20 text-primary' : 'bg-surface text-text-secondary'
              }`}
              title="แชท"
            >
              💬
            </button>

            <button
              onClick={() => { setShowParticipants(!showParticipants); setShowChat(false); }}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 ${
                showParticipants ? 'bg-primary/20 text-primary' : 'bg-surface text-text-secondary'
              }`}
              title="ผู้เข้าร่วม"
            >
              👥
            </button>

            {/* Leave */}
            <button
              onClick={() => setShowLeaveModal(true)}
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg bg-error/20 text-error hover:bg-error/30 hover:scale-110 transition-all"
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
                  onClick={() => { setShowChat(true); setShowParticipants(false); }}
                  className={`text-sm font-medium transition-colors ${showChat ? 'text-primary' : 'text-text-muted hover:text-text-primary'}`}
                >
                  💬 แชท
                </button>
                <button
                  onClick={() => { setShowParticipants(true); setShowChat(false); }}
                  className={`text-sm font-medium transition-colors ${showParticipants ? 'text-primary' : 'text-text-muted hover:text-text-primary'}`}
                >
                  👥 ผู้เข้าร่วม ({viewerCount})
                </button>
              </div>
              <button
                onClick={() => { setShowChat(false); setShowParticipants(false); }}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Chat panel */}
            {showChat && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-2 animate-fadeIn">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-surface flex items-center justify-center text-sm">
                        {msg.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-xs font-bold ${msg.isInstructor ? 'text-primary' : 'text-text-primary'}`}>
                            {msg.user}
                          </span>
                          {msg.isInstructor && (
                            <span className="px-1 py-0.5 rounded bg-primary/10 text-[9px] font-bold text-primary">อาจารย์</span>
                          )}
                          <span className="text-[10px] text-text-muted">{msg.time}</span>
                        </div>
                        <p className="text-sm text-text-secondary leading-snug break-words">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat input */}
                <form onSubmit={sendMessage} className="flex-shrink-0 p-3 border-t border-border/30">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="พิมพ์ข้อความ..."
                      className="flex-1 px-3 py-2 rounded-xl bg-surface border border-border text-text-primary text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-3 py-2 rounded-xl btn-game text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
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
                {PARTICIPANTS.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-lg">
                      {p.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${p.isInstructor ? 'text-primary' : 'text-text-primary'}`}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="glass rounded-2xl p-8 border border-border/50 shadow-2xl max-w-sm w-full mx-4 text-center">
            <div className="text-5xl mb-4">🚪</div>
            <h2 className="text-xl font-bold text-text-primary mb-2">ออกจากห้องเรียน?</h2>
            <p className="text-text-secondary text-sm mb-6">คุณแน่ใจว่าต้องการออกจากห้องเรียนสดนี้?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveModal(false)}
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
