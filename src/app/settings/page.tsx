'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Redirección desde la antigua ruta a la nueva ubicación en admin
export default function SettingsRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/admin/settings')
  }, [router])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg text-white/70 mb-2">Redirigiendo a la nueva ubicación...</p>
        <div className="w-8 h-8 border-t-2 border-[#00ff00] rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
}
