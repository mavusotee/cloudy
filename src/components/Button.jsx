"use client"
import React from 'react'
import Link from 'next/link'

function Button({ 
  text = 'Check availability', 
  href = '#', 
  className = '' 
}) {
  return (
    <Link href={href} className="inline-block">
      <button 
        className={`bg-carbon-black px-[clamp(16px,1vw+8px,16px)] py-0 w-[clamp(160px,12vw+70px,196px)] h-[clamp(44px,2.5vw+20px,49px)] rounded-full border border-eclipse font-geist-mono tracking-tight font-light uppercase text-[clamp(0.75rem,0.65rem+0.3vw,0.95rem)] text-center flex items-center justify-center  ${className}`}
      >
        {text}
      </button>
    </Link>
  )
}

export default Button