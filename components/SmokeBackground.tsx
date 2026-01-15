import React from 'react';

interface SmokeBackgroundProps {
  parallaxX?: number;
  parallaxY?: number;
  isSearching?: boolean;
}

const SmokeBackground: React.FC<SmokeBackgroundProps> = ({ 
  parallaxX = 0.5, 
  parallaxY = 0.5,
  isSearching = false
}) => {
  // Calculate offsets for parallax (subtle shift of +/- 15px)
  const offsetX = (parallaxX - 0.5) * 30;
  const offsetY = (parallaxY - 0.5) * 30;

  return (
    <>
      {/* Noise Texture */}
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-[3] opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
        }}
      />

      {/* Fog/Smoke Layers Container */}
      <div className={`absolute w-full h-full overflow-hidden z-[1] pointer-events-none transition-opacity duration-1000 ${isSearching ? 'opacity-80' : 'opacity-100'}`}>
        {/* Parallax Wrapper for Layer 1 */}
        <div 
          className="absolute inset-0 transition-transform duration-1000 ease-out will-change-transform"
          style={{ transform: `translate3d(${offsetX * 0.5}px, ${offsetY * 0.5}px, 0)` }}
        >
          <div 
            className={`absolute h-[100vh] w-[300vw] z-[1] opacity-40 animate-fog will-change-transform ${isSearching ? 'duration-[30s]' : ''}`}
            style={{
              background: 'radial-gradient(ellipse at center, rgba(80,80,80,0.2) 0%, rgba(0,0,0,0) 70%)'
            }}
          />
        </div>

        {/* Parallax Wrapper for Layer 2 */}
        <div 
          className="absolute inset-0 transition-transform duration-[1200ms] ease-out will-change-transform"
          style={{ transform: `translate3d(${offsetX * -0.8}px, ${offsetY * -0.8}px, 0)` }}
        >
          <div 
            className={`absolute h-[100vh] w-[300vw] z-[2] opacity-20 animate-fog-reverse scale-125 will-change-transform ${isSearching ? 'duration-[20s]' : ''}`}
            style={{
              background: 'radial-gradient(ellipse at center, rgba(120,120,120,0.15) 0%, rgba(0,0,0,0) 60%)'
            }}
          />
        </div>
      </div>
    </>
  );
};

export default SmokeBackground;