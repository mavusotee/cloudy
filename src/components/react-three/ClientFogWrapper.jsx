'use client'

import dynamic from 'next/dynamic'

// ssr: false is fully supported inside Client Components
const CinematicFog = dynamic(() => import('@/components/react-three/CinematicFog'), {
  ssr: false,
})

export default function ClientFogWrapper() {
  return <CinematicFog />
}