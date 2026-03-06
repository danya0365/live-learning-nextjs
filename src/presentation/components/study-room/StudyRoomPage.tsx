'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const MODE_TIMES = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const MOCK_PARTICIPANTS = [
    { id: 1, name: 'Min', avatar: '👩‍🎓', status: 'Focusing', color: 'bg-blue-500' },
    { id: 2, name: 'John Doe', avatar: '👨‍💻', status: 'Reading', color: 'bg-green-500' },
    { id: 3, name: 'Alice', avatar: '👩‍🏫', status: 'On Break', color: 'bg-yellow-500' },
    { id: 4, name: 'Bob', avatar: '👨‍🎓', status: 'Focusing', color: 'bg-purple-500' },
    { id: 5, name: 'Charlie', avatar: '🧑‍💻', status: 'Focusing', color: 'bg-pink-500' },
];

export function StudyRoomPage() {
    return (
        <div className="min-h-[calc(100vh-68px)] bg-background relative overflow-hidden flex flex-col">
            
            {/* Ambient Animated Background (Subtle) */}
            <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
            </div>

            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col lg:flex-row gap-8 relative z-10">
                
                {/* Left Column: Timer & Controls */}
                <div className="w-full lg:w-7/12 flex flex-col justify-center items-center lg:items-start gap-8">
                    
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-2">
                            Virtual <span className="gradient-text">Study Room</span>
                        </h1>
                        <p className="text-lg text-text-secondary">
                            พื้นที่สำหรับโฟกัสและอ่านหนังสือร่วมกับเพื่อนๆ โดยใช้เทคนิค Pomodoro
                        </p>
                    </div>

                    <PomodoroTimer />

                    {/* Ambient Sound Toggles (Mock) */}
                    <div className="w-full max-w-md bg-surface/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                            <span>🎧</span> เสียงพื้นหลัง (Ambient Sounds)
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <SoundToggle icon="🌧️" label="ฝนตก (Rain)" defaultActive={false} />
                            <SoundToggle icon="☕" label="ร้านกาแฟ (Cafe)" defaultActive={true} />
                            <SoundToggle icon="🔥" label="กองไฟ (Fire)" defaultActive={false} />
                            <SoundToggle icon="🎹" label="Lofi Beats" defaultActive={false} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Participants Grid */}
                <div className="w-full lg:w-5/12 flex flex-col gap-6">
                    <div className="bg-surface/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-xl flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                                <span>👥</span> ผู้เข้าร่วมตอนนี้
                            </h3>
                            <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-bold ring-1 ring-success/30 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                {MOCK_PARTICIPANTS.length + 12} คน กำลังออนไลน์
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-max overflow-y-auto pr-2 custom-scrollbar">
                            {MOCK_PARTICIPANTS.map(p => (
                                <ParticipantCard key={p.id} participant={p} />
                            ))}
                            
                            {/* Empty/Invite Slots */}
                             <div className="aspect-square bg-surface border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center text-text-muted hover:text-text-primary hover:border-primary/50 transition-colors cursor-pointer group">
                                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">➕</span>
                                <span className="text-xs font-medium">ชวนเพื่อน</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Subcomponent: Pomodoro
function PomodoroTimer() {
    const [mode, setMode] = useState<TimerMode>('pomodoro');
    const [timeLeft, setTimeLeft] = useState(MODE_TIMES.pomodoro);
    const [isActive, setIsActive] = useState(false);
    
    // Derived values for ring
    const totalTime = MODE_TIMES[mode];
    const percentage = ((totalTime - timeLeft) / totalTime) * 100;
    
    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Play sound mock
            alert("หมดเวลาแล้ว!");
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleModeChange = (newMode: TimerMode) => {
        setMode(newMode);
        setTimeLeft(MODE_TIMES[newMode]);
        setIsActive(false);
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(MODE_TIMES[mode]);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-md bg-surface/80 backdrop-blur-2xl border border-border/60 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
            
            {/* Subtle glow behind timer based on mode */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] -z-10 transition-colors duration-1000 ${
                mode === 'pomodoro' ? 'bg-error/20' : 
                mode === 'shortBreak' ? 'bg-success/20' : 
                'bg-blue-500/20'
            }`} />

            {/* Mode Selectors */}
            <div className="flex justify-center gap-2 mb-8 bg-surface-elevated p-1.5 rounded-2xl border border-border/50">
                <TimerModeBtn 
                    active={mode === 'pomodoro'} 
                    onClick={() => handleModeChange('pomodoro')}
                    colorClass="text-error"
                >
                    🍅 Focus
                </TimerModeBtn>
                <TimerModeBtn 
                    active={mode === 'shortBreak'} 
                    onClick={() => handleModeChange('shortBreak')}
                    colorClass="text-success"
                >
                    ☕ Short Break
                </TimerModeBtn>
                 <TimerModeBtn 
                    active={mode === 'longBreak'} 
                    onClick={() => handleModeChange('longBreak')}
                    colorClass="text-blue-500"
                >
                    🧘 Long Break
                </TimerModeBtn>
            </div>

            {/* Circular Timer Display */}
            <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
                {/* SVG Ring Progress */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                    {/* Background Ring */}
                    <circle 
                        cx="50" cy="50" r="46" 
                        fill="none" 
                        className="stroke-border/40" 
                        strokeWidth="2" 
                    />
                    {/* Progress Ring */}
                    <motion.circle 
                        cx="50" cy="50" r="46" 
                        fill="none" 
                        className={`transition-colors duration-500 ${
                            mode === 'pomodoro' ? 'stroke-error' : 
                            mode === 'shortBreak' ? 'stroke-success' : 
                            'stroke-blue-500'
                        }`} 
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "289", strokeDashoffset: "289" }}
                        animate={{ strokeDashoffset: 289 - (289 * percentage) / 100 }}
                        transition={{ duration: 0.5, ease: "linear" }}
                    />
                </svg>

                <div className="text-center relative z-10 font-mono">
                    <div className="text-6xl font-black text-text-primary tracking-tighter drop-shadow-sm">
                        {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm font-medium text-text-muted mt-2 tracking-widest uppercase">
                        {mode === 'pomodoro' ? 'Stay Focused' : 'Take a breath'}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
                <button 
                    onClick={resetTimer}
                    className="w-12 h-12 rounded-full border border-border/50 bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
                <button 
                    onClick={toggleTimer}
                    className={`px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all w-48 ${
                        isActive 
                            ? 'bg-surface border border-border text-text-primary' 
                            : 'bg-text-primary text-background'
                    }`}
                >
                    {isActive ? 'Pause' : 'Start'}
                </button>
            </div>
        </div>
    );
}

function TimerModeBtn({ active, onClick, children, colorClass }: { active: boolean, onClick: () => void, children: React.ReactNode, colorClass: string }) {
    return (
        <button 
            onClick={onClick}
            className={`flex-1 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all relative ${
                active ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary hover:bg-surface/50'
            }`}
        >
            {active && (
                <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-surface rounded-xl border border-border/50 shadow-sm -z-10"
                />
            )}
            <span className={`relative z-10 ${active ? colorClass : ''}`}>
                {children}
            </span>
        </button>
    );
}

// Subcomponent: Sound Toggle Mock
function SoundToggle({ icon, label, defaultActive }: { icon: string, label: string, defaultActive: boolean }) {
    const [active, setActive] = useState(defaultActive);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    return (
        <button 
            onClick={() => setActive(!active)}
            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 ${
                active 
                    ? 'bg-primary/10 border-primary/30 shadow-inner' 
                    : 'bg-surface border-border/50 hover:bg-surface-elevated hover:border-border'
            }`}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-transform ${active ? 'scale-110' : ''} ${
                active ? 'bg-primary/20 text-primary' : 'bg-surface-elevated text-text-secondary grayscale'
            }`}>
                {icon}
            </div>
            <div className="flex-1 text-left">
                <p className={`text-sm font-bold ${active ? 'text-primary' : 'text-text-secondary'}`}>{label}</p>
                <div className="w-full h-1 bg-surface-elevated rounded-full mt-1.5 overflow-hidden">
                    {active && <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} className="h-full bg-primary rounded-full" />}
                </div>
            </div>
        </button>
    );
}

// Subcomponent: Participant Card
function ParticipantCard({ participant }: { participant: any }) {
    return (
        <div className="aspect-square relative rounded-2xl border border-border/50 overflow-hidden bg-surface group hover:-translate-y-1 transition-transform duration-300">
            {/* Background Color Indicator */}
            <div className={`absolute inset-x-0 top-0 h-1/2 ${participant.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                <div className="relative mb-2">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-3xl shadow-md border-2 border-white relative z-10">
                        {participant.avatar}
                    </div>
                </div>
                <h4 className="text-sm font-bold text-text-primary text-center truncate w-full">{participant.name}</h4>
                <p className="text-[10px] font-medium text-text-muted mt-0.5 px-2 py-0.5 bg-background rounded-full border border-border/30">
                    {participant.status}
                </p>
            </div>
        </div>
    );
}
