'use client';

import React from 'react';
import { useDiy } from '@/contexts/DiyContext';

// BudgetLoadingState eliminado ya que no se utiliza y la carga se maneja globalmente

/**
 * Componente que muestra el estado de error del presupuesto
 */
export const BudgetErrorState: React.FC = () => {
  // Usar el contexto global para obtener el mensaje de error
  const { error } = useDiy();
  
  const handleReload = () => {
    window.location.reload();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleReload();
    }
  };
  
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-4">
        <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mb-3 mx-auto">
          <span className="text-red-500">!</span>
        </div>
        <p 
          className="text-white/70 text-sm mb-2"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          {error || 'Error al cargar el presupuesto'}
        </p>
        <button 
          onClick={handleReload}
          onKeyDown={handleKeyDown}
          className="text-white/70 text-xs underline hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 px-2 py-1 rounded"
          tabIndex={0}
          aria-label="Reintentar cargar el presupuesto"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
};

/**
 * Componente que muestra el estado vacío del presupuesto
 */
export const BudgetEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full p-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h18v18H3z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h8" />
      </svg>
      <p 
        className="text-white/50 text-sm"
        style={{ fontFamily: 'var(--font-geist-mono)' }}
      >
        No hay elementos en el presupuesto
      </p>
      <p className="text-white/30 text-xs mt-2 max-w-xs">
        Añade elementos desde el catálogo para comenzar a crear tu presupuesto
      </p>
    </div>
  );
};

// Exportamos todos los componentes bajo un namespace para facilitar su uso
export const BudgetStates = {
  // Loading: BudgetLoadingState, // Eliminado
  Error: BudgetErrorState,
  Empty: BudgetEmptyState
};

export default BudgetStates;
