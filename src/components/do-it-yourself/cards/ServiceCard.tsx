'use client';

import React, { memo } from 'react';
import { motion, Variants } from 'framer-motion';
import { Servicio } from '@/types/do-it-yourself';
import { diyA11y, diyStyles } from '@/config/do-it-yourself';
import { useDiy } from '@/contexts/DiyContext';

// Estilos para el efecto de borde gradiente
const gradientBorderStyle = {
  container: {
    position: 'relative',
    borderRadius: '12px',
    padding: '1px',
    background: '#111',
    transition: 'transform 0.3s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  } as React.CSSProperties,
  
  content: {
    position: 'relative',
    background: '#111',
    borderRadius: '11px',
    zIndex: 1,
    height: '100%',
    width: '100%',
  } as React.CSSProperties,
  
  pseudoBorder: {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: '12px',
    padding: '1px',
    background: 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff, #ff0000)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    backgroundSize: '300% 300%',
    animation: 'gradient-move 3.5s ease-in-out infinite',
    zIndex: 0,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  } as React.CSSProperties,
  
  hover: {
    transform: 'translateY(-5px)',
  },
  
  pseudoBorderHover: {
    opacity: 1,
  }
};

interface ServiceCardProps {
  servicio: Servicio;
  animationVariants: Variants;
}

const ServiceCard = memo<ServiceCardProps>(({
  servicio,
  animationVariants
}) => {
  // Obtenemos la función para agregar elementos del contexto DIY
  const { agregarElementoPresupuesto } = useDiy();
  
  // Funciones de manejo de eventos
  const handleAgregarClick = () => {
    agregarElementoPresupuesto(servicio);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleAgregarClick();
    }
  };

  return (
    <motion.div
      variants={animationVariants}
      style={gradientBorderStyle.container}
      className="group h-full relative cursor-pointer"
      onClick={handleAgregarClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${servicio.nombre}: ${servicio.precio} ${diyA11y.descriptions.serviceCard}`}
      whileHover={gradientBorderStyle.hover}
    >
      <div 
        style={gradientBorderStyle.pseudoBorder}
        className="pseudo-border"
      />
      <div style={gradientBorderStyle.content}>
        <div className={`${diyStyles.cardBody} flex flex-col h-full`}>
          <h3 className={`${diyStyles.cardTitle} min-h-[40px] flex items-center`}>{servicio.nombre}</h3>
          
          <div className="mb-2">
            <div className={diyStyles.cardMetaItem}>
              <span className={`${diyStyles.cardMetaLabel} uppercase`}>Tipo:</span>
              <span className={`${diyStyles.cardMetaValue} ${servicio.es_independiente ? 'text-[#00ff00]' : ''}`}>
                {servicio.es_independiente ? 'Independiente' : 'Complementario'}
              </span>
            </div>
          </div>
          
          <p className={`${diyStyles.text.body} flex-1 text-[10px] leading-[14px] line-clamp-4 mb-auto`}>
            {servicio.descripcion ? (
              servicio.descripcion.length > 120 
                ? `${servicio.descripcion.substring(0, 120)}...` 
                : servicio.descripcion
            ) : 'Sin descripción'}
          </p>
          
          <div className={diyStyles.cardFooterContainer}>
            {/* Tiempo */}
            <div className={diyStyles.cardFooterItem}>
              <div className={diyStyles.cardTimeLabel}>Tiempo</div>
              <div className={diyStyles.cardTimeValue}>{servicio.tiempo_estimado || '-'}</div>
            </div>
            
            {/* Precio */}
            <div className={diyStyles.cardFooterItem}>
              <div className={diyStyles.cardTimeLabel}>Precio</div>
              <div className={diyStyles.cardPrice}>${servicio.precio.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';

// La animación y los estilos de hover ahora se cargan desde animations.css

export default ServiceCard;
