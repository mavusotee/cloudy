"use client";

import React, {
  useRef,
  useSyncExternalStore,
  Suspense,
  useEffect,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Clouds, Cloud } from "@react-three/drei";
import * as THREE from "three";

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const CLOUD_URL = "/textures/cloud.png";

/* =========================================================
   SHARED SCROLL STATE
========================================================= */

const scrollState = {
  current: 0,
  target: 0,
};

/* =========================================================
   RADIAL STEAM
========================================================= */

function RadialVaporRing() {
  const containerRef = useRef();

  const smoothScroll = useRef(0);
  const smoothDepth = useRef(0);

  useFrame((state, delta) => {
    if (!containerRef.current) return;

    const actualScrollY =
      typeof window !== "undefined"
        ? window.scrollY
        : 0;

    /* =======================================================
       TARGET SCROLL
    ======================================================= */

    scrollState.target = actualScrollY;

    /*
     * Smoothly follow the actual page scroll.
     *
     * No wheel velocity.
     * No impulse.
     * No spring-back.
     */

    smoothScroll.current +=
      (scrollState.target - smoothScroll.current) *
      Math.min(1, delta * 5);

    scrollState.current =
      smoothScroll.current;

    /* =======================================================
       DOCUMENT PROGRESS
    ======================================================= */

    const docHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    let progress = 0;

    if (docHeight > 0) {
      progress = THREE.MathUtils.clamp(
        scrollState.current / docHeight,
        0,
        1
      );
    }

    /* =======================================================
       CONTROLLED CLOUD PULL
    ======================================================= */

    /*
     * This is the important part.
     *
     * We DO move the clouds toward the camera.
     *
     * But the movement is bounded.
     *
     * This prevents:
     *
     *  - clouds disappearing
     *  - clouds becoming enormous
     *  - clouds filling the entire screen
     *
     * The cloud field starts deeper and gradually moves
     * forward as the user scrolls.
     */

    const maxPull = 1.6;

    const targetDepth =
      progress * maxPull;

    smoothDepth.current +=
      (targetDepth - smoothDepth.current) *
      Math.min(1, delta * 4);

    containerRef.current.position.z =
      smoothDepth.current;

    /* =======================================================
       CONTROLLED ZOOM
    ======================================================= */

    /*
     * The zoom is permanently connected to scroll progress.
     *
     * It does NOT depend on wheel velocity.
     *
     * Therefore:
     *
     * scroll ↓
     *     clouds pull toward you
     *
     * stop
     *     clouds remain there
     *
     * scroll ↓
     *     clouds continue pulling
     */

    const maxZoom = 0.56;

    const zoom =
      progress * maxZoom;

    const finalScale =
      1 + zoom;

    containerRef.current.scale.set(
      finalScale,
      finalScale,
      finalScale
    );

    /* =======================================================
       SUBTLE LATERAL MOVEMENT
    ======================================================= */

    /*
     * A tiny amount of movement prevents the cloud field
     * from feeling like a static object being zoomed.
     */

    const lateral =
      progress * Math.PI * 1.25;

    containerRef.current.position.x =
      Math.sin(lateral) * 0.18;

    containerRef.current.position.y =
      Math.cos(lateral * 0.7) * 0.08;

    /* =======================================================
       SUBTLE ROTATION
    ======================================================= */

    /*
     * Slow atmospheric rotation.
     *
     * This is intentionally NOT tied to velocity.
     */

    const time =
      state.clock.elapsedTime;

    containerRef.current.rotation.z =
      Math.sin(time * 0.18) * 0.018;

    containerRef.current.rotation.x =
      Math.cos(time * 0.16) * 0.014;
  });

  return (
    <group ref={containerRef}>
      <Clouds
        limit={24}
        frustumCulled={false}
        texture={CLOUD_URL}
      >
        {/* =================================================
            TOP LEFT
        ================================================= */}

        <group
          position={[-4.5, 3.0, -1.6]}
        >
          <Cloud
            seed={12}
            scale={3.2}
            volume={26}
            color="#ffffff"
            opacity={0.35}
            fade={65}
            speed={0.25}
            growth={3.5}
          />
        </group>

        {/* =================================================
            TOP RIGHT
        ================================================= */}

        <group
          position={[4.5, 3.0, -1.8]}
        >
          <Cloud
            seed={34}
            scale={3.5}
            volume={16}
            color="#e8e8e8"
            opacity={0.17}
            fade={65}
            speed={0.20}
            growth={3}
          />
        </group>

        {/* =================================================
            BOTTOM LEFT
        ================================================= */}

        <group
          position={[-5.0, -2.8, -1.2]}
        >
          <Cloud
            seed={56}
            scale={3.0}
            volume={12}
            color="#d0d0d0"
            opacity={0.14}
            fade={75}
            speed={0.18}
            growth={2}
          />
        </group>

        {/* =================================================
            BOTTOM RIGHT
        ================================================= */}

        <group
          position={[5.0, -2.8, -1.4]}
        >
          <Cloud
            seed={78}
            scale={3.2}
            volume={14}
            color="#ffffff"
            opacity={0.15}
            fade={75}
            speed={0.12}
            growth={3}
          />
        </group>

        {/* =================================================
            CENTER BACK ATMOSPHERE
        ================================================= */}

        <group
          position={[0, 3.8, -3.4]}
        >
          <Cloud
            seed={91}
            scale={3.4}
            volume={15}
            color="#ffffff"
            opacity={0.09}
            fade={85}
            speed={0.10}
            growth={3}
          />
        </group>

        {/* =================================================
            CENTER LOWER ATMOSPHERE
        ================================================= */}

        <group
          position={[0, -4.0, -3.2]}
        >
          <Cloud
            seed={103}
            scale={3.6}
            volume={16}
            color="#eeeeee"
            opacity={0.08}
            fade={90}
            speed={0.12}
            growth={3}
          />
        </group>
      </Clouds>
    </group>
  );
}

/* =========================================================
   GLOBAL CINEMATIC FOG
========================================================= */

export default function GlobalCinematicFog() {
  const isClient = useIsClient();
  const wrapperRef = useRef();

  useEffect(() => {
    if (!isClient) return;

    let animationFrameId;

    const updateOpacity = () => {
      if (wrapperRef.current) {
        const docHeight =
          document.documentElement.scrollHeight -
          window.innerHeight;

        if (docHeight > 0) {
          const progress =
            THREE.MathUtils.clamp(
              scrollState.current / docHeight,
              0,
              1
            );

          /*
           * Keep the atmosphere present, but restrained.
           *
           * This is especially important against a black
           * website background.
           */

          const fade =
            0.42 +
            Math.abs(
              Math.cos(
                progress * Math.PI
              )
            ) *
              0.18;

          wrapperRef.current.style.opacity =
            fade.toFixed(3);
        }
      }

      animationFrameId =
        requestAnimationFrame(
          updateOpacity
        );
    };

    animationFrameId =
      requestAnimationFrame(
        updateOpacity
      );

    return () =>
      cancelAnimationFrame(
        animationFrameId
      );
  }, [isClient]);

  if (!isClient) return null;

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-40 overflow-hidden"
      style={{
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 7],
          fov: 75,
        }}
        gl={{
          powerPreference:
            "high-performance",
          antialias: false,
          alpha: true,
        }}
        style={{
          pointerEvents: "none",
          width: "100%",
          height: "100%",
        }}
        events={() => ({
          enabled: false,
        })}
        onCreated={({ scene }) => {
          scene.fog = new THREE.FogExp2(
            "#0a0c10",
            0.001
          );
        }}
      >
        <ambientLight intensity={1.2} />

        <directionalLight
          position={[5, 10, 5]}
          intensity={1.1}
        />

        <Suspense fallback={null}>
          <RadialVaporRing />
        </Suspense>
      </Canvas>
    </div>
  );
}