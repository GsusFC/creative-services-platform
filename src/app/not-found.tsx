'use client';

import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black/95 text-white p-4">
      <div className="max-w-md w-full bg-black/80 backdrop-blur-md rounded-xl shadow-[0_0_30px_rgba(20,184,166,0.25)] border border-white/10 p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
            <FileQuestion className="w-6 h-6 text-teal-500" />
          </div>
        </div>
        
        <h2 className="text-xl font-medium text-center mb-2">Página no encontrada</h2>
        
        <p className="text-white/70 text-center mb-6">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        
        <div className="flex justify-center">
          <Link 
            href="/"
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500/80 to-emerald-500/80 text-white rounded-lg hover:from-teal-500/90 hover:to-emerald-500/90 transition-all shadow-[0_0_10px_rgba(20,184,166,0.3)] focus:outline-none focus:ring-2 focus:ring-teal-500/50 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
