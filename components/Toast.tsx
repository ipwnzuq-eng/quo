import React from 'react';

interface ToastProps {
  show: boolean;
  message: string;
}

const Toast: React.FC<ToastProps> = ({ show, message }) => {
  return (
    <div 
      className={`
        fixed top-8 left-1/2 -translate-x-1/2 z-[100]
        bg-white/90 text-black px-6 py-3 rounded-full
        font-oswald text-sm uppercase tracking-widest
        pointer-events-none transition-all duration-400 cubic-bezier(0.175,0.885,0.32,1.275)
        ${show ? 'translate-y-0 opacity-100' : '-translate-y-[100px] opacity-0'}
      `}
    >
      {message}
    </div>
  );
};

export default Toast;
