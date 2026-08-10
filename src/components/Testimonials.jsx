// components/Testimonials.jsx
"use client";

import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useState, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

// Sample data structure from the Figma snapshot
const testimonialsData = [
  {
    company: "SPERO",
    contactName: "Jake from SPERO",
    role: "NEU BUILT FOUNDER & DIRECTOR",
    logo: "/Images/nb-1.jpg", 
    quote:
      "WE’VE WORKED WITH JAKE FROM CLOUDHAUS ACROSS A NUMBER OF OUR PROJECTS, AND THEIR WORK CONSISTENTLY EXCEEDS EXPECTATIONS. CLOUDHAUS IS’NT JUST A MEDIA PRODUCTION HOUSE, THEY HAVE GENUINE UNDERSTANDING OF ARCHITECTURE, CONSTRUCTION AND DESIGN, AND KNOWS EXACTLY HOW TO CAPTURE THE DETAILS THAT MATTER. HIS EYE FOR NATURAL LIGHT, COMPOSITION AND THE SUBTLE BEAUTY OF SPACE ALLOWS EVERY PROJECT TO BE SHOWCASED EXACTLY AS IT WAS INTENDED. CLOUDHAUS DOESN’T JUST FILM BUILDINGS, THEY TELL THE STORY BEHIND THEM",
    cloudTag: "[CLOUD_5]",
  },
  {
    company: "KRIVIC",
    contactName: "Ivan Krivic",
    role: "PROJECT MANAGER",
    logo: "/Images/krivic-1.jpg", // Path to business logo
    quote:
      " Placeholder quote for the second client, Ivan Krivic. His company name matches the header style in the design and is positioned at the bottom left.",
    cloudTag: "[CLOUD_1]",
  },
  {
    company: "ARCH_CO",
    contactName: "Sarah Chen",
    role: "HEAD ARCHITECT",
    logo: "/Images/tbc-1.jpg", 
    quote:
      "Another placeholder quote for the third client, Sarah Chen from ARCH_CO. The layout allows for easy mapping of multiple testimonials.",
    cloudTag: "[CLOUD_3]",
  },
];

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalTestimonials = testimonialsData.length;
  const currentTestimonial = testimonialsData[currentIndex];

  const containerRef = useRef(null);
  const quoteRef = useRef(null);
  const infoRef = useRef(null);
  const quoteIconRef = useRef(null);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalTestimonials);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + totalTestimonials) % totalTestimonials
    );
  };

  // Helper function to format the counter (e.g., "01")
  const formatIndex = (index) => String(index + 1).padStart(2, "0");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!quoteRef.current) return;

      // Split purely by words (no line divs or wrappers)
      const split = new SplitText(quoteRef.current, {
        type: "words",
        wordsClass: "inline-block will-change-[transform,opacity,filter]",
      });

      // Ultra-snappy timeline defaults
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // 1. Instant pop for Quote Icon
      if (quoteIconRef.current) {
        tl.fromTo(
          quoteIconRef.current,
          { opacity: 0, y: -8, filter: "blur(4px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.2 },
          0
        );
      }

      // 2. Fast SplitText words blur + opacity animation
      tl.fromTo(
        split.words,
        {
          opacity: 0,
          x: -8,
          filter: "blur(8px)",
        },
        {
          opacity: 0.9,
          y: 0,
          filter: "blur(0px)",
          duration: 0.28,
          stagger: 0.008, // Rapid fire stagger so the text flows in fast
          
        },
        0 // Start instantly alongside the icon
      );

      // 3. Parallel Logo + Client Info Animation (zero delay, perfectly seamless)
      if (infoRef.current) {
        tl.fromTo(
          infoRef.current,
          { opacity: 0, y: 20, x: -10, filter: "blur(6px)" },
          { opacity: 1, y: 0, x: 0, filter: "blur(0px)", duration: 1.4, ease: "power4.out" },
          0.05 // Triggers almost instantly with the first few words
        );
      }

      return () => {
        split.revert();
      };
    }, containerRef);

    return () => ctx.revert();
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-start justify-between w-full h-screen md:h-[85vh] font-mono text-ghost-white tracking-tight uppercase"
    >
      {/* TOP UI - Header */}
      <div className="flex flex-row items-center justify-between w-full text-lavender font-medium">
        <div className="text-[clamp(0.625rem,1vw,0.75rem)] flex items-center gap-2">
          {/* Square marker next to label */}
          <div className="w-1.5 h-1.5 bg-lavender" />
          <h1>TESTIMONIALS</h1>
        </div>
        <h1 className="text-[clamp(0.5rem,0.8vw,0.725rem)] text-ghost-white">
          [CLOUD_6]
        </h1>
      </div>

      {/* MID SECTION - Quote Icon and Text */}
      <div className="flex flex-col flex-grow items-start justify-center max-w-[1200px] w-full pl-2 my-16 ">
        {/* Large Quote Icon */}
        <h1
          ref={quoteIconRef}
          className="font-sans font-bold text-8xl will-change-transform"
        >
          &quot;
        </h1>

        {/* Target Paragraph for GSAP SplitText */}
        <p
          ref={quoteRef}
          className="text-[clamp(1.1rem,1.8vw,1.8rem)] text-eclipse leading-relaxed text-left font-fragment-mono will-change-[transform,opacity,filter]"
        >
          
          {currentTestimonial.quote}
        </p>
      </div>

      {/* BOTTOM UI - Client Info and Controls */}
      <div className="flex flex-col space-y-8 md:flex-row w-full items-start justify-between">
        {/* CLIENT INFO - LEFT */}
        <div
          ref={infoRef}
          className="flex flex-row items-end gap-4 will-change-[transform,opacity,filter]"
        >
          {/* Business Logo Container with Next.js Image */}
          {currentTestimonial.logo && (
            <div className="relative w-28 h-28 shrink-0">
              <Image
                src={currentTestimonial.logo}
                alt={`${currentTestimonial.company} logo`}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}

          <div className="flex flex-col space-y-1.5 text-left">
            {/* Larger Company Name */}
            <h1 className="text-[1.3rem] text-ghost-white font-medium">
              {currentTestimonial.company}
            </h1>
            {/* Muted Role Text */}
            <h1 className="text-sm text-eclipse opacity-80 font-medium">
              {currentTestimonial.role}
            </h1>
          </div>
        </div>

        {/* CONTROLS - RIGHT */}
        <div className="flex flex-col space-y-6 text-ghost-white items-end">
          {/* Counter (e.g., 01 / 03) */}
          <div className="flex flex-row items-center justify-between w-full text-base font-medium">
            <span>{formatIndex(currentIndex)}</span>
            <span className="opacity-90 text-sm">/</span>
            <span className="">
              {formatIndex(totalTestimonials - 1)}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-row space-x-3.5">
            <button
              onClick={handleNext}
              className="rounded-tl-2xl rounded-br-2xl rounded-tr-2xl rounded-bl-2xl border border-eclipse p-5 flex items-center justify-center text-center text-ghost-white "
            >
              <ArrowRight className="w-6 h-6" />
            </button>
            <button
              onClick={handlePrev}
              className="rounded-tl-2xl rounded-br-2xl rounded-tr-2xl rounded-bl-2xl border border-eclipse p-5 flex items-center justify-center text-center text-ghost-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;