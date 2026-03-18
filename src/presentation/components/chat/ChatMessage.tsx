"use client";

/**
 * Chat Message Component
 */

import { ChatMessage as ChatMessageType } from "@/src/presentation/stores/chat-store";
import { Bot, Check, CheckCheck, ShieldCheck, User } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const isAdmin = message.role === "admin";
  const isBotOrAdmin = isAssistant || isAdmin;

  return (
    <div
      className={`chat-message ${isBotOrAdmin ? "chat-message--assistant" : "chat-message--user"}`}
    >
      <div className={`chat-message__avatar ${isAdmin ? "bg-indigo-600 rounded-none rounded-t-xl rounded-l-xl opacity-90" : ""}`}>
        {isAdmin ? (
          <ShieldCheck className="chat-message__icon text-indigo-500" />
        ) : isAssistant ? (
          <Bot className="chat-message__icon" />
        ) : (
          <User className="chat-message__icon" />
        )}
      </div>
      <div className="chat-message__content">
        <div className={`chat-message__text ${isAdmin ? "!bg-indigo-50 !text-indigo-900 border !border-indigo-100" : ""}`}>
           {isAdmin && <span className="text-[10px] font-bold text-indigo-500 mb-1 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> CEO | Human Staff</span>}
           {message.content}
        </div>
        <div className="flex items-center gap-1 justify-end mt-1 text-[10px] text-gray-400">
          <span className="chat-message__time">
            {new Date(message.timestamp).toLocaleTimeString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {message.role === "user" && (
             <span>
                {message.status === "sending" && <span className="opacity-50">...</span>}
                {message.status === "sent" && <Check className="w-3 h-3" />}
                {message.status === "delivered" && <CheckCheck className="w-3 h-3" />}
                {message.status === "read" && <CheckCheck className="w-3 h-3 text-blue-500" />}
             </span>
          )}
        </div>
      </div>
    </div>
  );
}
