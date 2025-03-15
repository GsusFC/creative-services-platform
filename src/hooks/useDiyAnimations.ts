'use client';

import { useEffect, useMemo } from 'react';
import { diyAnimations, cardGradientStyles } from '@/config/do-it-yourself';
import { AnimationSettings } from '@/types/do-it-yourself';

/**
 * Hook para gestionar las animaciones de los componentes del módulo Do-It-Yourself
 */
export const useDiyAnimations = () => {
  // Aplicar estilos CSS para el efecto gradient mask al montar el componente
  useEffect(() => {
    // Crear un elemento style y añadirlo al head
    const styleElement = document.createElement('style');
    styleElement.innerHTML = cardGradientStyles;
    document.head.appendChild(styleElement);
    
    // Limpieza cuando el componente se desmonte
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Configuraciones de animación memoizadas para diferentes elementos
  const animationSettings: AnimationSettings = useMemo(() => ({
    // Variantes para el contenedor de tarjetas
    catalogContainer: diyAnimations.catalogContainer,
    
    // Variantes para las tarjetas individuales
    catalogItem: diyAnimations.catalogItem,
    
    // Variantes para elementos del presupuesto
    budget: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05
        }
      }
    },
    
    // Efectos de hover para tarjetas
    cardHover: diyAnimations.cardHover
  }), []);
  
  // Función para obtener la clase CSS para la animación
  const getAnimationClass = () => {
    return 'animate-card-hover'; // Clase de Tailwind o personalizada si está definida
  };
  
  // Función para obtener el estilo inline de animación si es necesario
  const getAnimationStyle = () => {
    return {};
  };

  return {
    animationSettings,
    getAnimationClass,
    getAnimationStyle
  };
};

export default useDiyAnimations;
