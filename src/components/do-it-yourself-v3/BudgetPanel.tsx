'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ElementoPresupuesto } from './DoItYourselfV3App';
import { Servicio, Producto, Paquete } from '@/mocks/do-it-yourself-v2';

interface BudgetPanelProps {
  elementosSeleccionados: ElementoPresupuesto[];
  onEliminarElemento: (index: number) => void;
  descuentoGlobal: number;
  modoSprint: boolean;
  totales: {
    subtotal: number;
    descuento: number;
    totalConDescuento: number;
    total: number;
  };
}

const BudgetPanel: React.FC<BudgetPanelProps> = ({
  elementosSeleccionados,
  onEliminarElemento,
  descuentoGlobal,
  modoSprint,
  totales
}) => {
  // Agrupar elementos por tipo
  const servicios = elementosSeleccionados.filter(e => 'es_independiente' in e) as Servicio[];
  const productos = elementosSeleccionados.filter(e => 'servicios' in e) as Producto[];
  const paquetes = elementosSeleccionados.filter(e => 'productos' in e) as Paquete[];

  // Animación para los elementos
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  // Renderizar grupo de elementos
  const renderGrupo = (titulo: string, elementos: ElementoPresupuesto[], startIndex: number) => {
    if (elementos.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h3 
          className="text-sm uppercase text-white/70 mb-2"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          {titulo}
        </h3>
        <motion.ul 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {elementos.map((elemento, idx) => {
            const index = startIndex + idx;
            return (
              <motion.li 
                key={`${elemento.id}-${index}`}
                variants={itemVariants}
                className="flex justify-between items-center bg-white/5 p-1.5 rounded hover:bg-white/10 transition-colors"
              >
                <div className="flex-1">
                  <p 
                    className="text-white text-sm"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}
                  >
                    {elemento.nombre}
                  </p>
                  <p 
                    className="text-white/50 text-xs"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}
                  >
                    {elemento.tiempo_estimado} días
                  </p>
                </div>
                <div className="flex items-center">
                  <span 
                    className="text-[#00ff00] mr-3"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}
                  >
                    ${elemento.precio.toLocaleString()}
                  </span>
                  <button
                    onClick={() => onEliminarElemento(index)}
                    className="text-white/50 hover:text-white/80 p-1"
                    aria-label="Eliminar elemento"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full bg-black p-3 flex flex-col"
    >
      <h2 
        className="text-xl uppercase text-white mb-4"
        style={{ fontFamily: 'var(--font-druk-text-wide)' }}
      >
        Presupuesto
      </h2>

      <div className="overflow-y-auto custom-scrollbar flex-grow">
        {elementosSeleccionados.length > 0 ? (
          <>
            {renderGrupo('Paquetes', paquetes, 0)}
            {renderGrupo('Productos', productos, paquetes.length)}
            {renderGrupo('Servicios', servicios, paquetes.length + productos.length)}
          </>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p 
              className="text-white/50 text-center"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Agrega elementos a tu presupuesto
            </p>
          </div>
        )}
      </div>

      {/* Resumen del presupuesto */}
      <div className="pt-4 mt-4 border-t border-white/10">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span 
              className="text-white/70"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Subtotal:
            </span>
            <span 
              className="text-white"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              ${totales.subtotal.toLocaleString()}
            </span>
          </div>
          
          {descuentoGlobal > 0 && (
            <div className="flex justify-between text-sm">
              <span 
                className="text-white/70"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                Descuento ({descuentoGlobal}%):
              </span>
              <span 
                className="text-red-400"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                -${totales.descuento.toLocaleString()}
              </span>
            </div>
          )}
          
          {modoSprint && (
            <div className="flex justify-between text-sm">
              <span 
                className="text-white/70"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                Factor Sprint (x1.5):
              </span>
              <span 
                className="text-yellow-400"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                +${(totales.total - totales.totalConDescuento).toLocaleString()}
              </span>
            </div>
          )}
          
          <div className="flex justify-between text-lg pt-2 border-t border-white/10 mt-2">
            <span 
              className="text-white font-medium"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Total:
            </span>
            <span 
              className="text-[#00ff00] font-bold"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              ${totales.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="space-y-2 mt-4">
        <button
          className="w-full py-1.5 px-3 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded transition-colors flex items-center justify-center gap-1"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Guardar Presupuesto
        </button>
        <button
          onClick={() => {
            // Aquí iría la lógica para limpiar el presupuesto
            // Por ahora, simplemente eliminamos todos los elementos
            for (let i = elementosSeleccionados.length - 1; i >= 0; i--) {
              onEliminarElemento(i);
            }
          }}
          className="w-full py-1.5 px-3 bg-white/5 hover:bg-white/10 text-white rounded transition-colors flex items-center justify-center gap-1"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Limpiar Presupuesto
        </button>
      </div>
    </motion.div>
  );
};

export default BudgetPanel;
