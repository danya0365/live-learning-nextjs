'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const MOCK_PREDEFINED_QUESTIONS = [
    "แนะนำคอร์ส React 19 ให้หน่อย",
    "Tailwind คืออะไร?",
    "มี Cheat Sheet สรุป JavaScript ไหม?",
];

export function AIHelperWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'สวัสดีครับ! 🤖 ผมคือ LiveBot ผู้ช่วยอัจฉริยะของคุณ มีเรื่องการเรียนอะไรให้ผมช่วยไหมครับ?',
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = (text: string) => {
        if (!text.trim()) return;

        // Add user message
        const userMsg: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Mock AI Response Logic
        setTimeout(() => {
            const lowerText = text.toLowerCase();
            let aiText = "ขออภัยครับ คำถามนี้ผมยังรับมือไม่ไหว 😅 ลองถามเรื่อง React, Tailwind, หรือขอเอกสารประกอบการเรียนดูสิครับ";

            if (lowerText.includes('react') || lowerText.includes('รีแอค')) {
                aiText = "React เป็นไลบรารียอดฮิตเลยครับ! แนะนำให้ไปที่หน้า \n👉 [คลังความรู้](/resources) เพื่อโหลด React 19 Cheat Sheet หรือไปที่ \n👉 [ลานประลอง](/quizzes) เพื่อทดสอบตัวแปรก่อนเข้าเรียนคอร์สสดครับ";
            } else if (lowerText.includes('tailwind') || lowerText.includes('css')) {
                 aiText = "Tailwind CSS ช่วยให้คุณเขียน CSS ได้เร็วมาก! เรามีคลิปสอนเทคนิคต่างๆ ด้วยนะ แวะไปดูได้ที่หน้า \n👉 [คลิปสั้น](/shorts) เลยครับ";
            } else if (lowerText.includes('cheat sheet') || lowerText.includes('เอกสาร') || lowerText.includes('สรุป')) {
                 aiText = "แน่นอนครับ! เรามีเอกสาร Cheat Sheet แลกแจกฟรีเพียบ ทั้ง React, Next.js เข้าไปดูได้ที่หน้า \n👉 [คลังความรู้](/resources) ครับ";
            } else if (lowerText.includes('pomodoro') || lowerText.includes('อ่านหนังสือ') || lowerText.includes('โฟกัส')) {
                aiText = "ถ้าต้องการสมาธิ ขอเชิญที่ \n👉 [ห้องอ่านหนังสือ (Study Room)](/study-room) ครับ มี Pomodoro Timer และเพื่อนร่วมโฟกัสเพียบ!";
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: aiText,
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    // Replace Markdown-like links for basic display
    const renderMessageText = (text: string) => {
         const parts = text.split(/(👉 \[[^\]]+\]\([^)]+\))/g);
         return parts.map((part, i) => {
             const match = part.match(/👉 \[([^\]]+)\]\(([^)]+)\)/);
             if (match) {
                 return (
                     <a key={i} href={match[2]} className="text-primary hover:underline font-bold block mt-1">
                         👉 {match[1]}
                     </a>
                 );
             }
             return <span key={i} className="whitespace-pre-wrap">{part}</span>;
         });
    };

    return (
        <>
            {/* The Floating Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: isOpen ? 0 : 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-lg shadow-primary/30 origin-center ${isOpen ? 'pointer-events-none' : ''}`}
            >
                <span className="text-2xl drop-shadow-md">🤖</span>
                {/* Ping indicator */}
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-error rounded-full ring-2 ring-background animate-pulse" />
            </motion.button>

            {/* The Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }}
                        className="fixed bottom-6 right-6 z-50 w-full max-w-[360px] h-[500px] max-h-[85vh] bg-surface backdrop-blur-3xl border border-border/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden origin-bottom-right"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-border/50 bg-surface-elevated/80 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg shadow-sm">
                                        🤖
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-surface-elevated" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-text-primary">LiveBot Assistant</h3>
                                    <p className="text-[10px] text-text-muted">กำลังออนไลน์ พร้อมช่วยเหลือ</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full bg-surface hover:bg-surface-elevated flex items-center justify-center text-text-muted transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar scroll-smooth">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                                        msg.sender === 'user' 
                                            ? 'bg-primary text-white rounded-tr-sm' 
                                            : 'bg-surface-elevated border border-border/30 text-text-primary rounded-tl-sm'
                                    }`}>
                                        {renderMessageText(msg.text)}
                                        <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-text-muted'}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex justify-start">
                                     <div className="max-w-[70%] bg-surface-elevated border border-border/30 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-text-muted rounded-full" />
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-text-muted rounded-full" />
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-text-muted rounded-full" />
                                     </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 border-t border-border/50 bg-background/50">
                            {/* Predefined Questions (Scrollable horizontally) */}
                            {messages.length === 1 && (
                                <div className="flex overflow-x-auto gap-2 pb-3 custom-scrollbar snap-x">
                                    {MOCK_PREDEFINED_QUESTIONS.map((q, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => handleSend(q)}
                                            className="snap-start shrink-0 px-3 py-1.5 bg-surface border border-border/50 text-text-secondary hover:text-primary hover:border-primary/50 text-xs rounded-full transition-colors whitespace-nowrap"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="relative flex items-center gap-2">
                                <input 
                                    type="text" 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                                    placeholder="พิมพ์คำถามของคุณ..."
                                    className="flex-1 bg-surface border border-border/60 rounded-full px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                    maxLength={200}
                                />
                                <button 
                                    onClick={() => handleSend(inputValue)}
                                    disabled={!inputValue.trim() || isTyping}
                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shrink-0 shadow-md"
                                >
                                    <svg className="w-4 h-4 translate-x-px -translate-y-px" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
