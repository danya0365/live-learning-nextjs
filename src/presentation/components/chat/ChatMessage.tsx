"use client";

/**
 * Chat Message Component
 */

import { ChatMessage as ChatMessageType } from "@/src/presentation/stores/chat-store";
import { Bot, Check, CheckCheck, ShieldCheck, User } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
  isMe?: boolean;
}

export function ChatMessage({ message, isMe = false }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const isAdmin = message.role === "admin";

  return (
    <div
      className={`chat-message w-full flex flex-col ${isMe ? "items-end text-right" : "items-start text-left"} gap-1.5`}
    >
      <div className={`flex items-end gap-3 max-w-[85%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white/20 ${isMe ? "bg-gradient-to-br from-primary to-secondary text-white" : "bg-surface text-text-muted"}`}>
          {isAdmin ? (
            <ShieldCheck className="w-4.5 h-4.5" />
          ) : isAssistant ? (
            <Bot className="w-4.5 h-4.5" />
          ) : (
            <User className="w-4.5 h-4.5" />
          )}
        </div>
        
        <div className="flex flex-col gap-1.5">
          <div className={`px-5 py-3 rounded-2xl text-sm font-bold shadow-sm transition-all border ${
            isMe 
              ? "bg-gradient-to-br from-primary to-secondary text-white border-transparent rounded-tr-none shadow-primary/20" 
              : "bg-surface text-text-primary border-border/50 rounded-tl-none"
          }`}>
             {isAdmin && !isMe && (
               <span className="text-[10px] font-black text-primary mb-2 flex items-center gap-1.5 uppercase tracking-widest border-b border-primary/10 pb-1.5">
                 <ShieldCheck className="w-3 h-3"/> CEO | Admin Panel
               </span>
             )}
             <p className="leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          
          <div className={`flex items-center gap-2 text-[10px] font-black text-text-muted/60 uppercase tracking-tighter ${isMe ? "justify-end pr-1" : "justify-start pl-1"}`}>
            <span>
              {new Date(message.timestamp).toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {message.role === "user" && isMe && (
               <div className="flex items-center gap-0.5">
                  {message.status === "sending" && <div className="w-1 h-1 bg-text-muted rounded-full animate-bounce" />}
                  {message.status === "sent" && <Check className="w-3 h-3" />}
                  {message.status === "delivered" && <CheckCheck className="w-3 h-3" />}
                  {message.status === "read" && <CheckCheck className="w-3 h-3 text-secondary animate-in zoom-in" />}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
