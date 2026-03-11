'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Mock Data for Shorts
interface ShortVideo {
  id: string;
  url: string; // Using placeholder shorts or external reliable URLs
  title: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  likes: number;
  comments: number;
  tags: string[];
}

const MOCK_SHORTS: ShortVideo[] = [
  {
    id: 's1',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
    title: 'สรุปการใช้งาน React "useOptimistic" ใน 1 นาที ⚡',
    author: {
      name: 'Khun Dev',
      avatar: '👨‍💻',
      role: 'Instructor'
    },
    likes: 1240,
    comments: 89,
    tags: ['#React19', '#Frontend', '#WebDev']
  },
  {
    id: 's2',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 
    title: '5 เคล็ดลับเขียน Tailwind CSS ให้โค้ดสะอาดขึ้น 🎨',
    author: {
      name: 'UI Master',
      avatar: '👩‍🎨',
      role: 'Instructor'
    },
    likes: 3400,
    comments: 120,
    tags: ['#TailwindCSS', '#CSS', '#Design']
  },
  {
    id: 's3',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    title: 'อธิบาย Server Actions ใน Next.js แบบง่ายๆ 🚀',
    author: {
      name: 'Next Ninja',
      avatar: '🥷',
      role: 'Admin'
    },
    likes: 890,
    comments: 45,
    tags: ['#NextJS', '#Backend', '#Fullstack']
  }
];

export function ShortsPage() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect which video is currently in view
  useEffect(() => {
    const options = {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 0.6, // Fire when 60% of the video is visible
    };

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
          setActiveVideoIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    const elements = document.querySelectorAll('.short-container');
    
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 h-[calc(100vh-68px)] flex flex-col items-center">
      
      {/* Header hidden on mobile, visible on desktop to explain the page */}
      <div className="hidden md:block text-center max-w-2xl mx-auto mb-6 relative z-10 shrink-0">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mb-2">
           <span className="gradient-text">Shorts</span> ทบทวนความรู้
        </h1>
        <p className="text-sm text-text-secondary">
          เลื่อนเพื่อดูคลิปสั้น แนะนำเทคนิคและทริคดีๆ ระหว่างรอคลาสเรียน
        </p>
      </div>

      {/* Vertical Scrolling Container */}
      <div 
        ref={containerRef}
        className="w-full max-w-[400px] h-[80vh] md:h-[70vh] bg-background snap-y snap-mandatory overflow-y-scroll scroll-smooth rounded-3xl border border-border/50 shadow-2xl relative scrollbar-hide"
      >
        {MOCK_SHORTS.map((short, index) => (
          <ShortPlayer 
            key={short.id} 
            index={index} 
            short={short} 
            isActive={index === activeVideoIndex} 
          />
        ))}
      </div>
      
    </div>
  );
}

// import motion inside here to prevent it from being removed by the first replacement

// Subcomponent: Individual Short Player
function ShortPlayer({ short, index, isActive }: { short: ShortVideo, index: number, isActive: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync playing state with active visibility
  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div 
        className="short-container w-full h-full snap-start snap-always relative bg-black flex items-center justify-center overflow-hidden"
        data-index={index}
    >
        {/* The Video Layer */}
        <div 
            className="absolute inset-0 w-full h-full cursor-pointer" 
            onClick={togglePlay}
        >
            <video
                ref={videoRef}
                src={short.url}
                loop
                muted // Autoplay policy requires mute initially
                playsInline
                className="w-full h-full object-cover scale-105"
            />
            {/* Play/Pause icon indicator (briefly flashes) */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: !isPlaying && isActive ? 1 : 0, scale: !isPlaying && isActive ? 1 : 0.5 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                <div className="w-20 h-20 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center">
                    <span className="text-white text-4xl ml-2">▶️</span>
                </div>
            </motion.div>
        </div>

        {/* Overlay Gradients to make text readable */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

        {/* Right Action Bar */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
            {/* Author Avatar */}
            <div className="relative group cursor-pointer">
                <div className="w-12 h-12 bg-white rounded-full border-2 border-white flex items-center justify-center text-2xl overflow-hidden shadow-lg">
                    {short.author.avatar}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-primary rounded-full border border-white flex items-center justify-center shadow-md">
                     <span className="text-[10px] text-white font-bold">+</span>
                </div>
            </div>

            {/* Like Button */}
            <button 
                onClick={() => setIsLiked(!isLiked)}
                className="flex flex-col items-center gap-1 group transition-transform active:scale-90"
            >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-3xl transition-colors ${isLiked ? 'text-primary drop-shadow-[0_0_8px_rgba(255,107,107,0.8)]' : 'text-white'}`}>
                    {isLiked ? '❤️' : '🤍'}
                </div>
                <span className="text-xs text-white font-medium drop-shadow-md">
                    {isLiked ? (short.likes + 1).toLocaleString() : short.likes.toLocaleString()}
                </span>
            </button>

            {/* Comment Button */}
            <button className="flex flex-col items-center gap-1 group transition-transform active:scale-90">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-3xl text-white">
                    💬
                </div>
                <span className="text-xs text-white font-medium drop-shadow-md">{short.comments}</span>
            </button>

             {/* Share Button */}
             <button className="flex flex-col items-center gap-1 group transition-transform active:scale-90">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-3xl text-white">
                    ↗️
                </div>
                <span className="text-xs text-white font-medium drop-shadow-md">แชร์</span>
            </button>
        </div>

        {/* Bottom Info Area */}
        <div className="absolute left-4 right-16 bottom-6 z-10 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
                 <h3 className="text-white text-lg font-bold drop-shadow-md leading-tight">
                    {short.title}
                 </h3>
            </div>
            
            <p className="text-white/90 text-sm font-medium drop-shadow-md flex items-center gap-2">
                <span>{short.author.name}</span>
                <span className="px-1.5 py-0.5 bg-white/20 rounded text-[10px] backdrop-blur-sm">
                    {short.author.role}
                </span>
            </p>

            <div className="flex flex-wrap gap-1.5 mt-1">
                {short.tags.map(tag => (
                    <span key={tag} className="text-white/80 text-xs font-semibold drop-shadow-md">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    </div>
  );
}
