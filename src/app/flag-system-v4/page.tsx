'use client';

import React from 'react';
import FlagSystemV4 from '@/components/flag-system-v4/FlagSystem';

export default function FlagSystemPage() {
  return (
    <main className="container py-8 md:py-12 mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">FLAG SYSTEM v4</h1>
        <p className="text-white/60 max-w-2xl mx-auto">
          Sistema mejorado de banderas que combina las mejores características de las versiones anteriores 
          con nuevas funcionalidades como exportación SVG avanzada e interfaz optimizada.
        </p>
      </div>
      
      <FlagSystemV4 />
    </main>
  );
}
