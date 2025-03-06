'use client'

import FeaturedCasesManager from '@/components/admin/FeaturedCasesManager'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'

export default function FeaturedCaseStudiesPage() {
  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-purple-950/10 text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Proyectos Destacados</h1>
            <p className="text-gray-400">Administra los proyectos que aparecerán en la sección destacada de la home</p>
          </div>
          
          <Link href="/admin/case-studies" className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-white font-medium transition-colors">
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Volver
          </Link>
        </div>
        
        <FeaturedCasesManager />
      </div>
    </div>
  )
}
