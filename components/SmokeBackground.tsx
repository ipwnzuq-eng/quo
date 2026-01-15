import React, { useMemo } from 'react';

interface SmokeBackgroundProps {
  parallaxX?: number;
  parallaxY?: number;
}

// Static definition of the noise SVG to prevent re-creation on every render
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`;

const SmokeBackground: React.FC<SmokeBackgroundProps> = React.memo(({ 
  parallaxX = 0.5, 
  parallaxY = 0.5,
}) => {
  // Convert 0..1 to -1..1 range for calculations
  const x = (parallaxX - 0.5) * 2;
  const y = (parallaxY - 0.5) * 2;

  // UseMemo for transform calculations isn't strictly necessary as the math is cheap,
  // but it helps signal intent. The real win is React.memo on the component itself.
  
  // Parallax offsets calculation (pixels)
  const backX = x * -35;
  const backY = y * -35;
  
  const midX = x * -80;
  const midY = y * -80;
  
  const foreX = x * -160;
  const foreY = y * -160;

  const rotateX = -y * 8; 
  const rotateY = x * 8;

  // Style objects extracted to ensure clean render cycle
  const containerStyle = useMemo(() => ({
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.15)`
  }), [rotateX, rotateY]);

  const lightStyle = useMemo(() => ({
    background: `radial-gradient(circle at center, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)`,
    transform: `translate3d(${x * -30}%, ${y * -30}%, 0)`
  }), [x, y]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#050505] perspective-1000">
      
      {/* Dynamic Lighting / Vignette */}
      <div 
        className="absolute inset-[-50%] w-[200%] h-[200%] z-[5] pointer-events-none mix-blend-soft-light transition-transform duration-200 ease-out will-change-transform"
        style={lightStyle}
      />

      {/* Noise Texture - Static grit */}
      {/* Optimized: Moved SVG definition out of render loop */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none z-[4] opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage: NOISE_SVG,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* 3D Container for Smoke Layers */}
      <div 
        className="relative w-full h-full transition-transform duration-500 cubic-bezier(0.1, 0.5, 0.5, 1) will-change-transform"
        style={containerStyle}
      >
        {/* Layer 1 - Deep Background */}
        <div 
          className="absolute inset-[-40%] w-[180%] h-[180%] transition-transform duration-1000 ease-out will-change-transform opacity-50"
          style={{ transform: `translate3d(${backX}px, ${backY}px, -60px) scale(1.1)` }}
        >
          <div 
            className="absolute top-0 left-0 w-full h-full animate-fog"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(60,60,60,0.3) 0%, rgba(0,0,0,0) 60%)',
              backgroundSize: '100% 100%',
              animationDuration: '80s'
            }}
          />
        </div>

        {/* Layer 2 - Middle Ground */}
        <div 
          className="absolute inset-[-40%] w-[180%] h-[180%] transition-transform duration-[800ms] ease-out will-change-transform opacity-30 mix-blend-screen"
          style={{ transform: `translate3d(${midX}px, ${midY}px, 0)` }}
        >
          <div 
            className="absolute top-0 left-0 w-full h-full animate-fog-reverse"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(100,100,100,0.2) 0%, rgba(0,0,0,0) 55%)',
              backgroundSize: '100% 100%',
              animationDuration: '55s'
            }}
          />
        </div>

        {/* Layer 3 - Foreground */}
        <div 
          className="absolute inset-[-40%] w-[180%] h-[180%] transition-transform duration-[400ms] ease-out will-change-transform opacity-20 pointer-events-none"
          style={{ 
            transform: `translate3d(${foreX}px, ${foreY}px, 80px) rotate(${x * 4}deg)` 
          }}
        >
           <div 
            className="absolute top-0 left-0 w-full h-full animate-fog"
            style={{
              background: 'radial-gradient(circle at 60% 40%, rgba(140,140,140,0.15) 0%, rgba(0,0,0,0) 45%)',
              backgroundSize: '120% 120%',
              animationDuration: '45s',
              animationDelay: '-10s'
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default SmokeBackground;