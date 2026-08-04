// components/Button.jsx
"use client"
import React, { useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Simple R3F Fill Shader
function ColorFillPlane({ isHovered }) {
  const meshRef = useRef(null)

  const shaderData = useMemo(() => ({
    uniforms: {
      uProgress: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uProgress;
      varying vec2 vUv;

      void main() {
        // Linear vertical fill direction
        float fillEdge = vUv.y;
        
        // Soft smoothstep threshold for a sleek transition edge
        float mask = smoothstep(fillEdge - 0.15, fillEdge + 0.15, uProgress * 1.3);

        // Base Carbon Black (#121212) -> Target Solid White (#FFFFFF)
        vec3 darkColor = vec3(0.07, 0.07, 0.07);
        vec3 whiteColor = vec3(1.0, 1.0, 1.0);

        vec3 finalColor = mix(darkColor, whiteColor, mask);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  }), [])

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const uniforms = meshRef.current.material.uniforms;
    
    // Smooth, snappy lerp transition target
    const targetProgress = isHovered ? 1.0 : 0.0;
    uniforms.uProgress.value = THREE.MathUtils.lerp(
      uniforms.uProgress.value,
      targetProgress,
      delta * 12.0
    );
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[5, 5]} />
      <shaderMaterial args={[shaderData]} />
    </mesh>
  )
}

export default function Button({ 
  text = 'Check availability', 
  href = '#', 
  className = '' 
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={href} className="inline-block">
      <button 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative overflow-hidden bg-carbon-black px-[clamp(16px,1vw+8px,16px)] py-0 w-[clamp(160px,12vw+70px,196px)] h-[clamp(44px,2.5vw+20px,49px)] rounded-full border border-eclipse font-geist-mono tracking-tight font-light uppercase text-[clamp(0.75rem,0.65rem+0.3vw,0.95rem)] text-center flex items-center justify-center cursor-pointer ${className}`}
      >
        {/* R3F WebGL Fill Layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none rounded-full overflow-hidden">
          <Canvas
            camera={{ position: [0, 0, 1] }}
            gl={{ preserveDrawingBuffer: true, antialias: true }}
            className="w-full h-full"
          >
            <ColorFillPlane isHovered={isHovered} />
          </Canvas>
        </div>

        {/* Text Layer: Dynamic color shift via CSS transition */}
        <span 
          className={`relative z-10 transition-colors duration-200 ease-out ${
            isHovered ? 'text-black font-normal' : 'text-ghost-white'
          }`}
        >
          {text}
        </span>
      </button>
    </Link>
  )
}