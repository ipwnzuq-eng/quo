import React, { useState, useEffect, useCallback } from 'react';
import SmokeBackground from './components/SmokeBackground';
import QuoteDisplay from './components/QuoteDisplay';
import EmberBurst from './components/EmberBurst';
import { quotesData } from './data';
import { Quote } from './types';

const App: React.FC = () => {
  const [initialIndex] = useState(() => Math.floor(Math.random() * quotesData.length));
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(quotesData[initialIndex]);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastIndex, setLastIndex] = useState(initialIndex);
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    // Listen for PWA install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  }, [installPrompt]);

  const triggerNewQuote = useCallback(() => {
    if (isAnimating) return;
    
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
  }, [isAnimating, lastIndex]);

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
      className="relative w-full h-[100dvh] bg-bukowski-bg text-bukowski-text flex flex-col justify-center items-center overflow-hidden cursor-pointer select-none touch-manipulation"
      onClick={triggerNewQuote}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      style={{ touchAction: 'manipulation' }}
    >
      <SmokeBackground 
        parallaxX={mousePos.x} 
        parallaxY={mousePos.y} 
      />
      <EmberBurst trigger={burstTrigger} />
      
      <QuoteDisplay quote={currentQuote} isVisible={isVisible} />
      
      {/* Tap Hint */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10 font-oswald text-[0.6rem] sm:text-[0.7rem] uppercase tracking-[0.2em] text-[#444] pointer-events-none animate-subtle-pulse whitespace-nowrap"
           style={{ bottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
        Další lok
      </div>

      {/* PWA Install Button */}
      {installPrompt && (
        <button
          onClick={handleInstallClick}
          className="fixed z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/20 hover:text-white/60 hover:border-white/20 transition-all active:scale-95 group touch-manipulation"
          style={{ 
            bottom: 'max(1.5rem, env(safe-area-inset-bottom))', 
            left: 'max(1.5rem, env(safe-area-inset-left))' 
          }}
          title="Nainstalovat aplikaci"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </button>
      )}
    </div>
  );
};

export default App;