'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/admin/components/ui/card"
import Link from "next/link"
import { DatabaseIcon, ArrowRightIcon, Settings2Icon, LayoutDashboardIcon, ImageIcon, BookOpenIcon, BarChart3Icon, Gamepad2Icon, FileTextIcon } from "lucide-react"
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
                <span>+8 esta semana</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border border-emerald-800/30 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Documentos</p>
                  <p className="text-3xl font-bold text-white">36</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <FileTextIcon className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-400">
                <span>+2 hoy</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-900/40 to-amber-950/40 border border-amber-800/30 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Visitas</p>
                  <p className="text-3xl font-bold text-white">4.2k</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <BarChart3Icon className="h-6 w-6 text-amber-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-400">
                <span>+16% este mes</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Secciones principales */}
        <h2 className="text-2xl font-bold mb-8 text-white">Herramientas y secciones</h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Case Studies */}
          <motion.div variants={itemVariants}>
            <Link href="/admin/case-studies" className="block group">
              <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/95 border border-white/10 hover:border-blue-500/50 hover:bg-gray-900/80 transition-all duration-300 shadow-xl h-full">
                <CardHeader className="pb-4 border-b border-white/5 bg-black/20">
                  <CardTitle className="flex items-center gap-3 text-xl text-white group-hover:text-blue-400 transition-colors">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <BookOpenIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    Casos de Estudio
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Gestiona la biblioteca completa de casos
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="text-gray-300 space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Añadir y editar casos de estudio
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Categorización y etiquetado
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Gestión de imágenes y recursos
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Estadísticas de visualización
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
                    Personaliza la plataforma y sus opciones
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="text-gray-300 space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      Ajustes generales del sitio
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      Gestión de usuarios y permisos
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      Personalizaciones de UI/UX
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      Opciones avanzadas
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
          
          {/* SVG Master */}
          <motion.div variants={itemVariants}>
            <Link href="/svg-master" className="block group">
              <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/95 border border-white/10 hover:border-amber-500/50 hover:bg-gray-900/80 transition-all duration-300 shadow-xl h-full">
                <CardHeader className="pb-4 border-b border-white/5 bg-black/20">
                  <CardTitle className="flex items-center gap-3 text-xl text-white group-hover:text-amber-400 transition-colors">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <Gamepad2Icon className="h-5 w-5 text-amber-400" />
                    </div>
                    SVG Master
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Editor avanzado de gráficos vectoriales
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="text-gray-300 space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      Edición avanzada de SVG
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      Optimización de vectores
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      Exportación en múltiples formatos
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      Biblioteca de elementos
                    </li>
                  </ul>
                  <div className="flex justify-end">
                    <div className="flex items-center gap-2 text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
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
