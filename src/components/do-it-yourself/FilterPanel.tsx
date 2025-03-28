'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
// TipoElemento ya no se usa para filtrar
// import { TipoElemento } from '@/types/do-it-yourself';
// Departamentos se obtienen del contexto
// import { departamentos } from '@/mocks/do-it-yourself';
import { useDiy } from '@/contexts/DiyContext';

// Ya no necesitamos una interfaz de props ya que usamos el contexto

const FilterPanel = () => {
  // Obtener datos y funciones del contexto DIY
  const diyContext = useDiy();
  
  // Obtener datos y funciones del contexto DIY
  const { 
    filtros, 
    setDepartamentoSeleccionado, 
    opcionesPresupuesto, 
    setDescuentoGlobal, 
    setModoSprint,
    allCategories // Obtener las categorías (mapeadas a Departamentos)
  } = useDiy();
  
  // Extraer filtros del contexto
  const departamentoSeleccionado = filtros.departamentoId;
  // tipoSeleccionado eliminado
  
  // Extraer opciones
  const { descuentoGlobal, modoSprint } = opcionesPresupuesto;
  
  // Estado local para el término de búsqueda (sin cambios)
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');

  // Manejador para cambios en el campo de búsqueda (sin cambios)
  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerminoBusqueda(e.target.value);
    // Lógica de búsqueda no implementada en el hook por ahora
  };

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-gradient-to-r from-black/80 via-black to-black/80 p-4 mb-3 relative overflow-hidden backdrop-blur-sm"
      style={{
        backgroundImage: 'radial-gradient(circle at 50px 50px, rgba(0, 255, 0, 0.03), transparent 150px)'
      }}
    >
      <div className="flex items-center justify-between">
        {/* Buscador General */}
        <div className="flex items-center space-x-3 pr-8 relative after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-10 after:w-px after:bg-gradient-to-b after:from-transparent after:via-white/10 after:to-transparent">
          <div>
            <label 
              htmlFor="busqueda-general" 
              className="text-xs uppercase text-white/70 block mb-2"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Buscar
            </label>
            <div className="relative">
              <input
                id="busqueda-general"
                type="text"
                value={terminoBusqueda}
                onChange={handleBusquedaChange}
                placeholder="Buscar servicios o productos..."
                className="appearance-none bg-black/60 text-white rounded-sm px-4 py-2 text-sm w-56 focus:ring-1 focus:ring-[#00ff00]/30 focus:outline-none transition-all border-b border-white/10 pr-8"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              />
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-white/50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sección Central - Selector de Departamento */}
        <div className="flex items-center space-x-3 pr-8 relative after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-10 after:w-px after:bg-gradient-to-b after:from-transparent after:via-white/10 after:to-transparent">
          <div>
            <label 
              htmlFor="departamento-select" 
              className="text-xs uppercase text-white/70 block mb-2"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Departamento
            </label>
            <div className="relative">
              <select
                id="departamento-select"
                value={departamentoSeleccionado === null ? '' : departamentoSeleccionado}
                onChange={(e) => {
                  const value = e.target.value;
                  setDepartamentoSeleccionado(value ? parseInt(value, 10) : null);
                }}
                className="appearance-none bg-black/60 text-white rounded-sm px-4 py-2 text-sm w-56 focus:ring-1 focus:ring-[#00ff00]/30 focus:outline-none transition-all border-b border-white/10 pr-8"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                <option value="">Todos los departamentos</option>
                {/* Usar allCategories del contexto */}
                {allCategories.map((depto) => (
                  <option key={depto.id} value={depto.id} className="py-1">{depto.nombre}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-white/50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Central - Selector de Tipo ELIMINADO */}
        
        {/* Sección Derecha - Opciones de Presupuesto */}
        {/* Ajustar padding si es necesario tras eliminar selector de tipo */}
        <div className="flex items-center space-x-8 pl-8"> 
          {/* Descuento Global */}
          <div className="w-48">
            <label 
              htmlFor="descuento"
              className="block text-xs uppercase text-white/70 mb-1"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Descuento
            </label>
            <div className="flex items-center space-x-3">
              <input
                id="descuento"
                type="number"
                min="0"
                max="100" // Permitir hasta 100%
                value={descuentoGlobal}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  // La validación 0-100 se hace en el hook
                  setDescuentoGlobal(isNaN(value) ? 0 : value); 
                }}
                className="w-20 h-8 bg-black/60 text-white rounded-sm px-2 py-1 text-sm focus:ring-1 focus:ring-[#00ff00]/30 focus:outline-none transition-all border-b border-white/10"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              />
              <span className="text-white text-sm w-7" style={{ fontFamily: 'var(--font-geist-mono)' }}>%</span>
            </div>
          </div>

          {/* Modo Sprint */}
          <div>
            <label 
              htmlFor="modoSprint"
              className="block text-xs uppercase text-white/70 mb-1"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Modo Sprint
            </label>
            <div className="flex items-center">
              <div className="min-w-[76px] flex items-center space-x-2">
                <button 
                  onClick={() => setModoSprint(!modoSprint)}
                  className="relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none"
                  style={{ backgroundColor: modoSprint ? 'rgba(0, 255, 0, 0.15)' : 'rgba(255, 255, 255, 0.1)' }}
                >
                  <span className="sr-only">Activar modo sprint</span>
                  <span
                    className={`${modoSprint ? 'translate-x-6 bg-[#00ff00]' : 'translate-x-1 bg-white/80'} inline-block w-5 h-5 transform transition-transform rounded-full shadow-md`}
                  />
                </button>
                <div className="min-w-[32px] text-xs text-white" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                  <span className="inline-block w-[20px]">{modoSprint ? 'ON' : 'OFF'}</span> <span className="text-[#00ff00]">x1.3</span> {/* Ajustar si factor cambió */}
                </div>
              </div>
            </div>
          </div>
          
          {/* Botón de Reinicio */}
          <div>
            <label className="block text-xs uppercase text-white/70 mb-1 invisible" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              Reiniciar
            </label>
            <button
              onClick={() => {
                setDepartamentoSeleccionado(null);
                // setTipoSeleccionado eliminado
                setDescuentoGlobal(0);
                setModoSprint(false);
              }}
              className="bg-white/5 hover:bg-white/10 text-white text-xs py-1.5 px-3 rounded flex items-center space-x-1 transition-colors"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reiniciar Filtros</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterPanel;
