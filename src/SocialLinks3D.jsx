import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Text, 
  Float,
  Html,
  OrbitControls,
  Environment
} from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

// Create a custom sine wave material for the cylinder
class MeshSineMaterial extends THREE.MeshStandardMaterial {
  constructor(parameters = {}) {
    super(parameters);
    this.setValues(parameters);
    this.time = { value: 0 };
    this.distort = { value: 0.4 };
    this.frequency = { value: 2.0 };
    
    this.onBeforeCompile = (shader) => {
      shader.uniforms.time = this.time;
      shader.uniforms.distort = this.distort;
      shader.uniforms.frequency = this.frequency;
      
      shader.vertexShader = `
        uniform float time;
        uniform float distort;
        uniform float frequency;
        ${shader.vertexShader}
      `.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        float theta = position.y * frequency + time;
        float s = sin(theta) * distort;
        transformed.z += s;
        `
      );
    };
  }

  get time() {
    return this._time;
  }
  
  set time(v) {
    this._time = v;
  }
  
  get distort() {
    return this._distort;
  }
  
  set distort(v) {
    this._distort = v;
  }
  
  get frequency() {
    return this._frequency;
  }
  
  set frequency(v) {
    this._frequency = v;
  }
}

// Extend Three.js with our custom material
extend({ MeshSineMaterial });

// Card Item Component for Social Links
const CardItem = ({ index, link, position, active, onClick }) => {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Generate vibrant colors based on index
  const colors = useMemo(() => [
    "#0077b5", // LinkedIn blue
    "#333333", // GitHub dark
    "#64ffda", // Theme cyan
    "#1da1f2", // Twitter blue
    "#e4405f"  // Instagram pink/purple
  ], []);
  
  // Animation for hover state
  const { scale } = useSpring({
    scale: hovered ? 1.1 : 1,
    config: { mass: 1, tension: 280, friction: 60 }
  });
  
  useFrame((state) => {
    // Gentle floating animation
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5 + index * 0.5) * 0.05;
      
      // Material animation
      if (ref.current.material) {
        ref.current.material.time.value = state.clock.getElapsedTime() * 0.5;
        ref.current.material.distort.value = hovered ? 0.6 : 0.4;
      }
    }
  });
  
  const handleClick = () => {
    setClicked(true);
    window.open(link.url, '_blank');
    setTimeout(() => setClicked(false), 300);
    if (onClick) onClick(index);
  };
  
  return (
    <animated.mesh
      ref={ref}
      position={position}
      rotation={[0, index * 0.05 - 0.1, 0]}
      scale={scale}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <cylinderGeometry args={[1.6, 1.6, 2.5, 128, 16, true]} />
      <meshSineMaterial 
        color={colors[index % colors.length]} 
        metalness={0.5} 
        roughness={0.2}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
      
      <Text
        position={[0, 0, 1.7]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.3}
        color="#ffffff"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
      >
        {link.title}
      </Text>

      {/* Click indicator */}
      {hovered && (
        <Html position={[0, 1.5, 1.7]} center>
          <div className="px-2 py-1 rounded text-xs bg-opacity-80 bg-[#0a192f] text-[#64ffda]">
            Click to open
          </div>
        </Html>
      )}
    </animated.mesh>
  );
};

// Curved wall of cards
const CardWall = ({ links, active, setActive }) => {
  const radius = 6;
  const group = useRef();
  
  return (
    <group ref={group}>
      {links.map((link, index) => {
        // Calculate positions in a curved wall
        const theta = (index / links.length) * Math.PI * 2;
        const x = Math.sin(theta) * radius;
        const z = Math.cos(theta) * radius;
        
        return (
          <CardItem 
            key={index}
            index={index} 
            link={link}
            position={[x, 0, z]}
            active={active === index}
            onClick={(idx) => setActive(idx)}
          />
        );
      })}
    </group>
  );
};

// Main component with static layout
const Scene = () => {
  const [active, setActive] = useState(null);
  
  const socialLinks = [
    { 
      title: "Resume", 
      url: "https://docs.google.com/document/d/1xepBzWF8TYz-loPCq_TMO3Hd9XOuGSxz/preview"
    },
    { 
      title: "LinkedIn", 
      url: "https://linkedin.com/in/zeelchotaliya"
    },
    { 
      title: "GitHub", 
      url: "https://github.com/zeelchotaliya"
    },
    { 
      title: "Twitter", 
      url: "https://twitter.com/zchotaliya"
    },
    { 
      title: "Instagram", 
      url: "https://instagram.com/zeel.chotaliya"
    }
  ];

  return (
    <>
      <color attach="background" args={['#050816']} />
      <fog attach="fog" args={['#070b34', 10, 30]} />
      
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      
      <CardWall links={socialLinks} active={active} setActive={setActive} />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 3, 0]}
          fontSize={0.8}
          color="#ffffff"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#64ffda"
        >
          Connect With Me
        </Text>
      </Float>
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        minPolarAngle={Math.PI / 2 - 0.5}
        maxPolarAngle={Math.PI / 2 + 0.5}
        rotateSpeed={0.5}
      />
      
      <Environment preset="city" />
    </>
  );
};

// Main component - can be directly included in your existing app
const SocialLinks3D = () => {
  return (
    <div id="connect" className="h-screen bg-[#050816]">
      <Canvas shadows gl={{ antialias: true, alpha: false }}>
        <Scene />
      </Canvas>
      
      {/* Instructions */}
      <div className="absolute top-5 left-5 bg-[#112240] p-3 rounded-md text-[#64ffda] text-sm max-w-xs opacity-80 hover:opacity-100 transition-opacity">
        <p>Drag to rotate view. Click on cards to visit links.</p>
      </div>
    </div>
  );
};

export default SocialLinks3D; 