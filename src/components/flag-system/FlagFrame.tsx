'use client';

import React, { useState } from 'react';
import { useFlagGenerator } from '@/hooks/useFlagGenerator';
import { letterToFlag } from '@/lib/flag-system/flagMap';

// Versión simplificada del sistema de banderas para usar en Frames
export default function FlagFrame() {
  const [
    { displayWord, backgroundColor },
    { setWord, generateRandomWord, changeBackgroundColor }
  ] = useFlagGenerator();
  
  const [inputValue, setInputValue] = useState('');
  
  // Manejar cambio de entrada de texto
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue) {
      setWord(inputValue);
      setInputValue('');
    }
  };
  
  // Alternar colores de fondo
  const handleToggleBackground = () => {
    const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    changeBackgroundColor(colors[randomIndex]);
  };
  
  // Determinar si hay una palabra para mostrar
  const hasWord = displayWord && displayWord.length > 0;
  
  // Letras para mostrar
  const letters = hasWord ? displayWord.split('').map(letter => letter.toUpperCase()) : [];

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Vista previa de banderas */}
      <div 
        className="aspect-video rounded-lg overflow-hidden mb-4 flex items-center justify-center"
        style={{ backgroundColor }}
      >
        {hasWord ? (
          <div className="flex flex-wrap justify-center gap-1 p-4">
            {letters.map((letter, index) => {
              const flag = letterToFlag(letter);
              if (!flag) return null;
              
              return (
                <div key={index} className="w-16 h-16 sm:w-20 sm:h-20">
                  <img 
                    src={flag.flagPath} 
                    alt={`Bandera para la letra ${letter}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-white/80 p-4">
            <p>Genera o escribe una palabra para ver sus banderas</p>
          </div>
        )}
      </div>
      
      {/* Controles */}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={generateRandomWord}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Generar Palabra
          </button>
          
          <button
            onClick={handleToggleBackground}
            className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Cambiar Fondo
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Escribe una palabra"
            maxLength={6}
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            type="submit"
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Mostrar
          </button>
        </form>
      </div>
      
      {/* Palabra actual */}
      {hasWord && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold tracking-wider">{displayWord}</p>
        </div>
      )}
    </div>
  );
}
