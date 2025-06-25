import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Text, 
  Float,
  Html,
  OrbitControls,
  Environment,
  Image
} from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { animated as animatedWeb } from '@react-spring/web';
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram, FaDownload } from 'react-icons/fa';
import { createPortal } from 'react-dom';

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

// Helper to get the right icon for each platform
const getSocialIcon = (title) => {
  switch (title.toLowerCase()) {
    case 'linkedin':
      return <FaLinkedin size={32} color="#0077b5" />;
    case 'github':
      return <FaGithub size={32} color="#333" />;
    case 'twitter':
      return <FaTwitter size={32} color="#1da1f2" />;
    case 'instagram':
      return <FaInstagram size={32} color="#e4405f" />;
    case 'resume':
      return <FaDownload size={32} color="#64ffda" />;
    default:
      return null;
  }
};

// Helper to get the icon URL for each platform
const getIconUrl = (title) => {
  switch (title.toLowerCase()) {
    case 'linkedin':
      return `https://api.iconify.design/mdi/linkedin.svg?color=%230077b5`;
    case 'github':
      return `https://api.iconify.design/mdi/github.svg?color=%23ffffff`;
    case 'twitter':
      return `https://api.iconify.design/mdi/twitter.svg?color=%231da1f2`;
    case 'instagram':
      return `https://api.iconify.design/mdi/instagram.svg?color=%23e4405f`;
    case 'resume':
      return `https://api.iconify.design/mdi/file-download-outline.svg?color=%2364ffda`;
    default:
      return '';
  }
};

// Card Item Component for Social Links
const CardItem = ({ index, link, position, active, onClick, rotation }) => {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Animation for hover state (scale)
  const { scale } = useSpring({
    scale: hovered ? 1.2 : 1,
    config: { mass: 1, tension: 280, friction: 60 }
  });
  
  // Animation for name float-in and color effect
  const nameSpring = useSpring({
    nameScale: hovered ? 1 : 0,
    color: hovered ? '#00ffff' : '#e0e0e0',
    config: { mass: 1, tension: 200, friction: 20 }
  });

  const iconUrl = getIconUrl(link.title);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5 + index * 0.5) * 0.05;
      
      // Parallax rotation effect on hover
      if (hovered) {
        const { x, y } = state.mouse;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotation[1] + x * 0.3, 0.1);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rotation[0] - y * 0.3, 0.1);
      } else {
        // Return to original rotation
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotation[1], 0.1);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rotation[0], 0.1);
      }
    }
  });
  
  const handleClick = () => {
    window.open(link.url, '_blank');
    if (onClick) onClick(index);
  };
  
  return (
    <animated.group
      ref={groupRef}
      position={position}
      scale={scale}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      rotation={rotation}
    >
      {/* 3D Icon Image */}
      <Image
        url={iconUrl}
        transparent
        scale={[2.5, 2.5]}
        opacity={0.9}
        toneMapped={false}
        sdf
      />
      
      {/* Name at the bottom with float-in and color effect */}
      <Html
        position={[0, -1.4, 0]}
        center
        style={{ pointerEvents: 'none', zIndex: 10 }}
      >
        <animatedWeb.div
          style={{
            transform: nameSpring.nameScale.to(s => `scale(${s})`),
            color: nameSpring.color,
            fontSize: 22,
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 600,
            letterSpacing: 1,
            textAlign: 'center',
            transition: 'transform 0.15s, color 0.15s',
            textShadow: '0 0 8px #0a192f',
            padding: '2px 12px',
            display: 'inline-block',
          }}
        >
          {link.title}
        </animatedWeb.div>
      </Html>
    </animated.group>
  );
};

// Curved wall of cards
const CardWall = ({ links, active, setActive }) => {
  const radius = 4.2;
  const group = useRef();
  const N = links.length;

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={group}>
      {links.map((link, index) => {
        // Equidistant placement around the full circle
        const angle = (2 * Math.PI / N) * index;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        return (
          <CardItem 
            key={index}
            index={index} 
            link={link}
            position={[x, 0, z]}
            active={active === index}
            onClick={(idx) => setActive(idx)}
            rotation={[0, angle, 0]}
          />
        );
      })}
    </group>
  );
};

// Main component with static layout
const Scene = () => {
  const [active, setActive] = useState(null);
  const [textHovered, setTextHovered] = useState(false);
  
  const socialLinks = [
    { 
      title: "Resume", 
      url: "/assets/Resume_Zeel_Chotaliya.pdf"
    },
    { 
      title: "LinkedIn", 
      url: "https://www.linkedin.com/in/zeel-chotaliya-95b940237/"
    },
    { 
      title: "GitHub", 
      url: "https://github.com/ZeelVC"
    },
    { 
      title: "Twitter", 
      url: "https://x.com/Zeel_Chotaliya?t=LpukAc_JpV9uYLTna7iTZw&s=09"
    },
    { 
      title: "Instagram", 
      url: "https://www.instagram.com/zeelvc/"
    }
  ];

  // Animation for Connect With Me text
  const textSpring = useSpring({
    scale: textHovered ? 1.12 : 1,
    color: textHovered ? '#64ffda' : '#ffffff',
    outlineWidth: textHovered ? 0.08 : 0.02,
    outlineColor: '#64ffda',
    config: { mass: 1, tension: 280, friction: 40 }
  });

  return (
    <>
      <color attach="background" args={['#050816']} />
      <fog attach="fog" args={['#070b34', 10, 30]} />
      
      <PerspectiveCamera makeDefault position={[0, 3, 10]} fov={50} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      
      {/* Restore Connect With Me as 3D text with hover effect */}
      <animated.group
        scale={textSpring.scale}
        onPointerOver={() => setTextHovered(true)}
        onPointerOut={() => setTextHovered(false)}
      >
        <animated.mesh>
          <Text
            position={[0, 3, 0]}
            fontSize={0.8}
            color={textSpring.color}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={textSpring.outlineWidth}
            outlineColor={textSpring.outlineColor}
          >
            Connect With Me
          </Text>
        </animated.mesh>
      </animated.group>
      
      <CardWall links={socialLinks} active={active} setActive={setActive} />
      
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
    <div id="connect" className="h-screen bg-[#050816] relative overflow-hidden hero-container">
      {/* Background with gradient and grid, matching Hero */}
      <div className="hero-background">
        <div className="hero-grid" />
      </div>
      {/* Remove Connect With Me overlay */}
      <Canvas shadows gl={{ antialias: true, alpha: false }}>
        <Scene />
      </Canvas>
      {/* Instructions */}
      <div className="absolute top-5 left-5 p-3 rounded-md text-[#fff] text-sm max-w-xs opacity-80 hover:opacity-100 transition-opacity z-20 border border-[#64ffda] shadow-lg" style={{background: '#333333'}}>
        <p>Drag to rotate. Click to visit links.</p>
      </div>
    </div>
  );
};

export default SocialLinks3D; 