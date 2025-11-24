import React, { useState, useEffect, useRef } from 'react';
import { MeditationTrack } from '../types';

const MEDITATION_TRACKS: MeditationTrack[] = [
    {
        id: 'breath',
        title: '基础呼吸',
        duration: '无限',
        steps: ['吸气', '呼气'] // Classic mode
    },
    {
        id: 'stress',
        title: '减压放松',
        duration: '3 分钟',
        steps: [
            "请找一个舒适的姿势坐下，轻轻闭上双眼。",
            "深呼吸，感受空气充满你的胸腔。",
            "缓缓吐气，带走身体里所有的紧张与疲惫。",
            "想象一道金色的光芒，从头顶温暖地流遍全身。",
            "你的肩膀放松了，眉心舒展了。",
            "放下所有的思绪，此刻只有当下的宁静。",
            "保持这种平静，慢慢睁开双眼。"
        ]
    },
    {
        id: 'compassion',
        title: '慈悲冥想',
        duration: '3 分钟',
        steps: [
            "安住于当下，感受心跳的律动。",
            "在心中默念：愿我内心平静，远离痛苦。",
            "想象一位你爱的人，愿他健康、快乐。",
            "将这份祝愿扩展到所有众生。",
            "愿世间万物，皆得安乐。",
            "感受慈悲的力量在心间流淌。",
            "带着这份爱，回归到当下的生活中。"
        ]
    }
];

interface ZenRoomProps {
  onClose: () => void;
}

const ZenRoom: React.FC<ZenRoomProps> = ({ onClose }) => {
  const [selectedTrack, setSelectedTrack] = useState<MeditationTrack | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [breathingText, setBreathingText] = useState('吸气');
  const [scale, setScale] = useState(1);
  
  // Ambient Sound State
  const [isPlayingAmbience, setIsPlayingAmbience] = useState(false);
  
  // Refs for timers and audio
  const stepTimerRef = useRef<number | null>(null);
  const breathTimerRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambienceNodesRef = useRef<{source: AudioBufferSourceNode, gain: GainNode} | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
        stopAmbience();
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
            audioCtxRef.current.close();
        }
        window.speechSynthesis.cancel();
        if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
        if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    };
  }, []);

  // Classic Breathing Animation Loop
  useEffect(() => {
    if ((!selectedTrack || selectedTrack.id === 'breath') && !stepTimerRef.current) {
        breathTimerRef.current = window.setInterval(() => {
            setBreathingText(prev => prev === '吸气' ? '呼气' : '吸气');
            setScale(prev => prev === 1 ? 1.5 : 1);
        }, 4000);
    }
    return () => {
        if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    };
  }, [selectedTrack]);

  // Guided Session Logic
  useEffect(() => {
    if (isSessionActive && selectedTrack && selectedTrack.id !== 'breath') {
        
        const playStep = (index: number) => {
            if (index >= selectedTrack.steps.length) {
                setIsSessionActive(false); // End
                return;
            }

            const text = selectedTrack.steps[index];
            
            // Speak
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'zh-CN';
            u.rate = 0.9;
            u.pitch = 0.8; // Lower pitch for calming effect
            window.speechSynthesis.speak(u);

            // Duration logic: roughly 8 seconds per step or based on speech length
            // Simple timeout for visual transition
            stepTimerRef.current = window.setTimeout(() => {
                setCurrentStepIndex(prev => prev + 1);
            }, 8000); 
        };

        playStep(currentStepIndex);
    } else {
        window.speechSynthesis.cancel();
        if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    }
  }, [isSessionActive, currentStepIndex, selectedTrack]);

  // --- Ambience Audio Logic (Web Audio API) ---
  const startAmbience = () => {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioContextClass();
      audioCtxRef.current = ctx;

      // Create Brown/Pink Noise buffer for a "Waterfall/Stream" effect
      const bufferSize = ctx.sampleRate * 2; // 2 seconds loop
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Brown noise integration
          lastOut = (lastOut + (0.02 * white)) / 1.02;
          data[i] = lastOut * 3.5; // Normalize roughly
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;
      
      // Lowpass filter to make it sound like water/distance
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0; // Start silent
      
      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      noiseSource.start();
      
      // Fade in
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 2);

      ambienceNodesRef.current = { source: noiseSource, gain: gainNode };
      setIsPlayingAmbience(true);
  };

  const stopAmbience = () => {
      if (ambienceNodesRef.current && audioCtxRef.current) {
          const { source, gain } = ambienceNodesRef.current;
          const ctx = audioCtxRef.current;
          
          // Fade out
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
          setTimeout(() => {
              source.stop();
              source.disconnect();
          }, 1000);
      }
      setIsPlayingAmbience(false);
  };

  const toggleAmbience = () => {
      if (isPlayingAmbience) {
          stopAmbience();
      } else {
          startAmbience();
      }
  };
  // --------------------------------------------

  const startSession = (track: MeditationTrack) => {
      setSelectedTrack(track);
      // Auto-start ambience for guided tracks if not already playing
      if (!isPlayingAmbience) {
          startAmbience();
      }

      if (track.id !== 'breath') {
          setCurrentStepIndex(0);
          setIsSessionActive(true);
          if (breathTimerRef.current) clearInterval(breathTimerRef.current);
      } else {
          setIsSessionActive(false);
      }
  };

  const stopSession = () => {
      setIsSessionActive(false);
      setSelectedTrack(null);
      setCurrentStepIndex(0);
      window.speechSynthesis.cancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950 text-white animate-fade-in overflow-hidden">
        
        {/* Background Ambience Element (Visual) */}
        <div className="absolute inset-0 pointer-events-none">
             <div className={`absolute inset-0 bg-teal-900/30 transition-opacity duration-1000 ${isPlayingAmbience ? 'opacity-100' : 'opacity-0'}`}></div>
             <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-800/20 via-transparent to-transparent animate-pulse`} style={{ animationDuration: '8s' }}></div>
        </div>

        {/* Close / Exit */}
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-30 text-white/70 hover:text-white transition-colors"
        >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        {/* Sound Toggle */}
        <button
            onClick={toggleAmbience}
            className={`absolute top-6 left-6 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all font-serif text-sm
                ${isPlayingAmbience ? 'bg-teal-500/30 border-teal-400 text-teal-100' : 'bg-transparent border-white/20 text-white/50 hover:bg-white/10'}
            `}
        >
            <span>{isPlayingAmbience ? '🎵 正在播放白噪音' : '🎵 播放白噪音'}</span>
        </button>

        <div className="flex flex-col items-center justify-center w-full h-full relative z-10">
            
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-calligraphy mb-8 opacity-80 absolute top-20">
                {isSessionActive ? selectedTrack?.title : '静心禅房'}
            </h2>
            
            {/* Main Visual Area */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-4 mt-20">
                
                {/* SELECTION MENU (When not active) */}
                {!selectedTrack && (
                    <div className="grid grid-cols-1 gap-4 w-full animate-fade-in">
                        <p className="text-center text-white/60 font-serif mb-4">请选择冥想课程</p>
                        {MEDITATION_TRACKS.map(track => (
                            <button
                                key={track.id}
                                onClick={() => startSession(track)}
                                className="bg-white/10 hover:bg-white/20 border border-white/20 p-4 rounded-xl text-left flex justify-between items-center transition-all hover:scale-[1.02] group"
                            >
                                <div>
                                    <h3 className="text-xl font-serif font-bold group-hover:text-teal-200 transition-colors">{track.title}</h3>
                                    <p className="text-sm text-teal-200/70">{track.duration}</p>
                                </div>
                                <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">▶</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* ACTIVE SESSION DISPLAY */}
                {selectedTrack && (
                    <div className="flex flex-col items-center animate-fade-in w-full">
                        {selectedTrack.id === 'breath' ? (
                            // Classic Breathing Circle
                            <div 
                                className="w-64 h-64 rounded-full border border-white/20 flex items-center justify-center relative transition-all duration-[4000ms] ease-in-out"
                                style={{ transform: `scale(${scale})` }}
                            >
                                <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl"></div>
                                <div className="text-3xl font-serif font-light tracking-widest">{breathingText}</div>
                            </div>
                        ) : (
                            // Guided Text Display
                            <div className="text-center max-w-sm h-64 flex items-center justify-center relative">
                                {/* Subtle glow pulse */}
                                <div className="absolute inset-0 bg-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
                                
                                <p className="text-2xl md:text-3xl font-serif leading-relaxed text-white/90 drop-shadow-lg transition-opacity duration-1000 ease-in-out px-4">
                                    {isSessionActive 
                                        ? selectedTrack.steps[currentStepIndex] 
                                        : "课程结束"
                                    }
                                </p>
                            </div>
                        )}

                        {/* Controls */}
                        <div className="mt-16 flex gap-6">
                            {isSessionActive || selectedTrack.id === 'breath' ? (
                                <button 
                                    onClick={stopSession}
                                    className="px-8 py-2 rounded-full border border-white/30 hover:bg-white/10 text-sm font-serif tracking-widest transition-colors"
                                >
                                    结束课程
                                </button>
                            ) : (
                                <button 
                                    onClick={stopSession} // Actually goes back to menu
                                    className="px-8 py-2 rounded-full bg-white/20 hover:bg-white/30 text-sm font-serif tracking-widest transition-colors"
                                >
                                    返回
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ZenRoom;