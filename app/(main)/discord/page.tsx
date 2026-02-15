'use client';

import { useEffect } from 'react';

export default function DiscordRedirect() {
  useEffect(() => {
    // Redirect to Discord invite link
    window.location.href = 'https://discord.gg/your-invite-link'; 
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl mb-6 animate-bounce">👾</div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 gradient-text">กำลังพาคุณไปที่ Discord Community...</h1>
      <p className="text-text-muted">
        หากไม่เปลี่ยนหน้าอัตโนมัติ <a href="https://discord.gg/your-invite-link" className="text-primary hover:underline font-bold">คลิกที่นี่</a>
      </p>
    </div>
  );
}
