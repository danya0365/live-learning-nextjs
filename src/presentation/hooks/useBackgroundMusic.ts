"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Lo-fi music URLs (royalty-free)
const MUSIC_TRACKS = [
  "/audio/lofi-study-1.mp3", // Will need to add these files
];

export function useBackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.3);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audio.loop = true;
      audio.volume = volume;
      
      // Try to load music, if not available use silent fallback
      audio.src = MUSIC_TRACKS[0];
      
      audio.oncanplaythrough = () => setIsLoaded(true);
      audio.onerror = () => {
        console.log('Background music not available');
        setIsLoaded(false);
      };
      
      audioRef.current = audio;

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = useCallback(() => {
    if (audioRef.current && isLoaded) {
      audioRef.current.play().catch(e => {
        console.log('Audio play failed:', e);
      });
      setIsPlaying(true);
    }
  }, [isLoaded]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const setVolume = useCallback((vol: number) => {
    const clampedVol = Math.min(1, Math.max(0, vol));
    setVolumeState(clampedVol);
    if (audioRef.current) {
      audioRef.current.volume = clampedVol;
    }
  }, []);

  // Fade out when TTS is speaking
  const fadeOut = useCallback((duration = 500) => {
    if (!audioRef.current) return;
    
    const startVolume = audioRef.current.volume;
    const step = startVolume / (duration / 50);
    
    const fade = setInterval(() => {
      if (audioRef.current && audioRef.current.volume > step) {
        audioRef.current.volume -= step;
      } else {
        if (audioRef.current) audioRef.current.volume = 0;
        clearInterval(fade);
      }
    }, 50);
  }, []);

  // Fade in when TTS stops
  const fadeIn = useCallback((targetVolume: number, duration = 500) => {
    if (!audioRef.current) return;
    
    const step = targetVolume / (duration / 50);
    
    const fade = setInterval(() => {
      if (audioRef.current && audioRef.current.volume < targetVolume - step) {
        audioRef.current.volume += step;
      } else {
        if (audioRef.current) audioRef.current.volume = targetVolume;
        clearInterval(fade);
      }
    }, 50);
  }, []);

  return {
    play,
    pause,
    toggle,
    setVolume,
    fadeOut,
    fadeIn,
    isPlaying,
    isLoaded,
    volume,
  };
}
