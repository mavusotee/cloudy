"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Split from "./Split";
import { ArrowLeft } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: "01",
    title: "Strategy & CONCEPT",
    description:
      "We design the framework before we ever touch a camera. This is the strategic architecture—mapping the narrative, sourcing locations, and engineering the precise visual blueprint. We eliminate guesswork to ensure that when production begins, every single frame is optimized for maximum commercial impact",
  },
  {
    id: "02",
    title: "Filming",
    description:
      "High-end execution on set. We deploy cinema-grade optics, controlled lighting, and deliberate movement to translate structural design and space into raw, high-authority visual media. Every setup is deliberate, capturing scale, texture, and technical craftsmanship without compromise.",
  },
  {
    id: "03",
    title: "Editing & Color",
    description:
      "Where raw footage is sculpted into a final commercial asset. Precise rhythmic pacing, seamless sound design, and custom architectural color grading elevate the visual tone, giving the final cut an unmistakable cinematic weight that commands authority.",
  },
];

function ServiceItem({ service }) {
  const lineRef = useRef(null);
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (!lineRef.current) return;

      gsap.fromTo(
        lineRef.current,
        {
          scaleX: 0,
          transformOrigin: "left center",
        },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            end: "bottom 70%",
            scrub: 0.8, // Tied to scroll progress with a silky 0.8s catch-up
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="group flex flex-col space-y-8 md:space-y-6 w-full"
    >
      {/* HEADER & CONTENT ROW */}
      <div className="flex flex-row items-start justify-between w-full">
        {/* NUMBERING */}
        <div className="shrink-0 w-12 md:w-20 pt-[clamp(0.2rem,0.5vw,0.6rem)]">
          <span className="font-sans font-semibold tracking-tighter text-zinc-600 text-[clamp(1.075rem,2.5vw,4.5rem)] select-none">
            {service.id}
          </span>
        </div>

        {/* SHARED COLUMN FOR TITLE + DESCRIPTION */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex flex-row items-start justify-between w-full">
            {/* TITLE */}
            <div className="flex items-start w-full md:translate-x-40">
              <Split duration="1">
                <h1 className="text-[clamp(2.05rem,4.5vw+0.5rem,4.5rem)] font-sans uppercase tracking-tighter transition-colors duration-300 group-hover:text-ghost-white font-medium leading-[1.05]">
                  {service.title}
                </h1>
              </Split>
            </div>

            {/* ARROW */}
            <div className="hidden md:flex items-center shrink-0 pl-4 pt-2">
              ( <ArrowLeft /> )
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="w-full md:translate-x-40 pt-4 md:pt-20">
            <Split duration="1.2">
              <p className="text-zinc-500 font-geist-mono uppercase  w-[clamp(350px,50vw,500px)] max-w-full pt-4 pb-2 text-[clamp(0.7rem,0.65rem+0.35vw,0.85rem)] leading-relaxed">
                {service.description}
              </p>
            </Split>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH UNDERLINE (SCRUBBED ON SCROLL) */}
      <div
        ref={lineRef}
        className="w-full bg-zinc-800 h-[1.5px] mt-[clamp(1.25rem,3vw,2rem)]"
      />
    </div>
  );
}

export default function ServicesSection() {
  return (
    <div className="w-full h-auto bg-black text-ghost-white mt-[clamp(3rem,8vw,7.5rem)]">
      {/* HEADER */}
      <div className="flex flex-row items-center justify-between w-full">
        <div className="font-mono tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)] flex items-center gap-2">
          <div className="w-2 h-2 bg-ghost-white" />
          <h1>OUR SERVICES</h1>
        </div>
        <h1 className="font-mono tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)]">
          [CLOUD_3]
        </h1>
      </div>

      {/* MAPPED SERVICES */}
      <div className="flex flex-col space-y-[clamp(2rem,5vw,4.5rem)] mt-[clamp(3.5rem,8vw,8rem)] w-full">
        {services.map((service, index) => (
          <ServiceItem key={service.id} service={service} index={index} />
        ))}
      </div>
    </div>
  );
}