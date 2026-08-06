'use client'
import { PlayIcon, StepForward } from 'lucide-react'
import React from 'react'

function Controls({ 
  duration = '00:00', 
  onNext, 
  currentIndex = 1, 
  totalVideos = 3,
  title = 'THE BUILDING COMPANY' 
}) {
  // Format numbers like 1 -> "01"
  const formattedIndex = String(currentIndex).padStart(2, '0')
  const formattedTotal = String(totalVideos).padStart(2, '0')

  return (
    <div className="flex items-center justify-between text-ghost-white w-full">

      {/* LEFT-CONTROLS (Hidden on Mobile) */}
      <div className="hidden md:flex flex-col items-start justify-start space-y-1 w-[clamp(140px,30vw,360px)]">
        <h1 className="font-sans font-semibold text-[clamp(0.5rem,0.45rem+0.2vw,0.625rem)]">FEATURED WORKS</h1>
        <div className="flex items-center justify-between w-full text-[clamp(0.65rem,0.5rem+0.5vw,1.25rem)] font-geist-mono">
          <h1 className="truncate">{title}</h1>
          <h2 className="shrink-0 ml-2 font-geist-mono font-medium">{duration}</h2>
        </div>

        <div className="bg-zinc-400 w-full h-[0.25px]" />
      </div>

      {/* PLAY BUTTON (Hidden on Mobile) */}
      <div className="hidden md:block">
        <button 
          aria-label="Play video"
          className="font-geist-mono cursor-pointer mix-blend-difference text-xl hover:font-semibold transition duration-300"
        >
          [ PLAY ]
        </button>
      </div>

      {/* RIGHT-CONTROLS (Full Width on Mobile, Fixed Clamp on Desktop) */}
      <div className="flex flex-col items-end justify-start space-y-1 w-full md:w-[clamp(110px,30vw,300px)]">
        <div className="flex items-center justify-between w-full text-[clamp(0.75rem,0.55rem+0.3vw,0.95rem)] font-geist-mono">
          <h1 className="font-geist-mono font-bold">{formattedIndex} / {formattedTotal}</h1>
          
          <button 
            onClick={onNext}
            className="flex items-center justify-center gap-2 cursor-pointer hover:opacity-75 transition-opacity"
          >
            <div className="text-white bg-white w-[clamp(3px,0.25vw+2px,12px)] h-[clamp(3px,0.25vw+2px,15px)]" />
            <h1 className="text-sm md:text-sm">NEXT</h1>
          </button>
        </div>

        <div className="bg-ghost-white w-full h-[0.25px]" />
      </div>

    </div>
  )
}

export default Controls