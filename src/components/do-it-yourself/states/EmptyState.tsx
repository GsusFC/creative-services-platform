'use client';

import React from 'react';

/**
 * Componente que muestra un mensaje cuando no hay elementos disponibles
 */
const EmptyState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-[400px] w-full">
      <p 
        className="text-white/50 text-center"
        style={{ fontFamily: 'var(--font-geist-mono)' }}
      >
        No hay elementos disponibles con los filtros seleccionados.
      </p>
    </div>
  );
};

export default EmptyState;
