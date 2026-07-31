'use client'
import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

// --- HIGH-INTENSITY DIRECTIONAL BLOW & CHROMATIC SHADER WITH COVER MATH ---
const HighVelocityBlowShader = {
  uniforms: {
    uTextureA: { value: null },
    uTextureB: { value: null },
    uProgress: { value: 0 },    // 0.0 to 1.0
    uDirection: { value: 1.0 },  // 1.0 (L->R) or -1.0 (R->L)
    uResolution: { value: new THREE.Vector2(1, 1) }, // Viewport size
    uVideoResA: { value: new THREE.Vector2(16, 9) }, // Video A aspect ratio
    uVideoResB: { value: new THREE.Vector2(16, 9) }  // Video B aspect ratio
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTextureA;
    uniform sampler2D uTextureB;
    uniform float uProgress;
    uniform float uDirection;
    uniform vec2 uResolution;
    uniform vec2 uVideoResA;
    uniform vec2 uVideoResB;
    varying vec2 vUv;

    // Helper function for object-fit: cover UV calculations
    vec2 getCoverUv(vec2 uv, vec2 screenRes, vec2 mediaRes) {
      float screenAspect = screenRes.x / screenRes.y;
      float mediaAspect = mediaRes.x / mediaRes.y;
      vec2 ratio = vec2(
        min(screenAspect / mediaAspect, 1.0),
        min((1.0 / screenAspect) / (1.0 / mediaAspect), 1.0)
      );
      return vec2(
        uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        uv.y * ratio.y + (1.0 - ratio.y) * 0.5
      );
    }

    // Pseudo-random noise for directional blow streaks
    float hash(vec2 p) {
      p = fract(p * vec2(234.34, 435.345));
      p += dot(p, p + 34.23);
      return fract(p.x * p.y);
    }

    void main() {
      // 1. Correct UV coordinates to prevent aspect distortion
      vec2 uvA = getCoverUv(vUv, uResolution, uVideoResA);
      vec2 uvB = getCoverUv(vUv, uResolution, uVideoResB);

      // Bell curve for phase velocity (peaks at mid-transition)
      float velocity = sin(uProgress * 3.14159265);

      // High-frequency horizontal streak noise
      float streaks = hash(vec2(0.0, vUv.y * 320.0));

      // Directional displacement
      float push = (velocity * 0.18 + streaks * velocity * 0.12) * uDirection;
      vec2 uvPushedA = vec2(uvA.x - push, uvA.y);
      vec2 uvPushedB = vec2(uvB.x + (1.0 - uProgress) * 0.12 * uDirection, uvB.y);

      // CHROMATIC RGB SPLIT
      float rgbSplit = velocity * 0.065 * uDirection;

      vec4 colA = vec4(0.0);
      vec4 colB = vec4(0.0);

      // Sample Texture A with aspect-corrected UVs
      colA.r = texture2D(uTextureA, uvPushedA + vec2(rgbSplit * 1.5, 0.0)).r * 0.6 +
               texture2D(uTextureA, uvPushedA + vec2(rgbSplit * 2.0, 0.0)).r * 0.4;
      colA.g = texture2D(uTextureA, uvPushedA).g;
      colA.b = texture2D(uTextureA, uvPushedA - vec2(rgbSplit * 1.5, 0.0)).b * 0.6 +
               texture2D(uTextureA, uvPushedA - vec2(rgbSplit * 2.0, 0.0)).b * 0.4;
      colA.a = 1.0;

      // Sample Texture B with aspect-corrected UVs
      colB.r = texture2D(uTextureB, uvPushedB - vec2(rgbSplit * 0.8, 0.0)).r;
      colB.g = texture2D(uTextureB, uvPushedB).g;
      colB.b = texture2D(uTextureB, uvPushedB + vec2(rgbSplit * 0.8, 0.0)).b;
      colB.a = 1.0;

      // Directional sweep mask
      float coord = uDirection > 0.0 ? vUv.x : (1.0 - vUv.x);
      float sweep = uProgress * 1.4 - (coord * 0.4 + streaks * 0.08);
      float mask = smoothstep(0.0, 1.0, sweep);

      // Mix outgoing frame into incoming frame
      vec4 finalColor = mix(colA, colB, mask);

      // Flash glow
      vec3 blowGlow = vec3(0.9, 0.95, 1.0) * 0.25;
      finalColor.rgb += blowGlow * pow(velocity, 2.0);

      gl_FragColor = finalColor;
    }
  `
}

function ShaderPlane({ activeSrc, nextSrc, isTransitioning, onTransitionComplete, onVideoInit }) {
  const materialRef = useRef()
  const dirRef = useRef(1.0)
  const { size } = useThree()

  const videoARef = useRef(null)
  const videoBRef = useRef(null)
  const texARef = useRef(null)
  const texBRef = useRef(null)

  // Update uniform resolution on viewport change
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height)
    }
  }, [size])

  // 1. Initial Active Video Setup
  useEffect(() => {
    if (!videoARef.current) {
      const vA = document.createElement('video')
      vA.muted = true
      vA.loop = true
      vA.playsInline = true
      vA.crossOrigin = 'anonymous'
      videoARef.current = vA
      texARef.current = new THREE.VideoTexture(vA)
    }

    const vA = videoARef.current
    if (vA.src !== window.location.origin + activeSrc && activeSrc) {
      vA.src = activeSrc

      // Extract native video dimensions on metadata load
      vA.onloadedmetadata = () => {
        if (materialRef.current) {
          materialRef.current.uniforms.uVideoResA.value.set(vA.videoWidth || 16, vA.videoHeight || 9)
        }
      }

      vA.play().catch(() => {})
    }

    if (onVideoInit) {
      onVideoInit(vA)
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTextureA.value = texARef.current
      materialRef.current.uniforms.uTextureB.value = texARef.current
    }
  }, [activeSrc, onVideoInit])

  // 2. Trigger High-Velocity Blow Transition
  useEffect(() => {
    if (isTransitioning && nextSrc) {
      if (!videoBRef.current) {
        const vB = document.createElement('video')
        vB.muted = true
        vB.loop = true
        vB.playsInline = true
        vB.crossOrigin = 'anonymous'
        videoBRef.current = vB
        texBRef.current = new THREE.VideoTexture(vB)
      }

      const vB = videoBRef.current
      vB.src = nextSrc

      vB.onloadedmetadata = () => {
        if (materialRef.current) {
          materialRef.current.uniforms.uVideoResB.value.set(vB.videoWidth || 16, vB.videoHeight || 9)
        }
      }

      const runBlow = () => {
        if (!materialRef.current) return

        materialRef.current.uniforms.uTextureB.value = texBRef.current
        materialRef.current.uniforms.uDirection.value = dirRef.current

        gsap.fromTo(
          materialRef.current.uniforms.uProgress,
          { value: 0 },
          {
            value: 1,
            duration: 1.32,
            ease: 'power3.inOut',
            onComplete: () => {
              videoARef.current.src = nextSrc
              videoARef.current.play().catch(() => {})

              // Copy texture B's video size to texture A after transition swap
              if (materialRef.current) {
                materialRef.current.uniforms.uVideoResA.value.copy(
                  materialRef.current.uniforms.uVideoResB.value
                )
                materialRef.current.uniforms.uTextureA.value = texARef.current
                materialRef.current.uniforms.uTextureB.value = texARef.current
                materialRef.current.uniforms.uProgress.value = 0
              }

              dirRef.current *= -1.0
              onTransitionComplete()

              if (onVideoInit) {
                onVideoInit(videoARef.current)
              }
            }
          }
        )
      }

      vB.play().then(() => runBlow()).catch(() => runBlow())
    }
  }, [isTransitioning, nextSrc, onTransitionComplete, onVideoInit])

  useFrame(() => {
    if (texARef.current) texARef.current.needsUpdate = true
    if (texBRef.current) texBRef.current.needsUpdate = true
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        args={[HighVelocityBlowShader]}
      />
    </mesh>
  )
}

export default function HeroCanvas({ activeSrc, nextSrc, isTransitioning, onTransitionComplete, onVideoInit }) {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-90 bg-zinc-900">
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        gl={{ powerPreference: 'high-performance', antialias: false }}
        dpr={[1, 1.5]}
      >
        <ShaderPlane
          activeSrc={activeSrc}
          nextSrc={nextSrc}
          isTransitioning={isTransitioning}
          onTransitionComplete={onTransitionComplete}
          onVideoInit={onVideoInit}
        />
      </Canvas>
    </div>
  )
}