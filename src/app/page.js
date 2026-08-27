'use client'
import React, { useEffect } from 'react'
import Lenis from 'lenis'
import Hero from './Hero/Home'
import More from './More/page'

export default function Page() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    })

    let frameId

    function raf(time) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)

    // Cleanup when component unmounts
    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [])

  return (
    <div>
      <Hero />
      <More />
      
    </div>
  )
}