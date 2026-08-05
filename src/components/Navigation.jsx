'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/Assets/Logo/cloud.svg'
import gsap from 'gsap'

function Navigation({ isMuted = true, onToggleSound }) {
  const logoRef = useRef(null)
  const linksRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 20) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false) // Scrolling down -> hide
      } else {
        setIsVisible(true)  // Scrolling up -> show
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // GSAP Animation Controller
  useEffect(() => {
    const elements = [logoRef.current, linksRef.current].filter(Boolean)

    if (isVisible) {
      gsap.to(elements, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out", // Change easing here to experiment! (e.g., "expo.out", "circ.out", "back.out(1.2)")
        stagger: 0.25,     // Subtle stagger between logo and links
        pointerEvents: "auto",
        overwrite: "auto",
      })
    } else {
      gsap.to(elements, {
        y: -34,
        opacity: 0,
        delay: 0.3,
        duration: 0.4,
        ease: "power2.in", // Easing when hiding
        pointerEvents: "none",
        overwrite: "auto",
      })
    }
  }, [isVisible])

  return (
    <nav className="flex flex-row items-center justify-between w-full text-ghost-white  md:px-4 md:py-4">
      {/* LOGO */}
      <div ref={logoRef} className="mix-blend-difference">
        <Link href="/">
          <Image 
            src={Logo} 
            alt="Logo" 
            width={200} 
            height={60} 
            priority 
            className="w-[clamp(140px,10vw+80px,320px)] h-auto"
          />
        </Link>
      </div>

      {/* LINKS DESKTOP */}
      <div
        ref={linksRef}
        className="hidden md:flex items-center justify-center space-x-4 font-mono uppercase text-[clamp(0.75rem,0.65rem+0.35vw,1.2rem)] translate-x-[clamp(0px,12vw,190px)] mix-blend-difference"
      >
        <Link href="/">ABOUT</Link>
        <Link href="/#">WORK</Link>
        <Link href="/#">MORE</Link>
        <Link href="/#">CONTACT</Link>
      </div>

      {/* RIGHT ACTION BUTTONS */}
      <div className="flex items-center space-x-3">
        {/* SOUND TOGGLE BUTTON */}
        <button
          onClick={onToggleSound}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          className="hidden md:flex items-center bg-carbon-black hover:bg-zinc-800 transition-colors h-[clamp(44px,2.5vw+20px,55px)] px-4 rounded-full border border-eclipse font-mono text-[clamp(0.45rem,0.65rem+0.3vw,1.25rem)] uppercase justify-center space-x-2 text-ghost-white cursor-pointer"
        >
          {isMuted ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.414 0-.75-.336-.75-.75V9.75c0-.414.336-.75.75-.75h4.99Z" />
              </svg>
              <span className="hidden sm:inline">SOUND OFF</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.287a5.25 5.25 0 0 1 0 7.426M11.25 4.5 6.53 9.22H3.75a.75.75 0 0 0-.75.75v4.06c0 .414.336.75.75.75h2.78l4.72 4.72a.75.75 0 0 0 1.28-.53V5.03a.75.75 0 0 0-1.28-.53Z" />
              </svg>
              <span className="hidden sm:inline text-emerald-400">SOUND ON</span>
            </>
          )}
        </button>

        {/* CHECK AVAILABILITY BUTTON */}
        <button className="bg-carbon-black hover:bg-zinc-800 transition-colors px-[clamp(16px,1vw+8px,16px)] py-0 w-[clamp(155px,12vw+70px,224px)] h-[clamp(44px,2.5vw+20px,55px)] rounded-full border border-eclipse font-mono tracking-tighter uppercase text-[clamp(0.3rem,0.63rem+0.3vw,1.25rem)] text-center flex items-center justify-center">
          Check availability
        </button>
      </div>
    </nav>
  )
}

export default Navigation