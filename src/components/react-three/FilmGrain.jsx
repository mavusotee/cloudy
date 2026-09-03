'use client'

import React, {
  useRef,
  useMemo,
  useEffect
} from 'react'

import {
  Canvas,
  useThree,
  useFrame
} from '@react-three/fiber'

import * as THREE from 'three'


/*
  This is the exact grain math from HeroCanvas's
  "FILM GRAIN REVEAL" block — same hash function, same
  fine + coarse two-layer blend (0.7 / 0.3) — pulled out
  on its own so it can run as a constant, site-wide layer
  instead of only appearing on hover.

  It's a real WebGL shader (not a 2D canvas trick), so the
  grain is pixel-for-pixel the same texture you already
  liked. It's a single full-screen quad with no textures
  or video, so the GPU cost is negligible — safe to leave
  mounted everywhere.

  The shader writes a neutral mid-gray (0.5) plus the grain
  deviation, and the canvas is composited with
  mix-blend-mode: 'overlay', so — same as before — it never
  washes out or darkens the page globally. Overlay treats
  0.5 as a no-op; only the grain deviation shows.
*/

const FilmGrainShader = {

  uniforms: {

    uTime: { value: 0 },

    uResolution: {
      value: new THREE.Vector2(1, 1)
    },

    uIntensity: { value: 0.08 }

  },


  vertexShader: `

    varying vec2 vUv;

    void main() {

      vUv = uv;

      gl_Position =
        vec4(position, 1.0);

    }

  `,


  fragmentShader: `

    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uIntensity;

    varying vec2 vUv;


    // ---------------------------------------------------
    // same hash used for the hero's hover grain
    // ---------------------------------------------------

    float hash(vec2 p) {

      return fract(

        sin(
          dot(
            p,
            vec2(12.9898, 78.233)
          )
        )
        * 43758.5453123

      );

    }


    void main() {

      float grainNoise =
        hash(

          vUv * uResolution.xy * 0.75 +

          vec2(
            uTime * 97.0,
            uTime * 61.0
          )

        );

      // a second, coarser layer so the grain clumps
      // rather than reading as uniform digital hiss

      float grainCoarse =
        hash(

          floor(vUv * uResolution.xy * 0.18) +

          vec2(
            uTime * 43.0,
            uTime * 29.0
          )

        );

      float grain =
        (grainNoise - 0.5) *
        0.7
        +
        (grainCoarse - 0.5) *
        0.3;

      float value =
        0.5 +
        grain *
        uIntensity;

      gl_FragColor =
        vec4(
          vec3(value),
          1.0
        );

    }

  `

}


// =========================================================
// GRAIN PLANE
// =========================================================

function GrainPlane({ intensity }) {

  const materialRef =
    useRef()

  const { size } =
    useThree()


  const shaderArgs =
    useMemo(() => {

      return {

        uniforms:
          THREE.UniformsUtils.clone(
            FilmGrainShader.uniforms
          ),

        vertexShader:
          FilmGrainShader
            .vertexShader,

        fragmentShader:
          FilmGrainShader
            .fragmentShader

      }

    }, [])


  useEffect(() => {

    if (materialRef.current) {

      materialRef.current
        .uniforms
        .uResolution
        .value
        .set(
          size.width,
          size.height
        )

    }

  }, [size])


  useEffect(() => {

    if (materialRef.current) {

      materialRef.current
        .uniforms
        .uIntensity
        .value =
        intensity

    }

  }, [intensity])


  useFrame((_, delta) => {

    if (materialRef.current) {

      materialRef.current
        .uniforms
        .uTime
        .value +=
        delta

    }

  })


  return (

    <mesh>

      <planeGeometry
        args={[2, 2]}
      />

      <shaderMaterial
        ref={materialRef}
        args={[shaderArgs]}
        depthTest={false}
        depthWrite={false}
      />

    </mesh>

  )

}


// =========================================================
// FILM GRAIN (global overlay)
// =========================================================

export default function FilmGrain({

  // Grain deviation strength. Tune to taste — this is the
  // same intensity concept as the hero shader's
  // grainAmount, just constant instead of spotlight-driven.
  intensity = 0.08,

  // CSS mix-blend-mode for the overlay. 'overlay' is the
  // default; 'soft-light' is gentler if it reads too
  // contrasty on your palette.
  blendMode = 'overlay',

  // Turn the effect off without unmounting it.
  disabled = false,

  className = '',

  style = {}

}) {

  if (disabled) {
    return null
  }


  return (

    <div

      aria-hidden="true"

      className={className}

      style={{

        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: blendMode,
        ...style

      }}

    >

      <Canvas

        gl={{

          powerPreference: 'low-power',
          antialias: false,
          alpha: false,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false

        }}

        dpr={[1, 1]}

        frameloop="always"

        camera={{ position: [0, 0, 1] }}

        style={{ pointerEvents: 'none' }}

        onCreated={({ gl }) => {

          // Belt and suspenders: R3F sometimes sets its own
          // inline style on the real <canvas> node, which can
          // win over the CSS inheritance from the wrapper div
          // above. Force it here so clicks always pass through.
          gl.domElement.style.pointerEvents = 'none'

        }}

      >

        <GrainPlane intensity={intensity} />

      </Canvas>

    </div>

  )

}