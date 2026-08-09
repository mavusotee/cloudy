'use client'

import { PlayIcon, StepForward } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from "@gsap/react"
import React, { useRef } from 'react'
import BlurFlicker from "./BlurFlicker"

function Controls({ 
  duration = '00:00', 
  onNext, 
  currentIndex = 1, 
  totalVideos = 3,
  title = 'THE BUILDING COMPANY',
  isLoaded = false
}) {
  const containerRef = useRef(null)
  const buttonRef = useRef(null)

  // Format numbers like 1 -> "01"
  const formattedIndex = String(currentIndex).padStart(2, '0')
  const formattedTotal = String(totalVideos).padStart(2, '0')

  // GSAP INITIAL SET & REVEAL ANIMATIONS
  useGSAP(() => {
    // 1. Initial hidden state setup
    gsap.set(".PB", { opacity: 0, y: 3, scale: 1.3, filter: "blur(10px)" })
    
    // Set origin to "center" so the scale expands from the middle outward
    gsap.set(".control-underline", { scaleX: 0, transformOrigin: "center center" })
    
    gsap.set(".mask-text", { 
      yPercent: 120, 
      skewY: 6, 
      opacity: 0, 
      filter: "blur(8px)" 
    })

    // 2. Pause until preloader completes
    if (!isLoaded) return

    const tl = gsap.timeline({ delay: 0.1 })

    // 3. Reveal Text Elements
    tl.to(".mask-text", {
      yPercent: 0,
      skewY: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1,
      ease: "power4.out",
      stagger: 0.05
    })
    // 4. Reveal Underlines
    .to(".control-underline", {
      scaleX: 1,
      duration: 1,
      ease: "power3.inOut",
      stagger: 0.1
    }, "-=0.8")
    // 5. Play Button Entrance
    .to(".PB", {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: "power3.out",
      filter: "blur(0px)"
    }, "-=0.9")

  }, { dependencies: [isLoaded], scope: containerRef })

  // GSAP MAGNETIC HOVER EFFECT
  useGSAP(() => {
    const btn = buttonRef.current
    if (!btn) return

    const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" })
    const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" })

    const handleMouseMove = (e) => {
      const { left, top, width, height } = btn.getBoundingClientRect()
      const x = e.clientX - (left + width / 2)
      const y = e.clientY - (top + height / 2)

      xTo(x * 0.55)
      yTo(y * 0.55)
    }

    const handleMouseLeave = () => {
      xTo(0)
      yTo(0)
    }

    btn.addEventListener('mousemove', handleMouseMove)
    btn.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove)
      btn.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="flex items-center justify-between text-ghost-white w-full select-none">

      {/* LEFT-CONTROLS */}
      <div className="hidden md:flex flex-col items-start justify-start space-y-1 w-[clamp(140px,30vw,360px)]">
        
        <div className="overflow-hidden pb-0.5">
          <h1 className="mask-text font-sans font-semibold text-[clamp(0.5rem,0.45rem+0.2vw,0.925rem)] block origin-left">
            FEATURED WORKS
          </h1>
        </div>

        <div className="flex items-center justify-between w-full text-[clamp(0.65rem,0.5rem+0.55vw,1.85rem)] font-geist-mono">
          <div className="overflow-hidden pb-0.5">
            <h1 className="mask-text truncate block origin-left">{title}</h1>
          </div>
          <div className="overflow-hidden pb-0.5">
            <h2 className="mask-text shrink-0 ml-2 font-geist-mono font-medium block origin-left">{duration}</h2>
          </div>
        </div>

        <div className="control-underline bg-ghost-white w-full h-[0.25px]" />
      </div>

      {/* PLAY BUTTON */}
      <div className="hidden md:block PB">
        <button 
          ref={buttonRef}
          aria-label="Play video"
          className="font-geist-mono cursor-pointer mix-blend-difference text-2xl hover:font-bold transition-all duration-300 inline-block p-2"
        >
          [ PLAY ]
        </button>
      </div>

      {/* RIGHT-CONTROLS */}
      <div className="flex flex-col items-end justify-start space-y-1 w-full md:w-[clamp(110px,30vw,300px)]">
        
        <div className="flex items-center justify-between w-full text-[clamp(0.75rem,0.55rem+0.3vw,0.975rem)] font-geist-mono">
          <div className="overflow-hidden pb-0.5">
            <h1 className="mask-text font-geist-mono font-bold block origin-left">
              {formattedIndex} / {formattedTotal}
            </h1>
          </div>
          <BlurFlicker>
          <button 
            onClick={onNext}
            className="flex items-center justify-center gap-2 cursor-pointer hover:opacity-75 transition-opacity overflow-hidden p-1"
          >
            <div className="mask-text flex items-center gap-2 origin-left">
              <div className="text-white bg-white w-[clamp(3px,0.25vw+2px,12px)] h-[clamp(3px,0.25vw+2px,15px)]" />
              <h1 className="text-[clamp(0.75rem,0.65rem+0.3vw,0.975rem)]">NEXT</h1>
            </div>
          </button>
          </BlurFlicker>
        </div>

        <div className="control-underline bg-ghost-white w-full h-[0.25px]" />
      </div>

    </div>
  )
}

export default Controls