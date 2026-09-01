"use client";
import React from "react";

function SmallBut() {
  return (
    <div className="font-mono tracking-tight text-[clamp(0.4875rem,0.9vw,0.75rem)] border rounded-full w-[clamp(5.5rem,7vw,5.6875rem)] h-[clamp(1.75rem,2.5vw,2rem)] px-3 py-1 flex items-center justify-center text-center cursor-pointer select-none bg-green text-ghost-white border-eclipse">
      CLICK TO VIEW
    </div>
  );
}

export default SmallBut;