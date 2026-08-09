'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/Assets/Logo/cloud.svg'
import gsap from 'gsap'

function Navigation({ isMuted = true, onToggleSound }) {
  const logoRef = useRef(null)
  const linksRef = useRef(null)

  const menuOverlayRef = useRef(null)
  const menuContentRef = useRef(null)
  const openTlRef = useRef(null)
  const closeTlRef = useRef(null)

  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 20) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false) // Scrolling down -> hide
      } else {
        setIsVisible(true) // Scrolling up -> show
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // GSAP Scroll Animation
  useEffect(() => {
    const elements = [logoRef.current, linksRef.current].filter(Boolean)

    if (isVisible) {
      gsap.to(elements, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        pointerEvents: "auto",
        overwrite: "auto",
      })
    } else {
      gsap.to(elements, {
        y: 0,
        opacity: 1,
        delay: 0.1,
        duration: 0.4,
        ease: "power2.in",
        pointerEvents: "none",
        overwrite: "auto",
      })
    }
  }, [isVisible])

  // GSAP Vertical Top-to-Bottom Clip-Path Animation
  useEffect(() => {
    if (!menuOverlayRef.current) return

    // Initial State: Squeezed flat to top line
    gsap.set(menuOverlayRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      display: "none"
    })

    const linkItems = menuContentRef.current?.querySelectorAll('a') || []

    const openTl = gsap.timeline({ paused: true })
      .set(menuOverlayRef.current, { display: "flex" })
      .to(menuOverlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.75,
        ease: "power3.inOut"
      })
      .fromTo(
        linkItems,
        {
          yPercent: 100,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.08,
          ease: "power3.out"
        },
        "-=0.5"
      )

    const closeTl = gsap.timeline({ 
      paused: true,
      onComplete: () => {
        gsap.set(menuOverlayRef.current, { display: "none" })
        setIsMobileMenuOpen(false)
        document.body.style.overflow = ''
      }
    })
      .to(linkItems, {
        yPercent: -100,
        xPercent: -8,
        opacity: 0,
        duration: 0.8,
        stagger: -0.04,
        ease: "power3.in"
      })
      .to(menuOverlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 0.65,
        ease: "power3.inOut"
      }, "-=0.2")

    openTlRef.current = openTl
    closeTlRef.current = closeTl
  }, [])

  const toggleMobileMenu = () => {
    if (!isMobileMenuOpen) {
      setIsMobileMenuOpen(true)
      document.body.style.overflow = 'hidden'
      closeTlRef.current?.pause(0)
      openTlRef.current?.restart()
    } else {
      openTlRef.current?.pause()
      closeTlRef.current?.restart()
    }
  }

  return (
    <>
      <nav className="flex flex-row items-center justify-between w-full text-ghost-white md:px-2 md:py-4 relative z-40">
        
        {/* ONLY THE LOGO HAS MIX-BLEND-DIFFERENCE */}
        <div ref={logoRef} className="mix-blend-difference pointer-events-auto [isolation:auto]">
          <Link href="/" className="block">
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

        {/* LINKS DESKTOP - NO BLEND MODE */}
        <div
          ref={linksRef}
          className="hidden md:flex items-center justify-center space-x-4 font-mono uppercase text-[clamp(0.75rem,0.65rem+0.35vw,1.2rem)] translate-x-[clamp(0px,12vw,190px)] pointer-events-auto"
        >
          <Link href="/">ABOUT</Link>
          <Link href="/#">WORK</Link>
          <Link href="/#">MORE</Link>
          <Link href="/#">CONTACT</Link>
        </div>

        {/* RIGHT ACTION BUTTONS - NO BLEND MODE */}
        <div className="flex items-center space-x-2 sm:space-x-3 pointer-events-auto">
          {/* SOUND TOGGLE BUTTON */}
          <button
            onClick={onToggleSound}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="hidden md:flex items-center bg-carbon-black hover:bg-zinc-800 transition-colors h-[clamp(44px,2.5vw+20px,55px)] px-4 rounded-full border border-eclipse font-mono text-[clamp(0.35rem,0.65rem+0.3vw,1.25rem)] uppercase justify-center space-x-2 text-ghost-white cursor-pointer"
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
          <button className="hidden md:flex bg-carbon-black hover:bg-zinc-800 transition-colors px-[clamp(16px,1vw+8px,16px)] py-0 w-[clamp(155px,12vw+70px,224px)] h-[clamp(44px,2.5vw+20px,55px)] rounded-full border border-eclipse font-mono tracking-tighter uppercase text-[clamp(0.3rem,0.63rem+0.3vw,1.25rem)] text-center items-center justify-center text-ghost-white cursor-pointer">
            Check availability
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={toggleMobileMenu}
            className="flex md:hidden bg-ghost-white hover:bg-zinc-200 transition-colors px-5 py-0 h-[clamp(44px,2.5vw+20px,55px)] rounded-full border border-ghost-white font-mono tracking-tighter uppercase text-[clamp(0.75rem,0.63rem+0.3vw,1rem)] text-carbon-black items-center justify-center font-bold cursor-pointer"
          >
            Menu
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div
        ref={menuOverlayRef}
        className="fixed inset-0 z-50 bg-carbon-black flex  flex-col justify-between  text-ghost-white md:hidden h-[85vh] border-b border-eclipse"
      >
        <div className="flex items-center justify-between w-full p-4">
          <Link href="/" onClick={toggleMobileMenu}>
            <Image 
              src={Logo} 
              alt="Logo" 
              width={160} 
              height={48} 
              priority 
              className="w-36 h-auto"
            />
          </Link>

          <button
            onClick={toggleMobileMenu}
            className="bg-ghost-white text-carbon-black px-4 h-11 rounded-full font-mono text-xs uppercase font-bold flex items-center justify-center"
          >
            Close
          </button>
        </div>

        {/* MENU LINKS CONTAINER WITH OVERFLOW-HIDDEN WRAPPERS */}
        <div ref={menuContentRef} className="flex flex-col space-y-2 font-sans text-6xl uppercase font-medium my-auto tracking-[-6%] p-6">
          <div className="overflow-hidden">
            <Link href="/" onClick={toggleMobileMenu} className="block hover:text-zinc-400 transition-colors">
              ABOUT
            </Link>
          </div>
          <div className="overflow-hidden">
            <Link href="/#" onClick={toggleMobileMenu} className="block hover:text-zinc-400 transition-colors">
              WORK
            </Link>
          </div>
          <div className="overflow-hidden">
            <Link href="/#" onClick={toggleMobileMenu} className="block hover:text-zinc-400 transition-colors">
              MORE
            </Link>
          </div>
          <div className="overflow-hidden">
            <Link href="/#" onClick={toggleMobileMenu} className="block hover:text-zinc-400 transition-colors">
              CONTACT
            </Link>
          </div>
        </div>

        <div className="pt-6 flex flex-row items-start space-y-4 p-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-eclipse font-mono font-medium tracking-tight text-[clamp(0.70rem,0.65vw+0.3rem,1rem)]">SOCIALS</h1>
            <div className="flex flex-row w-full items-center gap-4 text-[clamp(0.65rem,0.65vw+0.3rem,1rem)] font-mono tracking-tight uppercase">
              <Link className="hover:text-zinc-700" href="https://instagram.com/itsjmvisuals" target="_blank" rel="noopener noreferrer">
                INSTAGRAM
              </Link>
              <Link className="hover:text-zinc-700" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                FACEBOOK
              </Link>
              <Link className="hover:text-zinc-700" href="https://vimeo.com" target="_blank" rel="noopener noreferrer">
                VIMEO
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navigation