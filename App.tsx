import React, { useState, useEffect, useCallback } from 'react';
import SmokeBackground from './components/SmokeBackground';
import QuoteDisplay from './components/QuoteDisplay';
import EmberBurst from './components/EmberBurst';
import { quotesData } from './data';
import { Quote } from './types';
import { GoogleGenAI } from '@google/genai';

const App: React.FC = () => {
  const [initialIndex] = useState(() => Math.floor(Math.random() * quotesData.length));
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(quotesData[initialIndex]);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [lastIndex, setLastIndex] = useState(initialIndex);
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const triggerNewQuote = useCallback(() => {
    if (isAnimating || isSearchLoading) return;
    
    setIsAnimating(true);
    setIsVisible(false);

    setTimeout(() => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * quotesData.length);
      } while (randomIndex === lastIndex && quotesData.length > 1);

      setLastIndex(randomIndex);
      setCurrentQuote(quotesData[randomIndex]);
      setIsVisible(true);
      setBurstTrigger(prev => prev + 1);

      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }, 800);
  }, [isAnimating, isSearchLoading, lastIndex]);

  const searchAIQuote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSearchLoading || isAnimating) return;

    setIsSearchLoading(true);
    setIsVisible(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Najdi jeden unikátní a drsný citát Charlese Bukowského v češtině. Preferuj kratší a údernější citáty (do 150 znaků). Výsledek vrať přesně ve formátu 'Citát | Zdroj | Rok'. Nepoužívej uvozovky v textu citátu.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .filter(chunk => chunk.web)
        .map(chunk => ({
          title: chunk.web?.title || 'Zdroj',
          uri: chunk.web?.uri || '#'
        }));

      // Basic parsing of "Text | Source | Year"
      const parts = text.split('|').map(p => p.trim());
      const aiQuote: Quote = {
        text: parts[0] || "Někdy prostě jen zíráte do zdi a zeď zírá na vás. A oba víte, že má pravdu.",
        source: parts[1] || "Z hlubin webu",
        year: parts[2] || "Dnes",
        isAI: true,
        sources: sources.length > 0 ? sources : undefined
      };

      setCurrentQuote(aiQuote);
      setIsVisible(true);
      setBurstTrigger(prev => prev + 1);
    } catch (error) {
      console.error("AI Search failed", error);
      const randomIndex = Math.floor(Math.random() * quotesData.length);
      setCurrentQuote(quotesData[randomIndex]);
      setIsVisible(true);
    } finally {
      setIsSearchLoading(false);
      setIsAnimating(false);
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    setMousePos({ x: clientX / window.innerWidth, y: clientY / window.innerHeight });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        triggerNewQuote();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerNewQuote]);

  return (
    <div 
      className="relative w-full h-screen bg-bukowski-bg text-bukowski-text flex flex-col justify-center items-center overflow-hidden cursor-pointer select-none touch-manipulation"
      onClick={triggerNewQuote}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      style={{ touchAction: 'manipulation' }}
    >
      <SmokeBackground 
        parallaxX={mousePos.x} 
        parallaxY={mousePos.y} 
        isSearching={isSearchLoading}
      />
      <EmberBurst trigger={burstTrigger} />
      
      {isSearchLoading ? (
        <div className="z-20 font-oswald text-lg sm:text-xl uppercase tracking-[0.3em] text-white/40 animate-pulse px-4 text-center">
          Hledám v zapomnění...
        </div>
      ) : (
        <QuoteDisplay quote={currentQuote} isVisible={isVisible} />
      )}
      
      {/* Tap Hint */}
      {!isSearchLoading && (
        <div className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-10 font-oswald text-[0.6rem] sm:text-[0.7rem] uppercase tracking-[0.2em] text-[#444] pointer-events-none animate-subtle-pulse whitespace-nowrap">
          Další lok
        </div>
      )}

      {/* AI Search Button */}
      <button 
        onClick={searchAIQuote}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/30 hover:text-white/80 hover:border-white/40 transition-all active:scale-95 group"
        title="Objevit zapomenutý citát (AI)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <path d="M11 8v6"></path>
          <path d="M8 11h6"></path>
        </svg>
      </button>
    </div>
  );
};

export default App;