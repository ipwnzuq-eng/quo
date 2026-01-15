import React, { useState, useEffect, useRef } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (topic: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const [topic, setTopic] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setTopic('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSearch(topic);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md p-8 mx-4 bg-[#111] border border-white/10 shadow-2xl transform transition-all duration-300 scale-100"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="font-oswald text-xl uppercase tracking-[0.2em] text-white/60 mb-8 text-center">
          O čem dumáš?
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            ref={inputRef}
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Láska, smrt, pivo..."
            className="w-full bg-transparent border-b border-white/20 text-center font-lora text-2xl text-white/90 placeholder-white/20 py-2 focus:outline-none focus:border-white/60 transition-colors"
            autoComplete="off"
          />
          
          <button 
            type="submit"
            className="mt-4 font-oswald uppercase tracking-[0.15em] text-sm bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 hover:border-white/30 py-3 px-6 transition-all duration-300"
          >
            Hledat v temnotě
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchModal;