'use client'
import React, { useEffect } from 'react'
import Navigation from '@/components/UI/Navigation'
import Image from 'next/image'
import Lenis from 'lenis'
import Split from '@/components/Animations/Split'

function page() {

  useEffect(() => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
      })
  
      let frameId
  
      function raf(time) {
        lenis.raf(time)
        frameId = requestAnimationFrame(raf)
      }
  
      frameId = requestAnimationFrame(raf)
  
      // Cleanup when component unmounts
      return () => {
        cancelAnimationFrame(frameId)
        lenis.destroy()
      }
    }, [])
  return (
    <div className="w-full min-h-dvh bg-carbon-black p-4 md:p-8">
      {/*NAVIGATION*/}
      <Navigation />

      {/*===============================Page content==========================================*/}

      {/*Top Content*/}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 w-full pt-20 items-start">

        {/*LEFT CONTENT (Span 7 columns on desktop) */}
        <div className="flex flex-col space-y-18 lg:col-span-7 w-full">

          <div className="flex flex-col gap-y-6">
            <div className="font-mono tracking-tight text-[clamp(0.625rem,1vw,0.75rem)] flex items-center gap-2 text-ghost-white">
              <div className="w-2 h-2 bg-ghost-white text-ghost-white" />
              <h1>ABOUT CLOUDHAUS</h1>
            </div>
            <Split>

            <p className="text-ghost-white w-full text-[clamp(1.25rem,2.8vw,2.5rem)] tracking-tight leading-[130%] uppercase">
              Since 2019, Cloudhaus has created cinematic films and photography for high-end architecture and construction. Led by Jake McIntosh, the studio operates on the belief that exceptional work deserves to be documented with the same care and craftsmanship that brought it into being.
            </p>
            </Split>
          </div> 

          {/*LINKS AND MORE INFO*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
            {/*COL 1: CONTACT */}
            <div className="flex flex-col space-y-4">
              <div className="font-mono tracking-tight text-[clamp(0.625rem,1vw,0.75rem)] flex items-center gap-2 text-ghost-white">
                <div className="w-2 h-2 bg-ghost-white text-ghost-white" />
                <h2 className="text-zinc-700">CONTACT</h2>
              </div>
              
              <div className="flex flex-col space-y-3 w-full">
                <div className="flex flex-col font-sans text-ghost-white text-[clamp(0.75rem,1.2vw,1rem)] uppercase">
                  <p>0404 104 360</p>
                  <p>ADELAIDE, SOUTH AUSTRALIA</p>
                  <p>info@cloudhaus.com.au</p>
                </div>
              </div>
            </div>

            {/*COL 2: SERVICES */}
            <div className="flex flex-col space-y-4">
              <div className="font-mono tracking-tight text-[clamp(0.625rem,1vw,0.75rem)] flex items-center gap-2 text-ghost-white">
                <div className="w-2 h-2 bg-ghost-white text-eclipse" />
                <h2 className="text-zinc-700">SERVICES</h2>
              </div>
              
              <div className="flex flex-col space-y-3 w-full">
                <div className="flex flex-col font-sans text-ghost-white text-[clamp(0.75rem,1.2vw,1rem)] uppercase">
                  <p>PRE-PRODUCTION</p>
                  <p>PRODUCTION</p>
                  <p>POST-PRODUCTION</p>
                  <p>AI IN MOTION</p>
                </div>
              </div>
            </div>
          </div>

          {/*COL 3: SOCIALS */}
          <div className="flex flex-col space-y-4">
            <div className="font-mono tracking-tight text-[clamp(0.625rem,1vw,0.75rem)] flex items-center gap-2 text-ghost-white">
              <div className="w-2 h-2 bg-ghost-white text-eclipse" />
              <h2 className="text-zinc-700">SOCIALS</h2>
            </div>
            
            <div className="flex flex-col space-y-3 w-full">
              <div className="flex flex-row gap-6 sm:flex-row sm:gap-x-8 font-geist-mono text-ghost-white text-[clamp(0.75rem,1.2vw,1rem)] uppercase">
                <p>INSTAGRAM</p>
                <p>FACEBOOK</p>
                <p>VIMEO</p>
              </div>
            </div>
          </div>

        </div>

        {/*RIGHT IMAGE (Span 5 columns on desktop) */}
        <div className="flex flex-col gap-3 lg:col-span-5 w-full items-start lg:items-end lg:pr-4">
           <div className="w-full max-w-[220px] lg:max-w-[460px] h-[clamp(18rem,38vw,42rem)] relative">
             <Image 
               src="/Images/JAKE.png" 
               alt="Jake McIntosh, founder and director of Cloudhaus" 
               fill 
               className="object-cover rounded-none"
             />
           </div>
           <h1 className="font-geist-mono font-medium text-[clamp(0.6rem,1vw,0.85rem)] text-zinc-400 tracking-tight text-left lg:text-left w-full max-w-[420px] lg:max-w-[460px]">
            JAKE MCINTOSH - FOUNDER & DIRECTOR OF CLOUDHAUS
           </h1>
        </div>

      </div>
      
      {/* BOTTOM CONTENT */}
      <div className="flex flex-col-reverse md:flex-row items-start md:items-end justify-between font-geist-mono text-ghost-white text-[clamp(0.3rem,2.5vw,0.725rem)] uppercase w-full gap-[clamp(0.55rem,0.8vw,1.5rem)] pt-16 md:pt-48 px-2 md:px-4">
        {/* GROUPED 1st AND 2nd DIVS: Horizontal on mobile, inline with desktop row */}
        <div className="flex flex-row md:contents justify-between w-full md:w-auto">
          <div className="flex flex-col md:flex-row space-y-0 space-x-[clamp(0.5rem,4.5vw,6rem)]">
            <h1>BASED IN ADELAIDE</h1>
            <h1 className="">PRIVACY POLICY</h1>
          </div>
          <div className="flex flex-col md:flex-row space-y-0 space-x-[clamp(0.5rem,4.5vw,6rem)]">
            <h1>PRIVACY POLICY</h1>
            <h1 className="font-bold">WEBSITE BY: ZANI</h1>
          </div>
        </div>

        {/* 3rd DIV: Below on mobile, start-aligned */}
        <div className="flex flex-row space-x-[clamp(0.5rem,4.5vw,6rem)]">
          <h1 className="font-bold">BACK TO HOME</h1>
        </div>
      </div>
    </div>
  )
}

export default page