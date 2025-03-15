'use client';

import React, { useCallback } from 'react';
import { motion, Variants } from 'framer-motion';
import { ElementoPresupuesto, Servicio, Producto, Paquete } from '@/types/do-it-yourself';

// Importamos los componentes de tarjetas usando React.lazy para mejorar el rendimiento
const ProductCardV2 = React.lazy(() => import('../cards/ProductCardV2'));
const ServiceCardV2 = React.lazy(() => import('../cards/ServiceCardV2'));
const PackageCardV2 = React.lazy(() => import('../cards/PackageCardV2'));

// Tipos para props
interface ElementRendererProps {
  elementos: ElementoPresupuesto[];
  itemVariants: Variants;
}

/**
 * Componente optimizado para renderizar elementos según su tipo
 * Utiliza React.memo para evitar renderizados innecesarios
 */
const ElementRenderer: React.FC<ElementRendererProps> = ({ elementos, itemVariants }) => {
  // Usar useCallback para evitar recreaciones innecesarias de la función
  const handleVerDetalles = useCallback((elemento: ElementoPresupuesto) => {
    console.log('Ver detalles del elemento:', elemento);
    // Implementar lógica para mostrar detalles
  }, []);

  // Función para renderizar elementos según su tipo
  const renderElemento = (elemento: ElementoPresupuesto, index: number) => {
    // Es un producto
    if ('servicios' in elemento) {
      const producto = elemento as Producto;
      return (
        <motion.div key={`producto-${producto.id || `index-${index}`}`} variants={itemVariants}>
          <React.Suspense fallback={<div className="h-64 w-full bg-black/20 animate-pulse rounded-md"></div>}>
            <ProductCardV2
              producto={producto}
              onVerDetalles={handleVerDetalles}
              animationVariants={itemVariants}
            />
          </React.Suspense>
        </motion.div>
      );
    } 
    
    // Es un servicio
    if ('es_independiente' in elemento) {
      const servicio = elemento as Servicio;
      return (
        <motion.div key={`servicio-${servicio.id || `index-${index}`}`} variants={itemVariants}>
          <React.Suspense fallback={<div className="h-64 w-full bg-black/20 animate-pulse rounded-md"></div>}>
            <ServiceCardV2
              servicio={servicio}
              animationVariants={itemVariants}
            />
          </React.Suspense>
        </motion.div>
      );
    } 
    
    // Es un paquete
    if ('productos' in elemento) {
      const paquete = elemento as Paquete;
      return (
        <motion.div key={`paquete-${paquete.id || `index-${index}`}`} variants={itemVariants}>
          <React.Suspense fallback={<div className="h-64 w-full bg-black/20 animate-pulse rounded-md"></div>}>
            <PackageCardV2
              paquete={paquete}
              onVerDetalles={handleVerDetalles}
              animationVariants={itemVariants}
            />
          </React.Suspense>
        </motion.div>
      );
    }
    
    return null;
  };

  return (
    <>
      {elementos.map((elemento, index) => renderElemento(elemento, index))}
    </>
  );
};

// Usamos React.memo para optimizar renderizados
export default React.memo(ElementRenderer);
