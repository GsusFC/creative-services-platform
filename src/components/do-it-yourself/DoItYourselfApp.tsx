'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Importaciones de componentes
import CatalogView from './CatalogView';
import BudgetPanel from './budget/BudgetPanel';
import FilterPanel from './FilterPanel';
import { DiyProvider } from '@/contexts/DiyContext';
import { useDiy } from '@/contexts/DiyContext';
// Importar componentes de estado estándar
import LoadingState from './states/LoadingState';
import ErrorState from './states/ErrorState';


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

      {/* Mostrar estado de carga o error usando componentes estándar */}
      {estaCargando && <LoadingState />}
      {error && <ErrorState message={error} />}

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
