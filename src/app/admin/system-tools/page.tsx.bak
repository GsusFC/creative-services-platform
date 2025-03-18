'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, WrenchIcon, TypeIcon, LayoutIcon, CodeIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/admin/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/admin/components/ui/tabs';

export default function SystemToolsPage() {
  const [activeTab, setActiveTab] = useState<string>("fonts");
  // Animación para los elementos que aparecen en la página
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950/95 text-white">
      {/* Header con efecto de vidrio esmerilado mejorado */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-lg">
        <div className="max-w-full mx-auto flex justify-between items-center px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <WrenchIcon className="h-6 w-6 text-indigo-400" />
            </div>
            <span className="font-bold text-xl font-druk tracking-wide">HERRAMIENTAS DEL SISTEMA</span>
          </div>
          <Link href="/admin" className="flex items-center gap-2 text-sm text-indigo-300 hover:text-indigo-200 transition-colors px-3 py-2 rounded-md hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20">
            <ArrowLeftIcon className="h-4 w-4" />
            Volver al Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
              <h1 className="text-4xl font-bold font-druk tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-gray-400">
                HERRAMIENTAS DEL SISTEMA
              </h1>
            </div>
            <p className="text-gray-400 mb-8 max-w-3xl ml-4 pl-6 border-l border-indigo-500/30 text-lg">
              Esta sección proporciona herramientas y utilidades para el desarrollo y diagnóstico del sistema, incluyendo pruebas de tipografía, variables CSS y configuraciones técnicas.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-950/95 border border-white/10 shadow-2xl w-full overflow-hidden">
              <CardHeader className="pb-4 border-b border-indigo-500/20 bg-gradient-to-r from-black/40 to-indigo-950/10">
                <CardTitle className="flex items-center gap-3 text-xl text-white">
                  <div className="p-2 bg-indigo-500/20 rounded-lg shadow-inner shadow-indigo-600/10">
                    <TypeIcon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <span className="font-druk tracking-wide">PRUEBAS DE TIPOGRAFÍA</span>
                </CardTitle>
                <CardDescription className="text-gray-400 ml-11">
                  Visualización de fuentes, tamaños y variables CSS para desarrollo
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-8 pb-8 bg-gradient-to-b from-transparent to-black/20">
                <Tabs 
                  defaultValue="fonts" 
                  value={activeTab} 
                  onValueChange={setActiveTab} 
                  className="w-full"
                >
                  <div className="flex justify-center mb-8">
                    <TabsList className="h-12 bg-gray-800/50 border border-indigo-500/20 rounded-xl p-1 shadow-lg">
                      <TabsTrigger value="fonts" className="px-6 text-base rounded-lg data-[state=active]:bg-indigo-500/30 data-[state=active]:text-white data-[state=active]:shadow-inner">Fuentes</TabsTrigger>
                      <TabsTrigger value="sizes" className="px-6 text-base rounded-lg data-[state=active]:bg-indigo-500/30 data-[state=active]:text-white data-[state=active]:shadow-inner">Tamaños</TabsTrigger>
                      <TabsTrigger value="technical" className="px-6 text-base rounded-lg data-[state=active]:bg-indigo-500/30 data-[state=active]:text-white data-[state=active]:shadow-inner">Detalles Técnicos</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="fonts" className="space-y-8">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 p-6 rounded-xl border border-indigo-500/20 shadow-lg mb-8"
                    >
                      <h3 className="text-xl text-white mb-5 font-druk flex items-center gap-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/10 p-3 rounded-lg">
                        <div className="h-5 w-1 bg-indigo-500 rounded-full"></div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">TIPOGRAFÍA DEL SISTEMA</span>
                      </h3>
                      <p className="text-gray-300 mb-6 ml-4 pl-6 border-l border-indigo-500/30">
                        Estas son las fuentes utilizadas en el sistema, accesibles mediante clases de Tailwind y variables CSS.
                      </p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-indigo-900/20 to-indigo-800/10 p-6 rounded-xl border border-indigo-500/20 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover:border-indigo-500/30"
                      >
                        <h3 className="text-lg text-white mb-5 font-druk flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-indigo-500/30 rounded-full">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                          </div>
                          CLASES DE TAILWIND
                        </h3>
                        
                        <div className="space-y-6">
                          <div className="p-4 bg-indigo-500/10 rounded-lg">
                            <h4 className="text-md text-white mb-2 flex items-center">
                              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                              <code className="bg-indigo-500/20 px-2 py-1 rounded text-indigo-200">font-druk</code>
                              <span className="ml-2 text-xs text-gray-400">(Fuente de display)</span>
                            </h4>
                            <p className="font-druk text-white text-2xl" data-component-name="SystemToolsPage">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                            <p className="font-druk text-white text-lg mt-1">1234567890</p>
                          </div>
                          
                          <div className="p-4 bg-indigo-500/10 rounded-lg">
                            <h4 className="text-md text-white mb-2 flex items-center">
                              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                              <code className="bg-indigo-500/20 px-2 py-1 rounded text-indigo-200">font-sans</code>
                              <span className="ml-2 text-xs text-gray-400">(Inter)</span>
                            </h4>
                            <p className="font-sans text-white text-2xl">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                            <p className="font-sans text-white text-lg mt-1">abcdefghijklmnopqrstuvwxyz</p>
                            <p className="font-sans text-white text-lg mt-1">1234567890</p>
                          </div>
                          
                          <div className="p-4 bg-indigo-500/10 rounded-lg">
                            <h4 className="text-md text-white mb-2 flex items-center">
                              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                              <code className="bg-indigo-500/20 px-2 py-1 rounded text-indigo-200">font-mono</code>
                              <span className="ml-2 text-xs text-gray-400">(Geist Mono)</span>
                            </h4>
                            <p className="font-mono text-white text-2xl">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                            <p className="font-mono text-white text-lg mt-1">abcdefghijklmnopqrstuvwxyz</p>
                            <p className="font-mono text-white text-lg mt-1">1234567890</p>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 p-6 rounded-xl border border-purple-500/20 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:border-purple-500/30"
                      >
                        <h3 className="text-lg text-white mb-5 font-druk flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-purple-500/30 rounded-full">
                            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                          </div>
                          VARIABLES CSS
                        </h3>
                        
                        <div className="space-y-6">
                          <div className="p-4 bg-purple-500/10 rounded-lg">
                            <h4 className="text-md text-white mb-2 flex items-center">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                              <code className="bg-purple-500/20 px-2 py-1 rounded text-purple-200">var(--font-druk-text-wide)</code>
                            </h4>
                            <p className="text-white text-2xl" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                            <p className="text-white text-lg mt-1" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>1234567890</p>
                          </div>
                          
                          <div className="p-4 bg-purple-500/10 rounded-lg">
                            <h4 className="text-md text-white mb-2 flex items-center">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                              <code className="bg-purple-500/20 px-2 py-1 rounded text-purple-200">var(--font-inter)</code>
                            </h4>
                            <p className="text-white text-2xl" style={{ fontFamily: 'var(--font-inter)' }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                            <p className="text-white text-lg mt-1" style={{ fontFamily: 'var(--font-inter)' }}>abcdefghijklmnopqrstuvwxyz</p>
                            <p className="text-white text-lg mt-1" style={{ fontFamily: 'var(--font-inter)' }}>1234567890</p>
                          </div>
                          
                          <div className="p-4 bg-purple-500/10 rounded-lg">
                            <h4 className="text-md text-white mb-2 flex items-center">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                              <code className="bg-purple-500/20 px-2 py-1 rounded text-purple-200">var(--font-geist-mono)</code>
                            </h4>
                            <p className="text-white text-2xl" style={{ fontFamily: 'var(--font-geist-mono)' }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                            <p className="text-white text-lg mt-1" style={{ fontFamily: 'var(--font-geist-mono)' }}>abcdefghijklmnopqrstuvwxyz</p>
                            <p className="text-white text-lg mt-1" style={{ fontFamily: 'var(--font-geist-mono)' }}>1234567890</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 p-6 rounded-xl border border-gray-700/30 shadow-md mt-8"
                    >
                      <h3 className="text-lg text-white mb-5 font-druk flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-500/30 rounded-full">
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        </div>
                        VARIABLES CSS COMPUESTAS
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 p-4 rounded-lg border border-blue-500/20 shadow-sm">
                          <h4 className="text-md text-white mb-2 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            <code className="bg-blue-500/20 px-2 py-1 rounded text-blue-200">var(--font-sans)</code>
                          </h4>
                          <p className="text-gray-300 text-sm mb-2">Definición: <code className="bg-blue-500/10 px-2 py-1 rounded text-blue-200">var(--font-inter), system-ui, sans-serif</code></p>
                          <p className="text-white text-2xl" style={{ fontFamily: 'var(--font-sans)' }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                          <p className="text-white text-lg mt-1" style={{ fontFamily: 'var(--font-sans)' }}>abcdefghijklmnopqrstuvwxyz</p>
                          <p className="text-white text-lg mt-1" style={{ fontFamily: 'var(--font-sans)' }}>1234567890</p>
                        </div>
                      </div>
                    </motion.div>
                  </TabsContent>
                  
                  <TabsContent value="sizes" className="space-y-8">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 p-6 rounded-xl border border-indigo-500/20 shadow-lg mb-8"
                    >
                      <h3 className="text-xl text-white mb-5 font-druk flex items-center gap-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/10 p-3 rounded-lg">
                        <div className="h-5 w-1 bg-indigo-500 rounded-full"></div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">ESCALAS TIPOGRÁFICAS</span>
                      </h3>
                      <p className="text-gray-300 mb-6 ml-4 pl-6 border-l border-indigo-500/30">
                        Estas escalas muestran los diferentes tamaños de texto disponibles en el sistema, con sus equivalentes en píxeles.
                      </p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-indigo-900/20 to-indigo-800/10 p-6 rounded-xl border border-indigo-500/20 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover:border-indigo-500/30"
                      >
                        <h3 className="text-lg text-white mb-5 font-druk flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-indigo-500/30 rounded-full">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                          </div>
                          TAMAÑOS DE TEXTO (DRUK)
                        </h3>
                        
                        <div className="space-y-4">
                          {[
                            { size: "text-xs", px: "12px" },
                            { size: "text-sm", px: "14px" },
                            { size: "text-base", px: "16px" },
                            { size: "text-lg", px: "18px" },
                            { size: "text-xl", px: "20px" },
                            { size: "text-2xl", px: "24px" },
                            { size: "text-3xl", px: "30px" }
                          ].map((item, index) => (
                            <div key={index} className="group flex items-center justify-between border-b border-indigo-500/10 pb-2 hover:border-indigo-500/30 transition-colors duration-300">
                              <p className={`font-druk text-white ${item.size}`}>{item.size}</p>
                              <span className="text-indigo-400 text-xs px-2 py-1 bg-indigo-500/10 rounded-md group-hover:bg-indigo-500/20 transition-colors duration-300">{item.px}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 p-6 rounded-xl border border-purple-500/20 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:border-purple-500/30"
                      >
                        <h3 className="text-lg text-white mb-5 font-druk flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-purple-500/30 rounded-full">
                            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                          </div>
                          TAMAÑOS DE TEXTO (SANS)
                        </h3>
                        
                        <div className="space-y-4">
                          {[
                            { size: "text-xs", px: "12px" },
                            { size: "text-sm", px: "14px" },
                            { size: "text-base", px: "16px" },
                            { size: "text-lg", px: "18px" },
                            { size: "text-xl", px: "20px" },
                            { size: "text-2xl", px: "24px" },
                            { size: "text-3xl", px: "30px" }
                          ].map((item, index) => (
                            <div key={index} className="group flex items-center justify-between border-b border-purple-500/10 pb-2 hover:border-purple-500/30 transition-colors duration-300">
                              <p className={`font-sans text-white ${item.size}`}>{item.size}</p>
                              <span className="text-purple-400 text-xs px-2 py-1 bg-purple-500/10 rounded-md group-hover:bg-purple-500/20 transition-colors duration-300">{item.px}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 p-6 rounded-xl border border-gray-700/30 shadow-md mt-8"
                    >
                      <h3 className="text-lg text-white mb-5 font-druk flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-500/30 rounded-full">
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        </div>
                        ESPACIADOS COMUNES
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: "gap-2", value: "0.5rem (8px)" },
                          { label: "gap-4", value: "1rem (16px)" },
                          { label: "gap-6", value: "1.5rem (24px)" },
                          { label: "gap-8", value: "2rem (32px)" }
                        ].map((item, index) => (
                          <div 
                            key={index} 
                            className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 p-4 rounded-lg border border-blue-500/20 shadow-sm hover:shadow-md transition-shadow duration-300"
                          >
                            <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                            <p className="text-white font-mono">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </TabsContent>
                  
                  <TabsContent value="technical" className="space-y-8">
                    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 p-6 rounded-xl border border-indigo-500/20 shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 hover:border-indigo-500/30">
                      <h3 className="text-lg text-white mb-5 font-druk flex items-center gap-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/10 p-3 rounded-lg">
                        <div className="h-5 w-1 bg-indigo-500 rounded-full"></div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">DETALLES TÉCNICOS</span>
                      </h3>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-md text-gray-300 mb-2 flex items-center">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                            Variables CSS en :root
                          </h4>
                          <pre className="bg-black/70 p-5 rounded-lg text-green-400 overflow-x-auto text-sm border border-indigo-500/20 shadow-inner">
                            <code className="font-mono">
                              <span className="text-indigo-300">--font-sans:</span> var(--font-inter), system-ui, sans-serif;
                              <span className="text-indigo-300">--font-mono:</span> var(--font-geist-mono), monospace;
                              <span className="text-indigo-300">--font-display:</span> var(--font-druk-text-wide), sans-serif;
                            </code>
                          </pre>
                        </div>
                        
                        <div>
                          <h4 className="text-md text-gray-300 mb-2 flex items-center">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                            Configuración de Tailwind
                          </h4>
                          <pre className="bg-black/70 p-5 rounded-lg text-green-400 overflow-x-auto text-sm border border-indigo-500/20 shadow-inner">
                            <code className="font-mono">
                              <span className="text-indigo-300">fontFamily:</span> {'{'}
                                <span className="text-amber-300 pl-4">&apos;druk&apos;:</span> [&apos;var(--font-druk-text-wide)&apos;, &apos;sans-serif&apos;],
                                <span className="text-amber-300 pl-4">sans:</span> [&apos;var(--font-geist-mono)&apos;, &apos;monospace&apos;],
                                <span className="text-amber-300 pl-4">mono:</span> [&apos;var(--font-geist-mono)&apos;, &apos;monospace&apos;],
                                <span className="text-amber-300 pl-4">display:</span> [&apos;var(--font-druk-text-wide)&apos;, &apos;sans-serif&apos;],
                              {'}'}
                            </code>
                          </pre>
                        </div>
                        
                        <div>
                          <h4 className="text-md text-gray-300 mb-2 flex items-center">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                            Clases en el body
                          </h4>
                          <pre className="bg-black/70 p-5 rounded-lg text-green-400 overflow-x-auto text-sm border border-indigo-500/20 shadow-inner">
                            <code className="font-mono">
                              <span className="text-blue-300">&lt;body</span> <span className="text-amber-300">class=</span><span className="text-green-300">&quot;antialiased&quot;</span><span className="text-blue-300">&gt;</span>...<span className="text-blue-300">&lt;/body&gt;</span>
                            </code>
                          </pre>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-indigo-900/20 to-indigo-800/10 p-5 rounded-lg border border-indigo-500/20 shadow-md"
                      >
                        <h3 className="text-lg text-white mb-5 font-druk flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-indigo-500/30 rounded-full">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                          </div>
                          TECNOLOGÍAS PRINCIPALES
                        </h3>
                        <ul className="space-y-3 text-gray-300">
                          {[
                            { name: "Next.js 14", desc: "App Router" },
                            { name: "React 18", desc: "Server Components" },
                            { name: "TypeScript 5", desc: "Tipado estricto" },
                            { name: "TailwindCSS 3", desc: "Estilos modernos" },
                            { name: "Framer Motion", desc: "Animaciones fluidas" }
                          ].map((tech, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-indigo-400 mr-2">→</span>
                              <div>
                                <span className="font-medium text-white">{tech.name}</span>
                                <span className="text-gray-400 text-sm ml-2">({tech.desc})</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 p-5 rounded-lg border border-purple-500/20 shadow-md"
                      >
                        <h3 className="text-lg text-white mb-5 font-druk flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-purple-500/30 rounded-full">
                            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                          </div>
                          HERRAMIENTAS DE DESARROLLO
                        </h3>
                        <ul className="space-y-3 text-gray-300">
                          {[
                            { name: "ESLint", desc: "Linting de código" },
                            { name: "Prettier", desc: "Formateo consistente" },
                            { name: "Husky", desc: "Pre-commit hooks" },
                            { name: "Jest", desc: "Testing unitario" },
                            { name: "SWC", desc: "Compilación rápida" }
                          ].map((tool, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-purple-400 mr-2">→</span>
                              <div>
                                <span className="font-medium text-white">{tool.name}</span>
                                <span className="text-gray-400 text-sm ml-2">({tool.desc})</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 p-5 rounded-lg border border-gray-700/30 shadow-md"
                    >
                      <h3 className="text-lg text-white mb-5 font-druk flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-500/30 rounded-full">
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        </div>
                        INFORMACIÓN DEL SISTEMA
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: "Versión de Node.js", value: "v18.17.0", color: "from-green-900/20 to-green-800/10", borderColor: "border-green-500/20" },
                          { label: "Versión de Next.js", value: "14.0.3", color: "from-blue-900/20 to-blue-800/10", borderColor: "border-blue-500/20" },
                          { label: "Versión de React", value: "18.2.0", color: "from-cyan-900/20 to-cyan-800/10", borderColor: "border-cyan-500/20" },
                          { label: "Versión de TypeScript", value: "5.1.6", color: "from-indigo-900/20 to-indigo-800/10", borderColor: "border-indigo-500/20" }
                        ].map((item, index) => (
                          <div 
                            key={index} 
                            className={`bg-gradient-to-br ${item.color} p-4 rounded-lg ${item.borderColor} border shadow-sm hover:shadow-md transition-shadow duration-300`}
                          >
                            <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                            <p className="text-white font-mono text-lg">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                    
                    <div className="bg-gradient-to-br from-gray-800/40 to-gray-800/20 p-6 rounded-xl border border-indigo-500/20 shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 hover:border-indigo-500/30">
                      <h3 className="text-lg text-white mb-5 font-druk flex items-center gap-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/10 p-3 rounded-lg">
                        <div className="h-5 w-1 bg-indigo-500 rounded-full"></div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">ESTRUCTURA DE ESTILOS CSS</span>
                      </h3>
                      
                      <div className="space-y-4">
                        <p className="text-gray-300">La estructura de estilos CSS del proyecto está dividida en múltiples archivos organizados por funcionalidad:</p>
                        
                        <pre className="bg-black/70 p-5 rounded-lg text-blue-400 overflow-x-auto text-sm border border-indigo-500/20 shadow-inner">
                          <code className="font-mono">
                            <span className="text-white">styles/</span>
                            <span className="text-white">├── </span><span className="text-indigo-300">base/</span>                  <span className="text-gray-500"># Estilos base y fundamentales</span>
                            <span className="text-white">│   ├── </span><span className="text-green-300">reset.css</span>          <span className="text-gray-500"># Normalización y estilos base</span>
                            <span className="text-white">│   ├── </span><span className="text-green-300">typography.css</span>     <span className="text-gray-500"># Tipografía y estilos de texto</span>
                            <span className="text-white">│   └── </span><span className="text-green-300">variables.css</span>      <span className="text-gray-500"># Variables CSS y configuración de temas</span>
                            <span className="text-white">│</span>
                            <span className="text-white">├── </span><span className="text-indigo-300">components/</span>            <span className="text-gray-500"># Estilos específicos de componentes</span>
                            <span className="text-white">│   ├── </span><span className="text-green-300">buttons.css</span>        <span className="text-gray-500"># Estilos para botones</span>
                            <span className="text-white">│   ├── </span><span className="text-green-300">forms.css</span>          <span className="text-gray-500"># Estilos para elementos de formulario</span>
                            <span className="text-white">│   └── </span><span className="text-green-300">range-slider.css</span>   <span className="text-gray-500"># Estilos para input[type=&apos;range&apos;]</span>
                            <span className="text-white">│</span>
                            <span className="text-white">├── </span><span className="text-indigo-300">layout/</span>                <span className="text-gray-500"># Estilos de layout y estructura</span>
                            <span className="text-white">│   ├── </span><span className="text-green-300">admin.css</span>          <span className="text-gray-500"># Estilos para administración</span>
                            <span className="text-white">│   ├── </span><span className="text-green-300">containers.css</span>     <span className="text-gray-500"># Estilos para contenedores</span>
                            <span className="text-white">│   └── </span><span className="text-green-300">grid.css</span>           <span className="text-gray-500"># Sistema de grid y layout</span>
                            <span className="text-white">│</span>
                            <span className="text-white">├── </span><span className="text-indigo-300">utilities/</span>             <span className="text-gray-500"># Utilidades y helpers</span>
                            <span className="text-white">│   ├── </span><span className="text-green-300">animations.css</span>     <span className="text-gray-500"># Animaciones y transiciones</span>
                            <span className="text-white">│   ├── </span><span className="text-green-300">helpers.css</span>        <span className="text-gray-500"># Clases utilitarias</span>
                            <span className="text-white">│   └── </span><span className="text-green-300">scrollbar.css</span>      <span className="text-gray-500"># Estilos para scrollbar</span>
                            <span className="text-white">│</span>
                            <span className="text-white">└── </span><span className="text-green-300">main.css</span>               <span className="text-gray-500"># Archivo principal</span>
                          </code>
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
