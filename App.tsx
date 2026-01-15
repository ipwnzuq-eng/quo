import React, { useState, useEffect, useCallback } from 'react';
import SmokeBackground from './components/SmokeBackground';
import QuoteDisplay from './components/QuoteDisplay';
import Toast from './components/Toast';
import EmberBurst from './components/EmberBurst';
import { quotesData } from './data';
import { Quote } from './types';

const App: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastIndex, setLastIndex] = useState(-1);
  const [isShareAnimating, setIsShareAnimating] = useState(false);
  const [burstTrigger, setBurstTrigger] = useState(0);

  const triggerNewQuote = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsVisible(false); // Start fade out

    // Wait for fade out animation
    setTimeout(() => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * quotesData.length);
      } while (randomIndex === lastIndex && quotesData.length > 1);

      setLastIndex(randomIndex);
      setCurrentQuote(quotesData[randomIndex]);
      
      // Start fade in
      setIsVisible(true);
      // Trigger particle burst
      setBurstTrigger(prev => prev + 1);

      // Unlock after fade in
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);

    }, 800);
  }, [isAnimating, lastIndex]);

  // Initial load
  useEffect(() => {
    // Small delay to ensure smooth first render
    const timer = setTimeout(() => {
      triggerNewQuote();
    }, 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault(); // Prevent scrolling on space
        triggerNewQuote();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [triggerNewQuote]);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering new quote
    if (!currentQuote) return;

    // Trigger button animation
    setIsShareAnimating(true);
    setTimeout(() => setIsShareAnimating(false), 200);

    const textToShare = `„${currentQuote.text}“\n— Charles Bukowski`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bukowski Citát',
          text: textToShare,
          url: window.location.href
        });
      } catch (err) {
        console.log('Sharing cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(textToShare);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-bukowski-bg text-bukowski-text flex flex-col justify-center items-center overflow-hidden cursor-pointer select-none"
      onClick={triggerNewQuote}
    >
      <SmokeBackground />
      <EmberBurst trigger={burstTrigger} />
      
      <QuoteDisplay quote={currentQuote} isVisible={isVisible} />
      
      <Toast show={showToast} message="Zkopírováno do schránky" />

      {/* Tap Hint */}
      <div className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-10 font-oswald text-[0.7rem] uppercase tracking-[0.2em] text-[#444] pointer-events-none animate-subtle-pulse">
        Další lok
      </div>

      {/* Action Button */}
      <div className="fixed bottom-8 right-8 z-20 flex gap-4">
        <button 
          className={`
            group bg-transparent border border-white/20 rounded-full w-12 h-12 
            flex items-center justify-center text-white cursor-pointer 
            transition-all duration-300 backdrop-blur-[5px] 
            hover:border-white/60 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]
            ${isShareAnimating ? 'scale-90 bg-white/30' : 'hover:scale-110 hover:bg-white/20'}
          `}
          onClick={handleShare}
          aria-label="Sdílet citát"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current transition-transform duration-300 group-hover:rotate-12">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default App;