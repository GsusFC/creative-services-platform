'use client'

import { useEffect, useState } from 'react'

export default function FontTest(): React.ReactNode {
  const [fontStatus, setFontStatus] = useState<{
    drukLoaded: boolean;
    geistLoaded: boolean;
    fontList: string[];
  }>({ drukLoaded: false, geistLoaded: false, fontList: [] });

  useEffect(() => {
    // Verificar si las fuentes están cargadas
    const checkFonts = (): void => {
      try {
        // Verificar Druk Text Wide con diferentes pesos
        const drukLoaded800 = document.fonts.check('800 1em "Druk Text Wide"');
        const drukLoaded900 = document.fonts.check('900 1em "Druk Text Wide"');
        const drukLoaded700 = document.fonts.check('700 1em "Druk Text Wide"');
        console.log('Druk Text Wide cargada:', { drukLoaded700, drukLoaded800, drukLoaded900 });
        
        // Verificar Geist Mono con diferentes pesos
        const geistLoaded400 = document.fonts.check('400 1em "Geist Mono"');
        const geistLoaded500 = document.fonts.check('500 1em "Geist Mono"');
        const geistLoaded700 = document.fonts.check('700 1em "Geist Mono"');
        console.log('Geist Mono cargada:', { geistLoaded400, geistLoaded500, geistLoaded700 });
        
        // Listar todas las fuentes cargadas
        const fontList: string[] = [];
        document.fonts.forEach(font => {
          const fontInfo = `${font.family} (${font.weight} ${font.style})`;
          fontList.push(fontInfo);
          console.log(`- ${fontInfo}`);
        });

        // Actualizar el estado
        setFontStatus({
          drukLoaded: drukLoaded800 || drukLoaded900 || drukLoaded700,
          geistLoaded: geistLoaded400 || geistLoaded500 || geistLoaded700,
          fontList
        });
      } catch (error) {
        console.error('Error al verificar fuentes:', error);
      }
    };
    
    // Ejecutar la verificación cuando las fuentes estén listas
    if (document.fonts.ready instanceof Promise) {
      void document.fonts.ready.then(checkFonts);
    } else {
      checkFonts();
    }

    // Ejecutar otra verificación después de un tiempo para asegurarnos
    const timeoutId = setTimeout(checkFonts, 2000);
    return () => clearTimeout(timeoutId);
  }, []);
  
  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-800 rounded-lg my-8">
      <h2 className="mb-6 text-center">Prueba de Tipografías</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="mb-4 text-center">Druk Text Wide</h3>
          <p className="mb-2" style={{ fontFamily: '"Druk Text Wide", sans-serif', fontWeight: 700 }}>PESO 700 (BOLD)</p>
          <p className="mb-2" style={{ fontFamily: '"Druk Text Wide", sans-serif', fontWeight: 800 }}>PESO 800 (HEAVY)</p>
          <p className="mb-2" style={{ fontFamily: '"Druk Text Wide", sans-serif', fontWeight: 900 }}>PESO 900 (SUPER)</p>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="mb-4 text-center">Geist Mono</h3>
          <p className="mb-2" style={{ fontFamily: '"Geist Mono", monospace', fontWeight: 400 }}>Peso 400 (Regular)</p>
          <p className="mb-2" style={{ fontFamily: '"Geist Mono", monospace', fontWeight: 500 }}>Peso 500 (Medium)</p>
          <p className="mb-2" style={{ fontFamily: '"Geist Mono", monospace', fontWeight: 700 }}>Peso 700 (Bold)</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-8">
        <h3 className="mb-4">Elementos HTML con estilos aplicados</h3>
        <h1 className="mb-4 text-2xl">Encabezado H1</h1>
        <h2 className="mb-4 text-xl">Encabezado H2</h2>
        <h3 className="mb-4 text-lg">Encabezado H3</h3>
        <p className="mb-4">Este es un párrafo de prueba que debería usar Geist Mono.</p>
        <code className="mb-4 block p-2 bg-gray-100 dark:bg-gray-800 rounded">Este es código que debería tener estilo especial.</code>
      </div>
      
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h3 className="mb-4">Estado de carga de fuentes</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-bold">Druk Text Wide:</p>
            <p className={fontStatus.drukLoaded ? "text-green-500" : "text-red-500"}>
              {fontStatus.drukLoaded ? "✓ Cargada" : "✗ No cargada"}
            </p>
          </div>
          <div>
            <p className="font-bold">Geist Mono:</p>
            <p className={fontStatus.geistLoaded ? "text-green-500" : "text-red-500"}>
              {fontStatus.geistLoaded ? "✓ Cargada" : "✗ No cargada"}
            </p>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Revisa la consola del navegador para ver información detallada sobre las fuentes cargadas.
        </p>
      </div>
    </div>
  )
}
