"use client"

import Controls from '@/components/UI/Controls'
import Navigation from '@/components/UI/Navigation'
import HeroCanvas from '@/components/react-three/HeroCanvas'
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

// Helper to optimize Cloudinary URLs specifically for mobile devices
const getMobileOptimizedUrl = (url) => {
  if (!url) return url

  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    return url.replace('/upload/', '/upload/q_auto,f_auto,w_720,vc_h264/')
  }

  return url
}

const RAW_PROJECTS = [
  {
    src: 'https://res.cloudinary.com/eafm1vdw/video/upload/v1787731790/cloudhaus_landing_video_1440p.mp4',
    title: 'THE BUILDING COMPANY'
  },
]

const BOTTOM_TEXT =
  "VISUAL STUDIO FOR HIGH-END ARCHITECTURE AND CONSTRUCTION BASED IN ADELAIDE"

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [duration, setDuration] = useState('00:00')

  // Preloader Tracking States
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [preloaderUnmounted, setPreloaderUnmounted] = useState(false)

  // Audio & DOM Refs
  const [isMuted, setIsMuted] = useState(true)
  const activeVideoRef = useRef(null)

  const preloaderRef = useRef(null)
  const progressBarRef = useRef(null)
  const counterRef = useRef(null)
  const targetProgress = useRef(0)

  // Canvas Wrapper Ref for Scale & Skew Reveal
  const heroCanvasWrapperRef = useRef(null)

  // Bottom UI Animation Refs
  const bottomTextRef = useRef(null)
  const scrollTextRef = useRef(null)

  // Process project video URLs based on client screen size
  const PROJECTS = useMemo(() => {
    return RAW_PROJECTS.map((project) => ({
      ...project,
      src: getMobileOptimizedUrl(project.src)
    }))
  }, [])

  // Split sentence into words for staggered blur reveal
  const words = useMemo(() => BOTTOM_TEXT.split(' '), [])

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

        return Math.min(
          100,
          Math.round(prev + Math.max(1, diff * 0.12))
        )
      })
    }, 32)

    return () => clearInterval(interval)
  }, [isLoaded])

  // GSAP Exit Curtain Animation when progress hits 100%
  useGSAP(() => {
    if (progress < 100) return

    const tl = gsap.timeline({
      onComplete: () => {
        setPreloaderUnmounted(true)
      }
    })

    tl.to([counterRef.current, progressBarRef.current], {
      opacity: 0,
      duration: 0.4,
      ease: "power2.in"
    })
      .to(
        preloaderRef.current,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1.2,
          ease: "power4.inOut",
          onStart: () => {
            setIsLoaded(true)
          }
        },
        "-=0.1"
      )
  }, [progress])

  // Canvas Scale-Down & Entrance Animations
  useGSAP(() => {
    if (!isLoaded) return

    const isMobile = window.innerWidth <= 768
    const masterTl = gsap.timeline()

    if (heroCanvasWrapperRef.current) {
      masterTl.fromTo(
        heroCanvasWrapperRef.current,
        {
          scale: 1.15,
          skewY: isMobile ? 0 : 3,
          skewX: isMobile ? 0 : -1.5,
          filter: isMobile ? 'none' : 'blur(12px)',
          opacity: 0.7
        },
        {
          scale: 1.0,
          skewY: 0,
          skewX: 0,
          filter: 'none',
          opacity: 1,
          duration: 1.6,
          ease: 'power3.out'
        },
        0
      )
    }

    if (bottomTextRef.current) {
      const wordElements =
        bottomTextRef.current.querySelectorAll('.word-span')

      masterTl.fromTo(
        wordElements,
        {
          opacity: 0,
          filter: isMobile ? 'none' : 'blur(8px)',
          y: 15,
        },
        {
          opacity: 1,
          filter: 'none',
          y: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: 'power3.out'
        },
        0.2
      )
    }

    if (scrollTextRef.current) {
      masterTl.fromTo(
        scrollTextRef.current,
        {
          opacity: 0,
          y: 10
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        },
        "-=0.3"
      )
    }
  }, [isLoaded])

  const handleVideoInit = useCallback((videoEl) => {
    if (!videoEl) return

    activeVideoRef.current = videoEl
    videoEl.muted = isMuted

    videoEl.setAttribute('playsinline', 'true')
    videoEl.setAttribute('webkit-playsinline', 'true')

    const updateDuration = () => {
      if (videoEl.duration && !isNaN(videoEl.duration)) {
        setDuration(formatTime(videoEl.duration))
      }
    }

    const handleProgress = () => {
      if (videoEl.buffered.length > 0 && videoEl.duration) {
        const bufferedEnd =
          videoEl.buffered.end(videoEl.buffered.length - 1)

        const pct = Math.min(
          100,
          Math.round((bufferedEnd / videoEl.duration) * 100)
        )

        targetProgress.current = Math.max(
          targetProgress.current,
          pct
        )
      }
    }

    if (videoEl.readyState >= 1) {
      updateDuration()
      targetProgress.current = Math.max(
        targetProgress.current,
        85
      )
    }

    if (videoEl.readyState >= 3) {
      targetProgress.current = 100
    }

    videoEl.addEventListener(
      'loadedmetadata',
      updateDuration
    )

    videoEl.addEventListener(
      'durationchange',
      updateDuration
    )

    videoEl.addEventListener(
      'progress',
      handleProgress
    )

    videoEl.addEventListener(
      'canplaythrough',
      () => {
        targetProgress.current = 100
      }
    )

    const playPromise = videoEl.play()

    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn(
          "Autoplay restricted or deferred:",
          err
        )
      })
    }

    return () => {
      videoEl.removeEventListener(
        'loadedmetadata',
        updateDuration
      )

      videoEl.removeEventListener(
        'durationchange',
        updateDuration
      )

      videoEl.removeEventListener(
        'progress',
        handleProgress
      )
    }
  }, [isMuted])

  const handleToggleSound = () => {
    const nextMutedState = !isMuted

    setIsMuted(nextMutedState)

    if (activeVideoRef.current) {
      activeVideoRef.current.muted = nextMutedState

      if (!nextMutedState) {
        activeVideoRef.current.volume = 1.0

        activeVideoRef.current
          .play()
          .catch(() => {})
      }
    }
  }

  const handleNext = () => {
    if (isTransitioning || nextIndex !== null) return

    const upcoming =
      (currentIndex + 1) % PROJECTS.length

    setNextIndex(upcoming)
    setIsTransitioning(true)
  }

  const handleTransitionComplete = () => {
    if (nextIndex !== null) {
      setCurrentIndex(nextIndex)
      setNextIndex(null)
    }

    setIsTransitioning(false)
  }

  return (
    <>
      {/* FIXED NAVIGATION
          Kept OUTSIDE the perspective/overflow/transform context
          so it remains attached to the viewport. */}
      <header className="fixed top-0 left-0 right-0 z-[90] p-4 w-full pointer-events-none">
        <Navigation
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
          isLoaded={isLoaded}
        />
      </header>

      {/* PRELOADER
          Higher z-index than navigation so it always covers it. */}
      {!preloaderUnmounted && (
        <div
          ref={preloaderRef}
          className="fixed inset-0 w-full h-dvh bg-carbon-black z-[100] pointer-events-auto text-ghost-white flex flex-col items-center justify-between tracking-tight"
        >
          <div className="w-full bg-zinc-900 h-[4px] relative overflow-hidden">
            <div
              ref={progressBarRef}
              className="bg-ghost-white h-full transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <h1
            ref={counterRef}
            className="tracking-tight font-geist-mono text-[clamp(0.8rem,4vw,2rem)]"
          >
            [ {String(progress).padStart(3, '0')}% ]
          </h1>

          <p className="font-geist-mono text-ghost-white p-4 text-sm text-zinc-500">
            IT ALL STARTS WITH AN IDEA
          </p>
        </div>
      )}

      {/* MAIN PAGE */}
      <main className="relative w-full h-dvh overflow-hidden bg-zinc-900 [perspective:1200px]">

        {/* THREE.JS CANVAS WRAPPER */}
        <div
          ref={heroCanvasWrapperRef}
          className="absolute inset-0 w-full h-full origin-top center will-change-[transform,opacity]"
        >
          <HeroCanvas
            activeSrc={PROJECTS[currentIndex].src}
            nextSrc={
              nextIndex !== null
                ? PROJECTS[nextIndex].src
                : null
            }
            isTransitioning={isTransitioning}
            isMuted={isMuted}
            onTransitionComplete={handleTransitionComplete}
            onVideoInit={handleVideoInit}
            isLoaded={isLoaded}
          />
        </div>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none" />

        {/* FOREGROUND UI WRAPPER */}
        <div className="relative z-10 w-full h-full p-4 pt-20 flex flex-col justify-between box-border pointer-events-none">

          <div aria-hidden="true" />

          {/* CONTROLS */}
          <div className="pointer-events-auto">
            <Controls
              onNext={handleNext}
              currentIndex={currentIndex + 1}
              totalVideos={PROJECTS.length}
              title={PROJECTS[currentIndex].title}
              duration={duration}
              isLoaded={isLoaded}
            />
          </div>

          {/* BOTTOM UI WITH WORD SPLIT REVEAL */}
          <div className="flex flex-col gap-4 md:flex-row items-start md:items-end justify-between w-full mb-0 text-white font-geist-mono uppercase tracking-tight leading-[140%] md:leading-normal pointer-events-auto">

            <h1
              ref={bottomTextRef}
              className="w-[clamp(320px,25vw,925px)] text-[clamp(1rem,0.55rem+0.6vw,4.8rem)] flex flex-wrap gap-x-[0.3em] gap-y-[0.1em]"
            >
              {words.map((word, index) => (
                <span
                  key={index}
                  className="word-span inline-block will-change-[transform,opacity]"
                  style={{ opacity: 0 }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <p
              ref={scrollTextRef}
              className="text-zinc-200 md:text-ghost-white text-[clamp(0.45rem,0.55rem+0.5vw,2rem)] will-change-[transform,opacity]"
              style={{ opacity: 0 }}
            >
              (scroll down)
            </p>

          </div>
        </div>
      </main>
    </>
  )
}

export default Home