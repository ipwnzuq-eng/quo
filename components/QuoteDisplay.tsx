import React from 'react';
import { Quote } from '../types';

interface QuoteDisplayProps {
  quote: Quote | null;
  isVisible: boolean;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isVisible }) => {
  if (!quote) return null;

  // Logic to determine text sizing based on length
  const len = quote.text.length;
  const isVeryLong = len > 220;
  const isLong = len > 120;
  const isShort = len < 60;

  // Helper to generate search URLs
  const getSearchUrl = (query: string, context: string = '') => {
    const q = encodeURIComponent(`${query} ${context}`.trim());
    return `https://www.google.com/search?q=${q}`;
  };

  return (
    <div className="relative z-10 w-full flex flex-col justify-center items-center text-center 
      px-5 xs:px-8 sm:px-16 md:px-24 
      max-w-[100%] md:max-w-4xl lg:max-w-5xl"
    >
      
      {/* AI Badge - Ultra subtle */}
      <div 
        className={`
          mb-6 sm:mb-8 flex justify-center transition-all duration-1000 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
        `}
      >
        {quote.isAI && (
          <span className="font-oswald text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/30 px-3 py-1 border-b border-white/5 shadow-[0_1px_10px_rgba(0,0,0,0.5)]">
            AI Discovery
          </span>
        )}
      </div>

      {/* Quote Text - Cinematic Reveal with Sway */}
      <div 
        className={`
          relative font-lora font-normal text-bukowski-text hyphens-auto
          will-change-[opacity,filter,transform]
          transition-all duration-[1600ms] cubic-bezier(0.2, 0.0, 0.2, 1)
          ${isVeryLong ? 'text-[clamp(1rem,3.5vw,1.4rem)] leading-[1.6]' : 
            isLong ? 'text-[clamp(1.1rem,4vw,1.8rem)] leading-[1.5]' : 
            isShort ? 'text-[clamp(1.6rem,6vw,2.8rem)] leading-[1.3]' : 
            'text-[clamp(1.3rem,5vw,2.2rem)] leading-[1.45]'}
          ${isVisible 
            ? 'opacity-100 blur-0 scale-100 translate-y-0' 
            : 'opacity-0 blur-[4px] scale-[0.92] translate-y-8'}
        `}
        style={{ 
          wordBreak: 'break-word', 
          textWrap: 'balance',
          textShadow: '0 4px 24px rgba(0,0,0,0.6)' 
        }}
      >
        {/* Inner wrapper for independent floating animation */}
        <div className="animate-float-slow w-full">
          “{quote.text}”
        </div>
      </div>

      {/* Author and Source Block - Redesigned for hierarchy */}
      <div 
        className={`
          flex flex-col items-center w-full mt-8 sm:mt-12
          transition-all duration-[1400ms] ease-out delay-[300ms]
          ${isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-sm'}
        `}
      >
        {/* Author Name - Linked */}
        <div className="mb-4 drop-shadow-md relative group">
          <a 
            href={getSearchUrl(quote.author, 'spisovatel')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-lora italic font-medium text-white/90 text-[clamp(1.1rem,4vw,1.5rem)] tracking-tight 
                       transition-all duration-300 border-b border-transparent 
                       hover:text-white hover:border-white/30 cursor-pointer"
            title={`Vyhledat autora: ${quote.author}`}
          >
            — {quote.author}
          </a>
        </div>
        
        {/* Metadata Container */}
        <div className="relative flex flex-col items-center w-full max-w-[90%] sm:max-w-2xl">
          
          {/* Subtle Divider */}
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4"></div>

          {/* Source & Year - Linked */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 font-oswald uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[0.7rem] sm:text-[0.8rem] leading-relaxed text-center">
            
            {/* Source Link */}
            <a 
              href={getSearchUrl(quote.source, `kniha ${quote.author}`)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-white/70 font-normal transition-colors duration-300 hover:text-white border-b border-transparent hover:border-white/20 cursor-pointer"
              title={`Vyhledat dílo: ${quote.source}`}
            >
              {quote.source}
            </a>
            
            {quote.year && quote.year !== '–' && (
              <>
                <span className="hidden sm:inline-block text-white/20">•</span>
                {/* Year Link */}
                <a 
                  href={getSearchUrl(quote.year, 'rok události historie')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white/40 font-light tracking-widest transition-colors duration-300 hover:text-white/80 border-b border-transparent hover:border-white/10 cursor-pointer"
                  title={`Události roku ${quote.year}`}
                >
                  {quote.year}
                </a>
              </>
            )}
          </div>

          {/* AI Sources Links - Minimalist pills */}
          {quote.isAI && quote.sources && quote.sources.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4 pt-2 border-t border-white/5 w-full max-w-[300px]">
              {quote.sources.map((src, idx) => (
                <a 
                  key={idx} 
                  href={src.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[9px] text-white/30 hover:text-white/80 hover:bg-white/5 px-2 py-1 rounded transition-all duration-300 border border-transparent hover:border-white/10"
                  onClick={e => e.stopPropagation()}
                >
                  {src.title.length > 25 ? src.title.substring(0, 22) + '...' : src.title}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default QuoteDisplay;