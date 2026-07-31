'use client'
import React from 'react'
import Lenis from 'lenis';
import Hero from './Hero/Home'
import About from './About/page.jsx'

function page() {

  const lenis = new Lenis({
  duration: 1.2,      // Animation duration (seconds)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Natural easing curve
  smoothWheel: true,  // Enable smooth scroll on mouse wheel
  touchMultiplier: 2, // Touch responsiveness adjustment
});

// 2. Run the animation loop
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
  return (
    <div>
      <Hero />
      <About />
    </div>
  )
}

export default page