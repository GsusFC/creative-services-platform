'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Registrar el error en un servicio de análisis o monitoreo
    console.error('Error global en la aplicación:', error);
  }, [error]);

  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col items-center justify-center bg-black/95 text-white p-4">
        <div className="max-w-md w-full bg-black/80 backdrop-blur-md rounded-xl shadow-[0_0_30px_rgba(255,86,48,0.25)] border border-white/10 p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
          
          <h2 className="text-xl font-medium text-center mb-2">Error crítico</h2>
          
          <p className="text-white/70 text-center mb-6">
            Ha ocurrido un error crítico en la aplicación. Nuestro equipo ha sido notificado.
          </p>
          
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-6 overflow-auto max-h-32">
            <p className="text-red-400/90 text-sm font-mono">
              {error?.message || 'Error desconocido'}
            </p>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={reset}
              className="px-5 py-2.5 bg-gradient-to-r from-red-500/80 to-amber-500/80 text-white rounded-lg hover:from-red-500/90 hover:to-amber-500/90 transition-all shadow-[0_0_10px_rgba(255,86,48,0.3)] focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              Reiniciar aplicación
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
