import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Photo from './Photo'
import Particles from './Particles'

const Hero = () => {
  return (
    <div className="hero-container">
      {/* Background with gradient */}
      <div className="hero-background">
        {/* Energy grid */}
        <div className="hero-grid" />
      </div>

      <Canvas 
        camera={{ 
          fov: 35, 
          position: [0, 0, 7],
          near: 0.1,
          far: 1000
        }} 
        style={{ width: '100vw', height: '100vh' }}
      >
        <ambientLight intensity={2} />
        <pointLight position={[5, 5, 5]} intensity={3} color={'#ffffff'} />
        <pointLight position={[-5, -5, 5]} intensity={2} color={'#ffffff'} />
        <pointLight position={[0, -1.5, 0]} intensity={4} color={'#00ffff'} distance={5} decay={2} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 2.5}
        />
        <Particles />
        <Photo />
      </Canvas>

      {/* Hover instruction - upper left */}
      <div className="hover-instruction">
        Hover over the arc reactor to see me
      </div>

      {/* Name Overlay */}
      <div className="name-container">
        <h1 className="hero-title">
          Zeel Chotaiya
        </h1>
        {/* Scroll indicator right below name */}
        <div className="scroll-indicator">
          <div>For more scroll down</div>
          <div className="scroll-arrow">↓</div>
        </div>
      </div>

      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 0.4;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.05);
            }
          }
        `}
      </style>
    </div>
  )
}

export default Hero