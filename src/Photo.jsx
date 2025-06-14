import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { DoubleSide, MathUtils } from 'three'

const Photo = () => {
  const groupRef = useRef()
  const imageRef = useRef()
  const emitterRef = useRef()
  
  // Load texture
  const texture = useTexture('assets/Hero_image.png')
  const [hovered, setHovered] = useState(false)
  
  // Animation state
  const animationState = useRef({
    projectionProgress: 0,
    emitterIntensity: 0.5
  })

  useFrame((state) => {
    if (!groupRef.current || !imageRef.current || !emitterRef.current) return
    
    const time = state.clock.getElapsedTime()
    const { projectionProgress } = animationState.current

    // Update projection progress with smooth transition
    const targetProgress = hovered ? 1 : 0
    animationState.current.projectionProgress = MathUtils.lerp(
      projectionProgress,
      targetProgress,
      0.1
    )

    // Emitter pulsing effect
    animationState.current.emitterIntensity = 0.5 + Math.sin(time * 3) * 0.2

    // Apply animations
    if (imageRef.current) {
      const progress = animationState.current.projectionProgress
      
      // Vertical movement
      imageRef.current.position.y = -1.5 + (progress * 2)
      
      // Scale
      const baseScale = 0.5
      const finalScale = 0.9
      const currentScale = baseScale + (progress * (finalScale - baseScale))
      imageRef.current.scale.set(currentScale, currentScale, currentScale)

      // Opacity
      imageRef.current.material.opacity = progress

      // Gentle floating movement when visible
      if (progress > 0.5) {
        imageRef.current.position.y += Math.sin(time * 2) * 0.05
      }
    }

    // Emitter effects
    if (emitterRef.current) {
      emitterRef.current.material.emissiveIntensity = animationState.current.emitterIntensity
    }
  })

  return (
    <group 
      ref={groupRef}
      onPointerEnter={() => {
        setHovered(true)
        console.log('Hover started')
      }}
      onPointerLeave={() => {
        setHovered(false)
        console.log('Hover ended')
      }}
    >
      {/* Hologram Emitter Base */}
      <group position={[0, -1.5, 0]}>
        {/* Main emitter ring */}
        <mesh ref={emitterRef}>
          <torusGeometry args={[0.3, 0.05, 16, 32]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Emitter base plate */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.35, 0.4, 0.1, 32]} />
          <meshStandardMaterial
            color="#004455"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Image */}
      <mesh
        ref={imageRef}
        position={[0, -1.5, 0]}
        scale={[0.5, 0.5, 0.5]}
      >
        <planeGeometry args={[2, 3]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0}
          side={DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default Photo