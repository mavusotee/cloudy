"use client";
import Button from "@/components/Button";
import CinematicFogCanvas from "@/components/CinematicFog";
import Split from "@/components/Split";
import VimeoPlayer from "@/components/VimeoPlayer";
import React from "react";

const videos = [
  {
    id: 1,
    date: "01 - 2022",
    durationTop: "01:03",
    url: "https://vimeo.com/1161662171?share=copy&fl=cl&fe=ci",
    title: "THE BUIDLING COMPANY",
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
    title: "THE BUIDLING COMPANY",
    durationBottom: "01:03",
  },
  {
    id: 4,
    date: "01 - 2022",
    durationTop: "01:03",
    url: "https://vimeo.com/76979871",
    title: "THE BUIDLING COMPANY",
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

function page() {
  return (
    <div className="bg-carbon-black w-full min-h-screen py-6 px-4 md:px-8 flex flex-col space-y-16 md:space-y-32 relative overflow-hidden">
      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 flex flex-col space-y-16 md:space-y-28 w-full">
        {/* NAV */}
        <div className="flex flex-row items-center justify-between w-full text-lavender">
          <div className="font-mono tracking-tight text-[clamp(0.625rem,1vw,0.75rem)] flex items-center gap-2">
            <div className="w-2 h-2 bg-ghost-white" />
            <h1>OUR IDENTITY</h1>
          </div>
          <h1 className="font-mono tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)]">[CLOUD_1]</h1>
        </div>

        {/* INTRO SECTION */}
        <div className="flex flex-col lg:flex-row items-start justify-between w-full text-ghost-white gap-8 lg:gap-12">
          <h1 className="font-mono tracking-tight text-[clamp(0.75rem,1.1vw,0.875rem)]">
            IT ALL STARTS WITH AN IDEA
          </h1>

          <div className="flex flex-col items-start justify-end space-y-8 lg:space-y-12 w-full lg:w-3/5">
            <Split duration="2">
              <p className="w-full leading-[135%] md:leading-[120%] font-regular text-[clamp(1.7rem,3.5vw,3.125rem)] tracking-tight uppercase">
                A hidden visual story costs more than missed contracts—it steals the authority your work has already earned.
              </p>
            </Split>

            <Button text="ABOUT CLOUDHAUS" href="/About" />
          </div>
        </div>

        {/* HEADER & WORKS SECTION */}
        <div className="flex flex-col space-y-6 pt-6 md:pt-10">
          <div className="flex flex-row items-center justify-between w-full text-zinc-300">
            <div className="font-mono tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)] flex items-center gap-2">
              <div className="w-2 h-2 bg-zinc-600" />
              <h1>SELECTED WORKS</h1>
            </div>
            <h1 className="font-mono tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)]">[CLOUD_2]</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between w-full text-ghost-white gap-4">
            <div className="flex flex-row items-start gap-3 sm:gap-6 font-mono">
              <h1 className="text-[clamp(4rem,18vw,16.875rem)] tracking-[-8%] font-light leading-none">
                WORK
              </h1>
              <sup className="text-[clamp(1rem,2vw,1.875rem)] pt-1 sm:pt-2 leading-none font-mono font-light tracking-tight">
                [{videos.length < 10 ? `0${videos.length}` : videos.length}]
              </sup>
            </div>

            <div className="flex flex-col items-end justify-end space-y-4 self-end sm:self-auto">
              <Button text="VIEW ALL WORKS" href="/Works" />
            </div>
          </div>

          {/* WORKS GRID (Flex Column Layout - All video blocks uniform) */}
          <div className="flex flex-col space-y-12 md:space-y-20 pt-8">
            {videos.map((video) => (
              <div key={video.id} className="flex flex-col space-y-2 w-full text-lavender">
                {/* Top Meta Bar */}
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-geist-mono tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                    {video.date}
                  </h1>
                  <h2 className="font-sans font-medium tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)]">
                    {video.durationTop}
                  </h2>
                </div>

                {/* Video Player Frame */}
                <div className="w-full aspect-video overflow-hidden bg-zinc-900">
                  <VimeoPlayer urlOrId={video.url} />
                </div>

                {/* Bottom Meta Bar */}
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-sans tracking-tight text-[clamp(1rem,1.5vw,1.25rem)] font-medium">
                    {video.title}
                  </h1>
                  <h2 className="font-sans tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)]">
                    {video.durationBottom}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;