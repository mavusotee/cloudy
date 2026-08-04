"use client";
import React, { useRef, useSyncExternalStore, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Clouds, Cloud } from "@react-three/drei";
import * as THREE from "three";

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function RadialVaporRing() {
  const containerRef = useRef();
  const [opacityScale, setOpacityScale] = useState(1);

  useFrame((state, delta) => {
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const time = state.clock.elapsedTime;

    // Fade out as user scrolls down
    const maxScrollFade = 500;
    const currentFadeFactor = THREE.MathUtils.clamp(1 - scrollY / maxScrollFade, 0, 1);

    if (Math.abs(opacityScale - currentFadeFactor) > 0.01) {
      setOpacityScale(currentFadeFactor);
    }

    if (containerRef.current) {
      // Gentle rotational movement around the center clear pocket
      containerRef.current.rotation.z = time * 0.02;
      
      // Expand the radial clearance as user scrolls
      const expansion = scrollY * 0.005;
      containerRef.current.scale.setScalar(1 + expansion);
    }
  });

  return (
    <group ref={containerRef}>
      <Clouds limit={24} frustumCulled={false}>
        {/* TOP-LEFT FOG CLUSTER */}
        <group position={[-4.5, 3.0, -1]}>
          <Cloud
            seed={12}
            scale={3.2}
            volume={14}
            color="#ffffff"
            opacity={0.35 * opacityScale}
            fade={60}
            speed={0.15}
            growth={3}
          />
        </group>

        {/* TOP-RIGHT FOG CLUSTER */}
        <group position={[4.5, 3.0, -1]}>
          <Cloud
            seed={34}
            scale={3.5}
            volume={16}
            color="#e8e8e8"
            opacity={0.3 * opacityScale}
            fade={60}
            speed={0.2}
            growth={3}
          />
        </group>

        {/* BOTTOM-LEFT FOG CLUSTER */}
        <group position={[-5.0, -2.8, -1]}>
          <Cloud
            seed={56}
            scale={3.0}
            volume={12}
            color="#d0d0d0"
            opacity={0.25 * opacityScale}
            fade={70}
            speed={0.18}
            growth={2}
          />
        </group>

        {/* BOTTOM-RIGHT FOG CLUSTER */}
        <group position={[5.0, -2.8, -1]}>
          <Cloud
            seed={78}
            scale={3.2}
            volume={14}
            color="#ffffff"
            opacity={0.25 * opacityScale}
            fade={70}
            speed={0.12}
            growth={3}
          />
        </group>
      </Clouds>
    </group>
  );
}

export default function GlobalCinematicFog() {
  const isClient = useIsClient();

  if (!isClient) return null;

  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none z-40 overflow-hidden"
      style={{ pointerEvents: "none" }}
    >
      {/* --- SOFT RADIAL LIGHTENED VIGNETTE --- 
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          // Gentle radial glow that leaves the bottom 20% clear for UI elements
          background: "radial-gradient(ellipse 65% 55% at 50% 40%, rgba(0,0,0,0) 40%, rgba(10,12,16,0.45) 100%)"
        }}
      />
      */}

      {/* --- 3D RADIAL FOG CANVAS --- */}
      <Canvas 
        camera={{ position: [0, 0, 7], fov: 75 }}
        gl={{ powerPreference: "high-performance", antialias: false, alpha: true }}
        style={{ pointerEvents: "none", width: "100%", height: "100%" }} 
        events={() => ({ enabled: false })} 
        onCreated={({ scene }) => {
          // Extremely light scene fog so video details punch through clearly
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