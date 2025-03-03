'use client';

import React from 'react';

interface MainInfoSectionProps {
  projectName: string;
  tagline?: string;
  description: string;
  services?: string[];
}

export const MainInfoSection: React.FC<MainInfoSectionProps> = ({
  projectName,
  tagline,
  description,
  services
}) => {
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Columna izquierda: Nombre del Proyecto y Tagline */}
        <div>
          <h1 className="text-white text-3xl md:text-4xl font-geist-mono mb-6">
            {projectName}
          </h1>
          
          {tagline && (
            <p className="text-white/90 text-2xl md:text-3xl font-druk leading-tight">
              {tagline}
            </p>
          )}
        </div>
        
        {/* Columna derecha: Descripción y Servicios */}
        <div>
          <div className="text-white/80 font-geist-mono mb-8 text-sm leading-relaxed">
            {description}
          </div>
          
          {services && services.length > 0 && (
            <div>
              <p className="text-white/60 text-xs mb-3 font-geist-mono uppercase tracking-wider">
                Servicios
              </p>
              <div className="flex flex-wrap gap-2">
                {services.map((service, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1.5 border border-white/20 text-white/80 text-xs font-geist-mono rounded-sm"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MainInfoSection;
