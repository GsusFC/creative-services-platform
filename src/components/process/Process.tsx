import React from 'react';
import { motion } from 'framer-motion';

export default function Process() {
  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto px-4 py-16 relative">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-7xl font-druk mb-6">
          NUESTRO PROCESO
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto font-geist-mono">
          Transformamos marcas mediante un proceso estratégico que combina
          investigación profunda, creatividad audaz y ejecución precisa.
        </p>
      </motion.div>

      {/* Process Steps */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24"
      >
        {/* Step 1 */}
        <motion.div
          variants={itemVariants}
          className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-lg"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-900/30 border border-purple-700/30 rounded-full mr-4">
              <span className="text-purple-400 font-druk">01</span>
            </div>
            <h3 className="text-2xl font-druk tracking-tight">DISCOVERY</h3>
          </div>
          <p className="font-geist-mono mb-6">
            Investigamos a fondo tu marca, audiencia y competencia para comprender 
            el panorama completo y encontrar oportunidades únicas.
          </p>
          <ul className="space-y-3 font-geist-mono">
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">→</span>
              <span>Análisis de marca y mercado</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">→</span>
              <span>Investigación de audiencia</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">→</span>
              <span>Auditoría competitiva</span>
            </li>
          </ul>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          variants={itemVariants}
          className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-lg"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-900/30 border border-purple-700/30 rounded-full mr-4">
              <span className="text-purple-400 font-druk">02</span>
            </div>
            <h3 className="text-2xl font-druk tracking-tight">STRATEGY</h3>
          </div>
          <p className="font-geist-mono mb-6">
            Desarrollamos un plan estratégico que define el posicionamiento, mensajes clave
            y dirección creativa que impulsará el éxito de tu marca.
          </p>
          <ul className="space-y-3 font-geist-mono">
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">→</span>
              <span>Posicionamiento de marca</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">→</span>
              <span>Estrategia de mensajes</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">→</span>
              <span>Dirección creativa</span>
            </li>
          </ul>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          variants={itemVariants}
          className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-lg"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-900/30 border border-purple-700/30 rounded-full mr-4">
              <span className="text-purple-400 font-druk">03</span>
            </div>
            <h3 className="text-2xl font-druk tracking-tight">CREATION</h3>
          </div>
          <p className="font-geist-mono mb-6">
            Transformamos la estrategia en elementos visuales y verbales impactantes
            que capturan la esencia de tu marca y conectan con tu audiencia.
          </p>
          <ul className="space-y-3 font-geist-mono">
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">→</span>
              <span>Diseño de identidad visual</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">→</span>
              <span>Desarrollo de contenido</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">→</span>
              <span>Experiencias digitales</span>
            </li>
          </ul>
        </motion.div>

        {/* Step 4 */}
        <motion.div
          variants={itemVariants}
          className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-lg"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-900/30 border border-purple-700/30 rounded-full mr-4">
              <span className="text-purple-400 font-druk">04</span>
            </div>
            <h3 className="text-2xl font-druk tracking-tight">ACTIVATION</h3>
          </div>
          <p className="font-geist-mono mb-6">
            Implementamos tu nueva marca a través de diversos canales y puntos de contacto,
            asegurando coherencia y máximo impacto.
          </p>
          <ul className="space-y-3 font-geist-mono">
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">→</span>
              <span>Lanzamiento de marca</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">→</span>
              <span>Implementación en canales</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">→</span>
              <span>Medición y optimización</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="text-center py-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-druk mb-6">
          LLEVEMOS TU MARCA AL SIGUIENTE NIVEL
        </h2>
        <p className="text-xl max-w-2xl mx-auto mb-8 font-geist-mono">
          Estamos listos para ayudarte a transformar tu marca con estrategias creativas que generan resultados reales.
        </p>
        <button className="bg-purple-700 hover:bg-purple-600 text-white px-8 py-4 rounded-md font-geist-mono transition-colors">
          AGENDA UNA CONSULTA
        </button>
      </motion.div>
    </div>
  );
}
