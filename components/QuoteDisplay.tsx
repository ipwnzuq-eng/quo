import React from 'react';
import { Quote } from '../types';

interface QuoteDisplayProps {
  quote: Quote | null;
  isVisible: boolean;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isVisible }) => {
  if (!quote) return null;

  // Dynamická úprava velikosti písma podle délky citátu (pokud je příliš dlouhý, zmenšíme základ)
  const isLongQuote = quote.text.length > 180;

  return (
    <div className="relative z-10 w-full max-w-[720px] px-6 sm:px-10 flex flex-col justify-center items-center text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
      
      {/* AI Badge */}
      {quote.isAI && (
        <div className={`mb-4 font-oswald text-[0.6rem] uppercase tracking-widest text-white/20 border border-white/10 px-2 py-0.5 rounded transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          Objeveno skrze AI
        </div>
      )}

      {/* Quote Text */}
      <div 
        className={`
          font-lora leading-[1.4] font-normal mb-6 text-bukowski-text hyphens-auto
          will-change-[opacity,transform,filter]
          transition-all duration-[1000ms] cubic-bezier(0.25,0.4,0.25,1)
          ${isLongQuote ? 'text-[clamp(0.95rem,4vw,1.5rem)]' : 'text-[clamp(1.1rem,5vw,1.9rem)]'}
          ${isVisible ? 'opacity-100 scale-100 translate-y-0 blur-0' : 'opacity-0 scale-95 translate-y-4 blur-sm'}
        `}
        style={{ wordBreak: 'break-word' }}
      >
        “{quote.text}”
      </div>

      {/* Author and Source */}
      <div 
        className={`
          flex flex-col items-center gap-1 sm:gap-2
          transition-all duration-1000 ease-out delay-[200ms]
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        <div className="font-lora italic font-semibold text-white text-[clamp(0.9rem,3vw,1.1rem)]">
          Charles Bukowski
        </div>
        
        <div className="font-oswald text-[0.7rem] sm:text-sm text-bukowski-meta uppercase tracking-widest border-t border-[#333] pt-2 mt-1">
          {quote.source} {quote.year && quote.year !== '–' ? `(${quote.year})` : ''}
        </div>

        {/* AI Sources / Grounding */}
        {quote.isAI && quote.sources && quote.sources.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 max-w-xs">
            <span className="text-[9px] text-white/20 uppercase tracking-tighter w-full mb-1">Ověřeno na:</span>
            {quote.sources.map((src, idx) => (
              <a 
                key={idx} 
                href={src.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[9px] text-white/30 hover:text-white/90 underline transition-colors"
                onClick={e => e.stopPropagation()}
              >
                {src.title.length > 15 ? src.title.substring(0, 12) + '...' : src.title}
              </a>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default QuoteDisplay;