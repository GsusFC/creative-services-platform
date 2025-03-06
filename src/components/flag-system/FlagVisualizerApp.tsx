'use client';

import React, { useState, useRef } from 'react';
import { getRandomWord } from '@/lib/flag-system/dictionary';
import { letterToFlag } from '@/lib/flag-system/flagMap';

// Componente para mostrar las banderas en el canvas
const FlagDisplay = ({ word }: { word: string }) => {
  if (!word) {
    return (
      <div className="jsx-9109bf176d795fa9 text-center p-8">
        <span className="jsx-9109bf176d795fa9 text-white/60 font-mono text-xl block">
          Ingresa o genera una palabra para visualizar las banderas
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="flex justify-center items-center">
        {word.split('').map((letter, index) => {
          const flag = letterToFlag(letter.toUpperCase());
          if (!flag) return null;
          
          return (
            <div key={index} className="flex flex-col items-center">
              <img 
                src={flag.flagPath} 
                alt={`Bandera para la letra ${letter}`}
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
              />
            </div>
          );
        })}
      </div>
      
      {/* Palabra en el borde inferior */}
      <div className="absolute bottom-4 w-full text-center">
        <span className="text-white font-mono text-4xl font-bold tracking-wider">{word}</span>
      </div>
    </div>
  );
};

export default function FlagVisualizerApp() {
  const [word, setWord] = useState('');
  const [maxLength, setMaxLength] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Manejar entrada del usuario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limitar a máximo de caracteres, solo letras
    const value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, maxLength);
    setWord(value);
  };

  // Manejar generación de palabra aleatoria
  const handleRandomWord = () => {
    setIsGenerating(true);
    // Obtener palabra con la longitud especificada
    const randomWord = getRandomWord(maxLength);
    
    // Animar el proceso de generación
    let i = 0;
    const interval = setInterval(() => {
      setWord(randomWord.substring(0, i + 1));
      i++;
      if (i === randomWord.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 150);
  };

  // Manejar cambio de longitud máxima
  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLength = parseInt(e.target.value);
    setMaxLength(newLength);
    // Actualizar también la palabra actual si excede el nuevo límite
    if (word.length > newLength) {
      setWord(word.substring(0, newLength));
    }
  };
  
  // Exportar como SVG
  const handleExport = () => {
    if (!word) return;
    
    // Dimensiones del SVG
    const width = 1000;
    const height = 1000;
    
    // Crear contenido SVG
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <!-- Fondo negro -->
      <rect width="${width}" height="${height}" fill="black" />`;
      
    // Añadir las banderas en el centro
    const flagHeight = 100;
    const totalWidth = word.length * flagHeight; // No hay espaciado entre banderas
    let xPosition = (width - totalWidth) / 2;
    
    // Añadir cada bandera
    for (let i = 0; i < word.length; i++) {
      const letter = word[i];
      const flag = letterToFlag(letter);
      
      if (flag) {
        svgContent += `
        <image 
          x="${xPosition}" 
          y="${(height - flagHeight) / 2}" 
          width="${flagHeight}" 
          height="${flagHeight}" 
          href="${flag.flagPath}"
        />`;
        
        xPosition += flagHeight; // Sin espaciado entre banderas
      }
    }
    
    // Añadir el texto de la palabra alineado al centro en el borde inferior
    svgContent += `
    <text 
      x="${width/2}" 
      y="${height - 20}" 
      font-family="monospace" 
      font-size="48" 
      font-weight="bold"
      text-anchor="middle" 
      fill="white" 
      letter-spacing="0.1em"
    >${word}</text>`;
    
    // Añadir marca FLAG SYSTEM
    svgContent += `
      <text 
        x="${width - 20}" 
        y="${height - 10}" 
        font-family="monospace" 
        font-size="12" 
        text-anchor="end" 
        fill="#333333"
      >FLAG SYSTEM</text>
    </svg>`;
    
    // Crear blob y descargar
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flag-word-${word.toLowerCase()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-8xl flex flex-col lg:flex-row gap-8 mb-8">
      {/* Área de visualización de banderas */}
      <div className="w-full lg:w-2/3 flex justify-center" style={{maxWidth: "min(66.66%, -200px + 100vh)", opacity: 1, transform: "none"}}>
        <div className="w-full aspect-square">
          <div className="flex justify-center w-full relative">
            <div style={{width:"1000px", height:"1000px", background:"black", position:"relative", display:"flex", justifyContent:"center", alignItems:"center", maxWidth:"100%", border:"1px solid #333", borderRadius:"8px", overflow:"hidden", boxShadow:"0 4px 30px rgba(0, 0, 0, 0.5)"}} className="jsx-9109bf176d795fa9">
              <FlagDisplay word={word} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Panel de controles */}
      <div className="w-full lg:w-1/3">
        <div className="w-full bg-black/50 backdrop-blur-sm rounded-lg p-6">
          <div className="flex flex-col gap-6">
            {/* Entrada de texto */}
            <div className="w-full">
              <label className="block mb-2 text-sm font-mono text-white/60">CREAR PALABRA (MAX {maxLength} LETRAS)</label>
              <input
                type="text"
                className="w-full bg-black border border-white/20 rounded-md py-3 px-4 text-xl font-mono uppercase tracking-wider focus:border-[#00ff00] focus:outline-none"
                placeholder="AAA..."
                value={word}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Botones de acción */}
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleRandomWord}
                disabled={isGenerating}
                className="px-6 py-3 bg-[#00ff00] text-black font-mono uppercase tracking-wider disabled:opacity-50 hover:brightness-110 transition-all duration-300"
              >
                {isGenerating ? 'GENERANDO...' : 'PALABRA ALEATORIA'}
              </button>
              
              <button
                disabled={!word}
                onClick={handleExport}
                className="px-6 py-3 bg-white/10 border border-white/20 text-white font-mono uppercase tracking-wider disabled:opacity-30 hover:bg-white/20 transition-all duration-300"
              >
                EXPORTAR SVG
              </button>
            </div>
            
            {/* Control de longitud */}
            <div className="w-full border-t border-white/10 pt-4">
              <label className="block mb-2 text-sm font-mono text-white/60">LONGITUD MÁXIMA DE PALABRA</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="2"
                  max="10"
                  className="w-full accent-[#00ff00]"
                  value={maxLength}
                  onChange={handleLengthChange}
                />
                <span className="font-druk text-xl text-white">{maxLength}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
