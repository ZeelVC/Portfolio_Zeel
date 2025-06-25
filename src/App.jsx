import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import SocialLinks3D from './SocialLinks3D';
import TimeStone from './TimeStone';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Loading screen effect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    // Scroll listener for parallax effects
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Loading Screen */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050816]">
          <div className="w-16 h-16 border-4 border-[#64ffda] border-t-transparent rounded-full animate-spin"></div>
          <div className="mt-6 text-[#64ffda] text-xl font-mono tracking-widest">LOADING...</div>
        </div>
      )}

      {/* Main Content */}
      <div className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Hero Section */}
        <section className="h-screen">
          <Hero />
        </section>

        {/* Social Links Section */}
        <section className="h-screen">
          <SocialLinks3D />
        </section>

        {/* Contact Section */}
        <section className="h-screen">
          <TimeStone />
        </section>

        {/* Back to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-8 right-8 z-50 bg-[#64ffda] text-[#0a192f] w-12 h-12 rounded-full 
            flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-300
            ${scrollY > 300 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default App; 