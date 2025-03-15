'use client';

import { useEffect, useState } from "react";

// Crear nuestro componente directamente aquí para evitar problemas de importación
const FlagFrame = () => {
  const [displayWord, setDisplayWord] = useState('HELLO');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [inputValue, setInputValue] = useState('');
  
  // Manejar cambio de entrada de texto
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue) {
      setDisplayWord(inputValue.toUpperCase());
      setInputValue('');
    }
  };
  
  // Generar palabra aleatoria
  const generateRandomWord = () => {
    const randomWords = ['HELLO', 'WORLD', 'FRAME', 'FLAGS', 'NAVAL', 'OCEAN'];
    const randomIndex = Math.floor(Math.random() * randomWords.length);
    setDisplayWord(randomWords[randomIndex]);
  };
  
  // Alternar colores de fondo
  const handleToggleBackground = () => {
    const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    setBackgroundColor(colors[randomIndex]);
  };
  
  // Letras para mostrar
  const letters = displayWord.split('').map(letter => letter.toUpperCase());

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Vista previa de banderas */}
      <div 
        className="aspect-video rounded-lg overflow-hidden mb-4 flex items-center justify-center"
        style={{ backgroundColor }}
      >
        <div className="flex flex-wrap justify-center gap-1 p-4">
          {letters.map((letter, index) => {
            // Determinar la URL completa de la bandera
            const flagPath = `/assets/flags/${letter}-${
              letter === 'A' ? 'ALPHA' :
              letter === 'B' ? 'BRAVO' :
              letter === 'C' ? 'CHARLIE' :
              letter === 'D' ? 'DELTA' :
              letter === 'E' ? 'ECHO' :
              letter === 'F' ? 'FOXTROT' :
              letter === 'G' ? 'GOLF' :
              letter === 'H' ? 'HOTEL' :
              letter === 'I' ? 'INDIA' :
              letter === 'J' ? 'JULIET' :
              letter === 'K' ? 'KILO' :
              letter === 'L' ? 'LIMA' :
              letter === 'M' ? 'MIKE' :
              letter === 'N' ? 'NOVEMBER' :
              letter === 'O' ? 'OSCAR' :
              letter === 'P' ? 'PAPA' :
              letter === 'Q' ? 'QUEBEC' :
              letter === 'R' ? 'ROMEO' :
              letter === 'S' ? 'SIERRA' :
              letter === 'T' ? 'TANGO' :
              letter === 'U' ? 'UNIFORM' :
              letter === 'V' ? 'VICTOR' :
              letter === 'W' ? 'WHISKY' :
              letter === 'X' ? 'XRAY' :
              letter === 'Y' ? 'YANKEE' :
              letter === 'Z' ? 'ZULU' : ''
            }.svg`;
            
            return (
              <div key={index} className="w-16 h-16 sm:w-20 sm:h-20">
                <img 
                  src={flagPath} 
                  alt={`Bandera para la letra ${letter}`}
                  className="w-full h-full object-contain"
                />
              </div>
            );
          })}
        </div>
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
      <div className="mt-4 text-center">
        <p className="text-2xl font-bold tracking-wider">{displayWord}</p>
      </div>
    </div>
  );
};

export default function FramesPage() {
  useEffect(() => {
    // Obtener la URL base para usarla en las meta tags de Frame
    window.location.origin;
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <FlagFrame />
    </main>
  );
}
