'use client'
import Controls from '@/components/Controls'
import Navigation from '@/components/Navigation'
import HeroCanvas from '@/components/HeroCanvas'
import React, { useState, useCallback } from 'react'

const PROJECTS = [
  { 
    src: 'https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785489876/double_a___hazelwood_2160p_lnodhq.mp4', 
    title: 'HAZELWOOD RESIDENCE' 
  },
  { 
    src: 'https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785489189/16Cliff_qossp1.mp4', 
    title: 'KRIVIC' 
  },
  { 
    src: 'https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785496892/eston_property___gilbert_street_1080p_r3msmo.mp4', 
    title: 'THE BUILDING COMPANY' 
  }
]

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [duration, setDuration] = useState('00:00')

  // Format raw video duration (seconds) into MM:SS
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Listens to video events to capture metadata duration as soon as it loads
  const handleVideoInit = useCallback((videoEl) => {
    if (!videoEl) return

    const updateDuration = () => {
      if (videoEl.duration && !isNaN(videoEl.duration)) {
        setDuration(formatTime(videoEl.duration))
      }
    }

    // Capture immediately if metadata is already loaded
    if (videoEl.readyState >= 1) {
      updateDuration()
    }

    videoEl.addEventListener('loadedmetadata', updateDuration)
    videoEl.addEventListener('durationchange', updateDuration)

    return () => {
      videoEl.removeEventListener('loadedmetadata', updateDuration)
      videoEl.removeEventListener('durationchange', updateDuration)
    }
  }, [])

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
    <main className="relative w-full h-screen h-[100dvh] overflow-hidden bg-zinc-900">
      
      {/* FIXED NAVIGATION HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 w-full pointer-events-auto">
        <Navigation />
      </header>

      {/* THREE.JS CANVAS SHADER BACKGROUND */}
      <HeroCanvas
        activeSrc={PROJECTS[currentIndex].src}
        nextSrc={nextIndex !== null ? PROJECTS[nextIndex].src : null}
        isTransitioning={isTransitioning}
        onTransitionComplete={handleTransitionComplete}
        onVideoInit={handleVideoInit}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/90 z-0 pointer-events-none opacity-50" />

      {/* FOREGROUND UI WRAPPER */}
      <div className="relative z-10 w-full h-full p-4 pt-20 flex flex-col justify-between box-border">
        <div aria-hidden="true" />

        {/* CONTROLS */}
        <Controls 
          onNext={handleNext} 
          currentIndex={currentIndex + 1}
          totalVideos={PROJECTS.length}
          title={PROJECTS[currentIndex].title}
          duration={duration}
        />

        {/* BOTTOM UI */}
        <div className="flex items-end justify-between w-full mb-0 text-white font-mono uppercase tracking-tight text-[clamp(0.85rem,0.55rem+0.5vw,2rem)]">
          <p className="w-[clamp(340px,25vw,920px)]">
            VISUAL STUDIO FOR HIGH-END ARCHITECTURE AND CONSTRUCTION BASED IN ADELAIDE
          </p>
          <p>scroll down</p>
        </div>
      </div>

    </main>
  )
}

export default Home