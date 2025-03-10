'use client';

import React from 'react';
import { motion } from 'framer-motion';
import DoItYourselfApp from '../../components/do-it-yourself/DoItYourselfApp';

const DoItYourselfPage = () => {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-70"></div>
      
      <div className="pt-32 md:pt-40 px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight uppercase"
            style={{ fontFamily: 'var(--font-druk-text-wide)' }}
          >
            CREATE YOUR BUDGET
          </h1>
          <p 
            className="text-base md:text-lg text-white max-w-xl mx-auto"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            CONFIGURE AND GENERATE CUSTOM QUOTES BY DRAGGING AND DROPPING SERVICES
          </p>
        </motion.div>

        {/* Aplicación principal de presupuestos */}
        <DoItYourselfApp />
      </div>
    </main>
  );
};

export default DoItYourselfPage;
