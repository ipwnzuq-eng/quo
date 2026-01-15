import React from 'react';
import { Quote } from '../types';

interface QuoteDisplayProps {
  quote: Quote | null;
  isVisible: boolean;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isVisible }) => {
  if (!quote) return null;

  // Dynamická úprava velikosti písma podle délky citátu
  const isLongQuote = quote.text.length > 180;

  return (
    <div className="relative z-10 w-full max-w-[720px] px-6 sm:px-10 flex flex-col justify-center items-center text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
      
      {/* AI Badge */}
      {quote.isAI && (
        <div className={`mb-6 font-oswald text-[0.6rem] uppercase tracking-widest text-white/20 border border-white/10 px-2 py-0.5 rounded transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          Objeveno skrze AI
        </div>
      )}

      {/* Quote Text */}
      <div 
        className={`
          font-lora leading-[1.4] font-normal mb-8 text-bukowski-text hyphens-auto
          will-change-[opacity,transform,filter]
          transition-all duration-[1000ms] cubic-bezier(0.25,0.4,0.25,1)
          ${isLongQuote ? 'text-[clamp(1rem,4.2vw,1.6rem)]' : 'text-[clamp(1.2rem,5.5vw,2.1rem)]'}
          ${isVisible ? 'opacity-100 scale-100 translate-y-0 blur-0' : 'opacity-0 scale-95 translate-y-4 blur-sm'}
        `}
        style={{ wordBreak: 'break-word' }}
      >
        “{quote.text}”
      </div>

      {/* Author and Source Block */}
      <div 
        className={`
          flex flex-col items-center
          transition-all duration-1000 ease-out delay-[200ms]
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        {/* Author Name - Enhanced Visibility */}
        <div className="font-lora italic font-medium text-white/90 text-[clamp(1.1rem,4vw,1.4rem)] mb-2 tracking-tight">
          — Charles Bukowski
        </div>
        
        {/* Source Metadata */}
        <div className="font-oswald text-[0.65rem] sm:text-[0.75rem] text-bukowski-meta uppercase tracking-[0.2em] border-t border-white/10 pt-2 px-4">
          {quote.source} {quote.year && quote.year !== '–' ? `(${quote.year})` : ''}
        </div>

        {/* AI Sources / Grounding */}
        {quote.isAI && quote.sources && quote.sources.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-2 max-w-xs">
            <span className="text-[8px] text-white/10 uppercase tracking-widest w-full mb-1">Ověřeno v archivech:</span>
            {quote.sources.map((src, idx) => (
              <a 
                key={idx} 
                href={src.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[9px] text-white/30 hover:text-white/80 border border-white/5 px-2 py-0.5 rounded-sm bg-white/5 transition-all"
                onClick={e => e.stopPropagation()}
              >
                {src.title.length > 18 ? src.title.substring(0, 15) + '...' : src.title}
              </a>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default QuoteDisplay;