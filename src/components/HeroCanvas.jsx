'use client'
import React, { useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

const HighVelocityBlowShader = {
  uniforms: {
    uTextureA: { value: null },
    uTextureB: { value: null },
    uProgress: { value: 0 },
    uDirection: { value: 1.0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uVideoResA: { value: new THREE.Vector2(16, 9) },
    uVideoResB: { value: new THREE.Vector2(16, 9) }
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

    float hash(vec2 p) {
      p = fract(p * vec2(234.34, 435.345));
      p += dot(p, p + 34.23);
      return fract(p.x * p.y);
    }

    void main() {
      vec2 uvA = getCoverUv(vUv, uResolution, uVideoResA);
      vec2 uvB = getCoverUv(vUv, uResolution, uVideoResB);

      float velocity = sin(uProgress * 3.14159265);
      float streaks = hash(vec2(0.0, vUv.y * 320.0));

      float push = (velocity * 0.18 + streaks * velocity * 0.12) * uDirection;
      vec2 uvPushedA = vec2(uvA.x - push, uvA.y);
      vec2 uvPushedB = vec2(uvB.x + (1.0 - uProgress) * 0.12 * uDirection, uvB.y);

      float rgbSplit = velocity * 0.065 * uDirection;

      vec4 colA = vec4(0.0);
      vec4 colB = vec4(0.0);

      colA.r = texture2D(uTextureA, uvPushedA + vec2(rgbSplit * 1.5, 0.0)).r * 0.6 +
               texture2D(uTextureA, uvPushedA + vec2(rgbSplit * 2.0, 0.0)).r * 0.4;
      colA.g = texture2D(uTextureA, uvPushedA).g;
      colA.b = texture2D(uTextureA, uvPushedA - vec2(rgbSplit * 1.5, 0.0)).b * 0.6 +
               texture2D(uTextureA, uvPushedA - vec2(rgbSplit * 2.0, 0.0)).b * 0.4;
      colA.a = 1.0;

      colB.r = texture2D(uTextureB, uvPushedB - vec2(rgbSplit * 0.8, 0.0)).r;
      colB.g = texture2D(uTextureB, uvPushedB).g;
      colB.b = texture2D(uTextureB, uvPushedB + vec2(rgbSplit * 0.8, 0.0)).b;
      colB.a = 1.0;

      float coord = uDirection > 0.0 ? vUv.x : (1.0 - vUv.x);
      float sweep = uProgress * 1.4 - (coord * 0.4 + streaks * 0.08);
      float mask = smoothstep(0.0, 1.0, sweep);

      vec4 finalColor = mix(colA, colB, mask);
      vec3 blowGlow = vec3(0.9, 0.95, 1.0) * 0.25;
      finalColor.rgb += blowGlow * pow(velocity, 2.0);

      gl_FragColor = finalColor;
    }
  `
}

function createOptimizedVideoElement() {
  const v = document.createElement('video')
  v.muted = true
  v.loop = true
  v.playsInline = true
  v.crossOrigin = 'anonymous'
  v.preload = 'auto'
  return v
}

function ShaderPlane({ activeSrc, nextSrc, isTransitioning, onTransitionComplete, onVideoInit }) {
  const materialRef = useRef()
  const dirRef = useRef(1.0)
  const { size } = useThree()

  // Video refs
  const videoARef = useRef(null)
  const videoBRef = useRef(null)
  const texARef = useRef(null)
  const texBRef = useRef(null)
  const tweenRef = useRef(null)

  // Track active texture role: 0 = TexA is active, 1 = TexB is active
  const activeSlotRef = useRef(0)

  // 1. One-time setup
  useEffect(() => {
    if (!videoARef.current) {
      videoARef.current = createOptimizedVideoElement()
      const texA = new THREE.VideoTexture(videoARef.current)
      texA.minFilter = THREE.LinearFilter
      texA.magFilter = THREE.LinearFilter
      texA.generateMipmaps = false
      texARef.current = texA
    }
    if (!videoBRef.current) {
      videoBRef.current = createOptimizedVideoElement()
      const texB = new THREE.VideoTexture(videoBRef.current)
      texB.minFilter = THREE.LinearFilter
      texB.magFilter = THREE.LinearFilter
      texB.generateMipmaps = false
      texBRef.current = texB
    }
  }, [])

  // 2. Hardware Frame Sync
  useEffect(() => {
    let animIdA, animIdB

    const syncVideoA = () => {
      if (videoARef.current && texARef.current) texARef.current.needsUpdate = true
      if (videoARef.current && 'requestVideoFrameCallback' in videoARef.current) {
        animIdA = videoARef.current.requestVideoFrameCallback(syncVideoA)
      } else {
        animIdA = requestAnimationFrame(syncVideoA)
      }
    }

    const syncVideoB = () => {
      if (videoBRef.current && texBRef.current) texBRef.current.needsUpdate = true
      if (videoBRef.current && 'requestVideoFrameCallback' in videoBRef.current) {
        animIdB = videoBRef.current.requestVideoFrameCallback(syncVideoB)
      } else {
        animIdB = requestAnimationFrame(syncVideoB)
      }
    }

    syncVideoA()
    syncVideoB()

    return () => {
      if (videoARef.current && 'cancelVideoFrameCallback' in videoARef.current) {
        videoARef.current.cancelVideoFrameCallback(animIdA)
      } else {
        cancelAnimationFrame(animIdA)
      }
      if (videoBRef.current && 'cancelVideoFrameCallback' in videoBRef.current) {
        videoBRef.current.cancelVideoFrameCallback(animIdB)
      } else {
        cancelAnimationFrame(animIdB)
      }
    }
  }, [])

  // 3. Viewport size sync
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height)
    }
  }, [size])

  // 4. Initial Video Load
  useEffect(() => {
    const currentVideo = activeSlotRef.current === 0 ? videoARef.current : videoBRef.current
    if (!currentVideo || !activeSrc) return

    const targetSrc = window.location.origin + activeSrc
    if (currentVideo.src !== targetSrc && currentVideo.src !== activeSrc) {
      currentVideo.src = activeSrc
      currentVideo.onloadedmetadata = () => {
        if (materialRef.current) {
          materialRef.current.uniforms.uVideoResA.value.set(currentVideo.videoWidth || 16, currentVideo.videoHeight || 9)
        }
      }
      currentVideo.play().catch(() => {})
    }

    if (onVideoInit) onVideoInit(currentVideo)

    if (materialRef.current) {
      const activeTex = activeSlotRef.current === 0 ? texARef.current : texBRef.current
      materialRef.current.uniforms.uTextureA.value = activeTex
      materialRef.current.uniforms.uTextureB.value = activeTex
    }
  }, [activeSrc, onVideoInit])

  // 5. Ping-Pong Transition (NO VIDEO RE-ASSIGNMENT AT THE END)
  useEffect(() => {
    if (isTransitioning && nextSrc) {
      const isSlotZero = activeSlotRef.current === 0
      
      // Determine outgoing and incoming elements dynamically
      const outgoingVideo = isSlotZero ? videoARef.current : videoBRef.current
      const incomingVideo = isSlotZero ? videoBRef.current : videoARef.current
      const outgoingTex = isSlotZero ? texARef.current : texBRef.current
      const incomingTex = isSlotZero ? texBRef.current : texARef.current

      if (!incomingVideo || !materialRef.current) return

      // Assign target source strictly to the incoming buffer
      incomingVideo.src = nextSrc
      incomingVideo.currentTime = 0
      incomingVideo.onloadedmetadata = () => {
        if (materialRef.current) {
          const resUniform = isSlotZero ? 'uVideoResB' : 'uVideoResA'
          materialRef.current.uniforms[resUniform].value.set(
            incomingVideo.videoWidth || 16,
            incomingVideo.videoHeight || 9
          )
        }
      }

      incomingVideo.play().catch(() => {})

      // Bind outgoing & incoming textures to material
      materialRef.current.uniforms.uTextureA.value = outgoingTex
      materialRef.current.uniforms.uTextureB.value = incomingTex
      materialRef.current.uniforms.uDirection.value = dirRef.current

      if (tweenRef.current) tweenRef.current.kill()

      tweenRef.current = gsap.fromTo(
        materialRef.current.uniforms.uProgress,
        { value: 0 },
        {
          value: 1,
          duration: 1.5,
          ease: 'power4.out',
          onComplete: () => {
            // SWAP SLOTS SILENTLY: Set both slots to incomingTex so progress=0 doesn't glitch
            if (materialRef.current) {
              materialRef.current.uniforms.uTextureA.value = incomingTex
              materialRef.current.uniforms.uTextureB.value = incomingTex
              materialRef.current.uniforms.uProgress.value = 0
            }

            // Flip active slot pointer for next iteration
            activeSlotRef.current = isSlotZero ? 1 : 0
            dirRef.current *= -1.0

            // Pause outgoing video to free up memory & GPU decoding resources
            outgoingVideo.pause()

            onTransitionComplete()
            if (onVideoInit) onVideoInit(incomingVideo)
          }
        }
      )
    }
  }, [isTransitioning, nextSrc, onTransitionComplete, onVideoInit])

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        args={[HighVelocityBlowShader]}
        depthTest={false}
        depthWrite={false}
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
        frameloop="always"
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