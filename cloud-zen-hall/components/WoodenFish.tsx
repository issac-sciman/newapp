import React, { useState, useEffect } from 'react';
import { MeritState } from '../types';

interface WoodenFishProps {
  onClose: () => void;
  meritState: MeritState;
  setMeritState: React.Dispatch<React.SetStateAction<MeritState>>;
}

const WoodenFish: React.FC<WoodenFishProps> = ({ onClose, meritState, setMeritState }) => {
  const [scale, setScale] = useState(1);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [popups, setPopups] = useState<{ id: number; text: string }[]>([]);

  const handleTap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Avoid double triggering on some devices
    e.stopPropagation();

    // Sound effect simulation (optional, browser policy might block auto audio, relying on visual)
    // In a real app, uses AudioContext. Here we focus on strong visual feedback.

    // 1. Increment Merit
    setMeritState(prev => ({
      count: prev.count + 1,
      lastMeritTime: Date.now()
    }));

    // 2. Animate Fish
    setScale(0.9);
    setTimeout(() => setScale(1), 100);

    // 3. Add Ripple & Popup text
    const id = Date.now();
    
    // Get coordinates relative to container or generic center
    setRipples(prev => [...prev, { id, x: 50, y: 50 }]); // Centered ripple
    setPopups(prev => [...prev, { id, text: '功德 +1' }]);

    // Cleanup animations
    setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
        setPopups(prev => prev.filter(p => p.id !== id));
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md h-full md:h-auto md:aspect-[3/4] bg-buddha-light md:rounded-3xl flex flex-col items-center justify-between p-8 overflow-hidden">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-buddha-deep hover:text-red-800 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        {/* Header */}
        <h2 className="text-3xl font-calligraphy text-buddha-deep mt-8">积攒功德</h2>
        <p className="text-buddha-text/60 font-serif mb-4">当前功德: {meritState.count}</p>

        {/* The Wooden Fish (Interactive Area) */}
        <div 
            className="relative w-64 h-64 flex items-center justify-center cursor-pointer select-none"
            onMouseDown={handleTap}
            onTouchStart={handleTap}
            style={{ transform: `scale(${scale})`, transition: 'transform 0.1s' }}
        >
            {/* Simple CSS Wooden Fish Representation using SVG */}
            <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-2xl filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
                {/* Fish Body */}
                <path d="M180,80 C180,120 140,150 100,150 C60,150 20,120 20,80 C20,40 60,10 100,10 C140,10 180,40 180,80 Z" fill="#8B4513" />
                <path d="M170,80 C170,110 135,140 100,140 C65,140 30,110 30,80 C30,50 65,20 100,20 C135,20 170,50 170,80 Z" fill="#A0522D" />
                {/* Mouth/Slit */}
                <path d="M40,80 Q100,60 160,80 Q100,100 40,80" fill="#3E2723" opacity="0.8" />
                {/* Mallet Hit Area (visual guide) */}
                <circle cx="100" cy="80" r="15" fill="#5D4037" opacity="0.2" />
            </svg>
            
            {/* Popups */}
            {popups.map(popup => (
                <div 
                    key={popup.id}
                    className="absolute top-0 text-2xl font-bold text-yellow-600 animate-[float_1s_ease-out_forwards]"
                    style={{ 
                        transform: 'translateY(-50px)',
                        opacity: 0
                    }}
                >
                    {popup.text}
                </div>
            ))}
        </div>

        <div className="mt-8 text-center font-serif text-buddha-text opacity-70">
            <p>点击木鱼，净化心灵</p>
            <p className="text-sm mt-2">诚心诚意，福报自来</p>
        </div>

      </div>
    </div>
  );
};

export default WoodenFish;