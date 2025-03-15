'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Componente que muestra un estado de carga animado
 */
const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64 w-full">
      <div className="flex flex-col items-center">
        <div className="flex space-x-2">
          {[...Array(4)].map((_, i) => (
            <motion.div 
              key={i}
              className="w-2 h-2 bg-[#00ff00] rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.2, 1, 0.2]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
        <span className="text-xs text-white/60 mt-3" style={{ fontFamily: 'var(--font-geist-mono)' }}>
          Cargando elementos...
        </span>
      </div>
    </div>
  );
};

export default LoadingState;
