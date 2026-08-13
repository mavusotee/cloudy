// components/SmudgyTextReveal.jsx
"use client";
import React, { useRef, useLayoutEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmudgyTextReveal({ text = "" }) {
  const containerRef = useRef(null);
  const charsRef = useRef([]);

  // Safely split text into words with empty string fallback
  const words = useMemo(() => (text || "").split(" "), [text]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Filter out null/undefined refs
      const validChars = charsRef.current.filter(Boolean);
      if (!validChars.length) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;

      // 1. Calculate each character's exact radial distance from paragraph center
      const charData = validChars.map((charEl) => {
        const rect = charEl.getBoundingClientRect();
        const charX = rect.left - containerRect.left + rect.width / 2;
        const charY = rect.top - containerRect.top + rect.height / 2;

        // Euclidean circular distance formula
        const dist = Math.hypot(charX - centerX, charY - centerY);
        return { el: charEl, dist };
      });

      // Sort characters by their radial distance (center outwards)
      const sortedChars = charData
        .sort((a, b) => a.dist - b.dist)
        .map((item) => item.el);

      // 2. GSAP scrub timeline: Pure radial color shift (Gray -> White)
      gsap.fromTo(
        sortedChars,
        {
          color: "rgb(43, 43, 45)", // Base muted zinc gray
        },
        {
          color: "rgb(255, 255, 255)", // Full white target
          stagger: {
            each: 0.025,
            from: "start", // Color ripple grows outward from the center
          },
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "top 28%",
            scrub: 0.9,
            pin: false,
            preventOverlaps: true,
            fastScrollEnd: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [text]);

  // Reset character refs array on re-render
  charsRef.current = [];

  if (!text) return null;

  return (
    <div ref={containerRef} className="relative w-full lg:max-w-[755.9px]">
      <p className="w-full leading-[110%] font-regular text-[clamp(0.85rem,5vw,2.525rem)] tracking-tight uppercase flex flex-wrap gap-x-[0.3em] gap-y-[0.1em]">
        {words.map((word, wordIdx) => (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {word.split("").map((char, charIdx) => (
              <span
                key={charIdx}
                ref={(el) => {
                  if (el) charsRef.current.push(el);
                }}
                className="inline-block text-zinc-300 will-change-[color]"
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </p>
    </div>
  );
}