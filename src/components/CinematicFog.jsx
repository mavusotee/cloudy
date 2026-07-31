// components/CinematicFog.jsx
"use client";
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Clouds, Cloud } from "@react-three/drei";
import * as THREE from "three";

function SteamyVapor() {
  const leftGroupRef = useRef();
  const rightGroupRef = useRef();
  
  // Controls the dynamic fade factor on scroll
  const [fadeFactor, setFadeFactor] = useState(1);

  useFrame((state, delta) => {
    const scrollY = window.scrollY || 0;
    const idleY = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;

    // 1. Parting movement: Left moves out to -5.5, Right moves out to +5.5
    const targetLeftX = (scrollY / 250) * -5.5;
    const targetRightX = (scrollY / 250) * 5.5;

    // 2. Density reduction calculation:
    // Drops from 100% density down to ~35% density as you scroll,
    // leaving a subtle, visible mist frame on the outer edges instead of disappearing.
    const scrollProgress = Math.min(1, scrollY / 500);
    const newFadeFactor = 1 - scrollProgress * 0.65; // Floor is 0.35 (35% opacity retained)
    
    setFadeFactor(newFadeFactor);

    // Apply movement to Left Group
    if (leftGroupRef.current) {
      leftGroupRef.current.position.x = THREE.MathUtils.lerp(
        leftGroupRef.current.position.x,
        targetLeftX,
        0.05
      );
      leftGroupRef.current.position.y = idleY;
      leftGroupRef.current.rotation.z += delta * 0.008;
    }

    // Apply movement to Right Group
    if (rightGroupRef.current) {
      rightGroupRef.current.position.x = THREE.MathUtils.lerp(
        rightGroupRef.current.position.x,
        targetRightX,
        0.05
      );
      rightGroupRef.current.position.y = -idleY;
      rightGroupRef.current.rotation.z -= delta * 0.008;
    }
  });

  return (
    <Clouds material={THREE.MeshBasicMaterial} limit={20}>
      {/* LEFT FOG GROUP */}
      <group ref={leftGroupRef}>
        <Cloud
          seed={42}
          scale={3.5}
          volume={18}
          color="#f8f8ff"
          opacity={0.25 * fadeFactor} /* Starts at 0.25, eases down to ~0.08 */
          fade={80}
          speed={0.15}
          growth={3}
          position={[-1.5, 0, 1]}
        />
      </group>

      {/* RIGHT FOG GROUP */}
      <group ref={rightGroupRef}>
        <Cloud
          seed={88}
          scale={4.0}
          volume={20}
          color="#d0d0d0"
          opacity={.22 * fadeFactor} /* Starts at 0.12, eases down to ~0.04 */
          fade={100}
          speed={0.1}
          growth={2}
          position={[1.5, -1, -2]}
        />
      </group>
    </Clouds>
  );
}

export default function GlobalCinematicFog() {
  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none z-10">
      <Canvas 
        camera={{ position: [0, 0, 7], fov: 75 }}
        onCreated={({ scene }) => {
          // Retained your original scene haze
          scene.fog = new THREE.FogExp2("#0c0c0c", 0.035);
        }}
      >
        <ambientLight intensity={0.8} />
        <SteamyVapor />
      </Canvas>
    </div>
  );
}