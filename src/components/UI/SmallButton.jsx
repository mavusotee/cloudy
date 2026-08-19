"use client";
import React, { useRef, useImperativeHandle, forwardRef } from "react";
import gsap from "gsap";

const SmallButton = forwardRef(({ isOpen }, ref) => {
  const buttonRef = useRef(null);

  useImperativeHandle(ref, () => ({
    triggerBlur: () => {
      if (!buttonRef.current) return;

      // Reset any existing animations instantly
      gsap.killTweensOf(buttonRef.current);

      // Flash heavy blur + slight scale expansion, then spring back crisp
      gsap.timeline()
        .fromTo(
          buttonRef.current,
          {
            filter: "blur(22px) brightness(1.4)",
            scale: 0.92,
            opacity: 0.6,
          },
          {
            filter: "blur(0px) brightness(1)",
            scale: 1,
            opacity: 1,
            duration: 0.45,
            ease: "back.out(1.7)", // Gentle spring snap back to clarity
          }
        );
    },
  }));

  return (
    <div
      ref={buttonRef}
      className={`font-mono tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)] border transition-colors duration-300 rounded-full w-[clamp(7.5rem,10vw,8.6875rem)] h-[clamp(1.75rem,2.5vw,2rem)] px-3 py-1 flex items-center justify-center text-center cursor-pointer select-none ${
        isOpen
          ? "bg-ghost-white text-carbon-black border-ghost-white hover:bg-zinc-300"
          : "bg-carbon-black text-ghost-white border-eclipse hover:bg-ghost-white hover:text-carbon-black hover:border-ghost-white"
      }`}
    >
      {isOpen ? "CLOSE" : "CLICK TO VIEW"}
    </div>
  );
});

SmallButton.displayName = "SmallButton";
export default SmallButton;