'use client'

import React, { useRef, useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

const SmudgeTransitionShader = {
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

    vec3 permute(vec3 x) {
      return mod(((x * 34.0) + 1.0) * x, 289.0);
    }

    float snoise(vec2 v) {
      const vec4 C = vec4(
        0.211324865405187,
        0.366025403784439,
        -0.577350269189626,
        0.024390243902439
      );

      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);

      vec2 i1;

      i1 = (x0.x > x0.y)
        ? vec2(1.0, 0.0)
        : vec2(0.0, 1.0);

      vec4 x12 = x0.xyxy + C.xxzz;

      x12.xy -= i1;

      i = mod(i, 289.0);

      vec3 p = permute(
        permute(
          i.y + vec3(0.0, i1.y, 1.0)
        )
        + i.x
        + vec3(0.0, i1.x, 1.0)
      );

      vec3 m = max(
        0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
        ),
        0.0
      );

      m = m * m;
      m = m * m;

      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;

      m *= 1.79284291400159 -
        0.85373472095314 *
        (a0 * a0 + h * h);

      vec3 g;

      g.x =
        a0.x * x0.x +
        h.x * x0.y;

      g.yz =
        a0.yz * x12.xz +
        h.yz * x12.yw;

      return 130.0 * dot(m, g);
    }

    void main() {

      vec2 uvA = getCoverUv(
        vUv,
        uResolution,
        uVideoResA
      );

      vec2 uvB = getCoverUv(
        vUv,
        uResolution,
        uVideoResB
      );

      float transitionVelocity =
        sin(uProgress * 3.14159265);

      float noiseVal =
        snoise(
          vUv * 3.5 +
          vec2(
            uProgress * 1.8,
            uProgress * 0.8
          )
        );

      float secondaryNoise =
        snoise(
          vUv * 8.0 -
          vec2(uProgress * 2.5)
        );

      vec2 smudgeOffset = vec2(
        noiseVal * 0.18 +
        secondaryNoise * 0.06,

        snoise(vUv * 4.5) * 0.12
      )
      * transitionVelocity
      * uDirection;

      vec2 distortedUvA =
        uvA + smudgeOffset;

      vec2 distortedUvB =
        uvB -
        smudgeOffset *
        (1.0 - uProgress);

      float rgbSplit =
        transitionVelocity *
        0.04 *
        uDirection;

      vec4 colA = vec4(0.0);

      colA.r =
        texture2D(
          uTextureA,
          distortedUvA +
          vec2(
            rgbSplit,
            rgbSplit * 0.5
          )
        ).r;

      colA.g =
        texture2D(
          uTextureA,
          distortedUvA
        ).g;

      colA.b =
        texture2D(
          uTextureA,
          distortedUvA -
          vec2(
            rgbSplit,
            rgbSplit * 0.5
          )
        ).b;

      colA.a = 1.0;

      vec4 colB = vec4(0.0);

      colB.r =
        texture2D(
          uTextureB,
          distortedUvB -
          vec2(
            rgbSplit * 0.8,
            rgbSplit * 0.4
          )
        ).r;

      colB.g =
        texture2D(
          uTextureB,
          distortedUvB
        ).g;

      colB.b =
        texture2D(
          uTextureB,
          distortedUvB +
          vec2(
            rgbSplit * 0.8,
            rgbSplit * 0.4
          )
        ).b;

      colB.a = 1.0;

      float maskX =
        uDirection > 0.0
          ? vUv.x
          : (1.0 - vUv.x);

      float organicEdge =
        maskX +
        noiseVal * 0.25;

      float mask =
        smoothstep(
          0.0,
          1.0,
          (
            uProgress * 1.5 -
            organicEdge * 0.5
          )
        );

      vec4 finalColor =
        mix(
          colA,
          colB,
          mask
        );

      float edgeHighlight =
        smoothstep(
          0.0,
          0.1,
          1.0 -
          abs(mask - 0.5) * 2.0
        )
        * transitionVelocity;

      finalColor.rgb +=
        vec3(
          0.85,
          0.9,
          1.0
        )
        * edgeHighlight
        * 0.15;

      gl_FragColor =
        finalColor;
    }
  `
}


// =========================================================
// VIDEO CREATION
// =========================================================

function createOptimizedVideoElement() {
  const video = document.createElement('video')

  video.muted = true
  video.loop = true
  video.playsInline = true

  video.setAttribute(
    'playsinline',
    'true'
  )

  video.setAttribute(
    'webkit-playsinline',
    'true'
  )

  video.crossOrigin = 'anonymous'

  video.preload = 'metadata'

  return video
}


// =========================================================
// SAFE VIDEO PLAY
// =========================================================

async function safePlayVideo(
  video,
  unmute = false
) {
  if (!video) return

  if (unmute) {
    video.muted = false
    video.volume = 1.0
  }

  try {
    await video.play()
  } catch (err) {

    if (
      err.name === 'NotAllowedError' ||
      err.message?.includes(
        "user didn't interact"
      )
    ) {

      video.muted = true

      try {
        await video.play()
      } catch (e) {
        // Browser still prevented playback.
      }

    } else if (
      err.name !== 'AbortError'
    ) {

      console.warn(
        'Video playback warning:',
        err
      )
    }
  }
}


// =========================================================
// GET VIDEO DIMENSIONS
// =========================================================

function getVideoDimensions(video) {
  if (
    video &&
    video.videoWidth > 0 &&
    video.videoHeight > 0
  ) {
    return {
      width: video.videoWidth,
      height: video.videoHeight
    }
  }

  return {
    width: 16,
    height: 9
  }
}


// =========================================================
// UPDATE VIDEO RESOLUTION UNIFORM
// =========================================================

function updateVideoResolution(
  material,
  uniformName,
  video
) {
  if (!material || !video) return

  const {
    width,
    height
  } = getVideoDimensions(video)

  material.uniforms[
    uniformName
  ].value.set(
    width,
    height
  )
}


// =========================================================
// SHADER PLANE
// =========================================================

function ShaderPlane({
  activeSrc,
  nextSrc,
  isTransitioning,
  onTransitionComplete,
  onVideoInit
}) {

  const materialRef = useRef()

  const dirRef =
    useRef(1.0)

  const {
    size,
    gl
  } = useThree()

  const videoARef =
    useRef(null)

  const videoBRef =
    useRef(null)

  const texARef =
    useRef(null)

  const texBRef =
    useRef(null)

  const tweenRef =
    useRef(null)

  const activeSlotRef =
    useRef(0)


  // =======================================================
  // SHADER MATERIAL
  // =======================================================

  const shaderArgs = useMemo(() => {

    return {

      uniforms:
        THREE.UniformsUtils.clone(
          SmudgeTransitionShader.uniforms
        ),

      vertexShader:
        SmudgeTransitionShader.vertexShader,

      fragmentShader:
        SmudgeTransitionShader.fragmentShader

    }

  }, [])


  // =======================================================
  // VIDEO + TEXTURE INITIALIZATION
  // =======================================================

  useEffect(() => {

    if (!videoARef.current) {

      videoARef.current =
        createOptimizedVideoElement()

      const texA =
        new THREE.VideoTexture(
          videoARef.current
        )

      texA.minFilter =
        THREE.LinearFilter

      texA.magFilter =
        THREE.LinearFilter

      texA.generateMipmaps =
        false

      texARef.current =
        texA
    }


    if (!videoBRef.current) {

      videoBRef.current =
        createOptimizedVideoElement()

      const texB =
        new THREE.VideoTexture(
          videoBRef.current
        )

      texB.minFilter =
        THREE.LinearFilter

      texB.magFilter =
        THREE.LinearFilter

      texB.generateMipmaps =
        false

      texBRef.current =
        texB
    }


    return () => {

      if (tweenRef.current) {
        tweenRef.current.kill()
      }


      // VIDEO A

      if (videoARef.current) {

        videoARef.current.pause()

        videoARef.current.removeAttribute(
          'src'
        )

        videoARef.current.load()

        videoARef.current = null
      }


      if (texARef.current) {

        texARef.current.dispose()

        texARef.current = null
      }


      // VIDEO B

      if (videoBRef.current) {

        videoBRef.current.pause()

        videoBRef.current.removeAttribute(
          'src'
        )

        videoBRef.current.load()

        videoBRef.current = null
      }


      if (texBRef.current) {

        texBRef.current.dispose()

        texBRef.current = null
      }

    }

  }, [])


  // =======================================================
  // WEBGL CONTEXT LOSS
  // =======================================================

  useEffect(() => {

    const canvasEl =
      gl.domElement


    const handleContextLost =
      (event) => {

        event.preventDefault()

        if (tweenRef.current) {
          tweenRef.current.pause()
        }

      }


    const handleContextRestored =
      () => {

        gl.resetState()

        if (texARef.current) {
          texARef.current.needsUpdate =
            true
        }

        if (texBRef.current) {
          texBRef.current.needsUpdate =
            true
        }

      }


    canvasEl.addEventListener(
      'webglcontextlost',
      handleContextLost,
      false
    )

    canvasEl.addEventListener(
      'webglcontextrestored',
      handleContextRestored,
      false
    )


    return () => {

      canvasEl.removeEventListener(
        'webglcontextlost',
        handleContextLost
      )

      canvasEl.removeEventListener(
        'webglcontextrestored',
        handleContextRestored
      )

    }

  }, [gl])


  // =======================================================
  // SCREEN RESOLUTION
  // =======================================================

  useEffect(() => {

    if (
      materialRef.current
    ) {

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


  // =======================================================
  // ACTIVE VIDEO
  // =======================================================

  useEffect(() => {

    const currentVideo =
      activeSlotRef.current === 0
        ? videoARef.current
        : videoBRef.current


    if (
      !currentVideo ||
      !activeSrc
    ) {
      return
    }


    const targetSrc =
      activeSrc


    if (
      currentVideo.src !==
        targetSrc
    ) {

      currentVideo.src =
        targetSrc


      currentVideo.currentTime =
        0


      currentVideo.onloadedmetadata =
        () => {

          if (
            !materialRef.current
          ) {
            return
          }


          const uniformName =
            activeSlotRef.current === 0
              ? 'uVideoResA'
              : 'uVideoResB'


          updateVideoResolution(
            materialRef.current,
            uniformName,
            currentVideo
          )

        }


      currentVideo.onloadeddata =
        () => {

          if (
            !materialRef.current
          ) {
            return
          }


          const uniformName =
            activeSlotRef.current === 0
              ? 'uVideoResA'
              : 'uVideoResB'


          updateVideoResolution(
            materialRef.current,
            uniformName,
            currentVideo
          )

        }


      safePlayVideo(
        currentVideo,
        false
      )

    } else {

      // Make sure the resolution
      // remains correct even if
      // the source hasn't changed.

      const uniformName =
        activeSlotRef.current === 0
          ? 'uVideoResA'
          : 'uVideoResB'


      updateVideoResolution(
        materialRef.current,
        uniformName,
        currentVideo
      )


      if (
        currentVideo.paused
      ) {

        safePlayVideo(
          currentVideo,
          false
        )

      }

    }


    if (onVideoInit) {
      onVideoInit(
        currentVideo
      )
    }


    if (
      materialRef.current
    ) {

      const activeTex =
        activeSlotRef.current === 0
          ? texARef.current
          : texBRef.current


      materialRef.current
        .uniforms
        .uTextureA
        .value =
        activeTex


      materialRef.current
        .uniforms
        .uTextureB
        .value =
        activeTex

    }

  }, [
    activeSrc,
    onVideoInit
  ])


  // =======================================================
  // TRANSITION
  // =======================================================

  useEffect(() => {

    if (
      !isTransitioning ||
      !nextSrc
    ) {
      return
    }


    const isSlotZero =
      activeSlotRef.current === 0


    const outgoingVideo =
      isSlotZero
        ? videoARef.current
        : videoBRef.current


    const incomingVideo =
      isSlotZero
        ? videoBRef.current
        : videoARef.current


    const outgoingTex =
      isSlotZero
        ? texARef.current
        : texBRef.current


    const incomingTex =
      isSlotZero
        ? texBRef.current
        : texARef.current


    if (
      !incomingVideo ||
      !materialRef.current
    ) {
      return
    }


    // =====================================================
    // LOAD NEXT VIDEO
    // =====================================================

    incomingVideo.pause()

    incomingVideo.removeAttribute(
      'src'
    )

    incomingVideo.load()

    incomingVideo.src =
      nextSrc

    incomingVideo.currentTime =
      0


    const incomingUniform =
      isSlotZero
        ? 'uVideoResB'
        : 'uVideoResA'


    incomingVideo.onloadedmetadata =
      () => {

        if (
          materialRef.current
        ) {

          updateVideoResolution(
            materialRef.current,
            incomingUniform,
            incomingVideo
          )

        }

      }


    incomingVideo.onloadeddata =
      () => {

        if (
          materialRef.current
        ) {

          updateVideoResolution(
            materialRef.current,
            incomingUniform,
            incomingVideo
          )

        }

      }


    // =====================================================
    // PLAY NEXT VIDEO
    // =====================================================

    safePlayVideo(
      incomingVideo,
      false
    )


    // =====================================================
    // FADE OUTGOING AUDIO
    // =====================================================

    if (
      outgoingVideo
    ) {

      gsap.to(
        outgoingVideo,
        {
          volume: 0,
          duration: 1.0
        }
      )

    }


    // =====================================================
    // SHADER TEXTURES
    // =====================================================

    materialRef.current
      .uniforms
      .uTextureA
      .value =
      outgoingTex


    materialRef.current
      .uniforms
      .uTextureB
      .value =
      incomingTex


    materialRef.current
      .uniforms
      .uDirection
      .value =
      dirRef.current


    // =====================================================
    // TRANSITION
    // =====================================================

    if (
      tweenRef.current
    ) {
      tweenRef.current.kill()
    }


    tweenRef.current =
      gsap.fromTo(

        materialRef.current
          .uniforms
          .uProgress,

        {
          value: 0
        },

        {

          value: 1,

          duration: 1.3,

          ease:
            'power2.inOut',


          onComplete: () => {

            if (
              materialRef.current
            ) {

              materialRef.current
                .uniforms
                .uTextureA
                .value =
                incomingTex


              materialRef.current
                .uniforms
                .uTextureB
                .value =
                incomingTex


              materialRef.current
                .uniforms
                .uProgress
                .value = 0

            }


            activeSlotRef.current =
              isSlotZero
                ? 1
                : 0


            dirRef.current *=
              -1.0


            if (
              outgoingVideo
            ) {

              outgoingVideo.pause()

              outgoingVideo.currentTime =
                0

            }


            // Make absolutely sure
            // the incoming video's
            // actual dimensions are
            // stored after transition.

            if (
              materialRef.current
            ) {

              const activeUniform =
                isSlotZero
                  ? 'uVideoResB'
                  : 'uVideoResA'


              updateVideoResolution(
                materialRef.current,
                activeUniform,
                incomingVideo
              )

            }


            onTransitionComplete()


            if (
              onVideoInit
            ) {

              onVideoInit(
                incomingVideo
              )

            }

          }

        }

      )

  }, [
    isTransitioning,
    nextSrc,
    onTransitionComplete,
    onVideoInit
  ])


  // =======================================================
  // RENDER
  // =======================================================

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
// HERO CANVAS
// =========================================================

export default function HeroCanvas({
  activeSrc,
  nextSrc,
  isTransitioning,
  onTransitionComplete,
  onVideoInit
}) {

  return (

    <div
      className="
        absolute
        inset-0
        w-full
        h-full
        z-0
        pointer-events-none
        opacity-90
        bg-zinc-900
      "
    >

      <Canvas

        camera={{
          position: [0, 0, 1]
        }}

        gl={{
          powerPreference:
            'high-performance',

          antialias:
            false,

          preserveDrawingBuffer:
            false,

          failIfMajorPerformanceCaveat:
            false
        }}

        dpr={[
          1,
          1.5
        ]}

        frameloop="always"

        onCreated={({ gl }) => {

          gl.domElement.addEventListener(
            'webglcontextlost',
            (e) =>
              e.preventDefault(),
            false
          )

        }}

      >

        <ShaderPlane
          activeSrc={activeSrc}
          nextSrc={nextSrc}
          isTransitioning={
            isTransitioning
          }
          onTransitionComplete={
            onTransitionComplete
          }
          onVideoInit={
            onVideoInit
          }
        />

      </Canvas>

    </div>

  )
}