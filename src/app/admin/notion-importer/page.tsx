import React from 'react';
import NotionProjectImporter from '@/components/notion-importer/NotionProjectImporter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Importador de Proyectos Notion | Creative Services Platform',
  description: 'Importa y sincroniza proyectos desde tus bases de datos de Notion',
};

export default function NotionImporterPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto pt-24 pb-12 px-4">
        <div className="mb-8">
          <a 
            href="/admin" 
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Volver al panel de administración</span>
          </a>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-teal-500/20 to-teal-900/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-notebook text-teal-400">
                <path d="M2 6h4"/>
                <path d="M2 10h4"/>
                <path d="M2 14h4"/>
                <path d="M2 18h4"/>
                <rect width="16" height="20" x="8" y="2" rx="2"/>
                <path d="M18 2v20"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white/90">Importador de Proyectos Notion</h1>
              <p className="text-white/60 font-geist-mono">
                Importa y sincroniza proyectos desde bases de datos de Notion
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-b from-black/60 to-black/40 border border-white/10 rounded-xl p-6">
          <NotionProjectImporter />
        </div>
      </div>
    </div>
  );
}
