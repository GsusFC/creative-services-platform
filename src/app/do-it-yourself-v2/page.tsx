'use client';

import React from 'react';
import DoItYourselfV2App from '@/components/do-it-yourself-v2/DoItYourselfV2App';

export default function DoItYourselfV2Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12 mt-[80px]">
        <div className="mb-8">
          <h1 
            className="text-4xl mb-2 text-white" 
            style={{ fontFamily: 'var(--font-druk-text-wide)' }}
          >
            DO IT YOURSELF <span className="text-[#00ff00]">V2</span>
          </h1>
          <p 
            className="max-w-3xl text-white/70"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            Nueva versión en desarrollo que incluye departamentos, productos, servicios y paquetes.
            Esta versión permitirá crear presupuestos más completos y flexibles.
          </p>
        </div>
        
        <DoItYourselfV2App />
      </div>
    </main>
  );
}
