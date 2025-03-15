'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Importaciones de componentes
import CatalogView from './CatalogView';
import BudgetPanel from './budget/BudgetPanel';
import FilterPanel from './FilterPanel';
import { DiyProvider } from '@/contexts/DiyContext';
import { useDiy } from '@/contexts/DiyContext';

// Componente para mostrar estados de carga y error
const LoadingErrorState = () => {
  const { estaCargando, error } = useDiy();

  if (estaCargando) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-black bg-opacity-50 backdrop-blur-sm rounded-md">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="text-white text-lg font-medium">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-black bg-opacity-50 backdrop-blur-sm rounded-md p-6">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">!</span>
          </div>
          <h3 className="text-white text-xl font-bold">Error al cargar datos</h3>
          <p className="text-white/80">{error}</p>
          <button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return null;
};

// Componente contenedor que utiliza el contexto DIY
const DoItYourselfAppContent = () => {
  const { estaCargando, error } = useDiy();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full"
    >
      {/* Panel de Filtros - Usa el contexto directamente */}
      <FilterPanel />

      {/* Mostrar estado de carga o error cuando corresponda */}
      {(estaCargando || error) && <LoadingErrorState />}

      {/* Contenido principal - Solo se muestra si no hay errores ni está cargando */}
      {!estaCargando && !error && (
        <div className="flex flex-col md:flex-row gap-3 min-h-[600px]">
          {/* Panel Central - Catálogo */}
          <div className="w-full md:w-4/5 flex flex-col bg-black p-3">
            <CatalogView />
          </div>
          
          {/* Panel de Presupuesto - Usa el contexto directamente */}
          <div className="w-full md:w-1/5 mt-3 md:mt-0">
            <BudgetPanel />
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Componente principal que provee el contexto
const DoItYourselfApp = () => {
  return (
    <DiyProvider>
      <DoItYourselfAppContent />
    </DiyProvider>
  );
};

export default DoItYourselfApp;
