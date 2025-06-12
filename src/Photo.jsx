import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { DoubleSide, Color, Mesh, PlaneGeometry } from 'three'

const Photo = () => {
  const ringRef = useRef()
  const groupRef = useRef()
  let texture = useTexture('assets/Hero_image.png');

  // Animate the ring and floating group
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;
    }
  });

  // Create a slightly curved plane geometry
  // We'll use a parametric geometry for a subtle curve
  function CurvedPlane(props) {
    const ref = useRef()
    React.useEffect(() => {
      if (ref.current) {
        const geo = ref.current;
        for (let i = 0; i < geo.attributes.position.count; i++) {
          const y = geo.attributes.position.getY(i);
          const x = geo.attributes.position.getX(i);
          // Curve along X axis
          geo.attributes.position.setZ(i, Math.sin(x * Math.PI) * 0.15);
        }
        geo.computeVertexNormals();
      }
    }, []);
    return <planeGeometry ref={ref} args={[2, 2.5, 32, 32]} {...props} />
  }

  return (
    <group ref={groupRef}>
      <mesh ref={ringRef} position={[0, 0, -0.15]}>
        <torusGeometry args={[1.25, 0.08, 32, 100]} />
        <meshStandardMaterial emissive={new Color('#00ffe7')} color={'#fff'} emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>
      <mesh>
        <CurvedPlane />
        <meshStandardMaterial map={texture} transparent opacity={0.98} side={DoubleSide}/>
      </mesh>
    </group>
  )
}

export default Photo