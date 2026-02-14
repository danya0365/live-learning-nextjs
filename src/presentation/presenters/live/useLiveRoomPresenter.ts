'use client';

import { ChatMessage, LiveRoom, Participant } from '@/src/application/repositories/ILiveRoomRepository';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createClientLiveRoomPresenter } from './LiveRoomPresenterClientFactory';

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

export function useLiveRoomPresenter(roomId: string) {
  const presenter = useMemo(() => createClientLiveRoomPresenter(), []);

  // State
  const [room, setRoom] = useState<LiveRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI State
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isReacting, setIsReacting] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const autoMsgIndex = useRef(0);

  // Load Data
  useEffect(() => {
    async function init() {
      setLoading(true);
      const vm = await presenter.getRoomViewModel(roomId);
      if (vm) {
        setRoom(vm.room);
        setMessages(vm.messages);
        setParticipants(vm.participants);
        setViewerCount(vm.participants.length);
      } else {
        setError('Room not found');
      }
      setLoading(false);
    }
    init();
  }, [presenter, roomId]);

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
      setViewerCount((v) => Math.max(0, v + (Math.random() > 0.5 ? 1 : -1)));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg = await presenter.sendMessage(roomId, newMessage);
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
  };

  const handleReaction = (emoji: string) => {
    setIsReacting(emoji);
    setTimeout(() => setIsReacting(''), 1500);
  };

  return {
    state: {
      room,
      messages,
      participants,
      loading,
      error,
      newMessage,
      isMuted,
      isVideoOn,
      isHandRaised,
      showParticipants,
      showChat,
      viewerCount,
      elapsedTime,
      showLeaveModal,
      isReacting,
      chatEndRef,
    },
    actions: {
      setNewMessage,
      setIsMuted,
      setIsVideoOn,
      setIsHandRaised,
      setShowParticipants,
      setShowChat,
      setShowLeaveModal,
      sendMessage,
      handleReaction,
      formatTime,
    }
  };
}
