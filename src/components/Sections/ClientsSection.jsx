"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

function ClientsSection() {
  const trackRef = useRef(null);
  const blurTweenRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      const items = track.children;
      const totalWidth = track.scrollWidth / 2;

      // =========================================================
      // INFINITE CAROUSEL
      // =========================================================

      const loop = gsap.to(items, {
        x: `-=${totalWidth}`,
        duration: 25,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
        },
      });

      // =========================================================
      // SCROLL VELOCITY / DIZZINESS EFFECT
      // =========================================================

      const handleWheel = (event) => {
        const delta = event.deltaY;

        // Scroll down (delta > 0) = right to left (timeScale = 1 + boost)
        // Scroll up (delta < 0)   = left to right (timeScale = -1 - boost)
        const direction = delta > 0 ? 1 : -1;
        const speedBoost = Math.min(Math.abs(delta) / 20, 5);
        const targetTimeScale = direction * (1 + speedBoost);

        // Blur based on scroll velocity
        const blur = Math.min(Math.abs(delta) / 18, 8);

        if (blurTweenRef.current) {
          blurTweenRef.current.kill();
        }

        // Accelerate carousel speed in scroll direction + add blur
        gsap.to(loop, {
          timeScale: targetTimeScale,
          duration: 0.1,
          overwrite: "auto",
        });

        gsap.to(track, {
          filter: `blur(${blur}px)`,
          duration: 0.08,
          ease: "power2.out",
          overwrite: "auto",
        });

        // Smoothly return loop to base speed and clear blur
        blurTweenRef.current = gsap.timeline()
          .to(loop, {
            timeScale: direction,
            duration: 0.6,
            ease: "power2.out",
          })
          .to(
            track,
            {
              filter: "blur(0px)",
              duration: 0.3,
              ease: "power3.out",
            },
            "<"
          );
      };

      window.addEventListener("wheel", handleWheel, {
        passive: true,
      });

      return () => {
        window.removeEventListener("wheel", handleWheel);

        if (blurTweenRef.current) {
          blurTweenRef.current.kill();
        }
      };
    }, trackRef);

    return () => ctx.revert();
  }, []);

  const clientBlocks = Array.from({ length: 6 });

  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 bg-black mt-[clamp(3rem,8vw,0.5rem)] overflow-hidden mb-10 md:mb-40">
      {/* HEADER */}
      <div className="flex flex-row items-center justify-between w-full text-zinc-300 px-4 md:px-8">
        <div className="font-mono tracking-tight text-[clamp(0.5rem,0.8vw,0.725rem)] flex items-center gap-[clamp(0.35rem,0.6vw,0.6rem)]">
          <div className="w-[clamp(0.35rem,0.5vw,0.5rem)] h-[clamp(0.35rem,0.5vw,0.5rem)] bg-zinc-300" />
          <h1>CLIENTS</h1>
        </div>

        <h1 className="font-mono tracking-tight text-[clamp(0.5rem,0.8vw,0.725rem)]">
          [CLOUD_4]
        </h1>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col space-y-[clamp(1.5rem,4vw,4.5rem)] mt-[clamp(1.5rem,3.5vw,1.5rem)] mb-10">
        {/* TITLE */}
        <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-sans tracking-tight text-ghost-white max-w-[clamp(18rem,80vw,40rem)] leading-tight px-4 md:px-8">
          OUR CURRENT ROSTER:
        </h1>

        {/* FULL BLEED HORIZONTAL LOGO TRACK */}
        <div className="relative w-full overflow-hidden">
          {/* Edge fade gradient masks */}
          <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-carbon-black to-transparent z-10 pointer-events-none" />

          <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-carbon-black to-transparent z-10 pointer-events-none" />

          <div
            ref={trackRef}
            className="flex flex-row space-x-[clamp(1rem,2vw,1.5rem)] w-max will-change-transform"
          >
            {/* Original Set */}
            {clientBlocks.map((_, i) => (
              <div
                key={`client-1-${i}`}
                className="w-[clamp(16rem,45vw,23rem)] h-[clamp(8rem,20vw,15rem)] shrink-0 border border-eclipse bg-black"
              />
            ))}

            {/* Duplicated Set */}
            {clientBlocks.map((_, i) => (
              <div
                key={`client-2-${i}`}
                className="w-[clamp(16rem,45vw,25rem)] h-[clamp(8rem,20vw,15rem)] shrink-0 border border-eclipse bg-black"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientsSection;