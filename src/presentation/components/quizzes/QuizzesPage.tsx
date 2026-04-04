'use client';

import { ArrowLeft, ArrowRight } from "lucide-react";
import { a, useSpring } from '@react-spring/web';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

// Mock Data
interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface Deck {
  id: string;
  title: string;
  description: string;
  icon: string;
  cardCount: number;
  color: string;
  cards: Flashcard[];
}

const MOCK_DECKS: Deck[] = [
  {
    id: 'deck-1',
    title: 'React Hooks Mastery',
    description: 'ทดสอบความรู้เกี่ยวกับ React Hooks ตัวสำคัญๆ',
    icon: '⚛️',
    cardCount: 5,
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    cards: [
      { id: 'c1', front: 'useState ใช้ทำอะไร?', back: 'ใช้สำหรับเก็บและจัดการ State ภายใน Functional Component' },
      { id: 'c2', front: 'useEffect ทำงานตอนไหนบ้าง?', back: 'ทำงานหลังจาก Component ถูก Render เสร็จ (Mount, Update, Unmount) ขึ้นอยู่กับ Dependency Array' },
      { id: 'c3', front: 'useMemo กับ useCallback ต่างกันอย่างไร?', back: 'useMemo คืนค่าตัวแปรที่ถูกคำนวณแล้ว (Memorized Value) ส่วน useCallback คืนค่าฟังก์ชัน (Memorized Callback)' },
      { id: 'c4', front: 'Custom Hook คืออะไร?', back: 'ฟังก์ชัน JavaScript ธรรมดาที่ชื่อขึ้นต้นด้วย "use" และเรียกใช้ Hooks ตัวอื่นๆ ข้างในได้' },
      { id: 'c5', front: 'useRef ใช้ทำอะไรได้บ้าง?', back: 'ใช้เข้าถึง DOM Element โดยตรง และใช้เก็บค่าที่ไม่ทำให้เกิดการ Re-render เมื่อค่าเปลี่ยน' },
    ]
  },
  {
    id: 'deck-2',
    title: 'CSS Flexbox & Grid',
    description: 'ทบทวนเรื่องการจัด Layout ด้วย CSS',
    icon: '🎨',
    cardCount: 4,
    color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
    cards: [
      { id: 'c6', front: 'justify-content ควบคุมแกนไหนใน Flexbox?', back: 'แกนหลัก (Main Axis) เช่น แนวนอน ถ้ายึดตาม flex-row เริ่มต้น' },
      { id: 'c7', front: 'align-items ควบคุมแกนไหนใน Flexbox?', back: 'แกนรอง (Cross Axis) เช่น แนวตั้ง ถ้ายึดตาม flex-row เริ่มต้น' },
      { id: 'c8', front: 'Grid ต่างจาก Flexbox อย่างไร?', back: 'Grid เป็น 2 มิติ (แถวและคอลัมน์) แต่ Flexbox เป็น 1 มิติ (แถวหรือคอลัมน์)' },
      { id: 'c9', front: 'grid-template-columns: repeat(3, 1fr) หมายความว่าอะไร?', back: 'สร้างคอลัมน์ 3 คอลัมน์ โดยแต่ละคอลัมน์กว้างเท่าๆ กัน (1 fraction)' },
    ]
  },
  {
    id: 'deck-3',
    title: 'JavaScript ES6+',
    description: 'ทบทวน Syntax ใหม่ๆ ใน JavaScript',
    icon: '🟨',
    cardCount: 3,
    color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
    cards: [
      { id: 'c10', front: 'let กับ var ต่างกันอย่างไร?', back: 'let มี Scope แบบ Block-level (ในวงเล็บ {}) ส่วน var มี Scope แบบ Function-level' },
      { id: 'c11', front: 'Destructuring Assignment คืออะไร?', back: 'คือการแกะค่าจาก Array หรือ Object ออกมาใส่ตัวแปรย่อยๆ ได้อย่างกระชับ เช่น const { name } = user' },
      { id: 'c12', front: 'Promise มีกี่สถานะ?', back: '3 สถานะ: Pending (กำลังทำงาน), Fulfilled (สำเร็จ), และ Rejected (ล้มเหลว)' },
    ]
  }
];

export function QuizzesPage() {
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 min-h-[80vh]">
      
      {/* Header */}
      {!activeDeck && (
         <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20 backdrop-blur-md">
            <span className="animate-pulse">🧠</span>
            <span>Brain Teasers</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-4">
            ลานประลอง <span className="gradient-text">ความรู้</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary">
            ลับสมองของคุณด้วย Flashcards และ Quizzes สนุกๆ ก่อนเข้าห้องเรียนจริง
          </p>
        </div>
      )}

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {!activeDeck ? (
          // Deck Selection View
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
          >
            {MOCK_DECKS.map((deck) => (
              <button
                key={deck.id}
                onClick={() => setActiveDeck(deck)}
                className={`group relative flex flex-col p-6 rounded-3xl border bg-surface/30 backdrop-blur-sm hover:bg-surface/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden text-left ${deck.color}`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${deck.color} rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-surface/80 border border-border/50 shadow-sm flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    {deck.icon}
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-elevated border border-border/50 rounded-full text-xs font-bold text-text-primary backdrop-blur-md">
                    <span>📇</span>
                    <span>{deck.cardCount} การ์ด</span>
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-text-primary mb-2 relative z-10 group-hover:text-primary transition-colors">
                  {deck.title}
                </h3>
                
                <p className="text-text-secondary text-sm relative z-10">
                  {deck.description}
                </p>

                 <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </button>
            ))}
          </motion.div>
        ) : (
          // Flashcard View
          <motion.div 
            key="flashcards"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto"
          >
            <FlashcardPlayer 
              deck={activeDeck} 
              onClose={() => setActiveDeck(null)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponent: Flashcard Player
function FlashcardPlayer({ deck, onClose }: { deck: Deck, onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const currentCard = deck.cards[currentIndex];

  // React Spring for Flip Animation
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(1000px) rotateX(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  const nextCard = () => {
    setFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % deck.cards.length);
    }, 200); // Wait for unflip
  };

  const prevCard = () => {
     setFlipped(false);
     setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + deck.cards.length) % deck.cards.length);
     }, 200);
  };

  return (
    <div className="relative">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onClose}
          className="p-2 px-4 rounded-xl bg-surface/50 hover:bg-surface border border-border/50 text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2.5 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-bold">กลับไปเลือกการ์ด</span>
        </button>
        <div className="text-center">
            <h2 className="text-xl font-bold text-text-primary">{deck.title}</h2>
            <p className="text-xs text-text-muted font-medium mt-1">
                 การ์ดที่ {currentIndex + 1} จาก {deck.cardCount}
            </p>
        </div>
        <div className="w-[110px]" /> {/* Spacer for centering */}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-surface rounded-full mb-8 overflow-hidden border border-border/30 shadow-inner">
        <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / deck.cardCount) * 100}%` }}
        />
      </div>

      {/* The Flashcard */}
      <div 
        className="relative w-full aspect-[4/3] md:aspect-video cursor-pointer group"
        onClick={() => setFlipped(state => !state)}
      >
        {/* FRONT */}
        <a.div
          className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 md:p-12 bg-surface backdrop-blur-xl border border-border/60 rounded-3xl shadow-2xl"
          style={{ opacity: opacity.to(o => 1 - o), transform }}
        >
            <span className="absolute top-6 left-6 text-sm font-bold text-primary/70 tracking-widest uppercase">Question</span>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            
            <h3 className="text-2xl md:text-4xl text-center font-bold text-text-primary mb-4 relative z-10 leading-snug">
              {currentCard.front}
            </h3>
            
            <span className="absolute bottom-6 text-sm text-text-muted font-medium opacity-50 group-hover:opacity-100 transition-opacity">
               แตะเพื่อดูคำตอบ 👆
            </span>
        </a.div>

        {/* BACK */}
        <a.div
          className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 md:p-12 bg-gradient-to-br from-primary/10 to-secondary/5 backdrop-blur-xl border border-primary/20 rounded-3xl shadow-2xl"
          style={{
            opacity,
            transform: transform.to(t => `${t} rotateX(180deg)`),
          }}
        >
            <span className="absolute top-6 left-6 text-sm font-bold text-primary tracking-widest uppercase">Answer</span>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
            
            <p className="text-xl md:text-3xl text-center font-bold text-text-primary whitespace-pre-wrap relative z-10 leading-relaxed">
              {currentCard.back}
            </p>
        </a.div>
      </div>

      {/* Navigation Controls */}
    <div className="flex items-center justify-center gap-4 mt-8">
        <button 
           onClick={prevCard}
           className="w-14 h-14 rounded-2xl bg-surface border border-border hover:bg-surface-elevated hover:border-primary/50 transition-all flex items-center justify-center text-text-secondary hover:text-primary active:scale-95 group"
           aria-label="การ์ดก่อนหน้า"
        >
            <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
        </button>
        <button className="px-8 py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black tracking-wide shadow-lg shadow-primary/25 transition-all active:scale-95" onClick={() => setFlipped(!flipped)}>
            {flipped ? 'ซ่อนคำตอบ' : 'ดูคำตอบ'}
        </button>
        <button 
           onClick={nextCard}
           className="w-14 h-14 rounded-2xl bg-surface border border-border hover:bg-surface-elevated hover:border-primary/50 transition-all flex items-center justify-center text-text-secondary hover:text-primary active:scale-95 group"
           aria-label="การ์ดถัดไป"
        >
            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
