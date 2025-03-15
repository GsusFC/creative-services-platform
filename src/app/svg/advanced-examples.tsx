'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AdvancedExampleProps {
  backgroundColor: string;
  title: string;
  description: string;
}

export const DashedStrokeExample = ({ backgroundColor, title, description }: AdvancedExampleProps) => {
  return (
    <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
      <h3 className="text-xl font-druk mb-4">{title}</h3>
      <svg width="200" height="200" viewBox="0 0 200 200">
        <motion.path
          d="M50,100 C50,50 150,50 150,100 C150,150 50,150 50,100 Z"
          fill="none"
          stroke={backgroundColor === '#000000' ? '#ffffff' : '#000000'}
          strokeWidth="4"
          strokeDasharray="10 5"
          initial={{ pathLength: 0, strokeDashoffset: 1000 }}
          animate={{ 
            pathLength: 1, 
            strokeDashoffset: 0,
            rotate: [0, 5, -5, 0],
            scale: [1, 1.02, 0.98, 1] 
          }}
          transition={{ 
            pathLength: { duration: 2, repeat: Infinity, repeatType: "loop" },
            strokeDashoffset: { duration: 20, repeat: Infinity, repeatType: "loop" },
            rotate: { duration: 7, repeat: Infinity, repeatType: "loop" },
            scale: { duration: 5, repeat: Infinity, repeatType: "loop" }
          }}
        />
        <motion.circle
          cx="100"
          cy="100"
          r="30"
          fill={backgroundColor === '#ffffff' ? '#000000' : '#ffffff'}
          animate={{
            r: [30, 35, 25, 30],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </svg>
      <p className="mt-4 text-sm text-center">
        {description}
      </p>
    </div>
  );
};

export const SvgFilterEffects = ({ backgroundColor, title, description }: AdvancedExampleProps) => {
  return (
    <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
      <h3 className="text-xl font-druk mb-4">{title}</h3>
      <svg width="200" height="200" viewBox="0 0 200 200">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="4" dy="4" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>
        
        <motion.circle
          cx="100"
          cy="100"
          r="50"
          fill="#00ff00"
          filter="url(#glow)"
          animate={{
            r: [50, 55, 45, 50],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
        
        <motion.rect
          x="70"
          y="70"
          width="60"
          height="60"
          rx="10"
          fill="#ff0000"
          filter="url(#shadow)"
          animate={{
            rotate: [0, 180, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </svg>
      <p className="mt-4 text-sm text-center">
        {description}
      </p>
    </div>
  );
};

export const TextPathAnimation = ({ backgroundColor, title, description }: AdvancedExampleProps) => {
  return (
    <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
      <h3 className="text-xl font-druk mb-4">{title}</h3>
      <svg width="200" height="200" viewBox="0 0 200 200">
        <defs>
          <path id="textCircle" d="M100,25 A75,75 0 1,1 99,25" />
        </defs>
        
        <path 
          d="M100,25 A75,75 0 1,1 99,25" 
          fill="none" 
          stroke={backgroundColor === '#000000' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
          strokeWidth="1"
        />

        <motion.g
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <text 
            fill={backgroundColor === '#000000' ? '#ffffff' : '#000000'}
            fontFamily="monospace"
            fontSize="12"
          >
            <textPath href="#textCircle" startOffset="0%">
              CREATIVE SERVICES PLATFORM • INTERACTIVE SVG DEMO •
            </textPath>
          </text>
        </motion.g>
        
        <motion.circle
          cx="100"
          cy="100"
          r="40"
          fill="none"
          stroke={backgroundColor === '#000000' ? '#00ff00' : '#00aa00'}
          strokeWidth="2"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </svg>
      <p className="mt-4 text-sm text-center">
        {description}
      </p>
    </div>
  );
};

export const MaskRevealAnimation = ({ backgroundColor, title, description }: AdvancedExampleProps) => {
  return (
    <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
      <h3 className="text-xl font-druk mb-4">{title}</h3>
      <svg width="200" height="200" viewBox="0 0 200 200">
        <defs>
          <mask id="circleMask">
            <rect width="200" height="200" fill="white" />
            <motion.circle
              cx="100"
              cy="100"
              r="50"
              fill="black"
              animate={{
                r: [50, 80, 50],
                cx: [100, 120, 80, 100],
                cy: [100, 80, 120, 100]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          </mask>
        </defs>
        
        <rect width="200" height="200" fill="#ff0000" mask="url(#circleMask)" />
        
        <motion.text
          x="100"
          y="100"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="20"
          fill={backgroundColor === '#000000' ? '#ffffff' : '#000000'}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            y: [120, 100, 80, 100]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          MASKED
        </motion.text>
      </svg>
      <p className="mt-4 text-sm text-center">
        {description}
      </p>
    </div>
  );
};

export const ClipPathAnimation = ({ backgroundColor, title, description }: AdvancedExampleProps) => {
  return (
    <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
      <h3 className="text-xl font-druk mb-4">{title}</h3>
      <svg width="200" height="200" viewBox="0 0 200 200">
        <defs>
          <motion.clipPath id="morphingClip"
            animate={{
              d: [
                "M100,50 Q150,50 150,100 Q150,150 100,150 Q50,150 50,100 Q50,50 100,50 Z",
                "M100,50 Q170,50 150,100 Q130,150 100,150 Q70,150 50,100 Q30,50 100,50 Z",
                "M100,50 Q150,30 150,100 Q150,170 100,150 Q50,130 50,100 Q50,30 100,50 Z",
                "M100,50 Q150,50 150,100 Q150,150 100,150 Q50,150 50,100 Q50,50 100,50 Z"
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <path d="M100,50 Q150,50 150,100 Q150,150 100,150 Q50,150 50,100 Q50,50 100,50 Z" />
          </motion.clipPath>
        </defs>
        
        <motion.g
          animate={{
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <g clipPath="url(#morphingClip)">
            <rect x="25" y="25" width="150" height="150" fill="#0000ff" />
            
            <motion.g
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ transformOrigin: '100px 100px' }}
            >
              {[...Array(8)].map((_, i) => (
                <rect
                  key={i}
                  x="95"
                  y="35"
                  width="10"
                  height="65"
                  fill={backgroundColor === '#000000' ? '#ffffff' : '#000000'}
                  opacity="0.7"
                  transform={`rotate(${i * 45} 100 100)`}
                />
              ))}
            </motion.g>
          </g>
        </motion.g>
      </svg>
      <p className="mt-4 text-sm text-center">
        {description}
      </p>
    </div>
  );
};

export const InteractiveDataSVG = ({ backgroundColor, title, description }: AdvancedExampleProps) => {
  const [dataPoints, setDataPoints] = useState([25, 40, 35, 50, 45, 60, 75]);
  
  // Cambia los datos cada pocos segundos para simular actualizaciones dinámicas
  useEffect(() => {
    const interval = setInterval(() => {
      const newPoints = dataPoints.map(() => Math.floor(Math.random() * 60) + 15);
      setDataPoints(newPoints);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [dataPoints]);
  
  // Crear string para el path de la línea
  const linePath = dataPoints.map((point, i) => {
    const x = 30 + (i * 20);
    const y = 140 - point;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');
  
  return (
    <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
      <h3 className="text-xl font-druk mb-4">{title}</h3>
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Eje Y */}
        <line x1="30" y1="40" x2="30" y2="140" stroke={backgroundColor === '#000000' ? '#ffffff' : '#000000'} strokeWidth="1" />
        
        {/* Eje X */}
        <line x1="30" y1="140" x2="170" y2="140" stroke={backgroundColor === '#000000' ? '#ffffff' : '#000000'} strokeWidth="1" />
        
        {/* Línea de datos */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="#00ff00"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
        
        {/* Puntos de datos */}
        {dataPoints.map((point, i) => (
          <motion.circle
            key={i}
            cx={30 + (i * 20)}
            cy={140 - point}
            r="4"
            fill="#00ff00"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
        
        {/* Etiqueta de datos */}
        <motion.text
          x="100"
          y="170"
          textAnchor="middle"
          fill={backgroundColor === '#000000' ? '#ffffff' : '#000000'}
          fontSize="10"
          fontFamily="monospace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          DATOS EN TIEMPO REAL
        </motion.text>
      </svg>
      <p className="mt-4 text-sm text-center">
        {description}
      </p>
    </div>
  );
};
