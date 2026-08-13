// app/template.js
"use client";
import { useEffect } from "react";
import gsap from "gsap";

export default function Template({ children }) {
  useEffect(() => {
    // Fade the overlay OUT to reveal the new page
    gsap.to(".page-transition-overlay", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    });
  }, []);

  return <div>{children}</div>;
}