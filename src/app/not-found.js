"use client";
import React, { useEffect, useRef, useState } from 'react';
import Navigation from '../components/UI/Navigation';
import gsap from "gsap";

function Error() {
  const maskRef = useRef(null);
  const containerRef = useRef(null);
  
  // Ref for the two different layers to strobe them
  const bwLayerRef = useRef(null);
  const colorLayerRef = useRef(null);

  useEffect(() => {
    // -------------------------------------------------------------------
    // 1. STROBE ANIMATION 
    // Targets the background images of both the BW and Color layers
    // -------------------------------------------------------------------
    const images = [
      "/Images/Artist3.jpg",
      "/Images/Work.jpg",
      "/Images/Working.jpg",
      "/Images/Artist4.jpg",
      "/Images/movie1.jpg",
      "/Images/movie7.jpg",
    ];

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });

      images.forEach((img) => {
        tl.to([bwLayerRef.current, colorLayerRef.current], {
          backgroundImage: `url(${img})`,
          duration: 0,
        })
        .to({}, { duration: 0.25 }); // Delay for the strobe effect
      });
    });

    // -------------------------------------------------------------------
    // 2. MOUSE TRACKING
    // -------------------------------------------------------------------
    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(maskRef.current, {
        clipPath: `circle(100px at ${x}px ${y}px)`,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(maskRef.current, {
        clipPath: `circle(0px at 50% 50%)`,
        duration: 0.5,
      });
    };

    const container = containerRef.current;
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      ctx.revert();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Shared classes for the 404 text to ensure alignment is identical
  const textStyles = "text-[10rem] md:text-[38rem] font-bold tracking-tighter leading-none select-none uppercase";

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-black text-white overflow-hidden font-news-cycle">
 

      <div ref={containerRef} className="error-text-container relative flex flex-col items-center justify-center cursor-crosshair text-center">
        
        {/* BASE LAYER (Dark gray shadow) */}
        <h1 className={`${textStyles} text-white rotate-90 text-5xl`}>404</h1>

        {/* LAYER 1: BLACK & WHITE STROBE */}
        <div 
          ref={bwLayerRef}
          className={`absolute inset-0 ${textStyles} grayscale`}
          style={{
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          404
        </div>

        {/* LAYER 2: COLOR REVEAL (LENS) */}
        <div 
          ref={maskRef}
          className={`absolute inset-0 ${textStyles}`}
          style={{
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            backgroundSize: "cover",
            backgroundPosition: "center",
            clipPath: "circle(0px at 50% 50%)",
            filter: "brightness(1.2)"
          }}
        >
          <div ref={colorLayerRef} className="absolute inset-0 w-full h-full" 
               style={{ 
                 backgroundImage: 'inherit', 
                 backgroundSize: 'cover', 
                 backgroundPosition: 'center',
                 WebkitBackgroundClip: "text",
                 backgroundClip: "text",
                 color: "transparent"
               }}>
            404
          </div>
        </div>

        <p className="text-zinc-200 uppercase tracking-widest text-sm -mt-10 lg:-mt-16 bg-black px-4 z-10">
          Error: Page Not Found
        </p>
      </div>
    </div>
  );
}

export default Error;