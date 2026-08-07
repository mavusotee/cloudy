"use client"
import Controls from '@/components/Controls'
import Navigation from '@/components/Navigation'
import HeroCanvas from '@/components/HeroCanvas'
import React, { useState, useCallback, useRef } from 'react'

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

  // Global Audio State
  const [isMuted, setIsMuted] = useState(true)
  const activeVideoRef = useRef(null)

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleVideoInit = useCallback((videoEl) => {
    if (!videoEl) return

    activeVideoRef.current = videoEl
    videoEl.muted = isMuted

    const updateDuration = () => {
      if (videoEl.duration && !isNaN(videoEl.duration)) {
        setDuration(formatTime(videoEl.duration))
      }
    }

    if (videoEl.readyState >= 1) {
      updateDuration()
    }

    videoEl.addEventListener('loadedmetadata', updateDuration)
    videoEl.addEventListener('durationchange', updateDuration)

    return () => {
      videoEl.removeEventListener('loadedmetadata', updateDuration)
      videoEl.removeEventListener('durationchange', updateDuration)
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
      
      {/* FIXED NAVIGATION HEADER - CLEAN CONTAINER NO MIX-BLEND */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 w-full pointer-events-none">
        <Navigation 
          isMuted={isMuted} 
          onToggleSound={handleToggleSound} 
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
      />

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