"use client"

import Controls from '@/components/Controls'
import Navigation from '@/components/Navigation'
import HeroCanvas from '@/components/HeroCanvas'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const PROJECTS = [
  { 
    src: 'https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785921796/dunehouse_comp_1440p_hp8mzj.mp4', 
    title: 'HAZELWOOD RESIDENCE' 
  },
  { 
    src: 'https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922206/evergreen_comp_1080p_vfkngm.mp4', 
    title: 'THE BUILDING COMPANY' 
  },
  { 
    src: 'https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922129/woods_project_compressed_1080p_dpzyjd.mp4', 
    title: 'THE BUILDING COMPANY' 
  }
]

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [duration, setDuration] = useState('00:00')

  // Preloader Tracking States
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false) // Driven when loader completes
  const [preloaderUnmounted, setPreloaderUnmounted] = useState(false)

  // Audio & DOM Refs
  const [isMuted, setIsMuted] = useState(true)
  const activeVideoRef = useRef(null)
  
  const preloaderRef = useRef(null)
  const progressBarRef = useRef(null)
  const counterRef = useRef(null)
  const targetProgress = useRef(0)

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Track initial page/asset load progress
  useEffect(() => {
    targetProgress.current = Math.max(targetProgress.current, 30)

    const handleWindowLoad = () => {
      targetProgress.current = Math.max(targetProgress.current, 70)
    }

    if (document.readyState === 'complete') {
      handleWindowLoad()
    } else {
      window.addEventListener('load', handleWindowLoad)
    }

    return () => window.removeEventListener('load', handleWindowLoad)
  }, [])

  // Smoothly interpolate progress toward targetProgress
  useGSAP(() => {
    if (isLoaded) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const diff = targetProgress.current - prev
        if (diff <= 0.5 && targetProgress.current >= 100) {
          clearInterval(interval)
          return 100
        }
        return Math.min(100, Math.round(prev + Math.max(0.5, diff * 0.08)))
      })
    }, 16)

    return () => clearInterval(interval)
  }, [isLoaded])

  // GSAP Exit Curtain Animation when progress hits 100%
  useGSAP(() => {
    if (progress < 100) return

    const tl = gsap.timeline({
      onComplete: () => {
        // Completely remove preloader from React DOM after animation finishes
        setPreloaderUnmounted(true)
      }
    })

    // Fade out elements inside preloader
    tl.to([counterRef.current, progressBarRef.current], {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    })
    // Start wipe curtain animation AND flip isLoaded state so Hero components animate
    .to(preloaderRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1.5,
      ease: "power4.inOut",
      onStart: () => {
        setIsLoaded(true) // <--- CRITICAL: Triggers child animations right as curtain wipes!
      }
    }, "-=0.1")

  }, [progress])

  const handleVideoInit = useCallback((videoEl) => {
    if (!videoEl) return

    activeVideoRef.current = videoEl
    videoEl.muted = isMuted

    const updateDuration = () => {
      if (videoEl.duration && !isNaN(videoEl.duration)) {
        setDuration(formatTime(videoEl.duration))
      }
    }

    const handleProgress = () => {
      if (videoEl.buffered.length > 0 && videoEl.duration) {
        const bufferedEnd = videoEl.buffered.end(videoEl.buffered.length - 1)
        const pct = Math.min(100, Math.round((bufferedEnd / videoEl.duration) * 100))
        targetProgress.current = Math.max(targetProgress.current, pct)
      }
    }

    if (videoEl.readyState >= 1) {
      updateDuration()
      targetProgress.current = Math.max(targetProgress.current, 85)
    }

    if (videoEl.readyState >= 3) {
      targetProgress.current = 100
    }

    videoEl.addEventListener('loadedmetadata', updateDuration)
    videoEl.addEventListener('durationchange', updateDuration)
    videoEl.addEventListener('progress', handleProgress)
    videoEl.addEventListener('canplaythrough', () => {
      targetProgress.current = 100
    })

    return () => {
      videoEl.removeEventListener('loadedmetadata', updateDuration)
      videoEl.removeEventListener('durationchange', updateDuration)
      videoEl.removeEventListener('progress', handleProgress)
    }
  }, [isMuted])

  const handleToggleSound = () => {
    const nextMutedState = !isMuted
    setIsMuted(nextMutedState)

    if (activeVideoRef.current) {
      activeVideoRef.current.muted = nextMutedState
      if (!nextMutedState) {
        activeVideoRef.current.volume = 1.0
        activeVideoRef.current.play().catch(() => {})
      }
    }
  }

  const handleNext = () => {
    if (isTransitioning) return
    const upcoming = (currentIndex + 1) % PROJECTS.length
    setNextIndex(upcoming)
    setIsTransitioning(true)
  }

  const handleTransitionComplete = () => {
    setCurrentIndex(nextIndex)
    setNextIndex(null)
    setIsTransitioning(false)
  }

  return (
    <main className="relative w-full h-dvh overflow-hidden bg-zinc-900">

      {/* PRELOADER OVERLAY */}
      {!preloaderUnmounted && (
        <div 
          ref={preloaderRef} 
          className="fixed inset-0 w-full h-dvh bg-carbon-black z-[100] pointer-events-auto text-ghost-white flex flex-col items-center justify-between tracking-tight"
        >
          {/* Animated Progress Bar */}
          <div className="w-full bg-zinc-900 h-[4px] relative overflow-hidden">
            <div 
              ref={progressBarRef}
              className="bg-ghost-white h-full transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Animated Counter */}
          <h1 ref={counterRef} className="tracking-tight font-geist-mono text-[clamp(0.8rem,4vw,2rem)]">
            [ {String(progress).padStart(3, '0')}% ]
          </h1>

          <p className="font-geist-mono text-ghost-white p-4 text-sm text-zinc-500">
            IT ALL STARTS WITH AN IDEA
          </p>
        </div>
      )}

      {/* FIXED NAVIGATION HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 w-full pointer-events-none">
        <Navigation 
          isMuted={isMuted} 
          onToggleSound={handleToggleSound} 
          isLoaded={isLoaded}
        />
      </header>

      {/* THREE.JS CANVAS SHADER BACKGROUND */}
      <HeroCanvas
        activeSrc={PROJECTS[currentIndex].src}
        nextSrc={nextIndex !== null ? PROJECTS[nextIndex].src : null}
        isTransitioning={isTransitioning}
        isMuted={isMuted}
        onTransitionComplete={handleTransitionComplete}
        onVideoInit={handleVideoInit}
        isLoaded={isLoaded}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none" />

      {/* FOREGROUND UI WRAPPER */}
      <div className="relative z-10 w-full h-full p-4 pt-20 flex flex-col justify-between box-border pointer-events-none">
        <div aria-hidden="true" />

        {/* CONTROLS (isLoaded is now explicitly passed) */}
        <div className="pointer-events-auto">
          <Controls 
            onNext={handleNext} 
            currentIndex={currentIndex + 1}
            totalVideos={PROJECTS.length}
            title={PROJECTS[currentIndex].title}
            duration={duration}
            isLoaded={isLoaded} // <--- PROPERLY PASSED NOW
          />
        </div>

        {/* BOTTOM UI */}
        <div className="flex flex-col gap-4 md:flex-row items-start md:items-end justify-between w-full mb-0 text-white font-geist-mono uppercase tracking-tight leading-[140%] md:leading-normal pointer-events-auto">
          <p className="w-[clamp(320px,25vw,925px)] text-[clamp(1rem,0.55rem+0.6vw,4.5rem)]">
            VISUAL STUDIO FOR HIGH-END ARCHITECTURE AND CONSTRUCTION BASED IN ADELAIDE
          </p>
          <p className="text-zinc-200 md:text-ghost-white text-[clamp(0.45rem,0.55rem+0.5vw,2rem)]">(scroll down)</p>
        </div>
      </div>

    </main>
  )
}

export default Home