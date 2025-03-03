'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../admin/components/ui/card"
import Link from "next/link"
import { DatabaseIcon, ArrowRightIcon, Settings2Icon } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-black via-black/95 to-purple-950/10 text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-gray-400">Accede a las herramientas de administración de la plataforma</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          
          {/* Puedes agregar más tarjetas para otras herramientas de administración aquí */}
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
