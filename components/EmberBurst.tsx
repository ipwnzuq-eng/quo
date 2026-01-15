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
}

interface EmberBurstProps {
  trigger: number;
}

const EmberBurst: React.FC<EmberBurstProps> = ({ trigger }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    const newParticles: Particle[] = [];
    const count = 35; // Number of particles

    for (let i = 0; i < count; i++) {
      const isEmber = Math.random() > 0.4; // 60% embers, 40% dust
      newParticles.push({
        id: Math.random(),
        // Center spread: 50% +/- 30%
        x: 50 + (Math.random() - 0.5) * 60, 
        // Vertical spread: 60% +/- 20% (slightly lower than center)
        y: 60 + (Math.random() - 0.5) * 40,
        size: Math.random() * 3 + 1,
        color: isEmber 
          ? `rgba(255, ${100 + Math.random() * 100}, 50, ${0.4 + Math.random() * 0.4})` // Orange/Red glow
          : `rgba(200, 200, 200, ${0.2 + Math.random() * 0.3})`, // White/Grey dust
        duration: 1.5 + Math.random() * 2, // 1.5s - 3.5s
        delay: Math.random() * 0.4,
        driftX: (Math.random() - 0.5) * 150, // +/- 75px horizontal
        driftY: -80 - Math.random() * 120, // -80px to -200px vertical
      });
    }

    setParticles(newParticles);

    // Cleanup after animation finishes
    const timer = setTimeout(() => {
      setParticles([]);
    }, 4000);

    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[12]">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            opacity: 0,
            animation: `ember-float ${p.duration}s ease-out forwards`,
            animationDelay: `${p.delay}s`,
            ['--drift-x' as any]: `${p.driftX}px`,
            ['--drift-y' as any]: `${p.driftY}px`,
          }}
        />
      ))}
    </div>
  );
};

export default EmberBurst;