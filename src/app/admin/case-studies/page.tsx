'use client'

import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { CaseStudyDashboard } from './components/CaseStudyDashboard'

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950/95 text-white">
      {/* Header con efecto de vidrio esmerilado */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/40 border-b border-white/10 px-8 py-4">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="flex items-center text-gray-400 hover:text-white transition-colors">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              <span>Volver al Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto p-8">
        {/* Dashboard header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Gestión de Casos de Estudio
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl">
            Administra todos los casos de estudio, configura su visibilidad y sincronización con Notion.
          </p>
        </div>
        
        {/* Dashboard Principal */}
        <CaseStudyDashboard />
      </div>
    </div>
  )
}
