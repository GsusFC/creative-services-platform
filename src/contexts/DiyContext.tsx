'use client';

import React, { createContext, useContext, PropsWithChildren } from 'react';
import { useDiyState } from '@/hooks/useDiyState';
import { DiyContextState } from '@/types/do-it-yourself';

// Creamos el contexto con un valor inicial
const DiyContext = createContext<DiyContextState | undefined>(undefined);

/**
 * Proveedor del contexto DIY - Usa los repositorios implementados
 */
export const DiyProvider: React.FC<PropsWithChildren> = ({ children }) => {
  // Usamos el hook mejorado que utiliza los repositorios
  const diyState = useDiyState();
  
  return (
    <DiyContext.Provider value={diyState}>
      {children}
    </DiyContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto DIY
 */
export const useDiy = (): DiyContextState => {
  const context = useContext(DiyContext);
  
  if (context === undefined) {
    throw new Error('useDiy debe ser usado dentro de un DiyProvider');
  }
  
  return context;
};

export default DiyProvider;
