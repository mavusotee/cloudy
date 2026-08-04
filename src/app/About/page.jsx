"use client";
import React, { useEffect } from "react";
import Button from "@/components/Button";
import VimeoPlayer from "@/components/VimeoPlayer";
import SmudgyTextReveal from "@/components/SmudgyTextReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServicesSection from "@/components/ServicesSection";

gsap.registerPlugin(ScrollTrigger);

const videos = [
  {
    id: 1,
    date: "01 - 2022",
    durationTop: "01:03",
    url: "https://vimeo.com/1161662171?share=copy&fl=cl&fe=ci",
    title: "THE BUILDING COMPANY",
    durationBottom: "01:03",
  },
  {
    id: 2,
    date: "01 - 2022",
    durationTop: "01:03",
    url: "https://vimeo.com/803344319?share=copy&fl=cl&fe=ci",
    title: "MAVTECH DESIGNS",
    durationBottom: "01:03",
  },
  {
    id: 3,
    date: "01 - 2022",
    durationTop: "01:03",
    url: "https://vimeo.com/846791428?share=copy&fl=cl&fe=ci",
    title: "THE BUILDING COMPANY",
    durationBottom: "01:03",
  },
  {
    id: 4,
    date: "01 - 2022",
    durationTop: "01:03",
    url: "https://vimeo.com/76979871",
    title: "THE BUILDING COMPANY",
    durationBottom: "01:03",
  },
  {
    id: 5,
    date: "01 - 2022",
    durationTop: "01:03",
    url: "https://vimeo.com/76979871",
    title: "MAVTECH DESIGNS",
    durationBottom: "01:03",
  },
];

export default function Page() {
  // Ensure ScrollTrigger refreshes calculations after DOM layout settles
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-carbon-black w-full min-h-screen py-6 px-4 md:px-6 flex flex-col space-y-16 lg:space-y-32 relative overflow-x-hidden">
      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 flex flex-col space-y-16 lg:space-y-28 w-full">
        {/* NAV */}
        <div className="flex flex-row items-center justify-between w-full text-lavender">
          <div className="font-mono tracking-tight text-[clamp(0.625rem,1vw,0.75rem)] flex items-center gap-2">
            <div className="w-2 h-2 bg-ghost-white" />
            <h1>OUR IDENTITY</h1>
          </div>
          <h1 className="font-mono tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)]">[CLOUD_1]</h1>
        </div>

        {/* INTRO SECTION */}
        <div className="flex flex-col lg:flex-row items-start justify-between w-full text-ghost-white gap-8 lg:gap-0">
          <h1 className="font-mono tracking-tight text-[clamp(0.75rem,1.1vw,0.875rem)]">
            IT ALL STARTS WITH AN IDEA
          </h1>

          <div className="flex flex-col items-start justify-end space-y-8 lg:space-y-12 w-full lg:w-1/2 lg:translate-x-0 xl:translate-x-20">
            {/* TILTED DIAGONAL OVAL SMUDGY REVEAL */}
            <SmudgyTextReveal 
              text="A hidden visual story costs more than missed contracts—it steals the authority your work has already earned." 
            />

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
            <h1 className="font-mono tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)]">[CLOUD_2]</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between w-full text-ghost-white gap-4 sm:gap-0">
            <div className="flex flex-row items-start gap-4 sm:gap-6 font-mono">
              <h1 className="text-[clamp(4rem,15vw,10.875rem)] tracking-[-8%] font-light leading-none">
               LATEST WORK
              </h1>
              <sup className="hidden text-[clamp(1rem,2vw,1.875rem)] pt-1 sm:pt-2 leading-none font-mono font-light tracking-tight">
                [{videos.length < 10 ? `0${videos.length}` : videos.length}]
              </sup>
            </div>

            <div className="flex flex-col items-end justify-end space-y-4 self-end sm:self-auto">
              <Button text="VIEW ALL WORKS" href="/Works" />
            </div>
          </div>

          {/* WORKS GRID */}
          <div className="flex flex-col space-y-12 lg:space-y-22 pt-6">
            {/* ROW 1 */}
            <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-8 lg:gap-0 text-lavender">
              {/* Card 1 */}
              <div className="flex flex-col space-y-2 w-full">
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-geist-mono tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                    {videos[0].date}
                  </h1>
                  <h2 className="font-sans font-medium tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                    {videos[0].durationTop}
                  </h2>
                </div>
                <div className="w-full aspect-video lg:aspect-none lg:h-[30rem] overflow-hidden">
                  <VimeoPlayer urlOrId={videos[0].url} />
                </div>
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-sans tracking-tight text-[clamp(1rem,1.5vw,1.25rem)] font-medium">
                    {videos[0].title}
                  </h1>
                  <h2 className="font-sans tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)]">
                    {videos[0].durationBottom}
                  </h2>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col space-y-2 w-full">
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-geist-mono tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                    {videos[1].date}
                  </h1>
                  <h2 className="font-sans font-medium tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                    {videos[1].durationTop}
                  </h2>
                </div>
                <div className="w-full aspect-video lg:aspect-none lg:h-[30rem] overflow-hidden">
                  <VimeoPlayer urlOrId={videos[1].url} />
                </div>
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-sans tracking-tight text-[clamp(1rem,1.5vw,1.25rem)] font-medium">
                    {videos[1].title}
                  </h1>
                  <h2 className="font-sans tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)]">
                    {videos[1].durationBottom}
                  </h2>
                </div>
              </div>
            </div>

            {/* ROW 2 - FEATURED */}
            <div className="flex flex-col space-y-2 w-full text-lavender">
              <div className="flex flex-row items-center justify-between w-full px-2">
                <h1 className="font-geist-mono tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                  {videos[2].date}
                </h1>
                <h2 className="font-sans tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                  {videos[2].durationTop}
                </h2>
              </div>
              <div className="w-full aspect-video lg:aspect-none lg:h-[45rem] overflow-hidden">
                <VimeoPlayer urlOrId={videos[2].url} />
              </div>
              <div className="flex flex-row items-center justify-between w-full px-2">
                <h1 className="font-sans tracking-tight text-[clamp(1rem,1.5vw,1.25rem)] font-medium">
                  {videos[2].title}
                </h1>
                <h2 className="font-sans tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)]">
                  {videos[2].durationBottom}
                </h2>
              </div>
            </div>

            {/* ROW 3 */}
            <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-8 lg:gap-6 text-lavender pb-0 lg:pb-12">
              {/* Card 4 */}
              <div className="flex flex-col space-y-2 w-full">
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-geist-mono tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                    {videos[3].date}
                  </h1>
                  <h2 className="font-sans tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                    {videos[3].durationTop}
                  </h2>
                </div>
                <div className="w-full aspect-video lg:aspect-none lg:h-[30rem] overflow-hidden">
                  <VimeoPlayer urlOrId={videos[3].url} />
                </div>
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-sans tracking-tight text-[clamp(1rem,1.5vw,1.25rem)] font-medium">
                    {videos[3].title}
                  </h1>
                  <h2 className="font-sans tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)]">
                    {videos[3].durationBottom}
                  </h2>
                </div>
              </div>

              {/* Card 5 */}
              <div className="flex flex-col space-y-2 w-full lg:translate-y-12">
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-geist-mono tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                    {videos[4].date}
                  </h1>
                  <h2 className="font-sans tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                    {videos[4].durationTop}
                  </h2>
                </div>
                <div className="w-full aspect-video lg:aspect-none lg:h-[30rem] overflow-hidden">
                  <VimeoPlayer urlOrId={videos[4].url} />
                </div>
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-sans tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                    {videos[4].title}
                  </h1>
                  <h2 className="font-sans tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)]">
                    {videos[4].durationBottom}
                  </h2>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ServicesSection />
    </div>
  );
}