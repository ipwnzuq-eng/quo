import React from 'react';
import { Quote } from '../types';

interface QuoteDisplayProps {
  quote: Quote | null;
  isVisible: boolean;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isVisible }) => {
  if (!quote) return null;

  return (
    <div className="relative z-10 w-full max-w-[680px] p-10 flex flex-col justify-center items-center text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
      
      {/* Quote Text */}
      <div 
        className={`
          font-lora text-[clamp(1.4rem,5vw,2.1rem)] leading-[1.5] font-normal mb-6 text-bukowski-text
          will-change-[opacity,transform,filter]
          transition-all duration-[1000ms] cubic-bezier(0.25,0.4,0.25,1)
          ${isVisible ? 'opacity-100 scale-100 translate-y-0 blur-0' : 'opacity-0 scale-95 translate-y-4 blur-sm'}
        `}
      >
        “{quote.text}”
      </div>

      {/* Author and Source */}
      <div 
        className={`
          flex flex-col items-center gap-2
          transition-all duration-1000 ease-out delay-[200ms]
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        <div className="font-lora italic font-semibold text-white text-[clamp(1rem,3vw,1.2rem)]">
          Charles Bukowski
        </div>
        
        <div className="font-oswald text-sm text-bukowski-meta uppercase tracking-widest border-t border-[#333] pt-2 mt-1">
          {quote.source} {quote.year && quote.year !== '–' ? `(${quote.year})` : ''}
        </div>
      </div>

    </div>
  );
};

export default QuoteDisplay;