"use client";
import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import SmallButton from "@/components/SmallButton";
import Footer from "@/components/Footer";
import SmallBut from "@/components/SmallBut";
import SmudgyTextReveal from "@/components/SmudgyTextReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServicesSection from "@/components/ServicesSection";
import ClientsSection from "@/components/ClientsSection";
import { ArrowLeft } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const initialVideos = [
  {
    id: 1,
    date: "01 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922206/evergreen_comp_1080p_vfkngm.mp4",
    title: "THE BUILDING COMPANY",
    subtitle: "EVERGREEN RESIDENCE",
  },
  {
    id: 2,
    date: "01 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922129/woods_project_compressed_1080p_dpzyjd.mp4",
    title: "MORGAN BUILD",
    subtitle: "WOODS PROJECT",
  },
  {
    id: 3,
    date: "01 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785921796/dunehouse_comp_1440p_hp8mzj.mp4",
    title: "4LIFE CONSTRUCTIONS",
    subtitle: "THE DUNE HOUSE",
  },
  {
    id: 4,
    date: "01 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922167/skatepark_house_comp_1080p_v29fnm.mp4",
    title: "MORGAN BUILD",
    subtitle: "SKATEPARK HOUSE",
  },
  {
    id: 5,
    date: "01 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785921778/north_adelaide_comp_1440p_exjydf.mp4",
    title: "KRIVIC",
    subtitle: "NORTH ADELAIDE",
  },
];

const formatTime = (seconds) => {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// Reusable Video Component with GSAP Half-Capture Frame animation & Hover-to-Pause logic
function VideoCard({ item, time, onTimeUpdate, handleLoadedMetadata, onHoverStart, onHoverEnd, heightClass, isFullWidth }) {
  const containerRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const topL = containerRef.current.querySelector(".corner-tl");
      const topR = containerRef.current.querySelector(".corner-tr");
      const botL = containerRef.current.querySelector(".corner-bl");
      const botR = containerRef.current.querySelector(".corner-br");

      tlRef.current = gsap.timeline({ paused: true })
        .to([topL, topR, botL, botR], {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: "power2.out",
        })
        .to(topL, { x: 0, y: 0, duration: 0.35, ease: "power2.out" }, 0)
        .to(topR, { x: 0, y: 0, duration: 0.35, ease: "power2.out" }, 0)
        .to(botL, { x: 0, y: 0, duration: 0.35, ease: "power2.out" }, 0)
        .to(botR, { x: 0, y: 0, duration: 0.35, ease: "power2.out" }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (e) => {
    if (tlRef.current) tlRef.current.play();
    onHoverStart();
    const video = containerRef.current.querySelector("video");
    if (video) video.pause();
  };

  const handleMouseLeave = (e) => {
    if (tlRef.current) tlRef.current.reverse();
    onHoverEnd();
    const video = containerRef.current.querySelector("video");
    if (video) video.play();
  };

  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="flex flex-row items-center justify-between w-full px-0 md:px-2">
        <h1 className="font-geist-mono tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)] text-zinc-500">
          {item.date}
        </h1>
        <h2 className="font-geist-mono font-medium tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)] text-zinc-500">
          {time}
        </h2>
      </div>

      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative ${
          isFullWidth
            ? "w-screen left-1/2 -translate-x-1/2"
            : "w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0"
        } ${heightClass} overflow-hidden cursor-none`}
      >
        <video
          src={item.url}
          autoPlay
          loop
          muted
          playsInline
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          className="w-full h-full object-cover brightness-90 contrast-105"
        />

        {/* DARK MOODY OVERLAY */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-300 hover:opacity-20" />

        {/* GSAP CAPTURE CORNER BRACKETS (MIX BLEND DIFFERENCE) */}
        <div className="absolute inset-0 pointer-events-none mix-blend-difference z-20 p-4">
          {/* Top Left */}
          <div className="corner-tl absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white opacity-0 scale-90 -translate-x-3 -translate-y-3" />
          {/* Top Right */}
          <div className="corner-tr absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white opacity-0 scale-90 translate-x-3 -translate-y-3" />
          {/* Bottom Left */}
          <div className="corner-bl absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white opacity-0 scale-90 -translate-x-3 translate-y-3" />
          {/* Bottom Right */}
          <div className="corner-br absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white opacity-0 scale-90 translate-x-3 translate-y-3" />
        </div>
      </div>

      <div className="flex flex-row items-baseline justify-between w-full px-0 md:px-2 pt-2 text-ghost-white">
        <div className="flex flex-col">
          <p className="font-geist-mono text-[clamp(0.75rem,1vw,0.575rem)] text-zinc-400 tracking-tight">
            {item.title}
          </p>
          <h1 className="font-sans font-medium tracking-tight text-[clamp(1rem,1.5vw,1.35rem)] text-ghost-white">
            {item.subtitle}
          </h1>
        </div>
        <SmallBut />
      </div>
    </div>
  );
}

export default function Page() {
  const cursorRef = useRef(null);
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);

  // State to hold live playback times for each video ID
  const [timeState, setTimeState] = useState({
    1: "00:00",
    2: "00:00",
    3: "00:00",
    4: "00:00",
    5: "00:00",
  });

  const handleLoadedMetadata = (e) => {
    const video = e.currentTarget;
    if (video && video.duration) {
      video.currentTime = Math.random() * video.duration;
    }
  };

  const handleTimeUpdate = (id, e) => {
    const video = e.currentTarget;
    if (video) {
      setTimeState((prev) => ({
        ...prev,
        [id]: formatTime(video.currentTime),
      }));
    }
  };

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
          <h1 className="font-geist-mono font-medium tracking-tight text-[clamp(0.5rem,0.8vw,0.725rem)] text-ghost-white">
            [CLOUD_1]
          </h1>
        </div>

        {/* INTRO SECTION */}
        <div className="flex flex-col lg:flex-row items-start justify-between w-full text-ghost-white gap-12 lg:gap-0">
          <h1 className="font-geist-mono md:tracking-tight text-[clamp(0.65rem,1.1vw,0.875rem)]">
            IT ALL STARTS WITH AN IDEA.
          </h1>

          <div className="flex flex-col items-start justify-end space-y-8 lg:space-y-12 w-full lg:w-1/2 lg:translate-x-0 xl:translate-x-80 font-medium">
            <SmudgyTextReveal text="A hidden visual story costs more than missed contracts, it steals the authority your work has already earned." />
            <Button text="ABOUT CLOUDHAUS" href="/About" />
          </div>

          <div className="hidden md:flex ">( <ArrowLeft /> )</div>
        </div>

        {/* HEADER & WORKS SECTION */}
        <div className="flex flex-col space-y-6 pt-14 lg:pt-20">
          <div className="flex flex-row items-center justify-between w-full text-zinc-300">
            <div className="font-geist-mono font-medium tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)] flex items-center gap-2">
              <div className="w-2 h-2 bg-zinc-300" />
              <h1>SELECTED WORKS</h1>
            </div>
            <h1 className="font-geist-mono font-medium tracking-tight text-ghost-white text-[clamp(0.5rem,0.8vw,0.725rem)]">
              [CLOUD_2]
            </h1>
          </div>

          {/* WORKS HEADER ROW */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between w-full text-ghost-white gap-4 sm:gap-0">
            <div className="flex flex-row items-start gap-4 sm:gap-6 font-geist-mono">
              <h1 className="text-[clamp(8rem,20vw,30.875rem)] tracking-[-8%] font-light leading-none uppercase">
                Works
              </h1>
              <sup className="text-[clamp(1rem,2vw,1.875rem)] pt-1 sm:pt-6 leading-none font-sans font-medium tracking-tight">
                ({initialVideos.length < 10 ? `0${initialVideos.length}` : initialVideos.length})
              </sup>
            </div>

            <div className="flex flex-col items-start sm:items-end justify-end sm:self-end w-full sm:w-auto">
              <Button text="VIEW ALL WORKS" href="/Works" />
            </div>
          </div>

          {/* WORKS GRID */}
          <div className="flex flex-col space-y-8 lg:space-y-28 pt-6">
            {/* ROW 1 */}
            <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-8 lg:gap-0 text-lavender">
              <VideoCard
                item={initialVideos[0]}
                time={timeState[1]}
                onTimeUpdate={(e) => handleTimeUpdate(1, e)}
                handleLoadedMetadata={handleLoadedMetadata}
                onHoverStart={() => setIsHoveringVideo(true)}
                onHoverEnd={() => setIsHoveringVideo(false)}
                heightClass="aspect-video lg:aspect-none h-[17.5rem] lg:h-[30rem]"
              />
              <VideoCard
                item={initialVideos[1]}
                time={timeState[2]}
                onTimeUpdate={(e) => handleTimeUpdate(2, e)}
                handleLoadedMetadata={handleLoadedMetadata}
                onHoverStart={() => setIsHoveringVideo(true)}
                onHoverEnd={() => setIsHoveringVideo(false)}
                heightClass="aspect-video lg:aspect-none h-[17.5rem] lg:h-[30rem]"
              />
            </div>

            {/* ROW 2 - FEATURED (EDGE-TO-EDGE FULLSCREEN) */}
            <VideoCard
              item={initialVideos[2]}
              time={timeState[3]}
              onTimeUpdate={(e) => handleTimeUpdate(3, e)}
              handleLoadedMetadata={handleLoadedMetadata}
              onHoverStart={() => setIsHoveringVideo(true)}
              onHoverEnd={() => setIsHoveringVideo(false)}
              heightClass="h-[60vh] lg:h-screen"
              isFullWidth={true}
            />

            {/* ROW 3 (EDITORIAL ASYMMETRIC GRID) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] w-full gap-12 lg:gap-20 text-lavender pb-12 lg:pb-24 items-start">
              <VideoCard
                item={initialVideos[3]}
                time={timeState[4]}
                onTimeUpdate={(e) => handleTimeUpdate(4, e)}
                handleLoadedMetadata={handleLoadedMetadata}
                onHoverStart={() => setIsHoveringVideo(true)}
                onHoverEnd={() => setIsHoveringVideo(false)}
                heightClass="aspect-video lg:aspect-none h-[17.5rem] lg:h-[36rem]"
              />
              <div className="w-full lg:translate-y-24">
                <VideoCard
                  item={initialVideos[4]}
                  time={timeState[5]}
                  onTimeUpdate={(e) => handleTimeUpdate(5, e)}
                  handleLoadedMetadata={handleLoadedMetadata}
                  onHoverStart={() => setIsHoveringVideo(true)}
                  onHoverEnd={() => setIsHoveringVideo(false)}
                  heightClass="aspect-video lg:aspect-none h-[17.5rem] lg:h-[26rem]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ServicesSection />
      <ClientsSection />
      <Footer />
    </div>
  );
}