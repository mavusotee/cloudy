"use client";

import React, { useRef, useSyncExternalStore, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Clouds, Cloud } from "@react-three/drei";
import * as THREE from "three";

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const CLOUD_URL = "/textures/cloud.png";

// Shared ref to hold delayed scroll state
const delayedScroll = { current: 0, opacityFactor: 1 };

function RadialVaporRing() {
  const containerRef = useRef();

  useFrame((state, delta) => {
    if (!containerRef.current) return;

    const actualScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    
    // Smoothly interpolate scroll
    const speed = 1.5;
    delayedScroll.current += (actualScrollY - delayedScroll.current) * Math.min(1, delta * speed);

    const time = state.clock.elapsedTime;
    containerRef.current.rotation.z = time * 0.02;

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (docHeight > 0) {
      const progress = Math.min(1, Math.max(0, delayedScroll.current / docHeight));
      const bellCurve = Math.sin(progress * Math.PI);

      // Expansion
      const maxExpansion = 2.5; 
      const expansion = bellCurve * maxExpansion;
      containerRef.current.scale.setScalar(1 + expansion);

      // Aggressive drop to 0.05 (5%) opacity at peak expansion to remove steam
      const normalizedWave = Math.abs(Math.cos(progress * Math.PI));
      const min3DOpacity = 0.05; 
      delayedScroll.opacityFactor = min3DOpacity + normalizedWave * (1 - min3DOpacity);
    }
  });

  const factor = delayedScroll.opacityFactor;

  return (
    <group ref={containerRef}>
      <Clouds limit={24} frustumCulled={false} texture={CLOUD_URL}>
        <group position={[-4.5, 3.0, -1]}>
          <Cloud seed={12} scale={3.2} volume={14} color="#ffffff" opacity={0.35 * factor} fade={60} speed={0.15} growth={3} />
        </group>
        <group position={[4.5, 3.0, -1]}>
          <Cloud seed={34} scale={3.5} volume={16} color="#e8e8e8" opacity={0.30 * factor} fade={60} speed={0.20} growth={3} />
        </group>
        <group position={[-5.0, -2.8, -1]}>
          <Cloud seed={56} scale={3.0} volume={12} color="#d0d0d0" opacity={0.25 * factor} fade={70} speed={0.18} growth={2} />
        </group>
        <group position={[5.0, -2.8, -1]}>
          <Cloud seed={78} scale={3.2} volume={14} color="#ffffff" opacity={0.25 * factor} fade={70} speed={0.12} growth={3} />
        </group>
      </Clouds>
    </group>
  );
}

export default function GlobalCinematicFog() {
  const isClient = useIsClient();
  const wrapperRef = useRef();

  useEffect(() => {
    if (!isClient) return;

    let animationFrameId;

    const updateOpacity = () => {
      if (wrapperRef.current) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        if (docHeight > 0) {
          const progress = Math.min(1, Math.max(0, delayedScroll.current / docHeight));
          const normalizedWave = Math.abs(Math.cos(progress * Math.PI));

          // Lower DOM floor opacity to 0.1 (10%) at mid-scroll so background stays dark
          const minOpacity = 0.1;
          const fadeFactor = minOpacity + normalizedWave * (1 - minOpacity);

          wrapperRef.current.style.opacity = fadeFactor.toFixed(3);
        }
      }
      animationFrameId = requestAnimationFrame(updateOpacity);
    };

    animationFrameId = requestAnimationFrame(updateOpacity);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isClient]);

  if (!isClient) return null;

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-40 overflow-hidden"
      style={{ pointerEvents: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 75 }}
        gl={{ powerPreference: "high-performance", antialias: false, alpha: true }}
        style={{ pointerEvents: "none", width: "100%", height: "100%" }}
        events={() => ({ enabled: false })}
        onCreated={({ scene }) => {
          // Reduced global fog density from 0.004 down to 0.001 to stop the white film effect
          scene.fog = new THREE.FogExp2("#0a0c10", 0.001);
        }}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[5, 10, 5]} intensity={1.8} />

        <Suspense fallback={null}>
          <RadialVaporRing />
        </Suspense>
      </Canvas>
    </div>
  );
}