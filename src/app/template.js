// app/template.js
"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function Template({ children }) {
  useEffect(() => {
    const overlay = document.querySelector(".page-transition-overlay");
    if (!overlay) return;

    // Smooth emotional fade out as the new page lands
    gsap.to(overlay, {
      opacity: 0,
      "--wipe": "130%",
      duration: 0.7,
      ease: "power2.out",
      onComplete: () => {
        // Reset starting variables for the next transition
        gsap.set(overlay, { "--wipe": "0%", opacity: 0 });
      },
    });
  }, []);

  return <div>{children}</div>;
}