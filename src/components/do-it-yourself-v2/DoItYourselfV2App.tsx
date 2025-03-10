'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  departamentos, 
  servicios, 
  productos, 
  paquetes,
  getServiciosDeDepartamento,
  getProductosDeDepartamento,
  getServiciosDeProducto,
  getProductosDePaquete,
  Servicio,
  Producto,
  Paquete
} from '@/mocks/do-it-yourself-v2';

// Enumeración de tipos de elementos
enum TipoElemento {
  PRODUCTO = 'producto',
  SERVICIO = 'servicio',
  PAQUETE = 'paquete'
}

const DoItYourselfV2App = () => {
  // Estados
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<number | null>(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoElemento>(TipoElemento.PRODUCTO);
  // Tipo unión para los elementos que pueden ser añadidos al presupuesto
  type ElementoPresupuesto = Servicio | Producto | Paquete;
  
  const [elementosSeleccionados, setElementosSeleccionados] = useState<ElementoPresupuesto[]>([]);
  const [descuentoGlobal, setDescuentoGlobal] = useState<number>(0);
  const [modoSprint, setModoSprint] = useState<boolean>(false);
  
  // Obtener elementos filtrados según selecciones
  const getElementosFiltrados = () => {
    switch (tipoSeleccionado) {
      case TipoElemento.PRODUCTO:
        return departamentoSeleccionado 
          ? getProductosDeDepartamento(departamentoSeleccionado)
          : productos;
      case TipoElemento.SERVICIO:
        return departamentoSeleccionado 
          ? getServiciosDeDepartamento(departamentoSeleccionado)
          : servicios.filter(s => s.es_independiente);
      case TipoElemento.PAQUETE:
        return paquetes; // Los paquetes no se filtran por departamento
      default:
        return [];
    }
  };
  
  // Calcular total del presupuesto
  const calcularTotal = () => {
    const subtotal = elementosSeleccionados.reduce((total, elemento) => total + elemento.precio, 0);
    const descuento = subtotal * (descuentoGlobal / 100);
    const totalConDescuento = subtotal - descuento;
    const factorSprint = modoSprint ? 1.5 : 1; // Factor de multiplicación para modo sprint
    
    return {
      subtotal,
      descuento,
      totalConDescuento,
      total: totalConDescuento * factorSprint
    };
  };
  
  // Agregar elemento al presupuesto
  const agregarElemento = (elemento: ElementoPresupuesto) => {
    setElementosSeleccionados([...elementosSeleccionados, elemento]);
  };
  
  // Eliminar elemento del presupuesto
  const eliminarElemento = (index: number) => {
    const nuevosElementos = [...elementosSeleccionados];
    nuevosElementos.splice(index, 1);
    setElementosSeleccionados(nuevosElementos);
  };
  
  const elementos = getElementosFiltrados();
  const totales = calcularTotal();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* COLUMNA 1: Navegación y Filtros */}
      <div className="bg-black border border-white/10 p-4 rounded-lg shadow-xl">
        <h2 
          className="text-xl uppercase text-white mb-4"
          style={{ fontFamily: 'var(--font-druk-text-wide)' }}
        >
          Navegación
        </h2>
        
        {/* Selector de Departamentos */}
        <div className="mb-6">
          <h3 className="text-sm uppercase text-white/70 mb-2" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            Departamentos
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-2 text-xs transition-all border
                        ${departamentoSeleccionado === null 
                          ? 'bg-[#00ff00] text-black border-[#00ff00] shadow-[0_0_15px_rgba(0,255,0,0.4)]' 
                          : 'bg-transparent text-white/80 border-white/20 hover:border-white/40'}`}
              onClick={() => setDepartamentoSeleccionado(null)}
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              TODOS
            </button>
            
            {departamentos.map((depto) => (
              <button 
                key={depto.id}
                className={`px-3 py-2 text-xs flex items-center gap-2 transition-all border
                          ${departamentoSeleccionado === depto.id 
                            ? 'bg-[#00ff00] text-black border-[#00ff00] shadow-[0_0_15px_rgba(0,255,0,0.4)]' 
                            : 'bg-transparent text-white/80 border-white/20 hover:border-white/40'}`}
                onClick={() => setDepartamentoSeleccionado(depto.id)}
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                {depto.nombre.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        
        {/* Selector de Tipo */}
        <div className="mb-6">
          <h3 className="text-sm uppercase text-white/70 mb-2" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            Tipo
          </h3>
          <div className="flex gap-2">
            {Object.values(TipoElemento).map((tipo) => (
              <button 
                key={tipo}
                className={`px-3 py-2 text-xs flex items-center gap-2 transition-all border
                          ${tipoSeleccionado === tipo 
                            ? 'bg-[#00ff00] text-black border-[#00ff00] shadow-[0_0_15px_rgba(0,255,0,0.4)]' 
                            : 'bg-transparent text-white/80 border-white/20 hover:border-white/40'}`}
                onClick={() => setTipoSeleccionado(tipo as TipoElemento)}
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                {tipo.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        
        {/* Opciones de Presupuesto */}
        <div className="mt-12 border-t border-white/10 pt-4">
          <h3 className="text-sm uppercase text-white/70 mb-4" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            Opciones de Presupuesto
          </h3>
          
          {/* Descuento Global */}
          <div className="mb-4">
            <label className="block text-xs text-white/70 mb-1" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              Descuento Global (%)
            </label>
            <input 
              type="number" 
              min="0" 
              max="100"
              value={descuentoGlobal}
              onChange={(e) => setDescuentoGlobal(Number(e.target.value))}
              className="w-full bg-black border border-white/20 px-3 py-2 text-white/90 rounded-sm"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            />
          </div>
          
          {/* Modo Sprint */}
          <div className="flex items-center gap-2 mb-4">
            <input 
              type="checkbox"
              id="modoSprint"
              checked={modoSprint}
              onChange={() => setModoSprint(!modoSprint)}
              className="border border-white/20 rounded-sm bg-black"
            />
            <label 
              htmlFor="modoSprint"
              className="text-xs text-white/70"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Modo Sprint (factor x1.5)
            </label>
          </div>
        </div>
      </div>
      
      {/* COLUMNA 2: Catálogo Principal */}
      <div className="bg-black border border-white/10 p-4 rounded-lg shadow-xl">
        <h2 
          className="text-xl uppercase text-white mb-4"
          style={{ fontFamily: 'var(--font-druk-text-wide)' }}
        >
          {tipoSeleccionado === TipoElemento.PRODUCTO ? 'Productos' : 
           tipoSeleccionado === TipoElemento.SERVICIO ? 'Servicios' : 'Paquetes'}
        </h2>
        
        {elementos.length === 0 ? (
          <p className="text-white/60 text-center py-8" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            No hay elementos disponibles con los filtros seleccionados
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {elementos.map((elemento, index) => (
              <motion.div
                key={elemento.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.05
                }}
                className={`p-3 border bg-black/40 hover:bg-black/60 transition-all
                          ${tipoSeleccionado === TipoElemento.PRODUCTO ? 'border-blue-500/30' : 
                            tipoSeleccionado === TipoElemento.SERVICIO ? 'border-green-500/30' : 
                            'border-purple-500/30'}
                          hover:border-[#00ff00]/70 cursor-pointer group relative`}
                onClick={() => agregarElemento(elemento)}
              >
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <h3 className="text-sm text-white uppercase group-hover:text-[#00ff00] transition-colors">
                      {elemento.nombre}
                    </h3>
                    <span className="text-[#00ff00] text-xs whitespace-nowrap uppercase bg-[#00ff00]/10 px-2 py-1 rounded">
                      {new Intl.NumberFormat('es-ES', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      }).format(elemento.precio)}
                    </span>
                  </div>
                  
                  <p className="text-white/70 text-xs mt-2">
                    {elemento.descripcion}
                  </p>
                  
                  {elemento.tiempo_estimado && (
                    <div className="mt-2 text-white/50 text-xs">
                      Tiempo estimado: {elemento.tiempo_estimado}
                    </div>
                  )}
                  
                  {/* Mostrar servicios incluidos (solo para productos) */}
                  {tipoSeleccionado === TipoElemento.PRODUCTO && (
                    <div className="mt-2 space-y-1">
                      <p className="text-white/50 text-xs">Incluye:</p>
                      <div className="flex flex-wrap gap-1">
                        {getServiciosDeProducto(elemento.id).map(servicio => (
                          <span key={servicio.id} className="text-[10px] bg-green-900/30 border border-green-900/50 px-1 py-0.5 rounded">
                            {servicio.nombre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Mostrar productos incluidos (solo para paquetes) */}
                  {tipoSeleccionado === TipoElemento.PAQUETE && (
                    <div className="mt-2 space-y-1">
                      <p className="text-white/50 text-xs">Incluye productos:</p>
                      <div className="flex flex-wrap gap-1">
                        {getProductosDePaquete(elemento.id).map(producto => (
                          <span key={producto.id} className="text-[10px] bg-blue-900/30 border border-blue-900/50 px-1 py-0.5 rounded">
                            {producto.nombre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[16px] border-r-[16px] border-t-transparent border-r-[#00ff00]/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* COLUMNA 3: Presupuesto */}
      <div className="bg-black border border-white/10 p-4 rounded-lg shadow-xl">
        <h2 
          className="text-xl uppercase text-white mb-4"
          style={{ fontFamily: 'var(--font-druk-text-wide)' }}
        >
          Tu Presupuesto
        </h2>
        
        {elementosSeleccionados.length === 0 ? (
          <div className="border-2 border-dashed border-white/20 rounded-lg h-[200px] flex items-center justify-center">
            <p className="text-white/50 text-center py-8" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              Haz clic en los elementos para añadirlos a tu presupuesto
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Elementos agrupados por tipo */}
            {[
              { tipo: TipoElemento.PAQUETE, titulo: 'Paquetes', borderColor: 'border-purple-500/30' },
              { tipo: TipoElemento.PRODUCTO, titulo: 'Productos', borderColor: 'border-blue-500/30' },
              { tipo: TipoElemento.SERVICIO, titulo: 'Servicios', borderColor: 'border-green-500/30' }
            ].map(grupo => {
              const elementosDeGrupo = elementosSeleccionados.filter(
                e => 
                  (grupo.tipo === TipoElemento.PAQUETE && 'productos' in e) ||
                  (grupo.tipo === TipoElemento.PRODUCTO && 'servicios' in e && !('productos' in e)) ||
                  (grupo.tipo === TipoElemento.SERVICIO && 'es_independiente' in e)
              );
              
              if (elementosDeGrupo.length === 0) return null;
              
              return (
                <div key={grupo.tipo} className={`border ${grupo.borderColor} p-3 rounded-md`}>
                  <h3 className="text-sm uppercase text-white/70 mb-2" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    {grupo.titulo}
                  </h3>
                  
                  {elementosDeGrupo.map((elemento, idx) => {
                    const elementoIndex = elementosSeleccionados.indexOf(elemento);
                    return (
                      <div key={`${elemento.id}-${idx}`} className="flex justify-between items-center py-1 border-b border-white/10 last:border-0">
                        <span className="text-xs text-white">{elemento.nombre}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#00ff00]">
                            {new Intl.NumberFormat('es-ES', { 
                              style: 'currency', 
                              currency: 'EUR' 
                            }).format(elemento.precio)}
                          </span>
                          <button 
                            onClick={() => eliminarElemento(elementoIndex)}
                            className="text-white/50 hover:text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            
            {/* Resumen de totales */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>Subtotal:</span>
                <span>
                  {new Intl.NumberFormat('es-ES', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  }).format(totales.subtotal)}
                </span>
              </div>
              
              {descuentoGlobal > 0 && (
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Descuento ({descuentoGlobal}%):</span>
                  <span className="text-red-400">
                    -{new Intl.NumberFormat('es-ES', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    }).format(totales.descuento)}
                  </span>
                </div>
              )}
              
              {modoSprint && (
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Factor Sprint (x1.5):</span>
                  <span className="text-orange-400">
                    +{new Intl.NumberFormat('es-ES', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    }).format(totales.totalConDescuento * 0.5)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between text-sm text-white font-bold mt-2 pt-2 border-t border-white/20">
                <span>TOTAL:</span>
                <span className="text-[#00ff00]">
                  {new Intl.NumberFormat('es-ES', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  }).format(totales.total)}
                </span>
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="mt-4 flex gap-2">
              <button
                className="w-full py-2 px-4 text-xs uppercase bg-[#00ff00] text-black hover:bg-[#00ff00]/90 transition-colors"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                Guardar Presupuesto
              </button>
              <button
                className="py-2 px-4 text-xs uppercase bg-white/10 text-white hover:bg-white/20 transition-colors"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
                onClick={() => setElementosSeleccionados([])}
              >
                Limpiar
              </button>
            </div>
          </div>
        )}
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default DoItYourselfV2App;
