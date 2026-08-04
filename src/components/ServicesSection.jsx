"use client";

import React, { useRef, useEffect } from "react";
import SmallButton from "./SmallButton";
import gsap from "gsap";

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

function ServiceItem({ service, index, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const isMounted = useRef(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (!isMounted.current) {
      isMounted.current = true;
      if (isOpen) {
        gsap.set(el, {
          height: "auto",
          opacity: 1,
        });
      }
      return;
    }

    if (isOpen) {
      gsap.to(el, {
        height: "auto",
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      });
    } else {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power3.inOut",
      });
    }
  }, [isOpen]);

  return (
    <div className="group flex flex-col w-full">
      {/* HEADER ROW */}
      <div className="flex flex-row items-start justify-between w-full">
        {/* TITLE */}
        <div
          onClick={onToggle}
          className="cursor-pointer flex items-center justify-between w-full pr-[clamp(0.5rem,2vw,1rem)]"
        >
          {/* Base text-7xl (4.5rem/72px) clamped down to 1.75rem (28px) on small screens */}
          <h1 className="text-[clamp(1.75rem,4.5vw+0.5rem,4.5rem)] font-sans uppercase tracking-tight transition-colors duration-300 group-hover:text-lavender leading-[1.05]">
            {service.title}
          </h1>
        </div>

        {/* SMALL BUTTON TOGGLE - Always clickable on mobile, hover-triggered on desktop when closed */}
        <div
          onClick={onToggle}
          className={`cursor-pointer shrink-0 pl-[clamp(0.5rem,2vw,1rem)] transition-opacity duration-300 ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-100 md:opacity-0 pointer-events-auto md:pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto"
          }`}
        >
          <SmallButton isOpen={isOpen} index={index} />
        </div>
      </div>

      {/* GSAP DROPDOWN CONTENT */}
      <div
        ref={contentRef}
        className="h-0 opacity-0 overflow-hidden w-full origin-top"
      >
        {/* Base w-[670px] clamped down to 100% full-width on mobile; text size clamped fluidly */}
        <p className="text-zinc-500 font-mono uppercase w-[clamp(280px,50vw,670px)] max-w-full pt-[clamp(1rem,2.5vw,2rem)] pb-[clamp(0.25rem,0.75vw,0.5rem)] text-[clamp(0.7rem,0.65rem+0.35vw,0.875rem)] leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* FULL-WIDTH UNDERLINE */}
      <div className="w-full bg-eclipse h-[1px] mt-[clamp(1.25rem,3vw,2rem)]" />
    </div>
  );
}

export default function ServicesSection() {
  const [openId, setOpenId] = React.useState("01");

  const handleToggle = (id) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  return (
    // Base mt-30 (7.5rem/120px) clamped down to 3rem (48px)
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

      {/* MAPPED SERVICES - Base mt-32 (8rem) & space-y-18 (4.5rem) clamped down for mobile */}
      <div className="flex flex-col space-y-[clamp(2rem,5vw,4.5rem)] mt-[clamp(3.5rem,8vw,8rem)] w-full">
        {services.map((service, index) => (
          <ServiceItem
            key={service.id}
            service={service}
            index={index}
            isOpen={openId === service.id}
            onToggle={() => handleToggle(service.id)}
          />
        ))}
      </div>
    </div>
  );
}