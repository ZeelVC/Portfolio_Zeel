import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Photo from './Photo'
import Particles from './Particles'

const Hero = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Canvas camera={{ fov: 30, position: [0, 0, 8] }} style={{ width: '100vw', height: '100vh', background: '#000' }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={2} color={'#00ffe7'} />
        <pointLight position={[-10, -10, 10]} intensity={2} color={'#ff00e7'} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
        <Particles />
        <Photo />
        {/* Add Particles and NeonRing here soon */}
      </Canvas>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 10 }}>
        <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: 'bold', textShadow: '0 0 20px #00ffe7, 0 0 40px #ff00e7' }}>
          Hi all, my name is <span style={{ color: '#00ffe7' }}>zeel chotaiya</span>
        </h1>
        <p style={{ color: '#fff', fontSize: '1.5rem', marginTop: '1rem', textShadow: '0 0 10px #ff00e7' }}>
          For more, scroll down
        </p>
        <div style={{ marginTop: '2rem', animation: 'bounce 2s infinite', fontSize: '2rem', color: '#00ffe7', textShadow: '0 0 10px #00ffe7' }}>
          ↓
        </div>
      </div>
    </div>
  )
}

export default Hero