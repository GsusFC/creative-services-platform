"use client"

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CaseStudyDetail } from '@/lib/case-studies/mock-service'
import Image from 'next/image'
import { ArrowUpRight, Loader2 } from 'lucide-react'

interface PreviewPaneProps {
  caseStudy: Partial<CaseStudyDetail>
  isLoading?: boolean
}

/**
 * Componente de previsualización en vivo para casos de estudio
 * Permite ver el contenido mientras se edita
 */
export function PreviewPane({ caseStudy, isLoading = false }: PreviewPaneProps) {
  const [activeView, setActiveView] = useState('mobile')
  
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-neutral-950 rounded-md">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#00ff00]" />
          <p className="text-sm text-neutral-400">Cargando previsualización...</p>
        </div>
      </div>
    )
  }
  
  if (!caseStudy || !caseStudy.title) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-neutral-950 rounded-md p-4">
        <p className="text-neutral-400 text-center">
          Completa los campos requeridos para ver la previsualización
        </p>
      </div>
    )
  }
  
  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 rounded-md overflow-hidden border border-neutral-800">
      <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
        <h3 className="text-sm font-medium">Previsualización en vivo</h3>
        
        <Tabs defaultValue="mobile" value={activeView} onValueChange={setActiveView}>
          <TabsList className="bg-neutral-900 p-1">
            <TabsTrigger value="mobile" className="text-xs px-2 py-1">
              Móvil
            </TabsTrigger>
            <TabsTrigger value="desktop" className="text-xs px-2 py-1">
              Escritorio
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className={`mx-auto bg-black transition-all duration-300 overflow-hidden ${
          activeView === 'mobile' ? 'max-w-[375px]' : 'max-w-full'
        }`}>
          {/* Previsualización de Hero */}
          <div className="relative aspect-video w-full mb-6 bg-neutral-900 overflow-hidden">
            {caseStudy.heroImage ? (
              <Image
                src={caseStudy.heroImage}
                alt={caseStudy.title || "Preview"}
                className="object-cover"
                fill
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-neutral-600">Sin imagen principal</p>
              </div>
            )}
            
            {/* Badge de estado */}
            <div className="absolute top-3 right-3 px-2 py-1 bg-[#00ff00] text-black text-xs font-mono uppercase">
              Vista Previa
            </div>
          </div>
          
          {/* Contenido principal */}
          <div className="px-4">
            <div className="mb-8">
              <p className="text-xs text-[#00ff00] font-mono uppercase mb-2">PROYECTO DESTACADO</p>
              <h1 className="text-2xl font-bold mb-3">{caseStudy.title}</h1>
              <p className="text-neutral-400">{caseStudy.description || "Sin descripción"}</p>
            </div>
            
            {/* Servicios */}
            {caseStudy.services && caseStudy.services.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs text-[#00ff00] font-mono uppercase mb-2">SERVICIOS</h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.services.map((service, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Galería previsualización */}
            {caseStudy.gallery && caseStudy.gallery.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs text-[#00ff00] font-mono uppercase mb-2">GALERÍA</h3>
                <div className="grid grid-cols-2 gap-2">
                  {caseStudy.gallery.slice(0, 4).map((image, index) => (
                    <div key={index} className="aspect-square bg-neutral-900 relative overflow-hidden">
                      <Image
                        src={typeof image === 'string' 
                          ? image 
                          : (image as any).url || ''}
                        alt={`Imagen ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {caseStudy.gallery.length > 4 && (
                    <div className="aspect-square bg-neutral-800 flex items-center justify-center">
                      <p className="text-neutral-400 text-sm">+{caseStudy.gallery.length - 4} más</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* CTA */}
            <div className="py-8 text-center">
              <button
                className="px-4 py-2 bg-[#00ff00] text-black text-sm font-bold rounded-none flex items-center gap-2 mx-auto"
              >
                <span>Ver detalles</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
