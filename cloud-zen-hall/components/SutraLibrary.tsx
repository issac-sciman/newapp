import React, { useState, useRef, useEffect } from 'react';
import { Sutra } from '../types';

// Sample Data
const SUTRAS: Sutra[] = [
  {
    id: 'heart',
    title: '般若波罗蜜多心经',
    intro: '《心经》是大乘佛教中最短、最著名的经典，浓缩了般若智慧的精华。常诵此经可除一切苦，得大自在。',
    content: `观自在菩萨，行深般若波罗蜜多时，照见五蕴皆空，度一切苦厄。
    
舍利子，色不异空，空不异色，色即是空，空即是色，受想行识，亦复如是。

舍利子，是诸法空相，不生不灭，不垢不净，不增不减。

是故空中无色，无受想行识，无眼耳鼻舌身意，无色声香味触法，无眼界，乃至无意识界。

无无明，亦无无明尽，乃至无老死，亦无老死尽。

无苦集灭道，无智亦无得。

以无所得故，菩提萨埵，依般若波罗蜜多故，心无挂碍，无挂碍故，无有恐怖，远离颠倒梦想，究竟涅槃。

三世诸佛，依般若波罗蜜多故，得阿耨多罗三藐三菩提。

故知般若波罗蜜多，是大神咒，是大明咒，是无上咒，是无等等咒，能除一切苦，真实不虚。

故说般若波罗蜜多咒，即说咒曰：揭谛揭谛，波罗揭谛，波罗僧揭谛，菩提萨婆诃。`
  },
  {
    id: 'diamond',
    title: '金刚经 (选段)',
    intro: '《金刚经》主要讲述“无相”的智慧，破除一切执着。',
    content: `如是我闻。一时，佛在舍卫国祗树给孤独园，与大比丘众千二百五十人俱。

尔时，世尊食时，著衣持钵，入舍卫大城乞食。于其城中，次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。

...

佛告须菩提：“凡所有相，皆是虚妄。若见诸相非相，即见如来。”

...

“须菩提！于意云何？可以身相见如来不？”
“不也，世尊！不可以身相得见如来。何以故？如来所说身相，即非身相。”
佛告须菩提：“凡所有相，皆是虚妄。若见诸相非相，即见如来。”`
  }
];

interface SutraLibraryProps {
  onClose: () => void;
}

const SutraLibrary: React.FC<SutraLibraryProps> = ({ onClose }) => {
  const [selectedSutra, setSelectedSutra] = useState<Sutra | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Auto-scroll Logic
  useEffect(() => {
    let scrollInterval: number;
    if (isAutoScrolling && scrollRef.current) {
      scrollInterval = window.setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop += 1;
          // Stop if reached bottom
          if (scrollRef.current.scrollTop + scrollRef.current.clientHeight >= scrollRef.current.scrollHeight) {
            setIsAutoScrolling(false);
          }
        }
      }, 50); // Adjust speed here
    }
    return () => clearInterval(scrollInterval);
  }, [isAutoScrolling]);

  // Audio Logic
  const toggleAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      if (selectedSutra) {
        const u = new SpeechSynthesisUtterance(selectedSutra.content);
        u.lang = 'zh-CN';
        u.rate = 0.8; // Slower pace for sutras
        u.onend = () => setIsPlayingAudio(false);
        utteranceRef.current = u;
        window.speechSynthesis.speak(u);
        setIsPlayingAudio(true);
      }
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-buddha-deep/95 backdrop-blur-md animate-fade-in text-buddha-light">
      <div className="relative w-full max-w-3xl h-[90vh] flex flex-col md:flex-row bg-buddha-light rounded-xl overflow-hidden shadow-2xl">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-buddha-deep md:text-buddha-text hover:text-red-600 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        {/* Sidebar List */}
        <div className={`w-full md:w-1/3 bg-orange-50 border-r border-amber-200 flex flex-col ${selectedSutra ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-6 bg-amber-100/50">
                <h2 className="text-2xl font-calligraphy text-buddha-deep">藏经阁</h2>
                <p className="text-xs text-buddha-deep/60 mt-2 font-serif">深入经藏，智慧如海</p>
            </div>
            <div className="flex-1 overflow-y-auto">
                {SUTRAS.map(sutra => (
                    <button
                        key={sutra.id}
                        onClick={() => {
                            setSelectedSutra(sutra);
                            setIsAutoScrolling(false);
                            window.speechSynthesis.cancel();
                            setIsPlayingAudio(false);
                        }}
                        className={`w-full text-left p-4 border-b border-amber-100 hover:bg-amber-100 transition-colors
                            ${selectedSutra?.id === sutra.id ? 'bg-amber-200 border-l-4 border-l-buddha-deep' : ''}
                        `}
                    >
                        <h3 className="font-serif text-buddha-deep font-bold">{sutra.title}</h3>
                        <p className="text-xs text-buddha-deep/60 mt-1 truncate">{sutra.intro}</p>
                    </button>
                ))}
            </div>
        </div>

        {/* Content Area */}
        <div className={`w-full md:w-2/3 bg-white relative flex flex-col ${!selectedSutra ? 'hidden md:flex' : 'flex'}`}>
            {selectedSutra ? (
                <>
                    {/* Mobile Back Button */}
                    <div className="md:hidden p-4 border-b border-amber-100 flex items-center text-buddha-deep">
                        <button onClick={() => setSelectedSutra(null)} className="flex items-center gap-1 font-serif text-sm">
                            ← 返回经录
                        </button>
                    </div>

                    {/* Toolbar */}
                    <div className="p-4 border-b border-amber-100 flex justify-between items-center bg-amber-50/30">
                        <h2 className="text-xl font-calligraphy text-buddha-deep">{selectedSutra.title}</h2>
                        <div className="flex gap-2">
                            <button 
                                onClick={toggleAudio}
                                className={`p-2 rounded-full transition-all ${isPlayingAudio ? 'bg-amber-200 text-buddha-deep animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-amber-100'}`}
                                title="诵读"
                            >
                                🔈
                            </button>
                            <button 
                                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                                className={`px-3 py-1 rounded-full text-xs font-serif border transition-all
                                    ${isAutoScrolling ? 'bg-buddha-deep text-white border-buddha-deep' : 'bg-transparent text-buddha-deep border-buddha-deep hover:bg-amber-100'}
                                `}
                            >
                                {isAutoScrolling ? '⏸ 停止跟读' : '▶ 自动跟读'}
                            </button>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-8 scroll-smooth relative"
                    >
                        <div className="max-w-xl mx-auto">
                            <div className="mb-8 p-4 bg-amber-50 rounded-lg border border-amber-100">
                                <h4 className="font-bold text-buddha-deep mb-2 text-sm">【经典简介】</h4>
                                <p className="text-sm text-buddha-text/80 leading-relaxed font-serif">{selectedSutra.intro}</p>
                            </div>
                            
                            <article className="text-lg md:text-xl leading-loose text-buddha-text font-serif whitespace-pre-wrap tracking-wider text-justify">
                                {selectedSutra.content}
                            </article>
                            
                            <div className="h-32"></div> {/* Spacer */}
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center flex-col text-buddha-deep/30">
                    <span className="text-6xl mb-4">📖</span>
                    <p className="font-serif">请选择一部佛经开始修习</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SutraLibrary;