"use client";

import { useEffect, useState } from "react";

export function AdminChatBadge() {
  const [count, setCount] = useState<number>(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/admin/chats/unread");
      if (res.ok) {
        const data = await res.json();
        setCount(data.count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchUnreadCount();

    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-in zoom-in duration-300">
      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" />
      <span className="relative">
        {count > 99 ? "99+" : count}
      </span>
    </span>
  );
}
