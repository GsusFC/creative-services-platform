"use client";

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLogoSlider } from '@/hooks/useLogoSlider';
import { Logo } from '@/config/logos';

// Este componente ya no necesita props, ya que usa el hook useLogoSlider

const LogoSlider = memo(() => {
  const {
    logos,
    imageConfig,
    animationConfig,
    a11y,
    labels,
    isPaused,
    togglePause,
    getAnimationClass,
    getAnimationStyle
  } = useLogoSlider();
  
  // Obtenemos las clases y estilos de animación
  const animationClasses = getAnimationClass();
  const animationStyle = getAnimationStyle();

  // Renderizado del logo (con o sin enlace)
  const renderLogo = (logo: Logo, index: number, isDuplicate = false) => {
    const logoComponent = (
      <Image
        src={logo.src}
        alt={logo.alt}
        width={imageConfig.width}
        height={imageConfig.height}
        className={imageConfig.className}
      />
    );

    // Si el logo tiene URL, lo envolvemos en un Link
    if (logo.url) {
      return (
        <Link 
          href={logo.url} 
          key={`logo-${isDuplicate ? 'dup-' : ''}${index}`}
          aria-label={`Visitar ${logo.alt}`}
          target="_blank"
          rel="noopener noreferrer"
          className="focus:outline-none focus:ring-2 focus:ring-white/20 rounded-sm"
          tabIndex={0}
        >
          {logoComponent}
        </Link>
      );
    }

    // Si no tiene URL, devolvemos solo la imagen
    return (
      <div key={`logo-${isDuplicate ? 'dup-' : ''}${index}`}>
        {logoComponent}
      </div>
    );
  };

  return (
    <div className="w-full bg-black pt-4 pb-12 sm:pt-6 sm:pb-16 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-4 sm:mb-6 gap-2">
          <p className="text-center text-[10px] sm:text-xs font-mono text-white/40 uppercase tracking-[0.2em]">
            {labels.trustedBy}
          </p>
          <button 
            onClick={togglePause}
            className="text-[10px] sm:text-xs font-mono text-white/40 hover:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-sm"
            aria-label={a11y.pauseButtonLabel}
            title={a11y.pauseButtonLabel}
            tabIndex={0}
          >
            {isPaused ? '▶' : '❚❚'}
          </button>
        </div>
        
        <div 
          className="relative w-screen left-[calc(-50vw+50%)] right-[calc(-50vw+50%)] overflow-hidden px-4 sm:px-8"
          aria-label={a11y.sliderRegion}
          role="region"
        >
          <div 
            className={`flex ${animationConfig.spacing} ${animationClasses}`}
            style={animationStyle}
          >
            {/* Original set */}
            {logos.map((logo, i) => renderLogo(logo, i))}
            
            {/* Duplicated set for continuous scroll */}
            {logos.map((logo, i) => renderLogo(logo, i, true))}
          </div>
        </div>
      </div>
    </div>
  );
});

// Añadimos displayName para mejorar la depuración
LogoSlider.displayName = 'LogoSlider';

export default LogoSlider;
