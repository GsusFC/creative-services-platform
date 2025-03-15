'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TipoElemento } from '@/types/do-it-yourself';
import { departamentos } from '@/mocks/do-it-yourself';
import { useDiy } from '@/contexts/DiyContext';

// Ya no necesitamos una interfaz de props ya que usamos el contexto

const FilterPanel = () => {
  // Obtener datos y funciones del contexto DIY
  const diyContext = useDiy();
  
  // Extraer filtros del contexto
  const departamentoSeleccionado = diyContext.filtros.departamentoId;
  const tipoSeleccionado = diyContext.filtros.tipoElemento;
  
  // Extraer setters y opciones
  const { setDepartamentoSeleccionado, setTipoSeleccionado } = diyContext;
  const { descuentoGlobal, modoSprint } = diyContext.opcionesPresupuesto;
  const { setDescuentoGlobal, setModoSprint } = diyContext;
  // Estado local para el término de búsqueda
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');

  // Manejador para cambios en el campo de búsqueda
  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerminoBusqueda(e.target.value);
    // Aquí podríamos añadir lógica para filtrar por término de búsqueda
    // si se implementa esta funcionalidad en el contexto
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
                value={departamentoSeleccionado || ''}
                onChange={(e) => setDepartamentoSeleccionado(e.target.value ? parseInt(e.target.value) : null)}
                className="appearance-none bg-black/60 text-white rounded-sm px-4 py-2 text-sm w-56 focus:ring-1 focus:ring-[#00ff00]/30 focus:outline-none transition-all border-b border-white/10 pr-8"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                <option value="">Todos los departamentos</option>
                {departamentos.map((depto) => (
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

        {/* Sección Central - Selector de Tipo */}
        <div className="flex flex-col items-center px-8 relative after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-10 after:w-px after:bg-gradient-to-b after:from-transparent after:via-white/10 after:to-transparent">
          <span 
            className="text-xs uppercase text-white/70 block mb-1 self-start"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            Tipo
          </span>
          <div className="flex bg-gradient-to-r from-black/40 to-black/60 rounded-md p-1 shadow-inner">
            <button
              onClick={() => setTipoSeleccionado(TipoElemento.PRODUCTO)}
              className={`px-4 py-1.5 rounded text-xs transition-colors flex items-center space-x-1 ${
                tipoSeleccionado === TipoElemento.PRODUCTO
                  ? 'bg-[#00ff00] text-black'
                  : 'text-white hover:bg-white/10'
              }`}
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Productos</span>
            </button>
            <button
              onClick={() => setTipoSeleccionado(TipoElemento.SERVICIO)}
              className={`px-4 py-1.5 rounded text-xs transition-colors flex items-center space-x-1 ${
                tipoSeleccionado === TipoElemento.SERVICIO
                  ? 'bg-[#00ff00] text-black'
                  : 'text-white hover:bg-white/10'
              }`}
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Servicios</span>
            </button>
            <button
              onClick={() => setTipoSeleccionado(TipoElemento.PAQUETE)}
              className={`px-4 py-1.5 rounded text-xs transition-colors flex items-center space-x-1 ${
                tipoSeleccionado === TipoElemento.PAQUETE
                  ? 'bg-[#00ff00] text-black'
                  : 'text-white hover:bg-white/10'
              }`}
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>Paquetes</span>
            </button>
          </div>
        </div>

        {/* Sección Derecha - Opciones de Presupuesto */}
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
                max="50"
                value={descuentoGlobal}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 0 && value <= 50) {
                    setDescuentoGlobal(value);
                  }
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
                  <span className="inline-block w-[20px]">{modoSprint ? 'ON' : 'OFF'}</span> <span className="text-[#00ff00]">x1.5</span>
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
                setTipoSeleccionado(TipoElemento.PRODUCTO);
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
