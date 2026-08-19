"use client";

import React, { useRef, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";

/**
 * BlurFlicker Wraps any child element (buttons, cards, links) and applies 
 * a GSAP blur-flicker reveal animation on hover (or via imperative ref trigger).
 */
const BlurFlicker = forwardRef(({ children, className = "", triggerOnHover = true, ...props }, ref) => {
  const containerRef = useRef(null);

  const triggerAnimation = () => {
    if (!containerRef.current) return;

    gsap.killTweensOf(containerRef.current);

    gsap.fromTo(
      containerRef.current,
      {
        filter: "blur(22px) brightness(1.5)",
        scale: 0.92,
        opacity: 0.5,
      },
      {
        filter: "blur(0px) brightness(1)",
        scale: 1,
        opacity: 1,
        duration: 0.45,
        ease: "back.out(1.7)",
      }
    );
  };

  // Expose `triggerBlur` to parent components using refs
  useImperativeHandle(ref, () => ({
    triggerBlur: triggerAnimation,
  }));

  const handleMouseEnter = (e) => {
    if (triggerOnHover) {
      triggerAnimation();
    }
    if (props.onMouseEnter) {
      props.onMouseEnter(e);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </div>
  );
});

BlurFlicker.displayName = "BlurFlicker";

export default BlurFlicker;