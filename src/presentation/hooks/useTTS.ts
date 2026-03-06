"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface TTSOptions {
  voiceType: 'male' | 'female';
  rate: number;
  lang?: string;
}

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize and detect support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      // Load voices
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };
      
      loadVoices();
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
      
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  // Get Thai voice based on gender preference
  const getVoice = useCallback((voiceType: 'male' | 'female'): SpeechSynthesisVoice | null => {
    // Try to find Thai voice
    const thaiVoices = voices.filter(v => v.lang.includes('th'));
    
    if (thaiVoices.length > 0) {
      // Try to find matching gender
      const genderVoice = thaiVoices.find(v => 
        voiceType === 'female' 
          ? v.name.toLowerCase().includes('female') || v.name.includes('หญิง')
          : v.name.toLowerCase().includes('male') || v.name.includes('ชาย')
      );
      return genderVoice || thaiVoices[0];
    }
    
    // Fallback to any voice
    // For female: prefer higher pitch voices, for male: prefer lower
    const defaultVoice = voices.find(v => v.default) || voices[0];
    return defaultVoice;
  }, [voices]);

  // Speak text
  const speak = useCallback((text: string, options: TTSOptions): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isSupported) {
        reject(new Error('TTS not supported'));
        return;
      }

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Set voice
      const voice = getVoice(options.voiceType);
      if (voice) {
        utterance.voice = voice;
      }

      // Set rate and pitch
      utterance.rate = options.rate;
      utterance.pitch = options.voiceType === 'female' ? 1.1 : 0.9;
      utterance.lang = options.lang || 'th-TH';

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      utterance.onerror = (e) => {
        setIsSpeaking(false);
        reject(e);
      };

      speechSynthesis.speak(utterance);
    });
  }, [isSupported, getVoice]);

  // Stop speaking
  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  // Pause speaking
  const pause = useCallback(() => {
    if (isSupported) {
      speechSynthesis.pause();
    }
  }, [isSupported]);

  // Resume speaking
  const resume = useCallback(() => {
    if (isSupported) {
      speechSynthesis.resume();
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isSupported,
    voices,
  };
}
