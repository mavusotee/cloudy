'use client'

import React, { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

const SmudgeShader = {
  uniforms: {
    uTextureA: { value: null },
    uTextureB: { value: null },
    uProgress: { value: 0 },
    uDirection: { value: 1.0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uImageResA: { value: new THREE.Vector2(1, 1) },
    uImageResB: { value: new THREE.Vector2(1, 1) }
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
    uniform vec2 uImageResA;
    uniform vec2 uImageResB;
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

    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uvA = getCoverUv(vUv, uResolution, uImageResA);
      vec2 uvB = getCoverUv(vUv, uResolution, uImageResB);

      float transitionVelocity = sin(uProgress * 3.14159265);

      float noiseVal = snoise(vUv * 3.5 + vec2(uProgress * 1.8, uProgress * 0.8));
      float secondaryNoise = snoise(vUv * 8.0 - vec2(uProgress * 2.5));
      
      vec2 smudgeOffset = vec2(
        noiseVal * 0.18 + secondaryNoise * 0.06,
        snoise(vUv * 4.5) * 0.12
      ) * transitionVelocity * uDirection;

      vec2 distortedUvA = uvA + smudgeOffset;
      vec2 distortedUvB = uvB - smudgeOffset * (1.0 - uProgress);

      float rgbSplit = transitionVelocity * 0.04 * uDirection;

      vec4 colA = vec4(0.0);
      colA.r = texture2D(uTextureA, distortedUvA + vec2(rgbSplit, rgbSplit * 0.5)).r;
      colA.g = texture2D(uTextureA, distortedUvA).g;
      colA.b = texture2D(uTextureA, distortedUvA - vec2(rgbSplit, rgbSplit * 0.5)).b;
      colA.a = 1.0;

      vec4 colB = vec4(0.0);
      colB.r = texture2D(uTextureB, distortedUvB - vec2(rgbSplit * 0.8, rgbSplit * 0.4)).r;
      colB.g = texture2D(uTextureB, distortedUvB).g;
      colB.b = texture2D(uTextureB, distortedUvB + vec2(rgbSplit * 0.8, rgbSplit * 0.4)).b;
      colB.a = 1.0;

      float maskX = uDirection > 0.0 ? vUv.x : (1.0 - vUv.x);
      float organicEdge = maskX + noiseVal * 0.25;
      float mask = smoothstep(0.0, 1.0, (uProgress * 1.5 - organicEdge * 0.5));

      vec4 finalColor = mix(colA, colB, mask);

      float edgeHighlight = smoothstep(0.0, 0.1, 1.0 - abs(mask - 0.5) * 2.0) * transitionVelocity;
      finalColor.rgb += vec3(0.85, 0.9, 1.0) * edgeHighlight * 0.15;

      gl_FragColor = finalColor;
    }
  `
}

function ImagePlane({ textureA, textureB, isHovered, duration, ease }) {
  const materialRef = useRef()
  const tweenRef = useRef(null)
  const { size } = useThree()

  const shaderArgs = useMemo(() => {
    return {
      uniforms: THREE.UniformsUtils.clone(SmudgeShader.uniforms),
      vertexShader: SmudgeShader.vertexShader,
      fragmentShader: SmudgeShader.fragmentShader
    }
  }, [])

  // Update container resolution uniform
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height)
    }
  }, [size])

  // Assign base textures and original aspect ratios
  useEffect(() => {
    if (!materialRef.current || !textureA) return

    const mat = materialRef.current
    const texB = textureB || textureA

    mat.uniforms.uTextureA.value = textureA
    mat.uniforms.uTextureB.value = texB

    if (textureA.image) {
      mat.uniforms.uImageResA.value.set(textureA.image.width || 1, textureA.image.height || 1)
    }
    if (texB.image) {
      mat.uniforms.uImageResB.value.set(texB.image.width || 1, texB.image.height || 1)
    }
  }, [textureA, textureB])

  // Animate progress on hover change
  useEffect(() => {
    if (!materialRef.current) return

    const mat = materialRef.current
    if (tweenRef.current) tweenRef.current.kill()

    mat.uniforms.uDirection.value = isHovered ? 1.0 : -1.0

    tweenRef.current = gsap.to(mat.uniforms.uProgress, {
      value: isHovered ? 1 : 0,
      duration: duration,
      ease: ease,
      overwrite: 'auto'
    })
  }, [isHovered, duration, ease])

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        args={[shaderArgs]}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

/**
 * Reusable Hover Smudge Canvas Component
 * 
 * @param {string} src - Primary image URL
 * @param {string} [hoverSrc] - Optional second image URL to transition into on hover
 * @param {string} [className] - Tailwind / CSS classes for wrapper sizing
 * @param {number} [duration=1.0] - GSAP animation length in seconds
 * @param {string} [ease='power2.out'] - GSAP easing profile
 * @param {React.ReactNode} [children] - Optional overlay elements (titles, buttons, badges)
 */
export default function HoverSmudgeCanvas({
  src,
  hoverSrc,
  className = "relative w-full h-[400px] overflow-hidden",
  duration = 1.0,
  ease = "power2.out",
  children,
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [textures, setTextures] = useState({ texA: null, texB: null })

  // Pre-loader for static images into Three.js textures
  useEffect(() => {
    let isMounted = true
    const loader = new THREE.TextureLoader()

    const loadTex = (url) => {
      return new Promise((resolve) => {
        loader.load(url, (tex) => {
          tex.minFilter = THREE.LinearFilter
          tex.magFilter = THREE.LinearFilter
          tex.generateMipmaps = false
          resolve(tex)
        })
      })
    }

    const loadAll = async () => {
      const texA = await loadTex(src)
      const texB = hoverSrc ? await loadTex(hoverSrc) : texA

      if (isMounted) {
        setTextures({ texA, texB })
      }
    }

    loadAll()

    return () => {
      isMounted = false
      if (textures.texA) textures.texA.dispose()
      if (textures.texB && textures.texB !== textures.texA) textures.texB.dispose()
    }
  }, [src, hoverSrc])

  return (
    <div
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {textures.texA && (
        <Canvas
          camera={{ position: [0, 0, 1] }}
          gl={{
            powerPreference: 'high-performance',
            antialias: false,
            preserveDrawingBuffer: false
          }}
          dpr={[1, 1.5]}
          frameloop="always"
        >
          <ImagePlane
            textureA={textures.texA}
            textureB={textures.texB}
            isHovered={isHovered}
            duration={duration}
            ease={ease}
          />
        </Canvas>
      )}

      {/* Optional HTML children layered over the canvas */}
      {children && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {children}
        </div>
      )}
    </div>
  )
}