'use client'

import { drukText, geistMono } from '../fonts'
import { useEffect } from 'react'
import '@/styles/admin-fonts.css' // Importamos directamente las fuentes

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode {
  // Aseguramos que las fuentes estén disponibles
  useEffect(() => {
    // Forzar recarga de estilos
    document.documentElement.classList.add('fonts-loaded');
    
    // Verificar si las fuentes están cargadas
    console.log('Admin Layout cargado con fuentes:', {
      drukVariable: drukText.variable,
      geistVariable: geistMono.variable
    });
    
    // Verificar si las fuentes están disponibles en el documento
    setTimeout(() => {
      try {
        const drukLoaded = document.fonts.check('800 1em "Druk Text Wide"');
        const geistLoaded = document.fonts.check('400 1em "Geist Mono"');
        console.log('Fuentes disponibles en layout:', { drukLoaded, geistLoaded });
      } catch (error) {
        console.error('Error al verificar fuentes en layout:', error);
      }
    }, 1000);
  }, []);

  return (
    <div 
      className="admin-page"
      style={{
        // Aplicamos las fuentes directamente como propiedades CSS
        '--font-druk-text-wide': '"Druk Text Wide", sans-serif',
        '--font-geist-mono': '"Geist Mono", monospace'
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
