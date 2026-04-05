"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdminChatRoomViewModel, AdminChatRoomPresenter } from "./AdminChatRoomPresenter";
import { createClientAdminChatRoomPresenter } from "./AdminChatRoomPresenterClientFactory";
import { useAdminChatStore, ChatMessage } from "@/src/presentation/stores/admin-chat-store";

export interface AdminChatRoomPresenterState {
  viewModel: AdminChatRoomViewModel | null;
  loading: boolean;
  error: string | null;
  messages: ChatMessage[];
  searchResults: ChatMessage[] | null;
  autoReply: boolean;
  input: string;
  searchQuery: string;
}

export interface AdminChatRoomPresenterActions {
  loadData: () => Promise<void>;
  sendReply: (e?: React.FormEvent) => Promise<void>;
  markAsRead: () => Promise<void>;
  searchMessages: (query: string) => Promise<void>;
  handleSearch: (e: React.FormEvent) => void;
  clearSearch: () => void;
  toggleAutoReply: (state: boolean) => Promise<void>;
  closeSession: () => Promise<void>;
  updateSessionStatus: (status: string) => Promise<void>;
  setError: (error: string | null) => void;
  setInput: (input: string) => void;
  setSearchQuery: (query: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  // Helpers
  formatStatus: (status: string | undefined) => string;
  getStatusColor: (status: string | undefined) => string;
  formatDate: (dateString: string | undefined) => string;
}

/**
 * useAdminChatRoomPresenter
 * Custom hook following Section 3 of CREATE_PAGE_PATTERN.md strictly.
 * ALL logic, state, and effects are now moved here.
 */
export function useAdminChatRoomPresenter(
  sessionId: string,
  initialViewModel?: AdminChatRoomViewModel,
  presenterOverride?: AdminChatRoomPresenter
) {
  const isMountedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [viewModel, setViewModel] = useState<AdminChatRoomViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States moved from View
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const presenter = useMemo(
    () => presenterOverride || createClientAdminChatRoomPresenter(),
    [presenterOverride]
  );

  const store = useAdminChatStore();

  /**
   * Load data from presenter
   */
  const loadData = useCallback(async () => {
    if (!sessionId) {
      if (isMountedRef.current) setError("Session ID is missing");
      return;
    }

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    // Only set loading for initial load or manual refresh
    if (!viewModel) setLoading(true); 
    setError(null);

    try {
      const newViewModel = await presenter.getViewModel(sessionId, "", ""); 
      
      if (isMountedRef.current) {
        setViewModel(newViewModel);
        await store.syncMessages();
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      
      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
        setError(errorMessage);
        console.error("Error loading chat room data:", err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [sessionId, presenter, store.syncMessages, viewModel]);

  // Effects moved from View
  
  // Initialize store and initial sync
  useEffect(() => {
    if (sessionId) {
       store.setSessionId(sessionId);
    }
    
    if (!initialViewModel && sessionId) {
      loadData();
    } else if (sessionId) {
      store.syncMessages();
    }
  }, [sessionId, initialViewModel, loadData, store.syncMessages]);

  // Polling for messages
  useEffect(() => {
    const interval = setInterval(() => {
      // Don't sync if we are in search mode or explicit loading
      if (!store.searchResults && !loading) {
        loadData();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [loadData, store.searchResults, loading]);

  // Mark as read when messages from user arrive
  useEffect(() => {
    const hasUnread = store.messages.some(m => m.role === "user" && m.status !== "read");
    if (hasUnread) {
      store.markAsRead();
    }
  }, [store.messages, store.markAsRead]);

  // ✅ Auto-scroll to bottom (Moved from View)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!store.searchResults) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [store.messages, store.searchResults]);

  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  // Helpers moved from View (Standard Pattern style)
  const formatStatus = useCallback((status: string | undefined) => {
    switch (status) {
      case "active": return "กำลังดำเนินการ";
      case "follow_up": return "ติดตามผล";
      case "resolved": return "แก้ไขแล้ว";
      case "spam": return "สแปม";
      default: return status || "-";
    }
  }, []);

  const getStatusColor = useCallback((status: string | undefined) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-800 border-blue-200";
      case "follow_up": return "bg-purple-100 text-purple-800 border-purple-200";
      case "resolved": return "bg-green-100 text-green-800 border-green-200";
      case "spam": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, []);

  const formatDate = useCallback((dateString: string | undefined) => {
    if (!dateString) return "-";
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  }, []);

  // Handlers moved from View
  const handleAdminReply = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;
    const content = input.trim();
    setInput("");
    await store.sendReply(content);
  }, [input, loading, store.sendReply]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      store.searchMessages(searchQuery.trim());
    }
  }, [searchQuery, store.searchMessages]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    store.clearSearch();
  }, [store.clearSearch]);

  const state: AdminChatRoomPresenterState = {
    viewModel,
    loading,
    error,
    messages: store.messages,
    searchResults: store.searchResults,
    autoReply: store.autoReply,
    input,
    searchQuery,
  };

  const actions: AdminChatRoomPresenterActions = {
    loadData,
    sendReply: handleAdminReply,
    markAsRead: store.markAsRead,
    searchMessages: store.searchMessages,
    handleSearch,
    clearSearch,
    toggleAutoReply: store.toggleAutoReply,
    closeSession: store.closeSession,
    updateSessionStatus: async (status: string) => {
        await store.updateSessionStatus(status);
        await loadData();
    },
    setError: (err) => setError(err),
    setInput,
    setSearchQuery,
    messagesEndRef,
    inputRef,
    formatStatus,
    getStatusColor,
    formatDate,
  };

  return [state, actions] as const;
}
