'use client';

import React from 'react';
import CacheStats from '@/components/field-mapper/CacheStats';
import TransformationVisualizer from '@/components/field-mapper/TransformationVisualizer';
import PerformanceTools from '@/components/field-mapper/PerformanceTools';

export default function TestComponentsPage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Componentes de Prueba</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Estadísticas de Caché</h2>
        <CacheStats />
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Visualizador de Transformaciones</h2>
        <TransformationVisualizer />
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-2">Herramientas de Rendimiento</h2>
        <PerformanceTools />
      </section>
    </div>
  );
}
