"use client";

import React from "react";

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
  return (
    <div className="group flex flex-col w-full">
      {/* HEADER ROW */}
      <div className="flex flex-row items-start justify-between w-full">
        {/* TITLE CONTAINER */}
        <div className="flex items-start w-full pr-[clamp(0.5rem,2vw,1rem)]">
          <h1 className="text-[clamp(2.05rem,4.5vw+0.5rem,4.5rem)] font-sans uppercase tracking-tighter transition-colors duration-300 group-hover:text-ghost-white font-medium leading-[1.05]">
            {service.title}
          </h1>
        </div>

        {/* NUMBERING - Positioned Right */}
        <div className="shrink-0 pl-[clamp(0.5rem,2vw,1rem)] pt-[clamp(0.2rem,0.5vw,0.6rem)]">
          <span className="font-geist-mono font-medium text-zinc-200 text-[clamp(0.875rem,1.2vw,1.825rem)] select-none">
            ({service.id})
          </span>
        </div>
      </div>

      {/* DESCRIPTION CONTENT */}
      <div className="w-full">
        <p className="text-zinc-500 font-mono uppercase w-[clamp(400px,50vw,670px)] max-w-full pt-[clamp(1rem,2.5vw,2rem)] pb-[clamp(0.25rem,0.75vw,0.5rem)] text-[clamp(0.7rem,0.65rem+0.35vw,0.875rem)] leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* FULL-WIDTH UNDERLINE */}
      <div className="w-full bg-eclipse h-[1px] mt-[clamp(1.25rem,3vw,2rem)]" />
    </div>
  );
}

export default function ServicesSection() {
  return (
    <div className="w-full h-auto bg-carbon-black text-ghost-white mt-[clamp(3rem,8vw,7.5rem)]">
      {/* HEADER */}
      <div className="flex flex-row items-center justify-between w-full text-zinc-300">
        <div className="font-mono tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)] flex items-center gap-2">
          <div className="w-2 h-2 bg-zinc-300" />
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