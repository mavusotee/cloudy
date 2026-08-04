"use client";
import React from "react";

function SmallButton({ isOpen }) {
  return (
    <div
      className={`font-mono tracking-tight text-[12px] border transition-colors duration-300 rounded-full w-[139px] h-[30px] p-2 flex items-center justify-center text-center ${
        isOpen
          ? "bg-ghost-white text-carbon-black border-ghost-white hover:bg-zinc-300"
          : "bg-carbon-black text-ghost-white border-eclipse hover:bg-ghost-white hover:text-carbon-black hover:border-ghost-white"
      }`}
    >
      {isOpen ? "CLOSE" : "CLICK TO VIEW"}
    </div>
  );
}

export default SmallButton;