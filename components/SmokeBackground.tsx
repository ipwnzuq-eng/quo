import React from 'react';

const SmokeBackground: React.FC = () => {
  return (
    <>
      {/* Noise Texture */}
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-[3] opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
        }}
      />

      {/* Fog/Smoke Layers */}
      <div className="absolute w-full h-full overflow-hidden z-[1] pointer-events-none">
        {/* Layer 1 */}
        <div 
          className="absolute h-[100vh] width-[300vw] w-[300vw] z-[1] opacity-40 animate-fog will-change-transform"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(80,80,80,0.2) 0%, rgba(0,0,0,0) 70%)'
          }}
        />
        {/* Layer 2 */}
        <div 
          className="absolute h-[100vh] width-[300vw] w-[300vw] z-[2] opacity-20 animate-fog-reverse scale-125"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(120,120,120,0.15) 0%, rgba(0,0,0,0) 60%)'
          }}
        />
      </div>
    </>
  );
};

export default SmokeBackground;
