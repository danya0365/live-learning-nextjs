'use client';

import { ChatMessage, LiveRoom, Participant } from '@/src/application/repositories/ILiveRoomRepository';
import { createClient as createSupabaseClient } from '@/src/infrastructure/supabase/client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createClientLiveRoomPresenter } from './LiveRoomPresenterClientFactory';

export function useLiveRoomPresenter(roomId: string) {
  const presenter = useMemo(() => createClientLiveRoomPresenter(), []);
  const supabase = useMemo(() => createSupabaseClient(), []);

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

  // Load Initial Data
  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const vm = await presenter.getRoomViewModel(roomId);
        if (vm) {
          setRoom(vm.room);
          setMessages(vm.messages);
          setParticipants(vm.participants);
          setViewerCount(vm.participants.length);
        } else {
          setError('Room not found');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [presenter, roomId]);

  // Realtime Subscription (Chat & Presence)
  useEffect(() => {
    if (!room?.id) return;

    const channel = supabase.channel(`room:${room.id}`);

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'live_chat_messages',
          filter: `live_session_id=eq.${room.id}`,
        },
        async (payload) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', payload.new.profile_id)
            .single();

          const newMsg: ChatMessage = {
            id: payload.new.id,
            user: profile?.full_name || 'Anonymous',
            avatar: profile?.avatar_url || '',
            text: payload.new.text,
            time: new Date(payload.new.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isInstructor: payload.new.is_instructor,
          };

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const onlineParticipants: Participant[] = [];
        
        Object.values(newState).forEach((presences: any) => {
          presences.forEach((p: any) => {
            onlineParticipants.push({
              id: p.profile_id,
              name: p.name,
              avatar: p.avatar,
              isInstructor: p.isInstructor
            });
          });
        });
        
        // De-duplicate by profile_id
        const uniqueParticipants = Array.from(new Map(onlineParticipants.map(item => [item.id, item])).values());
        setParticipants(uniqueParticipants);
        setViewerCount(uniqueParticipants.length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Get current user profile to track presence
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();

            await channel.track({
              profile_id: user.id,
              name: profile?.full_name || 'Anonymous',
              avatar: profile?.avatar_url || '',
              online_at: new Date().toISOString(),
              isInstructor: room.instructor === profile?.full_name // Simple check for demo
            });
          }
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, room?.id, room?.instructor]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Elapsed timer
  useEffect(() => {
    const timer = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !room?.id) return;
    try {
      const msg = await presenter.sendMessage(room.id, newMessage);
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      setNewMessage('');
    } catch (err: any) {
      console.error('Failed to send message:', err);
    }
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
