"use client";
import React, { useRef, useSyncExternalStore, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Clouds, Cloud } from "@react-three/drei";
import * as THREE from "three";

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function SteamyVapor() {
  const leftGroupRef = useRef();
  const rightGroupRef = useRef();
  
  // Track dynamic opacity state driven by scroll
  const [opacityScale, setOpacityScale] = useState(1);

  useFrame((state, delta) => {
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const time = state.clock.elapsedTime;

    // --- FADE OUT LOGIC ---
    // Start fading immediately, completely invisible by 600px scroll depth
    const maxScrollFade = 600; 
    const currentFadeFactor = THREE.MathUtils.clamp(1 - scrollY / maxScrollFade, 0, 1);

    // Only trigger state updates when opacity actually changes significantly
    if (Math.abs(opacityScale - currentFadeFactor) > 0.01) {
      setOpacityScale(currentFadeFactor);
    }

    // --- Parting & Scattering Dynamics ---
    const scrollMult = 0.012;
    
    const targetLeftX = -1.5 - scrollY * scrollMult;
    const targetRightX = 1.5 + scrollY * scrollMult;

    const targetLeftY = Math.sin(time * 0.4) * 0.2 + scrollY * 0.004;
    const targetRightY = -Math.sin(time * 0.4) * 0.2 - scrollY * 0.005;

    const targetLeftZ = 0 + scrollY * 0.002;
    const targetRightZ = -1 - scrollY * 0.003;

    const swirlSpeed = 0.008 + scrollY * 0.00005;
    const lerpSpeed = 0.08;

    // Left Group Transforms
    if (leftGroupRef.current) {
      leftGroupRef.current.position.x = THREE.MathUtils.lerp(
        leftGroupRef.current.position.x,
        targetLeftX,
        lerpSpeed
      );
      leftGroupRef.current.position.y = THREE.MathUtils.lerp(
        leftGroupRef.current.position.y,
        targetLeftY,
        lerpSpeed
      );
      leftGroupRef.current.position.z = THREE.MathUtils.lerp(
        leftGroupRef.current.position.z,
        targetLeftZ,
        lerpSpeed
      );

      leftGroupRef.current.rotation.z += delta * swirlSpeed;
      leftGroupRef.current.rotation.x = Math.sin(time * 0.5 + scrollY * 0.002) * 0.15;
    }

    // Right Group Transforms
    if (rightGroupRef.current) {
      rightGroupRef.current.position.x = THREE.MathUtils.lerp(
        rightGroupRef.current.position.x,
        targetRightX,
        lerpSpeed
      );
      rightGroupRef.current.position.y = THREE.MathUtils.lerp(
        rightGroupRef.current.position.y,
        targetRightY,
        lerpSpeed
      );
      rightGroupRef.current.position.z = THREE.MathUtils.lerp(
        rightGroupRef.current.position.z,
        targetRightZ,
        lerpSpeed
      );

      rightGroupRef.current.rotation.z -= delta * swirlSpeed;
      rightGroupRef.current.rotation.y = Math.cos(time * 0.5 + scrollY * 0.002) * 0.15;
    }
  });

  return (
    <Clouds limit={20} frustumCulled={false}>
      {/* LEFT FOG GROUP */}
      <group ref={leftGroupRef} position={[-1.5, 0, 0]}>
        <Cloud
          seed={42}
          scale={3.5}
          volume={18}
          color="#ffffff"
          // Multiplied base opacity by our dynamic scroll fade factor
          opacity={0.5 * opacityScale}
          fade={80}
          speed={0.25}
          growth={4}
          position={[0, 0, 1]}
        />
      </group>

      {/* RIGHT FOG GROUP */}
      <group ref={rightGroupRef} position={[1.5, 0, 0]}>
        <Cloud
          seed={88}
          scale={4.0}
          volume={20}
          color="#e0e0e0"
          // Multiplied base opacity by our dynamic scroll fade factor
          opacity={0.4 * opacityScale}
          fade={100}
          speed={0.2}
          growth={3}
          position={[0, -1, -2]}
        />
      </group>
    </Clouds>
  );
}

export default function GlobalCinematicFog() {
  const isClient = useIsClient();

  if (!isClient) return null;

  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
      style={{ pointerEvents: "none" }}
    >
      <Canvas 
        camera={{ position: [0, 0, 7], fov: 75 }}
        gl={{ powerPreference: "high-performance", antialias: false, alpha: true }}
        style={{ pointerEvents: "none", width: "100%", height: "100%" }} 
        events={() => ({ enabled: false })} 
        onCreated={({ scene }) => {
          scene.fog = new THREE.FogExp2("#0c0c0c", 0.015);
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={2.0} />

        <Suspense fallback={null}>
          <SteamyVapor />
        </Suspense>
      </Canvas>
    </div>
  );
}