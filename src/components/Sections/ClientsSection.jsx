"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

function ClientsSection() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      const items = track.children;
      const totalWidth = track.scrollWidth / 2;

      // Seamless infinite loop from right to left
      gsap.to(items, {
        x: `-=${totalWidth}`,
        duration: 25,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
        },
      });
    }, trackRef);

    return () => ctx.revert();
  }, []);

  const clientBlocks = Array.from({ length: 6 });

  return (
    <div className="w-full h-auto bg-carbon-black mt-[clamp(3rem,8vw,0.5rem)] relative -mx-[clamp(1rem,4vw,3rem)] px-[clamp(1rem,4vw,3rem)] overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-row items-center justify-between w-full text-zinc-300">
        <div className="font-mono tracking-tight text-[clamp(0.5rem,0.8vw,0.725rem)] flex items-center gap-[clamp(0.35rem,0.6vw,0.6rem)]">
          <div className="w-[clamp(0.35rem,0.5vw,0.5rem)] h-[clamp(0.35rem,0.5vw,0.5rem)] bg-zinc-300" />
          <h1>CLIENTS</h1>
        </div>
        <h1 className="font-mono tracking-tight text-[clamp(0.5rem,0.8vw,0.725rem)]">[CLOUD_4]</h1>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col space-y-[clamp(1.5rem,4vw,4.5rem)] mt-[clamp(1.5rem,3.5vw,1.5rem)]">
        {/* TITLE */}
        <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-sans tracking-tight text-ghost-white max-w-[clamp(18rem,80vw,40rem)] leading-tight">
          OUR CURRENT ROSTER:
        </h1>

        {/* FULL BLEED HORIZONTAL LOGO TRACK */}
        <div className="relative -mx-[clamp(1rem,4vw,3rem)] px-[clamp(1rem,4vw,3rem)] overflow-hidden">
          {/* Edge fade gradient masks for smooth blending */}
          <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-carbon-black to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-carbon-black to-transparent z-10 pointer-events-none" />

          <div ref={trackRef} className="flex flex-row space-x-[clamp(1rem,2vw,1.5rem)] w-max">
            {/* Original Set */}
            {clientBlocks.map((_, i) => (
              <div
                key={`client-1-${i}`}
                className="w-[clamp(16rem,45vw,23rem)] h-[clamp(8rem,20vw,15rem)] shrink-0 border border-eclipse bg-carbon-black"
              />
            ))}
            {/* Duplicated Set for Seamless Loop */}
            {clientBlocks.map((_, i) => (
              <div
                key={`client-2-${i}`}
                className="w-[clamp(16rem,45vw,25rem)] h-[clamp(8rem,20vw,15rem)] shrink-0 border border-eclipse bg-carbon-black"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientsSection;