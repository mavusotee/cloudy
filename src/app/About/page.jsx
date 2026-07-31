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
    /* Container MUST have 'relative' so absolute layers anchor to it */
    <div className="bg-carbon-black w-full min-h-screen py-6 px-6 flex flex-col space-y-32 relative overflow-hidden">
      {/* 1. FOG CANVAS: Stretches across the full scrollable page height */}

      {/* 2. FOREGROUND CONTENT: Sits safely at z-10 above the grid and fog */}
      <div className="relative z-10 flex flex-col space-y-28 w-full">
        {/* NAV */}
        <div className="flex flex-row items-center justify-between w-full text-lavender">
          <div className="font-mono tracking-tight text-[12px] flex items-center gap-2">
            <div className="w-2 h-2 bg-ghost-white" />
            <h1>OUR IDENTITY</h1>
          </div>
          <h1 className="font-mono tracking-tight text-[10px]">[CLOUD_1]</h1>
        </div>

        {/* INTRO SECTION */}
        <div className="flex flex-row items-start justify-between w-full text-ghost-white">
          <h1 className="font-mono tracking-tight text-[14px]">
            IT ALL STARTS WITH AN IDEA
          </h1>

          <div className="flex flex-col items-start justify-end space-y-12 w-1/2 translate-x-20">
            <Split duration="2">
              <p className="w-[685.9px] leading-[120%] font-regular text-[40px] tracking-tight uppercase">
                A hidden visual story costs more than missed contracts—it steals the authority your work has already earned.
              </p>
            </Split>

            <Button text="ABOUT CLOUDHAUS" href="/About" />
          </div>
        </div>

        {/* HEADER & WORKS SECTION */}
        <div className="flex flex-col space-y-6 pt-10">
          <div className="flex flex-row items-center justify-between w-full text-zinc-300">
            <div className="font-mono tracking-tight text-[10px] flex items-center gap-2">
              <div className="w-2 h-2 bg-zinc-600" />
              <h1>SELECTED WORKS</h1>
            </div>
            <h1 className="font-mono tracking-tight text-[10px]">[CLOUD_2]</h1>
          </div>

          <div className="flex flex-row items-end justify-between w-full text-ghost-white">
            <div className="flex flex-row items-start gap-6 font-mono">
              <h1 className="text-[270px] tracking-[-8%] font-light leading-none">
                WORK
              </h1>
              <sup className="text-3xl pt-2 leading-none font-mono font-light tracking-tight">
                [{videos.length < 10 ? `0${videos.length}` : videos.length}]
              </sup>
            </div>

            <div className="flex flex-col items-end justify-end space-y-4">
              <Button text="VIEW ALL WORKS" href="/Works" />
            </div>
          </div>

          {/* WORKS GRID */}
          <div className="flex flex-col space-y-22">
            {/* ROW-1 (Index 0 & 1) */}
            <div className="flex flex-row items-center justify-center w-full text-lavender">
              <div className="flex flex-col space-y-2 w-full">
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-geist-mono tracking-tight text-[16px]">
                    {videos[0].date}
                  </h1>
                  <h2 className="font-sans font-medium tracking-tight text-[16px]">
                    {videos[0].durationTop}
                  </h2>
                </div>
                <div className="w-full h-[30rem]">
                  <VimeoPlayer urlOrId={videos[0].url} />
                </div>
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-sans tracking-tight text-[20px] font-medium">
                    {videos[0].title}
                  </h1>
                  <h2 className="font-sans tracking-tight text-[12px]">
                    {videos[0].durationBottom}
                  </h2>
                </div>
              </div>

              <div className="flex flex-col space-y-2 w-full">
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-geist-mono tracking-tight text-[16px]">
                    {videos[1].date}
                  </h1>
                  <h2 className="font-sans tracking-tight text-[16px]">
                    {videos[1].durationTop}
                  </h2>
                </div>
                <div className="w-full h-[30rem]">
                  <VimeoPlayer urlOrId={videos[1].url} />
                </div>
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-sans tracking-tight text-[20px] font-medium">
                    {videos[1].title}
                  </h1>
                  <h2 className="font-sans tracking-tight text-[12px]">
                    {videos[1].durationBottom}
                  </h2>
                </div>
              </div>
            </div>

            {/* VID-BLOCK-3 (Index 2) */}
            <div className="flex flex-col space-y-2 w-full text-lavender">
              <div className="flex flex-row items-center justify-between w-full px-2">
                <h1 className="font-geist-mono tracking-tight text-[16px]">
                  {videos[2].date}
                </h1>
                <h2 className="font-sans tracking-tight text-[16px]">{videos[2].durationTop}</h2>
              </div>
              <div className="w-full h-[45rem]">
                <VimeoPlayer urlOrId={videos[2].url} />
              </div>
              <div className="flex flex-row items-center justify-between w-full px-2">
                <h1 className="font-sans tracking-tight text-[20px] font-medium">
                  {videos[2].title}
                </h1>
                <h2 className="font-sans tracking-tight text-[12px]">{videos[2].durationBottom}</h2>
              </div>
            </div>

            {/* ROW-3 (Index 3 & 4) */}
            <div className="flex flex-row items-center justify-center w-full space-x-6 text-lavender">
              <div className="flex flex-col space-y-2 w-full">
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-geist-mono tracking-tight text-[16px]">
                    {videos[3].date}
                  </h1>
                  <h2 className="font-sans tracking-tight text-[16px]">
                    {videos[3].durationTop}
                  </h2>
                </div>
                <div className="w-full h-[30rem]">
                  <VimeoPlayer urlOrId={videos[3].url} />
                </div>
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-sans tracking-tight text-[20px] font-medium">
                    {videos[3].title}
                  </h1>
                  <h2 className="font-sans tracking-tight text-[12px]">
                    {videos[3].durationBottom}
                  </h2>
                </div>
              </div>

              <div className="flex flex-col space-y-2 w-full translate-y-12 text-lavender">
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-geist-mono tracking-tight text-[16px]">
                    {videos[4].date}
                  </h1>
                  <h2 className="font-sans tracking-tight text-[16px]">
                    {videos[4].durationTop}
                  </h2>
                </div>
                <div className="w-full h-[30rem]">
                  <VimeoPlayer urlOrId={videos[4].url} />
                </div>
                <div className="flex flex-row items-center justify-between w-full px-2">
                  <h1 className="font-sans tracking-tight text-[16px]">
                    {videos[4].title}
                  </h1>
                  <h2 className="font-sans tracking-tight text-[12px]">
                    {videos[4].durationBottom}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;