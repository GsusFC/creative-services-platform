'use client';

import React from 'react';

interface GallerySectionProps {
  images: string[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ images }) => {
  if (!images || images.length === 0) {
    return null;
  }
  
  return (
    <section className="pb-32 container mx-auto px-6">
      <h2 className="text-white/90 text-xl font-geist-mono mb-8">
        Galería
      </h2>
      
      <div className="space-y-8">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="w-full aspect-video bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default GallerySection;
