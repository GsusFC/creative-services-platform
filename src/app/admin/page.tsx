'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { DatabaseIcon, ArrowRightIcon, Settings2Icon } from "lucide-react"
import { FEATURES } from "@/config/features"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-purple-950/10 text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-gray-400">Accede a las herramientas de administración de la plataforma</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Field Mapper cards - Controlados por flag de características */}
          {FEATURES.fieldMapper.enabled && FEATURES.fieldMapper.versions.base && (
            <Link href="/admin/field-mapper" className="block group">
              <Card className="bg-black/30 border border-white/10 hover:border-blue-500/70 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-white group-hover:text-blue-400 transition-colors">
                    <DatabaseIcon className="h-5 w-5" />
                    Field Mapper
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Versión original del Field Mapper
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Herramienta para mapear campos entre Notion y el sitio web con validación de compatibilidad.
                  </p>
                  <div className="flex justify-end">
                    <ArrowRightIcon className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
          
          {FEATURES.fieldMapper.enabled && FEATURES.fieldMapper.versions.v2 && (
            <Link href="/admin/field-mapper-v2" className="block group">
              <Card className="bg-black/30 border border-white/10 hover:border-purple-500/70 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-white group-hover:text-purple-400 transition-colors">
                    <DatabaseIcon className="h-5 w-5" />
                    Field Mapper v2
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Mapear campos de Notion a la web
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Configura cómo se muestran los campos de Notion en el sitio web, estableciendo las relaciones entre ambos.
                  </p>
                  <div className="flex justify-end">
                    <ArrowRightIcon className="h-5 w-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
          
          {FEATURES.fieldMapper.enabled && FEATURES.fieldMapper.versions.v3 && (
            <Link href="/admin/field-mapper/v3" className="block group">
              <Card className="bg-black/30 border border-white/10 hover:border-green-500/70 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-white group-hover:text-green-400 transition-colors">
                    <DatabaseIcon className="h-5 w-5" />
                    Field Mapper v3
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Mapeo optimizado para Case Studies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Nueva versión enfocada en mapeo por componentes para landing pages y case studies.
                  </p>
                  <div className="flex justify-end">
                    <ArrowRightIcon className="h-5 w-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
          
          {FEATURES.fieldMapper.enabled && FEATURES.fieldMapper.versions.v4 && (
            <Link href="/admin/field-mapper-v4" className="block group">
              <Card className="bg-black/30 border border-white/10 hover:border-amber-500/70 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-white group-hover:text-amber-400 transition-colors">
                    <DatabaseIcon className="h-5 w-5" />
                    Field Mapper v4
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full">Nueva versión</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Versión optimizada con análisis de rendimiento, caché y transformaciones avanzadas para mapeos complejos.
                  </p>
                  <div className="flex justify-end">
                    <ArrowRightIcon className="h-5 w-5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
          
          {FEATURES.fieldMapper.enabled && (
            <Link href="/admin/field-mapper/landing" className="block group">
              <Card className="bg-gradient-to-br from-black/80 to-purple-950/20 border border-white/10 hover:border-purple-500/70 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-white group-hover:text-purple-400 transition-colors">
                    <DatabaseIcon className="h-5 w-5" />
                    Field Mapper Landing
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full">Presentación</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Página de presentación del nuevo Field Mapper V4 con todas sus características y mejoras.
                  </p>
                  <div className="flex justify-end">
                    <ArrowRightIcon className="h-5 w-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Notion Importer card - Controlada por flags de características */}
          {FEATURES.notion.enabled && FEATURES.notion.importer && (
            <Link href="/admin/notion-importer" className="block group">
              <Card className="bg-black/30 border border-white/10 hover:border-teal-500/70 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-white group-hover:text-teal-400 transition-colors">
                    <DatabaseIcon className="h-5 w-5" />
                    Importador de Proyectos Notion
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    <span className="bg-teal-500/20 text-teal-300 text-xs px-2 py-0.5 rounded-full">Nueva herramienta</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Sincroniza automáticamente proyectos desde Notion, gestiona conflictos y programa importaciones periódicas.
                  </p>
                  <div className="flex justify-end">
                    <ArrowRightIcon className="h-5 w-5 text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
          
          <Link href="/admin/case-studies" className="block group">
            <Card className="bg-black/30 border border-white/10 hover:border-indigo-500/70 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-white group-hover:text-indigo-400 transition-colors">
                  <DatabaseIcon className="h-5 w-5" />
                  Gestor de Case Studies
                </CardTitle>
                <CardDescription className="text-gray-400">
                  <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded-full">Nueva sección</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Visualiza, gestiona y edita los Case Studies generados a partir de los proyectos de Notion.
                </p>
                <div className="flex justify-end">
                  <ArrowRightIcon className="h-5 w-5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="#" className="block group opacity-70 cursor-not-allowed">
            <Card className="bg-black/30 border border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings2Icon className="h-5 w-5" />
                  Configuración
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configuración del sitio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Próximamente: Configura opciones generales del sitio web.
                </p>
                <div className="flex justify-end">
                  <span className="text-xs text-white/40 uppercase">Próximamente</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
