'use client'
import { PlayIcon } from 'lucide-react'
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
    <div className="hidden md:flex items-center justify-between text-ghost-white w-full">

      {/* LEFT-CONTROLS */}
      <div className="flex flex-col items-start justify-start space-y-1 w-[clamp(140px,30vw,360px)]">
        <h1 className="font-sans text-[clamp(0.5rem,0.45rem+0.2vw,0.625rem)]">FEATURED WORKS</h1>
        <div className="flex items-center justify-between w-full text-[clamp(0.65rem,0.5rem+0.5vw,0.95rem)] font-mono">
          <h1 className="truncate">{title}</h1>
          <h2 className="shrink-0 ml-2">{duration}</h2>
        </div>

        <div className="bg-zinc-400 w-full h-[0.25px]" />
      </div>

      {/* PLAY BUTTON */}
      <div>
        <button 
          aria-label="Play video"
          className="bg-carbon-black w-[clamp(60px,5vw+35px,100px)] h-[clamp(60px,5vw+35px,100px)] rounded-full border border-eclipse font-mono tracking-tighter uppercase text-[0.95rem] text-center flex items-center justify-center transition-transform hover:scale-105 opacity-0"
        >
          <PlayIcon strokeWidth="2" className="w-[clamp(16px,1.5vw+12px,38px)] h-[clamp(16px,1.5vw+10px,28px)]" />
        </button>
      </div>

      {/* RIGHT-CONTROLS */}
      <div className="flex flex-col items-end justify-start space-y-1 w-[clamp(110px,30vw,300px)]">
        <div className="flex items-center justify-between w-full text-[clamp(0.65rem,0.55rem+0.3vw,0.95rem)] font-mono">
          <h1>{formattedIndex} / {formattedTotal}</h1>
          
          <button 
            onClick={onNext}
            className="flex items-center justify-center gap-2 cursor-pointer hover:opacity-75 transition-opacity"
          >
            <div className="bg-white w-[clamp(3px,0.25vw+2px,5px)] h-[clamp(3px,0.25vw+2px,5px)]" />
            <h1>NEXT</h1>
          </button>
        </div>

        <div className="bg-ghost-white w-full h-[0.25px]" />
      </div>

    </div>
  )
}

export default Controls