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

function RadialVaporRing() {
  const containerRef = useRef();

  useFrame((state) => {
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const time = state.clock.elapsedTime;

    if (containerRef.current) {
      containerRef.current.rotation.z = time * 0.02;
      const expansion = scrollY * 0.005;
      containerRef.current.scale.setScalar(1 + expansion);
    }
  });

  return (
    <group ref={containerRef}>
      <Clouds limit={24} frustumCulled={false} texture={CLOUD_URL}>
        <group position={[-4.5, 3.0, -1]}>
          <Cloud seed={12} scale={3.2} volume={14} color="#ffffff" opacity={0.35} fade={60} speed={0.15} growth={3} />
        </group>
        <group position={[4.5, 3.0, -1]}>
          <Cloud seed={34} scale={3.5} volume={16} color="#e8e8e8" opacity={0.30} fade={60} speed={0.20} growth={3} />
        </group>
        <group position={[-5.0, -2.8, -1]}>
          <Cloud seed={56} scale={3.0} volume={12} color="#d0d0d0" opacity={0.25} fade={70} speed={0.18} growth={2} />
        </group>
        <group position={[5.0, -2.8, -1]}>
          <Cloud seed={78} scale={3.2} volume={14} color="#ffffff" opacity={0.25} fade={70} speed={0.12} growth={3} />
        </group>
      </Clouds>
    </group>
  );
}

export default function GlobalCinematicFog() {
  const isClient = useIsClient();
  const wrapperRef = useRef();

  // Pure DOM scroll listener for parent opacity fade
  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      if (wrapperRef.current) {
        const scrollY = window.scrollY;
        const maxScrollFade = 500;
        const fadeFactor = Math.max(0, 1 - scrollY / maxScrollFade);
        wrapperRef.current.style.opacity = fadeFactor.toString();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isClient]);

  if (!isClient) return null;

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-40 overflow-hidden transition-opacity duration-75 ease-out"
      style={{ pointerEvents: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 75 }}
        gl={{ powerPreference: "high-performance", antialias: false, alpha: true }}
        style={{ pointerEvents: "none", width: "100%", height: "100%" }}
        events={() => ({ enabled: false })}
        onCreated={({ scene }) => {
          scene.fog = new THREE.FogExp2("#0a0c10", 0.004);
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