// components/Testimonials.jsx
"use client";

import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import BlurFlicker from "../Animations/BlurFlicker";
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const testimonialsData = [
  {
    company: "SPERO",
    role: "NEU BUILT FOUNDER & DIRECTOR",
    quote:
      "WE’VE WORKED WITH JAKE FROM CLOUDHAUS ACROSS A NUMBER OF OUR PROJECTS, AND THEIR WORK CONSISTENTLY EXCEEDS EXPECTATIONS. CLOUDHAUS ISN’T JUST A MEDIA PRODUCTION HOUSE, THEY HAVE GENUINE UNDERSTANDING OF ARCHITECTURE, CONSTRUCTION AND DESIGN, AND KNOWS EXACTLY HOW TO CAPTURE THE DETAILS THAT MATTER. HIS EYE FOR NATURAL LIGHT, COMPOSITION AND THE SUBTLE BEAUTY OF SPACE ALLOWS EVERY PROJECT TO BE SHOWCASED EXACTLY AS IT WAS INTENDED. CLOUDHAUS DOESN’T JUST FILM BUILDINGS, THEY TELL THE STORY BEHIND THEM",
    cloudTag: "[CLOUD_5]",
  },
  {
    company: "THE BUILDING COMPANY",
    role: "CO-FOUNDER",
    quote:
      "WE'VE WORKED WITH JAKE SINCE 2020, AND HE'S CONSISTENTLY DELIVERED EXACTLY WHAT WE'VE NEEDED - GREAT QUALITY, VARYING SCOPE OF CLIPS, QUICK TURNAROUND, FLEXIBLE AND ALWAYS RELIABLE. THESE ARE QUALITIES THAT MAKE HIM A PLEASURE TO WORK WITH, TIME AND TIME AGAIN.",
    cloudTag: "[CLOUD_1]",
  },
  {
    company: "4LIFE CONSTRUCTION",
    role: "DIRECTOR",
    quote:
      "WE'VE HAD THE PLEASURE OF WORKING WITH JAKE FROM CLOUDHAUS ON SEVERAL PROJECTS, AND HE HAS CONSISTENTLY BEEN PROFESSIONAL, RELIABLE, EASY TO WORK WITH, AND HIGHLY CREATIVE. FROM THE INITIAL PLANNING THROUGH TO THE FINAL DELIVERY, THE ENTIRE PROCESS HAS ALWAYS BEEN SEAMLESS. JAKE HAS A GREAT EYE FOR DETAIL AND A CREATIVE APPROACH TO STORYTELLING, DOING AN EXCELLENT JOB OF CAPTURING THE QUALITY AND CRAFTSMANSHIP OF OUR BUILDS. THE FINISHED VIDEOS HAVE BEEN A GREAT ASSET IN SHOWCASING OUR PROJECTS AND HAVE HELPED US PRESENT OUR WORK PROFESSIONALLY ACROSS OUR WEBSITE AND SOCIAL MEDIA.",
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

  const formatIndex = (index) => String(index).padStart(2, "0");

  useLayoutEffect(() => {
    let split;

    const ctx = gsap.context(() => {
      if (!quoteRef.current) return;

      split = new SplitText(quoteRef.current, {
        type: "words",
        wordsClass: "inline-block will-change-[transform,opacity,filter]",
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      if (quoteIconRef.current) {
        tl.fromTo(
          quoteIconRef.current,
          { opacity: 0, y: -8, filter: "blur(4px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.2 },
          0
        );
      }

      tl.fromTo(
        split.words,
        {
          opacity: 0,
          x: -8,
          y: 0,
          filter: "blur(8px)",
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          filter: "blur(0px)",
          duration: 0.28,
          ease: "power4.inOut",
          stagger: 0.008,
        },
        0
      );

      if (infoRef.current) {
        tl.fromTo(
          infoRef.current,
          { opacity: 0, y: 20, x: -10, filter: "blur(6px)" },
          { opacity: 1, y: 0, x: 0, filter: "blur(0px)", duration: 1.4, ease: "power4.out" },
          0.08
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
      if (split) split.revert();
    };
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-start w-full font-mono text-ghost-white tracking-tight uppercase px-[clamp(0.1rem,4vw,0.2rem)] pt-[clamp(2rem,4vw,4rem)] pb-[clamp(3rem,5vw,6rem)]"
    >
      {/* TOP UI - Header */}
      <div className="flex flex-row items-center justify-between w-full text-ghost-white font-medium mb-[clamp(2rem,4vw,4rem)]">
        <div className="text-[clamp(0.625rem,1vw,0.75rem)] flex items-center gap-[clamp(0.375rem,1vw,0.5rem)]">
          <div className="w-[clamp(0.25rem,0.6vw,0.375rem)] h-[clamp(0.25rem,0.6vw,0.375rem)] bg-lavender" />
          <h1>TESTIMONIALS</h1>
        </div>
        <h1 className="text-[clamp(0.5rem,0.8vw,0.725rem)] text-ghost-white">
          {currentTestimonial.cloudTag}
        </h1>
      </div>

      {/* MID SECTION - Quote Text */}
      <div className="flex flex-col items-start justify-start w-full mb-[clamp(1.5rem,3vw,2.5rem)]">
        <p
          ref={quoteRef}
          className="w-full max-w-[min(1250px,120vw)] text-[clamp(0.9rem,1.8vw,2.2rem)] text-ghost-white leading-[145%] text-left font-sans lowercase will-change-[transform,opacity,filter]"
        >
          &quot; {currentTestimonial.quote} &quot;
        </p>
      </div>

      {/* BOTTOM UI - Client Info and Controls */}
      <div className="flex flex-col space-y-[clamp(1.25rem,4vw,2rem)] md:flex-row w-full items-start md:items-end justify-between">
        {/* CLIENT INFO - LEFT */}
        <div
          ref={infoRef}
          className="flex flex-col space-y-[clamp(0.25rem,0.6vw,0.375rem)] text-left will-change-[transform,opacity,filter]"
        >
          <h1 className="text-[clamp(0.95rem,2vw,1.3rem)] text-ghost-white font-medium">
            {currentTestimonial.company}
          </h1>
          <h1 className="text-[clamp(0.65rem,1.2vw,0.875rem)] text-eclipse opacity-80 font-medium">
            {currentTestimonial.role}
          </h1>
        </div>

        {/* CONTROLS - RIGHT */}
        <div className="flex flex-col space-y-[clamp(0.75rem,1.5vw,1rem)] text-ghost-white items-start md:items-end w-full md:w-auto">
          {/* Counter */}
          <div className="flex flex-row items-center justify-between md:justify-end gap-[clamp(0.5rem,1.5vw,0.75rem)] text-[clamp(0.8rem,1.4vw,1rem)] font-bold w-full md:w-auto">
            <span>{formatIndex(currentIndex + 1)}</span>
            <span className="opacity-90 text-[0.9em]">/</span>
            <span>{formatIndex(totalTestimonials)}</span>
          </div>

          {/* Buttons */}
          <div className="flex flex-row space-x-[clamp(0.5rem,1.5vw,0.875rem)]">
            <BlurFlicker>
              <button
                onClick={handlePrev}
                aria-label="Prev testimonial"
                className="rounded-2xl border border-eclipse p-[clamp(1rem,1.5vw,1.25rem)] flex items-center justify-center text-center text-ghost-white cursor-pointer select-none"
              >
                <ArrowLeft className="w-[clamp(1.1rem,1.8vw,1.5rem)] h-[clamp(1.1rem,1.8vw,1.5rem)]" />
              </button>
            </BlurFlicker>

            <BlurFlicker>
              <button
                onClick={handleNext}
                aria-label="Next testimonial"
                className="rounded-2xl border border-eclipse p-[clamp(1rem,1.5vw,1.25rem)] flex items-center justify-center text-center text-ghost-white cursor-pointer select-none"
              >
                <ArrowRight className="w-[clamp(1.1rem,1.8vw,1.5rem)] h-[clamp(1.1rem,1.8vw,1.5rem)]" />
              </button>
            </BlurFlicker>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;