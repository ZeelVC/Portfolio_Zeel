import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 80;
const COLORS = ['#00ffe7', '#ff00e7', '#fff', '#00f0ff', '#ffb300'];

function randomSpherePoint(radius) {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);
  return [x, y, z];
}

const Particles = () => {
  const meshRef = useRef();
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const [x, y, z] = randomSpherePoint(3.5 + Math.random());
      return {
        position: [x, y, z],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        scale: 0.08 + Math.random() * 0.12,
        speed: 0.003 + Math.random() * 0.004,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      const t = state.clock.getElapsedTime() * p.speed + p.phase;
      meshRef.current.children[i].position.x = p.position[0] + Math.sin(t) * 0.3;
      meshRef.current.children[i].position.y = p.position[1] + Math.cos(t) * 0.3;
      meshRef.current.children[i].position.z = p.position[2] + Math.sin(t * 0.7) * 0.2;
    });
  });

  return (
    <group ref={meshRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[p.scale, 16, 16]} />
          <meshStandardMaterial emissive={new THREE.Color(p.color)} color={p.color} emissiveIntensity={2} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
};

export default Particles; 