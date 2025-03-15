'use client';

import React from 'react';

interface ErrorStateProps {
  message?: string;
}

/**
 * Componente que muestra un estado de error con posibilidad de reintentar
 */
const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = "Ocurrió un error inesperado al cargar los datos."
}) => {
  const handleRetry = () => {
    window.location.reload();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleRetry();
    }
  };
  
  return (
    <div className="flex items-center justify-center h-64 w-full">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mb-4">
          <span className="text-red-500 text-xl">!</span>
        </div>
        <h3 className="text-white text-lg font-semibold mb-2">Error al cargar elementos</h3>
        <p className="text-white/70 mb-4">{message}</p>
        <button 
          onClick={handleRetry}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label="Reintentar carga de datos"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
