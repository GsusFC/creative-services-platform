'use client';

import Link from 'next/link';
import Image from 'next/image';
import LandingPreview from '@/components/field-mapper-v4/client/LandingPreview';

export default function FieldMapperLanding() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="py-8 px-4 md:px-16 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold font-geist-mono">Field Mapper</h1>
          <nav className="space-x-4">
            <Link 
              href="/admin/field-mapper-v4" 
              className="px-4 py-2 rounded-md bg-white text-black font-geist-mono hover:bg-white/90 transition-colors"
            >
              Iniciar Aplicación
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 font-geist-mono">
                Field Mapper <span className="text-purple-400">V4</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8 font-geist-mono">
                Una solución avanzada para mapear campos entre Notion y Case Studies. 
                Más rápido, más intuitivo y completamente rediseñado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/admin/field-mapper-v4" 
                  className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors text-center font-geist-mono"
                >
                  Explorar Ahora
                </Link>
                <Link 
                  href="/admin/field-mapper-v2" 
                  className="px-6 py-3 bg-transparent border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-center font-geist-mono"
                >
                  Versión Anterior
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-gradient-to-tr from-purple-800/20 to-blue-800/20 rounded-xl p-1">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                  <LandingPreview />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-16 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center font-geist-mono">Características Principales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black p-6 rounded-xl border border-gray-800 hover:border-purple-700/30 transition-colors">
              <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-geist-mono">Transformaciones Inteligentes</h3>
              <p className="text-gray-400 font-geist-mono">
                Conversión automática entre diferentes tipos de campos con un sistema inteligente de transformaciones.
              </p>
            </div>
            
            <div className="bg-black p-6 rounded-xl border border-gray-800 hover:border-purple-700/30 transition-colors">
              <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-geist-mono">UI Minimalista</h3>
              <p className="text-gray-400 font-geist-mono">
                Interfaz simplificada y optimizada para maximizar el espacio de trabajo y mejorar la experiencia de usuario.
              </p>
            </div>
            
            <div className="bg-black p-6 rounded-xl border border-gray-800 hover:border-purple-700/30 transition-colors">
              <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-geist-mono">Sistema de Caché</h3>
              <p className="text-gray-400 font-geist-mono">
                Rendimiento optimizado con sistema de caché TTL y estrategia de invalidación LRU para operaciones frecuentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-16">
        <div className="max-w-5xl mx-auto text-center bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-12 rounded-2xl border border-purple-800/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-geist-mono">¿Listo para transformar tu flujo de trabajo?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto font-geist-mono">
            Empieza a usar Field Mapper V4 hoy mismo y descubre cómo puede simplificar la gestión de tus datos entre Notion y Case Studies.
          </p>
          <Link 
            href="/admin/field-mapper-v4" 
            className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors inline-block font-geist-mono"
          >
            Comenzar Ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-400 font-geist-mono">
          <p> {new Date().getFullYear()} Field Mapper V4. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
