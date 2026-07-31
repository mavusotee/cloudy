'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/Assets/Logo/cloud.svg';

function Navigation() {
  return (
    <nav className="flex flex-row items-center justify-between w-full text-ghost-white px-4 py-4">
  <Link href="/" className="mix-blend-difference">
    <Image 
      src={Logo} 
      alt="Logo" 
      width={200} 
      height={60} 
      priority 
      className="w-[clamp(180px,10vw+80px,320px)] h-auto"
    />
  </Link>

  {/* LINKS DESKTOP */}
  <div className="hidden md:flex items-center justify-center space-x-4 font-mono uppercase text-[clamp(0.75rem,0.65rem+0.35vw,1.2rem)] translate-x-[clamp(0px,12vw,190px)] mix-blend-difference">
    <Link href="/">ABOUT</Link>
    <Link href="/#">WORK</Link>
    <Link href="/#">MORE</Link>
    <Link href="/#">CONTACT</Link>
  </div>

  <div>
    <button className="bg-carbon-black px-[clamp(16px,1vw+8px,16px)] py-0 w-[clamp(160px,12vw+70px,224px)] h-[clamp(44px,2.5vw+20px,55px)] rounded-full border border-eclipse font-mono tracking-tighter uppercase text-[clamp(0.75rem,0.65rem+0.3vw,1.25rem)] text-center flex items-center justify-center">
      Check availability
    </button>
  </div>
</nav>
  )
}

export default Navigation