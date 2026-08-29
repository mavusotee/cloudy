"use client";

import React, { useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

function ExtrudedTextReveal({ text }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      const split = new SplitText(textRef.current, {
        type: "lines,words,chars",
        linesClass: "sky-line relative block overflow-hidden py-[0.05em]",
        wordsClass: "sky-word relative inline-block whitespace-nowrap",
        charsClass:
          "sky-char relative inline-block will-change-[transform,opacity,filter] transform-gpu",
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        split.chars,
        {
          opacity: 0,
          yPercent: 120,
          scaleY: 0.1,
          scaleX: 0.9,
          filter: "blur(10px)",
          transformOrigin: "50% 100%",
          force3D: true,
        },
        {
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          filter: "blur(0px)",
          stagger: 0.008,
          duration: 0.8,
          force3D: true,
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [text]);

  return (
    <div ref={containerRef} className="w-full">
      <h2
        ref={textRef}
        className="text-3xl md:text-7xl text-ghost-white tracking-tight leading-[0.9]"
      >
        {title.split(" ").map((word, index) => (
          <React.Fragment key={`${word}-${index}`}>
            {index > 0 && <br />}
            {word}
          </React.Fragment>
        ))}
      </h2>
    </div>
  );
}

function WorkControls({
  title,
  onNext,
  disabled = false,
  currentVideo = 1,
  totalVideos = 1,
}) {
  return (
    <div className="flex items-end justify-between w-full select-none pb-5">
      {/* LEFT PROJECT INFORMATION */}
      <div className="flex flex-col space-y-2 font-sans tracking-tight">
        {/* PROJECT TITLE */}
        <ExtrudedTextReveal text={title || ""} />

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
