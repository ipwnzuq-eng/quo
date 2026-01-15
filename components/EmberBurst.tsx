import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number; // %
  y: number; // %
  size: number; // px
  color: string;
  duration: number; // s
  delay: number; // s
  driftX: number; // px
  driftY: number; // px
  maxOpacity: number;
  flicker: boolean;
}

interface EmberBurstProps {
  trigger: number;
}

const EmberBurst: React.FC<EmberBurstProps> = React.memo(({ trigger }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    const newParticles: Particle[] = [];
    const count = 45; 

    for (let i = 0; i < count; i++) {
      const type = Math.random();
      let color = '';
      let size = Math.random() * 2 + 0.5;
      let flicker = false;
      let maxOpacity = 0.4 + Math.random() * 0.4;

      if (type > 0.6) {
        // Glowing Ember (Orange/Red)
        color = `rgba(255, ${80 + Math.random() * 100}, 30, ${maxOpacity})`;
        size = Math.random() * 3 + 1;
        flicker = true;
      } else if (type > 0.2) {
        // Grey Ash
        color = `rgba(180, 180, 180, ${maxOpacity * 0.6})`;
        size = Math.random() * 4 + 1;
      } else {
        // Fine Dust (White/Bright)
        color = `rgba(255, 255, 255, ${maxOpacity * 0.8})`;
        size = Math.random() * 1.5 + 0.5;
      }

      newParticles.push({
        id: Math.random(),
        x: 50 + (Math.random() - 0.5) * 40,
        y: 55 + (Math.random() - 0.5) * 30,
        size,
        color,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 0.5,
        driftX: (Math.random() - 0.5) * 200, 
        driftY: -100 - Math.random() * 250, 
        maxOpacity,
        flicker
      });
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, [trigger]);

  // If no particles, render nothing to save DOM nodes
  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[12]">
      {particles.map(p => (
        <div
          key={p.id}
          className={`absolute rounded-full particle ${p.flicker ? 'animate-flicker' : ''}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: p.flicker ? `0 0 ${p.size * 3}px ${p.color}` : 'none',
            opacity: 0,
            animation: `ember-float ${p.duration}s cubic-bezier(0.2, 0, 0.4, 1) forwards, ember-flicker ${0.5 + Math.random()}s infinite alternate ease-in-out`,
            animationDelay: `${p.delay}s`,
            ['--drift-x' as any]: `${p.driftX}px`,
            ['--drift-y' as any]: `${p.driftY}px`,
            ['--max-opacity' as any]: p.maxOpacity,
            willChange: 'transform, opacity' // Hint to browser for optimization
          }}
        />
      ))}
    </div>
  );
});

export default EmberBurst;