'use client';

import React from 'react';
import DoItYourselfApp from '../../components/do-it-yourself/DoItYourselfApp';

const DoItYourselfPage = () => {
  return (
    <main className="min-h-screen pt-[120px] px-0 md:px-2 max-w-full mx-auto">
      <section className="mb-8 px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Crea tu presupuesto personalizado</h1>
        <p className="text-lg max-w-3xl">
          Configura y genera presupuestos a tu medida arrastrando y soltando los servicios que necesitas.
          Nuestra herramienta de autoservicio te permite visualizar costos en tiempo real.
        </p>
      </section>

      {/* Aplicación principal de presupuestos */}
      <DoItYourselfApp />
    </main>
  );
};

export default DoItYourselfPage;
