'use client';

import React from 'react';
// Importamos el nuevo componente que usa los repositorios
import DoItYourselfApp from '@/components/do-it-yourself/DoItYourselfApp';

const DoItYourselfPage = () => {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-70"></div>
      
      <div className="pt-10 md:pt-20 px-4 md:px-8">

        {/* Aplicación principal de presupuestos - Versión con repositorios */}
        <DoItYourselfApp />
      </div>
    </main>
  );
};

export default DoItYourselfPage;
