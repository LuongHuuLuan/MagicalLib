'use client';

import { useState } from 'react';
import { audioSystem } from '@/lib/audio';
import { Sparkles } from 'lucide-react';
import gsap from 'gsap';

interface StartOverlayProps {
  onStart: () => void;
}

export default function StartOverlay({ onStart }: StartOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleStart = () => {
    gsap.to('.start-overlay', { 
      opacity: 0, 
      duration: 1.5, 
      ease: 'power2.inOut',
      onComplete: () => {
        setIsVisible(false);
        onStart();
        audioSystem.playBGM();
      }
    });
  };

  if (!isVisible) return null;

  return (
    <div className="start-overlay fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-serif italic text-white glow-text tracking-tighter">
            Thư Viện Huyền Bí
          </h1>
          <p className="text-amber-200/60 font-serif tracking-[0.3em] uppercase text-xs">
            Thư viện của những chiếc lá thì thầm
          </p>
        </div>

        <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto" />

        <button 
          onClick={handleStart}
          className="group relative px-12 py-4 bg-transparent transition-all duration-500 hover:scale-105"
        >
          {/* Arcane Button Styles */}
          <div className="absolute inset-0 border border-amber-500/30 rounded-full group-hover:border-amber-400/80 transition-colors" />
          <div className="absolute -inset-1 border border-green-500/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <span className="relative z-10 text-amber-100 font-serif text-lg tracking-widest flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            ĐÁNH THỨC KHU RỪNG
          </span>
        </button>

        <p className="text-amber-200/20 text-[10px] font-serif uppercase tracking-[0.2em] mt-12">
          Những rễ cây cổ thụ đang chờ nhịp đập của bạn
        </p>
      </div>

      {/* Decorative corners */}
      <div className="fixed top-8 left-8 border-t border-l border-blue-500/20 w-12 h-12" />
      <div className="fixed top-8 right-8 border-t border-r border-blue-500/20 w-12 h-12" />
      <div className="fixed bottom-8 left-8 border-b border-l border-blue-500/20 w-12 h-12" />
      <div className="fixed bottom-8 right-8 border-b border-r border-blue-500/20 w-12 h-12" />
    </div>
  );
}
