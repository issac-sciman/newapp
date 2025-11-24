import React, { useState, useEffect } from 'react';
import Avatar from './components/Avatar';
import ChatInterface from './components/ChatInterface';
import WoodenFish from './components/WoodenFish';
import ZenRoom from './components/ZenRoom';
import SutraLibrary from './components/SutraLibrary';
import { geminiService } from './services/geminiService';
import { Message, AppView, MeritState } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);
  const [meritState, setMeritState] = useState<MeritState>(() => {
    const saved = localStorage.getItem('meritState');
    return saved ? JSON.parse(saved) : { count: 0, lastMeritTime: 0 };
  });

  useEffect(() => {
    localStorage.setItem('meritState', JSON.stringify(meritState));
  }, [meritState]);

  const handleSendMessage = async (text: string) => {
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    const responseText = await geminiService.sendMessage(text);

    const newAiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newAiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="relative h-[100dvh] w-full flex flex-col bg-gradient-to-b from-buddha-light via-orange-50 to-amber-100 overflow-hidden text-buddha-text">
      
      {/* 1. Header Area (Top) */}
      <header className="absolute top-0 w-full p-4 flex justify-between items-center z-30 bg-gradient-to-b from-white/60 to-transparent">
        <h1 className="text-2xl font-calligraphy text-buddha-deep drop-shadow-sm">云端禅堂</h1>
        <div className="text-xs font-serif text-buddha-deep/70 bg-white/50 px-3 py-1 rounded-full border border-yellow-200">
           功德: {meritState.count}
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main className="flex-1 flex flex-col relative z-10 pt-16">
        
        {/* Avatar Section (Top Middle) */}
        <div className="flex-shrink-0 flex justify-center w-full min-h-[250px] transition-all duration-500 ease-in-out">
            <Avatar isTalking={isLoading} />
        </div>

        {/* Chat Section (Bottom Half) */}
        <div className="flex-1 w-full bg-white/40 backdrop-blur-sm rounded-t-[3rem] shadow-[0_-10px_40px_rgba(255,193,7,0.2)] border-t border-white/50 overflow-hidden flex flex-col">
            <ChatInterface 
                messages={messages} 
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
            />
        </div>
      </main>

      {/* 3. Floating Action Buttons (Bottom Right) */}
      <div className="absolute bottom-24 right-4 z-40 flex flex-col gap-3 items-end">
        
        {/* Sutra Library Button (New) */}
        <button 
            onClick={() => setCurrentView(AppView.SUTRA_LIBRARY)}
            className="group flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-700 text-white pl-4 pr-2 py-2 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-x-1"
        >
            <span className="font-serif text-sm">藏经阁</span>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">📜</span>
            </div>
        </button>

        {/* Zen Room Button */}
        <button 
            onClick={() => setCurrentView(AppView.ZEN_ROOM)}
            className="group flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-600 text-white pl-4 pr-2 py-2 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-x-1"
        >
            <span className="font-serif text-sm">禅房 · 冥想</span>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">🧘</span>
            </div>
        </button>

        {/* Merit/Prayer Button */}
        <button 
             onClick={() => setCurrentView(AppView.WOODEN_FISH)}
             className="group flex items-center justify-center gap-2 bg-buddha-deep hover:bg-yellow-900 text-white pl-4 pr-2 py-2 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-x-1"
        >
            <span className="font-serif text-sm">祈福 · 功德</span>
            <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/50">
                <span className="text-lg">🐟</span>
            </div>
        </button>
      </div>

      {/* 4. Overlays/Modals */}
      {currentView === AppView.WOODEN_FISH && (
        <WoodenFish 
            onClose={() => setCurrentView(AppView.CHAT)} 
            meritState={meritState}
            setMeritState={setMeritState}
        />
      )}

      {currentView === AppView.ZEN_ROOM && (
        <ZenRoom onClose={() => setCurrentView(AppView.CHAT)} />
      )}

      {currentView === AppView.SUTRA_LIBRARY && (
        <SutraLibrary onClose={() => setCurrentView(AppView.CHAT)} />
      )}

    </div>
  );
}

export default App;