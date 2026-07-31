// components/CinematicFog.jsx
"use client";
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Clouds, Cloud } from "@react-three/drei";
import * as THREE from "three";

function SteamyVapor() {
  const leftGroupRef = useRef();
  const rightGroupRef = useRef();
  
  // Ref to target the actual Cloud Instance
  const leftCloudRef = useRef();
  const rightCloudRef = useRef();

  useFrame((state, delta) => {
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const idleY = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;

    // 1. Parting movement
    const targetLeftX = (scrollY / 250) * -5.5;
    const targetRightX = (scrollY / 250) * 5.5;

    // 2. Opacity decay
    const scrollProgress = Math.min(1, scrollY / 500);
    const fadeFactor = 1 - scrollProgress * 0.65; // Retains ~35% opacity at max scroll

    // 3. Update material opacity safely inside Three.js scene tree
    if (leftCloudRef.current?.material) {
      leftCloudRef.current.material.opacity = 0.25 * fadeFactor;
    }
    if (rightCloudRef.current?.material) {
      rightCloudRef.current.material.opacity = 0.22 * fadeFactor;
    }

    // Apply movement
    if (leftGroupRef.current) {
      leftGroupRef.current.position.x = THREE.MathUtils.lerp(
        leftGroupRef.current.position.x,
        targetLeftX,
        0.05
      );
      leftGroupRef.current.position.y = idleY;
      leftGroupRef.current.rotation.z += delta * 0.008;
    }

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
    <Clouds limit={20}>
      {/* LEFT FOG GROUP */}
      <group ref={leftGroupRef}>
        <Cloud
          ref={leftCloudRef}
          seed={42}
          scale={3.5}
          volume={18}
          color="#f8f8ff"
          opacity={0.25}
          fade={80}
          speed={0.15}
          growth={3}
          position={[-1.5, 0, 1]}
        />
      </group>

      {/* RIGHT FOG GROUP */}
      <group ref={rightGroupRef}>
        <Cloud
          ref={rightCloudRef}
          seed={88}
          scale={4.0}
          volume={20}
          color="#d0d0d0"
          opacity={0.22}
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none z-50">
      <Canvas 
        camera={{ position: [0, 0, 7], fov: 75 }}
        gl={{ powerPreference: "high-performance", antialias: false, alpha: true }}
        onCreated={({ scene }) => {
          scene.fog = new THREE.FogExp2("#0c0c0c", 0.035);
        }}
      >
        <ambientLight intensity={1.2} />
        <SteamyVapor />
      </Canvas>
    </div>
  );
}