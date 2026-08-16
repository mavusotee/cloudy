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

      // Split text into lines instead of words
      const split = new SplitText(textRef.current, {
        type: "lines",
        linesClass: "block will-change-[filter,opacity,transform,color]",
      });

      const mm = gsap.matchMedia();

      // -------------------------------------------------------------
      // DESKTOP (Width > 768px)
      // -------------------------------------------------------------
      mm.add("(min-width: 769px)", () => {
        gsap.fromTo(
          split.lines,
          {
            color: "rgb(65, 65, 70)",
            opacity: 0,
            filter: "blur(12px)",
            y: 48,
            x: 20,
            z: -300,
            rotationY: 35,
            rotationX: -25,
            transformOrigin: "0% 50% -100px",
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
            stagger: 0.12, // Increased stagger for distinct line sequence
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 72%",
              end: "top 22%",
              scrub: 1.8,
           
              onEnterBack: () => {
                hasSettledRef.current = false;
              },
            },
          }
        );
      });

      // -------------------------------------------------------------
      // MOBILE (Width <= 768px)
      // -------------------------------------------------------------
      mm.add("(max-width: 768px)", () => {
        gsap.fromTo(
          split.lines,
          {
            color: "rgb(44, 44, 47)",
            opacity: 0,
            filter: "blur(8px)",
            y: 20,
            x: 5,
            z: -80,
            rotationY: 20,
            rotationX: -25,
            transformOrigin: "0% 50% -50px",
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
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              end: "top 35%",
              scrub: 1.2,
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
        className="w-full leading-[120%] font-regular text-[clamp(1.45rem,5vw,3.125rem)] tracking-tight uppercase"
      >
        {text}
      </p>
    </div>
  );
}