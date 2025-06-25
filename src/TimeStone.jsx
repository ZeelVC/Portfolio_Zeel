import React, { useState, useMemo } from 'react';
import { useSpring, useTransition, animated } from '@react-spring/web';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const Particle = ({ style, isActivated }) => {
  const particleAnimation = useSpring({
    to: { 
      transform: isActivated ? `translate(${style.x}px, ${style.y}px) scale(1)` : 'translate(0px, 0px) scale(0)',
      opacity: isActivated ? (Math.random() * 0.5 + 0.3) : 0 
    },
    from: { 
      transform: 'translate(0px, 0px) scale(0)', 
      opacity: 0 
    },
    config: { tension: 120, friction: 14 },
    delay: style.delay,
  });

  return (
    <animated.div
      style={{
        ...particleAnimation,
        position: 'absolute',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#00ff00',
        boxShadow: '0 0 15px #00ff00, 0 0 5px #fff',
      }}
    />
  );
};

const TimeStone = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [isHovered, setHovered] = useState(false);

  const particles = useMemo(() => {
    if (typeof window === 'undefined') return [];
    const particleCount = 50;
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.5;
    return Array.from({ length: particleCount }).map((_, i) => {
      const angle = (i / particleCount) * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius * (0.4 + Math.random() * 0.6),
        y: Math.sin(angle) * radius * (0.4 + Math.random() * 0.6),
        delay: Math.random() * 1000,
      };
    });
  }, []);

  const bgSpring = useSpring({
    opacity: isActivated ? 0.35 : 0.18,
    filter: isActivated ? 'blur(16px) brightness(1.5) drop-shadow(0 0 60px #00ff00)' : 'blur(32px) brightness(1)',
    config: { tension: 80, friction: 30 },
  });

  const amuletAnimation = useSpring({
    transform: isActivated ? 'scale(1.05)' : isHovered ? 'scale(1.03)' : 'scale(1)',
    borderColor: isActivated ? '#00ff00' : '#B8860B', // Gold color for inactive
    boxShadow: isActivated 
      ? '0 0 40px #00ff00, 0 0 10px #ffffff' 
      : isHovered
      ? '0 0 30px #B8860B, 0 0 8px #ffffff'
      : '0 0 20px #222',
    config: { tension: 200, friction: 15 },
  });

  const innerSymbolAnimation = useSpring({
    transform: isActivated ? 'rotate(360deg)' : 'rotate(0deg)',
    color: isActivated ? '#00ff00' : '#B8860B', // Gold color for inactive
    config: { tension: 100, friction: 50 }
  });

  const innerGlowSpring = useSpring({
    opacity: isActivated ? 0.5 : isHovered ? 0.4 : 0.28,
    filter: isActivated 
        ? 'blur(6px) brightness(1.4)' 
        : isHovered 
        ? 'blur(10px) brightness(1.2)'
        : 'blur(14px)',
    config: { tension: 200, friction: 20 }
  });

  const formTransitions = useTransition(isActivated, {
    from: { opacity: 0, transform: 'translateY(40px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(40px)' },
  });

  const TimeStoneSymbol = (props) => (
    <animated.svg 
        {...props}
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
    >
        {/* Central stone */}
        <circle cx="50" cy="50" r="8" fill="currentColor" stroke="none"/>
        {/* Inner circle */}
        <circle cx="50" cy="50" r="15" />
        {/* Square inside the inner circle */}
        <rect x="40" y="40" width="20" height="20" transform="rotate(45 50 50)" />
        {/* Outer circle */}
        <circle cx="50" cy="50" r="45" />
        {/* "Runes" on the outer circle */}
        <g transform="translate(50,50)">
            {Array.from({ length: 8 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 45})`}>
                    <path d="M 0 -48 L 0 -42" />
                </g>
            ))}
        </g>
    </animated.svg>
  );

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919265727707', '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:zeelvc7@gmail.com';
  };

  return (
    <div id="contact" className="h-screen bg-[#050816] relative overflow-hidden hero-container flex items-center justify-center p-4">
      {/* Animated swirling gradient background */}
      <animated.div
        className="absolute inset-0 z-0 animate-spin-slow"
        style={{
          background: 'conic-gradient(from 90deg at 50% 50%, #00ff00 0%, #B8860B 40%, #050816 100%)',
          ...bgSpring,
        }}
      />

      {/* Magical circles/runes */}
      <svg className="absolute z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" width="600" height="600" viewBox="0 0 600 600" fill="none" style={{opacity: 0.22}}>
        <circle cx="300" cy="300" r="180" stroke="#00ff00" strokeWidth="2" strokeDasharray="8 12" />
        <circle cx="300" cy="300" r="120" stroke="#B8860B" strokeWidth="1.5" strokeDasharray="4 8" />
        <circle cx="300" cy="300" r="240" stroke="#00ff00" strokeWidth="1" strokeDasharray="2 6" />
        {/* Runes (simple lines for now) */}
        {Array.from({length: 12}).map((_,i)=>(
          <g key={i} style={{transform: `rotate(${i*30}deg)`, transformOrigin: '300px 300px'}}>
            <rect x="295" y="70" width="10" height="30" rx="5" fill="#B8860B" opacity="0.5" />
          </g>
        ))}
      </svg>

      <div className="hero-background">
        <div className="hero-grid" />
      </div>

      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        {particles.map((style, i) => (
          <Particle key={i} style={style} isActivated={isActivated} />
        ))}
      </div>

      <div className="relative flex flex-col items-center z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 text-center">Contact me</h2>
        
        <animated.div 
            style={amuletAnimation}
            className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gray-900 border-[10px] flex items-center justify-center cursor-pointer select-none relative overflow-hidden"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setIsActivated(!isActivated)}
        >
            {/* Magical animated background inside the Time Stone */}
            <div className="absolute inset-0 rounded-full pointer-events-none z-0">
                {/* Layer 1: Animated swirling energy SVG */}
                <svg className="absolute inset-0 w-full h-full animate-spin-slow" style={{opacity: 0.22}} viewBox="0 0 200 200">
                  <defs>
                    <radialGradient id="swirl" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#00ff00" stopOpacity="0.7" />
                      <stop offset="60%" stopColor="#B8860B" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <ellipse cx="100" cy="100" rx="80" ry="40" fill="url(#swirl)"/>
                  <ellipse cx="100" cy="100" rx="60" ry="20" fill="url(#swirl)" transform="rotate(30 100 100)"/>
                  <ellipse cx="100" cy="100" rx="40" ry="10" fill="url(#swirl)" transform="rotate(60 100 100)"/>
                </svg>
                {/* Layer 2: Pulsing green glow */}
                <animated.div className="absolute inset-0 rounded-full animate-pulse" style={{
                  background: 'radial-gradient(circle at 60% 40%, #00ff00 0%, #B8860B 40%, transparent 80%)',
                  ...innerGlowSpring
                }} />
                {/* Layer 3: Rotating runes/circles */}
                <svg className="absolute inset-0 w-full h-full animate-spin-slower" style={{opacity: 0.18}} viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" stroke="#00ff00" strokeWidth="2" fill="none" strokeDasharray="8 12" />
                  <circle cx="100" cy="100" r="60" stroke="#B8860B" strokeWidth="1.5" fill="none" strokeDasharray="4 8" />
                  <circle cx="100" cy="100" r="40" stroke="#00ff00" strokeWidth="1" fill="none" strokeDasharray="2 6" />
                  {/* Simple runes */}
                  {Array.from({length: 8}).map((_,i)=>(
                    <g key={i} transform={`rotate(${i*45} 100 100)`}>
                      <rect x="97" y="18" width="6" height="18" rx="3" fill="#B8860B" opacity="0.5" />
                    </g>
                  ))}
                </svg>
                {/* Layer 4: Animated sparks */}
                {Array.from({length: 6}).map((_,i)=>(
                  <div key={i} className="absolute w-2 h-2 rounded-full bg-[#00ff00] animate-ping"
                    style={{
                      left: `calc(50% + ${32*Math.cos((i/6)*2*Math.PI)}%)`,
                      top: `calc(50% + ${32*Math.sin((i/6)*2*Math.PI)}%)`,
                      opacity: 0.7,
                      filter: 'blur(1px) drop-shadow(0 0 8px #00ff00)'
                    }}
                  />
                ))}
            </div>
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#4a2e0a] to-[#2b1a04] flex items-center justify-center p-4 relative z-10">
                <div className="w-32 h-32 md:w-40 md:h-40">
                    <TimeStoneSymbol style={innerSymbolAnimation} />
                </div>
            </div>
        </animated.div>

        <div className="h-40 w-full max-w-md mt-8 flex items-center justify-center">
            {formTransitions((style, item) => 
                item ? (
                    <animated.div style={style} className="w-full">
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <button
                                onClick={handleWhatsAppClick}
                                className="bg-[#25D366] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#128C7E] transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                            >
                                <FaWhatsapp size={24} />
                                WhatsApp
                            </button>
                            <button
                                onClick={handleEmailClick}
                                className="bg-[#D44638] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#EA4335] transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                            >
                                <FaEnvelope size={24} />
                                Email
                            </button>
                        </div>
                    </animated.div>
                ) : null
            )}
        </div>
      </div>
    </div>
  );
};

export default TimeStone; 