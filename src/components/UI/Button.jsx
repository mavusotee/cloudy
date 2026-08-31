"use client"
import React, { useState } from 'react'
import TransitionLink from '@/components/PageTransitions/TransitionLink'

export default function Button({ 
  text = 'Check availability', 
  href = '#', 
  className = '',
  onClick
}) {
  const [isHovered, setIsHovered] = useState(false)

  const buttonContent = (
    <button 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden bg-black px-[clamp(16px,1vw+8px,16px)] py-0 w-[clamp(165px,12vw+70px,199px)] h-[clamp(42px,2.5vw+20px,49px)] rounded-full border border-eclipse font-geist-mono tracking-tight font-light uppercase text-[clamp(0.15rem,0.65rem+0.3vw,0.95rem)] text-center flex items-center justify-center cursor-pointer transition-colors duration-300  ${className}`}
    >
      {/* Text Layer: Dynamic color shift via CSS transition */}
      <span 
        className={`relative z-10 transition-colors duration-200 ease-out ${
          isHovered ? 'text-zinc-200 font-normal' : 'text-ghost-white'
        }`}
      >
        {text}
      </span>
    </button>
  )

  // If href is supplied, wrap with TransitionLink
  if (href) {
    return (
      <TransitionLink href={href} className="inline-block">
        {buttonContent}
      </TransitionLink>
    )
  }

  return buttonContent
}