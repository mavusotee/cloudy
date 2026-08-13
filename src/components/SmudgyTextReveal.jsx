"use client";
import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function SmudgyTextReveal({ text = "" }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const hasSettledRef = useRef(false);

  useLayoutEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      // Set perspective on container to activate 3D space rendering
      gsap.set(containerRef.current, { perspective: 1000 });

      // Split text into words automatically
      const split = new SplitText(textRef.current, {
        type: "words",
        wordsClass: "inline-block will-change-[filter,opacity,transform,color]",
      });

      const mm = gsap.matchMedia();

      // -------------------------------------------------------------
      // DESKTOP (Width > 768px)
      // -------------------------------------------------------------
      mm.add("(min-width: 769px)", () => {
        gsap.fromTo(
          split.words,
          {
            color: "rgb(65, 65, 70)",
            opacity: 0,
            filter: "blur(10px)",
            y: 38,
            x: 35,
            z: -150,
            rotationY: 50,
            rotationX: -32,
            transformOrigin: "50% 50% -100px",
          },
          {
            color: "rgb(255, 255, 255)",
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            x: 0,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 72%",
              end: "top 22%",
              scrub: 1.8,
              markers: true,
              onEnterBack: () => {
                hasSettledRef.current = false;
              },
            },
          }
        );
      });

      // -------------------------------------------------------------
      // MOBILE (Width <= 768px) - Tweak values specifically for touch screens
      // -------------------------------------------------------------
      mm.add("(max-width: 768px)", () => {
        gsap.fromTo(
          split.words,
          {
            color: "rgb(65, 65, 70)",
            opacity: 0,
            filter: "blur(8px)", // Slightly lighter blur for mobile performance
            y: 24,               // Tighter Y displacement to fit smaller viewports
            x: 20,               // Reduced horizontal shift to avoid accidental horizontal scroll
            z: -80,              // Reduced depth so text stays legible on small screens
            rotationY: 30,       // Gentler rotation
            rotationX: -20,
            transformOrigin: "50% 50% -50px",
          },
          {
            color: "rgb(255, 255, 255)",
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            x: 0,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            stagger: 0.04,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%", // Triggers earlier on mobile for smoother reveal
              end: "top 35%",
              scrub: 1.2,      // Faster catch-up for touch scrolling inertia
             
              onEnterBack: () => {
                hasSettledRef.current = false;
              },
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [text]);

  if (!text) return null;

  return (
    <div ref={containerRef} className="relative w-full lg:max-w-[765.9px]">
      <p
        ref={textRef}
        className="w-full leading-[120%] font-regular text-[clamp(1.45rem,5vw,2.925rem)] tracking-tight uppercase "
      >
        {text}
      </p>
    </div>
  );
}