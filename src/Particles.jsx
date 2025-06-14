import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Particles = () => {
  const particlesRef = useRef();
  const ringsRef = useRef();

  // Create particles
  const particleCount = 500;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = Math.random() * 5 + 1;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = Math.sin(theta) * radius;
    }
    return pos;
  }, []);

  // Create energy rings
  const ringCount = 3;
  const rings = useMemo(() => {
    const ringGeometries = [];
    for (let i = 0; i < ringCount; i++) {
      const geometry = new THREE.RingGeometry(1 + i * 0.5, 1.2 + i * 0.5, 64);
      ringGeometries.push(geometry);
    }
    return ringGeometries;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Animate particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const z = positions[i3 + 2];
        const angle = Math.atan2(z, x);
        const radius = Math.sqrt(x * x + z * z);
        
        // Spiral movement
        const newAngle = angle + (0.1 / radius);
        positions[i3] = Math.cos(newAngle) * radius;
        positions[i3 + 2] = Math.sin(newAngle) * radius;
        
        // Vertical oscillation
        positions[i3 + 1] = Math.sin(time * 2 + radius) * 0.2 + positions[i3 + 1];
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate rings
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.z = time * (0.2 + i * 0.1);
        ring.scale.setScalar(1 + Math.sin(time * 2 + i) * 0.1);
      });
    }
  });

  return (
    <group position={[0, -1.5, 0]}>
      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#00ffff"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Energy Rings */}
      <group ref={ringsRef}>
        {rings.map((geometry, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <primitive object={geometry} />
            <meshBasicMaterial
              color="#00ffff"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Central glow */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export default Particles; 