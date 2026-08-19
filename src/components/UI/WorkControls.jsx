"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

function WorkControls({
  client,
  title,
  onNext,
  disabled = false,
  currentVideo = 1,
  totalVideos = 1,
}) {
  return (
    <div className="flex items-end justify-between w-full select-none pb-5">
      {/* LEFT CLIENT INFORMATION */}
      <div className="flex flex-col space-y-2 font-sans tracking-tight">
        <h1 className="text-sm text-ghost-white font-monot uppercase">
          {client}
        </h1>

        <h2 className="text-3xl md:text-7xl text-ghost-white tracking-tight">
          {title}
        </h2>

        {/* VIDEO COUNTER */}
        {totalVideos > 1 && (
          <span className="text-[10px] md:text-xs text-zinc-400 font-geist-mono tracking-widest">
            {String(currentVideo).padStart(2, "0")} /{" "}
            {String(totalVideos).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* NEXT VIDEO BUTTON */}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled || totalVideos <= 1}
        aria-label="Next project video"
        className={`
          bg-carbon-black
          border
          border-eclipse
          text-2xl
          w-[3.5rem]
          h-[4rem]
          flex
          items-center
          justify-center
          text-center
          transition-opacity
          duration-300
          ${
            disabled || totalVideos <= 1
              ? "opacity-40 cursor-not-allowed"
              : "opacity-100 cursor-pointer"
          }
        `}
      >
        <ChevronRight className="text-2xl" />
      </button>
    </div>
  );
}

export default WorkControls;