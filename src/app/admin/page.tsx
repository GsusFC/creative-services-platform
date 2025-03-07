'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/admin/components/ui/card"
import Link from "next/link"
import { DatabaseIcon, ArrowRightIcon, Settings2Icon, LayoutDashboardIcon, ImageIcon, BookOpenIcon, UsersIcon, BarChart3Icon } from "lucide-react"
import { motion } from "framer-motion"

export default function AdminPage() {
  // Animación para los elementos que aparecen en la página
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <div className="admin-page min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950/95 text-white">
      {/* Header con efecto de vidrio esmerilado */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/40 border-b border-white/10 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LayoutDashboardIcon className="h-6 w-6 text-blue-400" />
            <span className="font-bold text-xl">Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="font-semibold">CS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Dashboard header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Panel de Administración
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl">
            Bienvenido al sistema de administración de contenidos. Gestiona estudios de caso, 
            configuración del sitio y herramientas avanzadas.
          </p>
        </motion.div>
        
        {/* Dashboard Analytics Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <Card className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 border border-blue-800/30 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Estudios de caso</p>
                  <p className="text-3xl font-bold text-white">12</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <DatabaseIcon className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-400">
                <span>+3 este mes</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-900/40 to-purple-950/40 border border-purple-800/30 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Imágenes</p>
                  <p className="text-3xl font-bold text-white">48</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-400">
                <span>+12 este mes</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-900/40 to-green-950/40 border border-green-800/30 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Publicados</p>
                  <p className="text-3xl font-bold text-white">8</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <BookOpenIcon className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-400">
                <span>+2 este mes</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-900/40 to-amber-950/40 border border-amber-800/30 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Visitas</p>
                  <p className="text-3xl font-bold text-white">2.4k</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <BarChart3Icon className="h-6 w-6 text-amber-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-400">
                <span>+18% este mes</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Secciones principales */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* CMS Case Studies */}
          <motion.div variants={itemVariants}>
            <Link href="/admin/case-studies" className="block group">
              <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/95 border border-white/10 hover:border-green-500/50 hover:bg-gray-900/80 transition-all duration-300 shadow-xl h-full">
                <CardHeader className="pb-4 border-b border-white/5 bg-black/20">
                  <CardTitle className="flex items-center gap-3 text-xl text-white group-hover:text-green-400 transition-colors">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <DatabaseIcon className="h-5 w-5 text-green-400" />
                    </div>
                    CMS Case Studies
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Gestión completa de estudios de caso
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="text-gray-300 space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      Crear y editar proyectos
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      Gestionar elementos multimedia
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      Sincronización con Notion
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      Configurar casos destacados
                    </li>
                  </ul>
                  <div className="flex justify-end">
                    <div className="flex items-center gap-2 text-green-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                      <span className="text-sm font-medium">Acceder</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
          
          {/* Flag System */}
          <motion.div variants={itemVariants}>
            <Link href="/flag-system-v3" className="block group">
              <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/95 border border-white/10 hover:border-blue-500/50 hover:bg-gray-900/80 transition-all duration-300 shadow-xl h-full">
                <CardHeader className="pb-4 border-b border-white/5 bg-black/20">
                  <CardTitle className="flex items-center gap-3 text-xl text-white group-hover:text-blue-400 transition-colors">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <DatabaseIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    Flag System V3
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Sistema avanzado de generación de banderas
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="text-gray-300 space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Historial avanzado de combinaciones
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Cacheo automático de imágenes
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Exportación a formatos vectoriales
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Personalización avanzada
                    </li>
                  </ul>
                  <div className="flex justify-end">
                    <div className="flex items-center gap-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                      <span className="text-sm font-medium">Acceder</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
          
          {/* Settings */}
          <motion.div variants={itemVariants}>
            <Link href="/admin/settings" className="block group">
              <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/95 border border-white/10 hover:border-purple-500/50 hover:bg-gray-900/80 transition-all duration-300 shadow-xl h-full">
                <CardHeader className="pb-4 border-b border-white/5 bg-black/20">
                  <CardTitle className="flex items-center gap-3 text-xl text-white group-hover:text-purple-400 transition-colors">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Settings2Icon className="h-5 w-5 text-purple-400" />
                    </div>
                    Configuración
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Configuración y opciones del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="text-gray-300 space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      Gestionar shortcuts
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      Configurar accesos rápidos
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      Enlaces personalizados
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      Opciones del sistema
                    </li>
                  </ul>
                  <div className="flex justify-end">
                    <div className="flex items-center gap-2 text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                      <span className="text-sm font-medium">Acceder</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
