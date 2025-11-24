import React, { useRef, useEffect, useState } from 'react';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto relative z-20">
      
      {/* Messages Area - Transparent with subtle gradient backdrop */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide pb-24 mask-image-linear-gradient">
        {messages.length === 0 && (
          <div className="text-center text-buddha-text/60 mt-10 font-serif italic animate-fade-in">
            <p>阿弥陀佛，施主有何心事，不妨道来。</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] px-5 py-3 rounded-2xl shadow-sm text-lg font-serif leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-buddha-deep text-white rounded-br-none' 
                  : 'bg-white/90 text-buddha-text border border-yellow-200 rounded-bl-none'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white/80 px-4 py-2 rounded-2xl rounded-bl-none text-buddha-text font-serif italic flex items-center gap-2">
              <span className="w-2 h-2 bg-buddha-amber rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-buddha-amber rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-buddha-amber rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-buddha-light via-buddha-light to-transparent">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center bg-white border-2 border-buddha-amber/30 p-2 rounded-full shadow-lg transition-transform focus-within:scale-[1.02]">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="请施主输入..."
            className="flex-1 bg-transparent px-4 py-2 outline-none text-buddha-deep font-serif placeholder-buddha-text/40"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="bg-gradient-to-r from-buddha-amber to-buddha-gold text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;