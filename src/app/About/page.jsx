"use client";
import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import SmallButton from "@/components/SmallButton";
import SmallBut from "@/components/SmallBut";
import SmudgyTextReveal from "@/components/SmudgyTextReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServicesSection from "@/components/ServicesSection";
import ClientsSection from "@/components/ClientsSection";

gsap.registerPlugin(ScrollTrigger);

const videos = [
  {
    id: 1,
    date: "01 . 2022",
    durationTop: "01:03",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922206/evergreen_comp_1080p_vfkngm.mp4",
    title: "THE BUILDING COMPANY",
  },
  {
    id: 2,
    date: "01 . 2022",
    durationTop: "01:03",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922129/woods_project_compressed_1080p_dpzyjd.mp4",
    title: "MAVTECH DESIGNS",
  },
  {
    id: 3,
    date: "01 . 2022",
    durationTop: "01:03",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785921796/dunehouse_comp_1440p_hp8mzj.mp4",
    title: "THE BUILDING COMPANY",
  },
  {
    id: 4,
    date: "01 . 2022",
    durationTop: "01:03",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922167/skatepark_house_comp_1080p_v29fnm.mp4",
    title: "THE BUILDING COMPANY",
  },
  {
    id: 5,
    date: "01 . 2022",
    durationTop: "01:03",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785921778/north_adelaide_comp_1440p_exjydf.mp4",
    title: "MAVTECH DESIGNS",
  },
];

export default function Page() {
  const cursorRef = useRef(null);
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  // GSAP Mouse Follower Logic
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Center cursor baseline
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });

    const moveCursor = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  // GSAP Scale In/Out Animation on Video Hover State
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    if (isHoveringVideo) {
      gsap.to(cursor, {
        scale: 1,
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
      });
    } else {
      gsap.to(cursor, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [isHoveringVideo]);

  return (
    <div className="bg-carbon-black w-full min-h-screen py-6 px-4 md:px-6 flex flex-col space-y-16 lg:space-y-32 relative overflow-x-hidden">
      {/* CUSTOM CURSOR OVERLAY */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-50 hidden md:block scale-0 opacity-0 mix-blend-difference text-white"
      >
        <span className="font-geist-mono text-xl font-medium tracking-tight">
          [ CLICK ]
        </span>
      </div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 flex flex-col space-y-16 lg:space-y-28 w-full">
        {/* NAV */}
        <div className="flex flex-row items-center justify-between w-full text-lavender">
          <div className="font-mono tracking-tight text-[clamp(0.625rem,1vw,0.75rem)] flex items-center gap-2">
            <div className="w-2 h-2 bg-ghost-white" />
            <h1>OUR IDENTITY</h1>
          </div>
          <h1 className="font-mono tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)]">
            [CLOUD_1]
          </h1>
        </div>

        {/* INTRO SECTION */}
        <div className="flex flex-col lg:flex-row items-start justify-between w-full text-ghost-white gap-8 lg:gap-0">
          <h1 className="font-mono tracking-tight text-[clamp(0.75rem,1.1vw,0.875rem)]">
            IT ALL STARTS WITH AN IDEA
          </h1>

          <div className="flex flex-col items-start justify-end space-y-8 lg:space-y-12 w-full lg:w-1/2 lg:translate-x-0 xl:translate-x-20">
            <SmudgyTextReveal text="A hidden visual story costs more than missed contracts—it steals the authority your work has already earned." />
            <Button text="ABOUT CLOUDHAUS" href="/About" />
          </div>
        </div>

        {/* HEADER & WORKS SECTION */}
        <div className="flex flex-col space-y-6 pt-14 lg:pt-20">
          <div className="flex flex-row items-center justify-between w-full text-zinc-300">
            <div className="font-mono tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)] flex items-center gap-2">
              <div className="w-2 h-2 bg-zinc-300" />
              <h1>SELECTED WORKS</h1>
            </div>
            <h1 className="font-mono tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)]">
              [CLOUD_2]
            </h1>
          </div>

          {/* WORKS HEADER ROW */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between w-full text-ghost-white gap-4 sm:gap-0">
            <div className="flex flex-row items-start gap-4 sm:gap-6 font-geist-mono">
              <h1 className="text-[clamp(8rem,20vw,36.875rem)] tracking-[-8%] font-light leading-none">
                Work
              </h1>
              <sup className="text-[clamp(1rem,2vw,1.875rem)] pt-1 sm:pt-2 leading-none font-sans font-light tracking-tight">
                ({videos.length < 10 ? `0${videos.length}` : videos.length})
              </sup>
            </div>

            {/* BUTTON: MOBILE = LEFT BELOW TITLE | DESKTOP = BOTTOM RIGHT */}
            <div className="flex flex-col items-start sm:items-end justify-end sm:self-end w-full sm:w-auto">
              <Button text="VIEW ALL WORKS" href="/Works" />
            </div>
          </div>

          {/* WORKS GRID */}
          <div className="flex flex-col space-y-8 lg:space-y-12 pt-6">
            {/* ROW 1 */}
            <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-8 lg:gap-6 text-lavender">
              {/* Card 1 */}
              <div className="flex flex-col space-y-2 w-full">
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-geist-mono tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)] text-zinc-400">
                    {videos[0].date}
                  </h1>
                  <h2 className="font-geist-mono font-medium tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                    {videos[0].durationTop}
                  </h2>
                </div>
                <div
                  className="w-full aspect-video lg:aspect-none lg:h-[30rem] overflow-hidden cursor-none"
                  onMouseEnter={() => setIsHoveringVideo(true)}
                  onMouseLeave={() => setIsHoveringVideo(false)}
                >
                  <video
                    src={videos[0].url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-geist-mono font-medium tracking-tight text-[clamp(1rem,1.5vw,1.25rem)]">
                    {videos[0].title}
                  </h1>
                  <SmallBut />
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col space-y-2 w-full">
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-geist-mono tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)] text-zinc-400">
                    {videos[1].date}
                  </h1>
                  <h2 className="font-geist-mono font-medium tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                    {videos[1].durationTop}
                  </h2>
                </div>
                <div
                  className="w-full aspect-video lg:aspect-none lg:h-[30rem] overflow-hidden cursor-none"
                  onMouseEnter={() => setIsHoveringVideo(true)}
                  onMouseLeave={() => setIsHoveringVideo(false)}
                >
                  <video
                    src={videos[1].url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-geist-mono font-medium tracking-tight text-[clamp(1rem,1.5vw,1.25rem)]">
                    {videos[1].title}
                  </h1>
                  <SmallBut />
                </div>
              </div>
            </div>

            {/* ROW 2 - FEATURED (FULL SCREEN HEIGHT ON DESKTOP) */}
            <div className="flex flex-col space-y-2 w-full text-lavender">
              <div className="flex flex-row items-center justify-between w-full px-2">
                <h1 className="font-geist-mono tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)] text-zinc-400">
                  {videos[2].date}
                </h1>
                <h2 className="font-geist-mono font-medium tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                  {videos[2].durationTop}
                </h2>
              </div>
              <div
                className="w-full aspect-video lg:aspect-none lg:h-screen overflow-hidden cursor-none"
                onMouseEnter={() => setIsHoveringVideo(true)}
                onMouseLeave={() => setIsHoveringVideo(false)}
              >
                <video
                  src={videos[2].url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-row items-center justify-between w-full px-2">
                <h1 className="font-geist-mono font-medium tracking-tight text-[clamp(1rem,1.5vw,1.25rem)]">
                  {videos[2].title}
                </h1>
                <SmallBut />
              </div>
            </div>

            {/* ROW 3 (EDITORIAL ASYMMETRIC GRID) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] w-full gap-12 lg:gap-20 text-lavender pb-12 lg:pb-24 items-start">
              {/* Card 4 (Dominant / Larger) */}
              <div className="flex flex-col space-y-2 w-full">
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-geist-mono tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)] text-zinc-400">
                    {videos[3].date}
                  </h1>
                  <h2 className="font-geist-mono font-medium tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                    {videos[3].durationTop}
                  </h2>
                </div>
                <div
                  className="w-full aspect-video lg:aspect-none lg:h-[36rem] overflow-hidden cursor-none"
                  onMouseEnter={() => setIsHoveringVideo(true)}
                  onMouseLeave={() => setIsHoveringVideo(false)}
                >
                  <video
                    src={videos[3].url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-row items-center justify-between w-full px-2 pt-1">
                  <h1 className="font-geist-mono font-medium tracking-tight text-[clamp(1rem,1.5vw,1.25rem)]">
                    {videos[3].title}
                  </h1>
                  <SmallBut />
                </div>
              </div>

              {/* Card 5 (Smaller / Secondary & Offset) */}
              <div className="flex flex-col space-y-2 w-full lg:translate-y-24">
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-geist-mono tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)] text-zinc-400">
                    {videos[4].date}
                  </h1>
                  <h2 className="font-geist-mono font-medium tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                    {videos[4].durationTop}
                  </h2>
                </div>
                <div
                  className="w-full aspect-video lg:aspect-none lg:h-[26rem] overflow-hidden cursor-none"
                  onMouseEnter={() => setIsHoveringVideo(true)}
                  onMouseLeave={() => setIsHoveringVideo(false)}
                >
                  <video
                    src={videos[4].url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-row items-center justify-between w-full px-2 pt-1">
                  <h1 className="font-geist-mono font-medium tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                    {videos[4].title}
                  </h1>
                  <SmallBut />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ServicesSection />
      <ClientsSection />
    </div>
  );
}