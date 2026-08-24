"use client";

import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import BlurFlicker from "../Animations/BlurFlicker";
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const testimonialsData = [
  {
    company: "Spero",
    role: "Neu Built Founder & Director",
    quote:
      "We’ve worked with Jake from Cloudhaus across a number of our projects, and their work consistently exceeds expectations. Cloudhaus understands architecture, construction and design, and knows exactly how to capture the details that matter. His eye for natural light, composition and the subtle beauty of space allows every project to be showcased exactly as it was intended.",
    cloudTag: "[CLOUD_5]",
  },
  {
    company: "Nerida Box",
    role: "Co-Founder & Director of The Building Company",
    quote:
      "We've worked with Jake since 2020, and he's consistently delivered exactly what we've needed - great quality, varying scope of clips, quick turnaround, flexible and always reliable. These are qualities that make him a pleasure to work with, time and time again.",
    cloudTag: "[CLOUD_1]",
  },
  {
    company: "Matt Cates",
    role: "Director 4LIFE Construction",
    quote:
      "We've had the pleasure of working with Jake from Cloudhaus on several projects, and he has consistently been professional, reliable, easy to work with, and highly creative. From the initial planning through to the final delivery, the process has always been seamless. Jake has a great eye for detail and storytelling, capturing the quality and craftsmanship of our builds and helping us present our work professionally.",
    cloudTag: "[CLOUD_3]",
  },
];

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const totalTestimonials = testimonialsData.length;
  const currentTestimonial = testimonialsData[currentIndex];

  const containerRef = useRef(null);
  const quoteRef = useRef(null);
  const infoRef = useRef(null);
  const quoteIconRef = useRef(null);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalTestimonials);
  };

  const handlePrev = () => {
    setDirection(-1);
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
          {
            opacity: 0,
            y: -8,
            filter: "blur(4px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.2,
          },
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
          {
            opacity: 0,
            y: 20,
            x: -10,
            filter: "blur(6px)",
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            filter: "blur(0px)",
            duration: 1.4,
            ease: "power4.out",
          },
          0.08
        );
      }
    }, containerRef);

    return () => {
      if (split) {
        split.revert();
      }

      ctx.revert();
    };
  }, [currentIndex, direction]);

  return (
    <div
      ref={containerRef}
      className="
        relative
        flex
        flex-col
        items-start
        justify-between
        w-full
        min-h-screen
        font-mono
        text-ghost-white
        tracking-tight
        px-[clamp(0.1rem,4vw,0.2rem)]
        py-[clamp(2rem,4vw,4rem)]
      "
    >
      {/* TOP UI - Header */}
      <div className="flex flex-row items-center justify-between w-full text-ghost-white font-medium">
        <div className="text-[clamp(0.625rem,1vw,0.75rem)] flex items-center gap-[clamp(0.375rem,1vw,0.5rem)] text-zinc-700">
          <div className="w-[clamp(0.25rem,0.6vw,0.375rem)] h-[clamp(0.25rem,0.6vw,0.375rem)] bg-lavender" />
          <h1>TESTIMONIALS</h1>
        </div>

        <h1 className="text-[clamp(0.5rem,0.8vw,0.725rem)] text-ghost-white">
          {currentTestimonial.cloudTag}
        </h1>
      </div>

      {/* MID SECTION - Quote Text */}
      <div className="flex flex-col items-start justify-center w-full flex-1 py-[clamp(3rem,8vw,8rem)]">
        <p
          key={currentIndex}
          ref={quoteRef}
          className="
            w-full
            max-w-[min(1250px,125vw)]
            text-[clamp(0.9rem,2vw,3.5rem)]
            text-ghost-white
            leading-[145%]
            text-left
            font-sans
            will-change-[transform,opacity,filter]
            uppercase
          "
        >
          &quot;{currentTestimonial.quote}&quot;
        </p>
      </div>

      {/* BOTTOM UI - Client Info and Controls */}
      <div className="flex flex-col space-y-[clamp(1.25rem,4vw,2rem)] md:flex-row w-full items-start md:items-end justify-between">

        {/* CLIENT INFO - LEFT */}
        <div
          ref={infoRef}
          className="
            flex
            flex-col
            space-y-[clamp(0.25rem,0.6vw,0.375rem)]
            text-left
            will-change-[transform,opacity,filter]
          "
        >
          <h1 className="text-[clamp(0.95rem,2vw,1.3rem)] text-ghost-white font-medium">
            {currentTestimonial.company}
          </h1>

          <h1 className="text-[clamp(0.65rem,1.2vw,0.875rem)] text-eclipse opacity-80 font-medium">
            {currentTestimonial.role}
          </h1>
        </div>

        {/* CONTROLS - RIGHT */}
        <div className="flex flex-col space-y-[clamp(0.75rem,1.5vw,1rem)] text-ghost-white items-start md:items-end w-full md:w-full">

          {/* Counter */}
          <div className="flex flex-row items-center justify-between md:justify-end gap-[clamp(0.5rem,1.5vw,0.75rem)] text-[clamp(0.8rem,1.4vw,1rem)] font-bold w-full md:w-full">
            <span>{formatIndex(currentIndex + 1)}</span>

            <span className="opacity-90 text-[0.9em]">
              /
            </span>

            <span>
              {formatIndex(totalTestimonials)}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-row space-x-[clamp(0.5rem,1.5vw,0.875rem)]">

            <BlurFlicker>
              <button
                onClick={handlePrev}
                aria-label="Prev testimonial"
                className="
                  rounded-2xl
                  border
                  border-eclipse
                  p-[clamp(1rem,1.5vw,1.25rem)]
                  flex
                  items-center
                  justify-center
                  text-center
                  text-ghost-white
                  cursor-pointer
                  select-none
                "
              >
                <ArrowLeft className="w-[clamp(1.1rem,1.8vw,1.5rem)] h-[clamp(1.1rem,1.8vw,1.5rem)]" />
              </button>
            </BlurFlicker>

            <BlurFlicker>
              <button
                onClick={handleNext}
                aria-label="Next testimonial"
                className="
                  rounded-2xl
                  border
                  border-eclipse
                  p-[clamp(1rem,1.5vw,1.25rem)]
                  flex
                  items-center
                  justify-center
                  text-center
                  text-ghost-white
                  cursor-pointer
                  select-none
                "
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