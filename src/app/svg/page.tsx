'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DashedStrokeExample,
  SvgFilterEffects,
  TextPathAnimation,
  MaskRevealAnimation,
  ClipPathAnimation,
  InteractiveDataSVG
} from './advanced-examples';
import { 
  BrandStrategyExample,
  BrandingExample,
  DigitalProductExample,
  MotionDesignExample,
  WebDevelopmentExample,
  UiUxDesignExample
} from './service-icon-examples';

export default function SVGPage() {
  // Estado para controlar los colores de fondo y los parámetros de los SVG
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  
  // Lista de colores disponibles para seleccionar
  const colorOptions = [
    { name: 'Negro', value: '#000000' },
    { name: 'Blanco', value: '#ffffff' },
    { name: 'Rojo', value: '#ff0000' },
    { name: 'Verde', value: '#00ff00' },
    { name: 'Azul', value: '#0000ff' },
  ];

  // Funciones para ejemplos de animaciones SVG
  const AnimatedStroke = () => (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <motion.circle
        cx="100"
        cy="100"
        r="80"
        stroke={backgroundColor === '#000000' ? '#ffffff' : '#000000'}
        strokeWidth="8"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "loop", repeatDelay: 0.5 }}
      />
    </svg>
  );

  const MorphingSVG = () => (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <motion.path
        d="M 100,50 L 150,100 L 100,150 L 50,100 Z"
        fill={backgroundColor === '#000000' ? '#ffffff' : '#000000'}
        animate={{
          d: [
            "M 100,50 L 150,100 L 100,150 L 50,100 Z", // rombo
            "M 50,50 L 150,50 L 150,150 L 50,150 Z",   // cuadrado
            "M 100,50 C 130,50 150,70 150,100 C 150,130 130,150 100,150 C 70,150 50,130 50,100 C 50,70 70,50 100,50", // círculo
            "M 100,50 L 150,100 L 100,150 L 50,100 Z", // rombo
          ]
        }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
      />
    </svg>
  );

  const InteractiveSVG = () => {
    const [hovered, setHovered] = useState(false);
    
    return (
      <svg 
        width="200" 
        height="200" 
        viewBox="0 0 200 200"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.rect
          x="50"
          y="50"
          width="100"
          height="100"
          rx="20"
          fill={hovered ? '#00ff00' : (backgroundColor === '#000000' ? '#ffffff' : '#000000')}
          animate={{ rotate: hovered ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        />
        {hovered && (
          <motion.text
            x="100"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={backgroundColor === '#000000' ? '#000000' : '#ffffff'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            fontSize="20"
          >
            ¡Hola!
          </motion.text>
        )}
      </svg>
    );
  };

  const GradientSVG = () => (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <defs>
        <linearGradient id="svgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <motion.stop
            offset="0%"
            animate={{ stopColor: ['#ff0000', '#00ff00', '#0000ff', '#ff0000'] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.stop
            offset="100%"
            animate={{ stopColor: ['#0000ff', '#ff0000', '#00ff00', '#0000ff'] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </linearGradient>
      </defs>
      <motion.circle 
        cx="100" 
        cy="100" 
        r="80" 
        fill="url(#svgGradient)"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </svg>
  );

  const PulseSVG = () => (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <motion.circle
        cx="100"
        cy="100"
        r="40"
        fill={backgroundColor === '#ffffff' ? '#000000' : '#ffffff'}
        animate={{
          r: [40, 80, 40],
          opacity: [1, 0.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col justify-center items-center p-4 md:p-8 pt-24 md:pt-28">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-druk tracking-wider mb-4">SVG SHOWCASE</h1>
        <p className="text-white/60 max-w-2xl mx-auto font-geist-mono text-sm mb-8">
          Exploración de animaciones SVG avanzadas e interactivas
        </p>
        <p className="text-white/80 max-w-2xl mx-auto font-geist-mono text-xs mb-4">
          Estas técnicas pueden aplicarse a los iconos de servicios y elementos visuales de la plataforma
        </p>
        
        {/* Selector de color de fondo */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              onClick={() => setBackgroundColor(color.value)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                backgroundColor === color.value ? 'border-[#00ff00] scale-110' : 'border-white/20'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </header>
      
      <div className="w-full max-w-6xl mx-auto"
        style={{ backgroundColor: backgroundColor, color: backgroundColor === '#ffffff' ? '#000000' : '#ffffff' }}
      >
        {/* Ejemplos SVG Básicos */}
        <h2 className="text-2xl font-druk mb-4 text-center">Ejemplos Básicos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 rounded-lg border border-white/10 mb-12">
          <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
            <h3 className="text-xl font-druk mb-4">Animación de trazo</h3>
            <AnimatedStroke />
            <p className="mt-4 text-sm text-center">
              Animación de dibujo de trazo con pathLength
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
            <h3 className="text-xl font-druk mb-4">Morfismo de forma</h3>
            <MorphingSVG />
            <p className="mt-4 text-sm text-center">
              Transformación fluida entre formas diferentes
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
            <h3 className="text-xl font-druk mb-4">Interactivo</h3>
            <InteractiveSVG />
            <p className="mt-4 text-sm text-center">
              Cambia al pasar el cursor (hover)
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
            <h3 className="text-xl font-druk mb-4">Gradientes animados</h3>
            <GradientSVG />
            <p className="mt-4 text-sm text-center">
              Transición de colores en gradientes
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
            <h3 className="text-xl font-druk mb-4">Efecto pulso</h3>
            <PulseSVG />
            <p className="mt-4 text-sm text-center">
              Animación de pulso radial
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
            <h3 className="text-xl font-druk mb-4">Código SVG</h3>
            <pre className="language-html text-xs overflow-auto p-4 bg-black/50 rounded-lg w-full h-[200px]">
              {`<motion.circle
  cx="100"
  cy="100"
  r="80"
  stroke="#ffffff"
  strokeWidth="8"
  fill="none"
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ 
    duration: 2, 
    repeat: Infinity
  }}
/>`}
            </pre>
            <p className="mt-4 text-sm text-center">
              Ejemplo de código usando Framer Motion
            </p>
          </div>
        </div>
        
        {/* Ejemplos SVG Avanzados */}
        <h2 className="text-2xl font-druk mb-4 text-center">Ejemplos Avanzados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 rounded-lg border border-white/10 mb-12">
          <DashedStrokeExample 
            backgroundColor={backgroundColor}
            title="Trazos Animados" 
            description="Líneas que se dibujan con efectos de dash y variaciones sutiles"
          />
          <SvgFilterEffects 
            backgroundColor={backgroundColor}
            title="Filtros y Efectos" 
            description="Sombras, resplandor y filtros para profundidad visual"
          />
          <TextPathAnimation 
            backgroundColor={backgroundColor}
            title="Texto en Ruta" 
            description="Texto que sigue una trayectoria circular animada"
          />
          <MaskRevealAnimation 
            backgroundColor={backgroundColor}
            title="Revelación por Máscara" 
            description="Efectos de revelación usando mascarillas dinámicas"
          />
          <ClipPathAnimation 
            backgroundColor={backgroundColor}
            title="Recorte Animado" 
            description="Formas que se transforman mediante clip-path"
          />
          <InteractiveDataSVG 
            backgroundColor={backgroundColor}
            title="Datos Dinámicos" 
            description="Visualización de datos con actualización en tiempo real"
          />
        </div>
        
        {/* Ejemplos de Servicios */}
        <h2 className="text-2xl font-druk mb-4 text-center">Ejemplos para Iconos de Servicios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 rounded-lg border border-white/10 mb-12">
          <BrandStrategyExample 
            backgroundColor={backgroundColor}
            title="Brand Strategy" 
            description="Gráfico ascendente con línea de tendencia animada"
          />
          <BrandingExample 
            backgroundColor={backgroundColor}
            title="Branding" 
            description="Círculos que forman un logotipo abstracto"
          />
          <DigitalProductExample 
            backgroundColor={backgroundColor}
            title="Digital Product" 
            description="Interfaz interactiva con elementos animados"
          />
          <MotionDesignExample 
            backgroundColor={backgroundColor}
            title="Motion Design" 
            description="Barras horizontales que ondulan como ondas"
          />
          <WebDevelopmentExample 
            backgroundColor={backgroundColor}
            title="Web Development" 
            description="Red de triángulos conectados con pulsos"
          />
          <UiUxDesignExample 
            backgroundColor={backgroundColor}
            title="UI/UX Design" 
            description="Bloques de interfaz reorganizándose"
          />
        </div>
        
        <div className="mt-8 text-center mb-8">
          <h2 className="text-2xl font-druk mb-4">Aplicación Práctica</h2>
          <p className="text-sm max-w-3xl mx-auto">
            Estas técnicas SVG muestran cómo los iconos de servicios actuales pueden evolucionar
            para transmitir mejor lo que representa cada servicio. La animación y la interactividad
            pueden mejorar considerablemente la experiencia del usuario y resaltar las fortalezas
            específicas de cada área.
          </p>
        </div>
      </div>
    </div>
  );
}
