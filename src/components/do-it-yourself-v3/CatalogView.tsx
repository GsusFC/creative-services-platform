'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TipoElemento, ElementoPresupuesto } from './DoItYourselfV3App';
import { Servicio, Producto, Paquete } from '@/mocks/do-it-yourself-v2';

// Estilos CSS para el efecto gradient mask
const cardStyles = `
  .card-gradient-outline {
    position: relative;
    border-radius: 8px;
    padding: 1.5px;
    background-origin: border-box;
    background-clip: content-box, border-box;
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.1));
    transition: all 0.3s ease;
  }
  
  .card-gradient-outline:hover {
    transform: translateY(-2px);
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), 
      linear-gradient(45deg, rgb(255, 0, 0), rgb(0, 255, 0), rgb(0, 0, 255), rgb(255, 0, 0));
    background-size: 100% 100%, 300% 300%;
    animation: gradient-move 3s linear infinite;
  }
  
  @keyframes gradient-move {
    0% {
      background-position: 0% 0%, 0% 50%;
    }
    50% {
      background-position: 0% 0%, 100% 50%;
    }
    100% {
      background-position: 0% 0%, 0% 50%;
    }
  }
  
  .card-inner {
    background-color: #000;
    border-radius: 6.5px;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
`;

interface CatalogViewProps {
  elementos: ElementoPresupuesto[];
  tipoSeleccionado: TipoElemento;
  onAgregarElemento: (elemento: ElementoPresupuesto) => void;
  getServiciosDeProducto: (productoId: number) => Servicio[];
  getProductosDePaquete: (paqueteId: number) => Producto[];
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
  elementosTotales: ElementoPresupuesto[];
}

const CatalogView: React.FC<CatalogViewProps> = ({
  elementos,
  elementosTotales,
  tipoSeleccionado,
  onAgregarElemento,
  getServiciosDeProducto,
  getProductosDePaquete,
  paginaActual,
  totalPaginas,
  onCambiarPagina
}) => {
  // Aplicar estilos CSS para el efecto gradient mask
  useEffect(() => {
    // Crear un elemento style y añadirlo al head
    const styleElement = document.createElement('style');
    styleElement.innerHTML = cardStyles;
    document.head.appendChild(styleElement);
    
    // Limpieza cuando el componente se desmonte
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  // Animación para las tarjetas con carga dinámica
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
    hidden: { y: 15, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        duration: 0.2
      }
    }
  };
  
  // Estado para animación de carga
  const [isLoading, setIsLoading] = useState(true);
  
  // Simular carga al cambiar de tipo
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [tipoSeleccionado, elementos]);

  // La función renderCard se eliminó porque ahora usamos funciones específicas directamente

  // Renderizar tarjeta de producto
  const renderProductoCard = (producto: Producto) => {
    const serviciosRelacionados = getServiciosDeProducto(producto.id);
    
    return (
      <motion.div 
        variants={itemVariants}
        className="card-gradient-outline h-[200px] overflow-hidden relative group transition-all"
      >
        <div className="card-inner flex flex-col p-4 shadow-sm h-full w-full">
          <div className="flex justify-between items-start mb-0.5">
            <h3 
              className="text-base text-white font-medium truncate max-w-[70%]"
              style={{ fontFamily: 'var(--font-druk-text-wide)' }}
            >
              {producto.nombre}
            </h3>
            <span 
              className="text-[#00ff00] font-bold"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              ${producto.precio.toLocaleString()}
            </span>
          </div>
          
          <p 
            className="text-white/70 text-xs mb-1 flex-grow line-clamp-1"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            {producto.descripcion}
          </p>
          
          {serviciosRelacionados.length > 0 && (
            <div className="mb-1">
              <h4 
                className="text-xs uppercase text-white/50 mb-0.5"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                Incluye:
              </h4>
              <ul className="text-[10px] text-white/70 space-y-0">
                {serviciosRelacionados.map(servicio => (
                  <li 
                    key={servicio.id}
                    className="flex items-center"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}
                  >
                    <span className="text-[#00ff00] mr-1">•</span> {servicio.nombre}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-auto pt-0.5 border-t border-white/10">
            <span 
              className="text-xs text-white/50"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              {producto.tiempo_estimado}d
            </span>
            <button
              onClick={() => onAgregarElemento(producto)}
              className="px-1.5 py-0.5 bg-[#00ff00] hover:bg-[#00dd00] text-black text-xs rounded transition-colors"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Agregar
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Renderizar tarjeta de servicio
  const renderServicioCard = (servicio: Servicio) => {
    return (
      <motion.div 
        variants={itemVariants}
        className="card-gradient-outline h-[200px] overflow-hidden relative group transition-all"
      >
        <div className="card-inner flex flex-col p-4 shadow-sm h-full w-full">

        <div className="flex justify-between items-start mb-0.5">
          <h3 
            className="text-base text-white font-medium truncate max-w-[70%]"
            style={{ fontFamily: 'var(--font-druk-text-wide)' }}
          >
            {servicio.nombre}
          </h3>
          <span 
            className="text-[#00ff00] font-bold"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            ${servicio.precio.toLocaleString()}
          </span>
        </div>
        
        <p 
          className="text-white/70 text-xs mb-1 flex-grow line-clamp-2"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          {servicio.descripcion}
        </p>
        
        <div className="flex justify-between items-center mt-auto pt-0.5 border-t border-white/10">
          <span 
            className="text-xs text-white/50"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            {servicio.tiempo_estimado}d
          </span>
          <button
            onClick={() => onAgregarElemento(servicio)}
            className="px-1.5 py-0.5 bg-[#00ff00] hover:bg-[#00dd00] text-black text-xs rounded transition-colors"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            Agregar
          </button>
        </div>
        </div>
      </motion.div>
    );
  };

  // Renderizar tarjeta de paquete
  const renderPaqueteCard = (paquete: Paquete) => {
    const productosIncluidos = getProductosDePaquete(paquete.id);
    
    return (
      <motion.div 
        variants={itemVariants}
        className="bg-black border border-white/10 rounded-lg p-1.5 flex flex-col shadow-sm hover:shadow-md hover:border-white/20 transition-all h-[200px] overflow-hidden relative group"
      >

        <div className="flex justify-between items-start mb-0.5">
          <h3 
            className="text-base text-white font-medium truncate max-w-[70%]"
            style={{ fontFamily: 'var(--font-druk-text-wide)' }}
          >
            {paquete.nombre}
          </h3>
          <span 
            className="text-[#00ff00] font-bold"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            ${paquete.precio.toLocaleString()}
          </span>
        </div>
        
        <p 
          className="text-white/70 text-xs mb-1 flex-grow line-clamp-1"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          {paquete.descripcion}
        </p>
        
        {productosIncluidos.length > 0 && (
          <div className="mb-1">
            <h4 
              className="text-xs uppercase text-white/50 mb-0.5"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              Incluye:
            </h4>
            <ul className="text-[10px] text-white/70 space-y-0">
              {productosIncluidos.map(producto => (
                <li 
                  key={producto.id}
                  className="flex items-center"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >
                  <span className="text-[#00ff00] mr-1">•</span> {producto.nombre}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-auto pt-0.5 border-t border-white/10">
          <span 
            className="text-xs text-white/50"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            {paquete.tiempo_estimado}d
          </span>
          <button
            onClick={() => onAgregarElemento(paquete)}
            className="px-1.5 py-0.5 bg-[#00ff00] hover:bg-[#00dd00] text-black text-xs rounded transition-colors"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            Agregar
          </button>
        </div>
      </motion.div>
    );
  };

  // Mostrar contenido según el estado de carga
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="col-span-4 flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="w-2 h-2 bg-[#00ff00] rounded-full"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.2, 1, 0.2]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-white/60 mt-3" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              Cargando elementos...
            </span>
          </div>
        </div>
      );
    }
    
    if (elementos.length === 0) {
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
    }
    
    return (
      <>
        {tipoSeleccionado === TipoElemento.PRODUCTO && (
          <motion.div
            className="grid grid-cols-3 gap-4 w-full pb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {elementos.map(elemento => {
              if ('precio' in elemento && 'servicios' in elemento) {
                const producto = elemento as Producto;
                return (
                  <motion.div key={producto.id} variants={itemVariants}>
                    {renderProductoCard(producto)}
                  </motion.div>
                );
              }
              return null;
            })}
          </motion.div>
        )}
        
        {tipoSeleccionado === TipoElemento.SERVICIO && (
          <motion.div
            className="grid grid-cols-3 gap-4 w-full pb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {elementos.map(elemento => {
              if ('precio' in elemento && 'es_independiente' in elemento) {
                const servicio = elemento as Servicio;
                return (
                  <motion.div key={servicio.id} variants={itemVariants}>
                    {renderServicioCard(servicio)}
                  </motion.div>
                );
              }
              return null;
            })}
          </motion.div>
        )}
        
        {tipoSeleccionado === TipoElemento.PAQUETE && (
          <motion.div
            className="grid grid-cols-3 gap-4 w-full pb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {elementos.map(elemento => {
              if ('precio' in elemento && 'productos' in elemento) {
                const paquete = elemento as Paquete;
                return (
                  <motion.div key={paquete.id} variants={itemVariants}>
                    {renderPaqueteCard(paquete)}
                  </motion.div>
                );
              }
              return null;
            })}
          </motion.div>
        )}
      </>
    );
  };

  // Componente de Paginación
  const Pagination = () => {
    if (totalPaginas <= 1) return null;
    
    return (
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button 
          onClick={() => onCambiarPagina(Math.max(1, paginaActual - 1))}
          disabled={paginaActual === 1}
          className="px-2 py-1 text-xs rounded bg-black border border-white/10 text-white/70 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/50 transition-colors"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          &lt;
        </button>
        
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
          <button
            key={pagina}
            onClick={() => onCambiarPagina(pagina)}
            className={`w-6 h-6 text-xs rounded flex items-center justify-center transition-colors ${paginaActual === pagina 
              ? 'bg-[#00ff00] text-black' 
              : 'bg-black border border-white/10 text-white/70 hover:bg-black/50'}`}
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            {pagina}
          </button>
        ))}
        
        <button 
          onClick={() => onCambiarPagina(Math.min(totalPaginas, paginaActual + 1))}
          disabled={paginaActual === totalPaginas}
          className="px-2 py-1 text-xs rounded bg-black border border-white/10 text-white/70 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/50 transition-colors"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          &gt;
        </button>
      </div>
    );
  };

  // Contenedor principal
  return (
    <div className="flex flex-col h-full">
      {/* Información de número de elementos */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-white/50" style={{ fontFamily: 'var(--font-geist-mono)' }}>
          {elementos.length} elementos mostrados de {elementosTotales.length} totales
        </span>
      </div>
      
      {/* Grid de productos con scroll personalizado */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-[450px]">
        {renderContent()}
      </div>

      {/* Paginación siempre visible en la misma posición */}
      <div className="mt-4 flex justify-center">
        <Pagination />
      </div>
    </div>
  );
};

export default CatalogView;
