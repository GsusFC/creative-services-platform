'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { diyStyles } from '@/config/do-it-yourself';
import { useDiy } from '@/contexts/DiyContext';

// Definimos el componente sin memo primero
function PaginationControlsComponent() {
  // Obtener datos y funciones del contexto DIY
  const { paginacion, cambiarPagina } = useDiy();
  
  const { paginaActual, totalPaginas, elementosPorPagina, totalElementos } = paginacion;
  
  // Opciones de elementos por página (no se usa actualmente desde el contexto)
  const opcionesElementosPorPagina = [4, 6, 8];
  
  // Función para manejar cambio de página
  const handleCambioPagina = (pagina: number) => {
    cambiarPagina(pagina);
  };
  
  // Generar array de páginas para navegación
  const getPaginasArray = () => {
    const paginasArray = [];
    const maxPaginasVisibles = 5;
    
    if (totalPaginas <= maxPaginasVisibles) {
      // Mostrar todas las páginas si hay menos que el máximo visible
      for (let i = 1; i <= totalPaginas; i++) {
        paginasArray.push(i);
      }
    } else {
      // Lógica para mostrar páginas con elipsis
      if (paginaActual <= 3) {
        // Cerca del inicio
        for (let i = 1; i <= 4; i++) {
          paginasArray.push(i);
        }
        paginasArray.push('...');
        paginasArray.push(totalPaginas);
      } else if (paginaActual >= totalPaginas - 2) {
        // Cerca del final
        paginasArray.push(1);
        paginasArray.push('...');
        for (let i = totalPaginas - 3; i <= totalPaginas; i++) {
          paginasArray.push(i);
        }
      } else {
        // En medio
        paginasArray.push(1);
        paginasArray.push('...');
        paginasArray.push(paginaActual - 1);
        paginasArray.push(paginaActual);
        paginasArray.push(paginaActual + 1);
        paginasArray.push('...');
        paginasArray.push(totalPaginas);
      }
    }
    
    return paginasArray;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between border-t border-white/10 pt-4"
    >
      <div className={`flex items-center text-sm ${diyStyles.text.secondary}`}>
        <span>Mostrando </span>
        <span className="mx-1">{elementosPorPagina} de {totalElementos} elementos</span>
      </div>
      
      <div className="flex items-center space-x-1">
        {/* Botón Anterior */}
        <button
          onClick={() => handleCambioPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          className={`px-3 py-1 rounded text-sm ${
            paginaActual === 1
              ? diyStyles.buttons.disabled
              : diyStyles.buttons.secondary
          }`}
          aria-label="Ir a la página anterior"
          tabIndex={paginaActual === 1 ? -1 : 0}
        >
          Anterior
        </button>
        
        {/* Números de página */}
        <div className="flex items-center space-x-1">
          {getPaginasArray().map((pagina, index) => (
            <React.Fragment key={index}>
              {pagina === '...' ? (
                <span 
                  className="px-3 py-1 text-white/50 text-sm"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >
                  ...
                </span>
              ) : (
                <button
                  onClick={() => typeof pagina === 'number' && handleCambioPagina(pagina)}
                  className={`px-3 py-1 rounded text-sm ${
                    paginaActual === pagina
                      ? 'bg-[#00ff00] text-black font-medium'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >
                  {pagina}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Botón Siguiente */}
        <button
          onClick={() => handleCambioPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas || totalPaginas === 0}
          className={`px-3 py-1 rounded text-sm ${
            paginaActual === totalPaginas || totalPaginas === 0
              ? 'bg-white/5 text-white/30 cursor-not-allowed'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          Siguiente
        </button>
      </div>
    </motion.div>
  );
}

// Luego aplicamos memo
const PaginationControls = memo(PaginationControlsComponent);

// Y finalmente asignamos el displayName
PaginationControls.displayName = 'PaginationControls';

export default PaginationControls;
