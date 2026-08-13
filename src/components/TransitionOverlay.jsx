"use client";

import Image from "next/image";

export default function TransitionOverlay() {
  return (
    <div
      className="page-transition-overlay relative flex items-center justify-center bg-zinc-950 text-white"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        
        zIndex: 9999,
        pointerEvents: "none",
        opacity: 0,
      }}
    >

     
       
    

       <div className="absolute top-2 left-2 w-8 h-8 border-t border-l border-zinc-800" />
                      <div className="absolute top-2 right-2 w-8 h-8 border-t border-r border-zinc-800" />
                      <div className="absolute bottom-2 left-2 w-8 h-8 border-b border-l border-zinc-800" />
                      <div className="absolute bottom-2 right-2 w-8 h-8 border-b border-r border-zinc-800" />
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* CENTER PNG */}
        <div
          className="centerPNG tracking-tight text-center flex flex-col -space-y-2 items-center justify-center"
          style={{
            opacity: 0, // GSAP will control this
            transform: "scale(0.9)", // nice starting state
          }}
        >
          <h1 className="font-aguafina text-3xl font-regular tracking-tight">DANIEL KORR</h1>
          <p className="font-inconsolata tracking-tighter text-[8px] font-bold text-zinc-400 ">SUPER COOL PHOTOGRAPHER</p>
        </div>

      </div>
    </div>
  );
}