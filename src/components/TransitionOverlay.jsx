"use client";

import React from "react";

export default function TransitionOverlay() {
  return (
    <div
      className="page-transition-overlay fixed inset-0 z-[9999] pointer-events-none bg-carbon-black"
      style={{
        width: "100vw",
        height: "100vh",
        opacity: 0,
        "--wipe": "0%",
        maskImage:
          "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) calc(var(--wipe) - 20%), rgba(0,0,0,0) var(--wipe))",
        WebkitMaskImage:
          "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) calc(var(--wipe) - 20%), rgba(0,0,0,0) var(--wipe))",
      }}
    />
  );
}