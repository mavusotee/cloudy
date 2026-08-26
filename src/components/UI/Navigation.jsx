'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/Assets/Logo/cloud.svg'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BlurFlicker from '../Animations/BlurFlicker'
import TransitionLink from '../PageTransitions/TransitionLink'

gsap.registerPlugin(ScrollTrigger)

function Navigation({ isMuted = true, onToggleSound }) {
  const navRef = useRef(null)
  const logoRef = useRef(null)
  const linksRef = useRef(null)

  const menuOverlayRef = useRef(null)
  const menuContentRef = useRef(null)
  const openTlRef = useRef(null)
  const closeTlRef = useRef(null)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // GSAP Fade out navigation on reaching #footer
  useEffect(() => {
    if (!navRef.current) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#footer',
        start: 'top top+=200',
        end: 'bottom bottom',
        onEnter: () => {
          gsap.to(navRef.current, {
            opacity: 0,
            y: -20,
            pointerEvents: 'none',
            duration: 0.4,
            ease: 'power2.out'
          })
        },
        onLeaveBack: () => {
          gsap.to(navRef.current, {
            opacity: 1,
            y: 0,
            pointerEvents: 'auto',
            duration: 0.4,
            ease: 'power2.out'
          })
        }
      })
    })

    return () => ctx.revert()
  }, [])

  // GSAP Vertical Top-to-Bottom Clip-Path Animation
  useEffect(() => {
    if (!menuOverlayRef.current) return

    // Initial State: Squeezed flat to top line
    gsap.set(menuOverlayRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      display: "none"
    })

    const linkItems =
      menuContentRef.current?.querySelectorAll('a') || []

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
      {/* NAVIGATION */}
      <nav ref={navRef} className="fixed top-0 left-0 flex flex-row items-center justify-between w-full text-ghost-white p-4 md:px-6 md:py-6 z-[100]">

        {/* ONLY THE LOGO HAS MIX-BLEND-DIFFERENCE */}
        <div
          ref={logoRef}
          className="mix-blend-difference pointer-events-auto [isolation:auto]"
        >
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
          <TransitionLink href="/About">
            ABOUT
          </TransitionLink>

          <TransitionLink href="/All-Works">
            WORK
          </TransitionLink>

          <TransitionLink href="/Weddings">
            MORE
          </TransitionLink>

          <TransitionLink href="/#footer">
            CONTACT
          </TransitionLink>
        </div>

        {/* RIGHT ACTION BUTTONS - NO BLEND MODE */}
        <div className="flex items-center space-x-2 sm:space-x-3 pointer-events-auto">

          {/* CHECK AVAILABILITY BUTTON */}
          <BlurFlicker>
            <button className="hidden md:flex bg-carbon-black hover:bg-zinc-800 transition-colors px-[clamp(16px,1vw+8px,16px)] py-0 w-[clamp(155px,12vw+70px,224px)] h-[clamp(44px,2.5vw+20px,55px)] rounded-full border border-eclipse font-mono tracking-tighter uppercase text-[clamp(0.3rem,0.63rem+0.3vw,1.25rem)] text-center items-center justify-center text-ghost-white cursor-pointer">
              Check availability
            </button>
          </BlurFlicker>

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
        className="fixed inset-0 z-[110] bg-carbon-black flex flex-col justify-between text-ghost-white md:hidden h-[85vh] border-b border-eclipse"
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
        <div
          ref={menuContentRef}
          className="flex flex-col space-y-2 font-sans text-6xl uppercase font-medium my-auto tracking-[-6%] p-6"
        >
          <div className="overflow-hidden">
            <Link
              href="/About"
              onClick={toggleMobileMenu}
              className="block hover:text-zinc-400 transition-colors"
            >
              ABOUT
            </Link>
          </div>

          <div className="overflow-hidden">
            <Link
              href="/All-Works"
              onClick={toggleMobileMenu}
              className="block hover:text-zinc-400 transition-colors"
            >
              WORK
            </Link>
          </div>

          <div className="overflow-hidden">
            <Link
              href="/Weddings"
              onClick={toggleMobileMenu}
              className="block hover:text-zinc-400 transition-colors"
            >
              MORE
            </Link>
          </div>

          <div className="overflow-hidden">
            <Link
              href="/#footer"
              onClick={toggleMobileMenu}
              className="block hover:text-zinc-400 transition-colors"
            >
              CONTACT
            </Link>
          </div>
        </div>

        <div className="pt-6 flex flex-row items-start space-y-4 p-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-eclipse font-mono font-medium tracking-tight text-[clamp(0.70rem,0.65vw+0.3rem,1rem)]">
              SOCIALS
            </h1>

            <div className="flex flex-row w-full items-center gap-4 text-[clamp(0.65rem,0.65vw+0.3rem,1rem)] font-mono tracking-tight uppercase">

              <Link
                className="hover:text-zinc-700"
                href="https://instagram.com/itsjmvisuals"
                target="_blank"
                rel="noopener noreferrer"
              >
                INSTAGRAM
              </Link>

              <Link
                className="hover:text-zinc-700"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                FACEBOOK
              </Link>

              <Link
                className="hover:text-zinc-700"
                href="https://vimeo.com/user135969253"
                target="_blank"
                rel="noopener noreferrer"
              >
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