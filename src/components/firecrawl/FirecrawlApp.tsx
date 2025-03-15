'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import FirecrawlApp from '@mendable/firecrawl-js';
import ReactMarkdown from 'react-markdown';

// Definir interfaces para tipar la respuesta
interface FirecrawlPage {
  markdown?: string;
  [key: string]: unknown;
}

interface FirecrawlResponse {
  pages?: FirecrawlPage[];
  [key: string]: unknown;
}

// Inicializar la API de Firecrawl con la clave proporcionada
const firecrawlClient = new FirecrawlApp({
  apiKey: "fc-678a61193ba7489fa977e6784593507d"
});

// Componente principal
const FirecrawlComponent = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  const resultContainerRef = useRef<HTMLDivElement>(null);

  // Manejar el cambio de URL
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    // Limpiar errores al cambiar la URL
    if (error) setError('');
  };

  // Validar la URL
  const isValidUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (err) {
      return false;
    }
  };

  // Extraer datos de la URL
  const handleExtract = async () => {
    if (!url.trim()) {
      setError('Por favor, introduce una URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Por favor, introduce una URL válida');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      // Implementación simulada para demostración
      // En un entorno real, se usaría la API de Firecrawl
      console.log("Procesando URL:", url);
      
      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generar un markdown de demostración basado en la URL
      const domain = new URL(url).hostname;
      const demoMarkdown = `# Contenido extraído de ${domain}

## Descripción
Esta es una demostración de extracción de contenido desde ${url}.

## Características
- Conversión automática de HTML a Markdown
- Extracción de encabezados y párrafos principales
- Conservación de enlaces y formato básico
- Limpieza de contenido no relevante

## Ejemplo de contenido
Este es un ejemplo de contenido extraído. En un entorno de producción, 
aquí verías el contenido real de la página web procesado y convertido a formato Markdown.

### Enlaces
- [Página principal](${url})
- [Documentación](${url}/docs)
- [Contacto](${url}/contact)

---

*Generado con Firecrawl - ${new Date().toLocaleDateString()}*`;
      
      setResult(demoMarkdown);
      setIsLoading(false);
      
    } catch (err: unknown) {
      console.error('Error al extraer datos:', err);
      const errorMessage = err instanceof Error ? err.message : 'Hubo un problema al procesar la URL';
      setError(`Error: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  // Copiar el resultado al portapapeles
  const handleCopyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result)
        .then(() => {
          setShowCopied(true);
          setTimeout(() => setShowCopied(false), 2000);
        })
        .catch(err => {
          console.error('Error al copiar:', err);
        });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight uppercase"
          style={{ fontFamily: 'var(--font-druk-text-wide)' }}
        >
          EXTRACTOR WEB
        </h1>
        <p 
          className="text-base md:text-lg text-white max-w-2xl"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          INTRODUCE UNA URL PARA EXTRAER SU CONTENIDO EN FORMATO MARKDOWN
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Panel de entrada */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-black border border-white/10 p-6 rounded-lg shadow-2xl"
        >
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-8 h-8 mr-2 text-[#00ff00] bg-[#00ff00]/10 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h2 
              className="text-2xl uppercase text-white mb-0"
              style={{ fontFamily: 'var(--font-druk-text-wide)' }}
            >
              URL
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://ejemplo.com"
                className="w-full p-3 bg-black border border-white/20 text-white rounded-md focus:border-[#00ff00] focus:outline-none transition-colors font-mono"
                disabled={isLoading}
              />
              {error && (
                <p className="text-red-500 mt-2 text-sm" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={handleExtract}
              disabled={isLoading}
              className="w-full py-3 bg-[#00ff00] text-black font-bold rounded-md hover:bg-[#00ff00]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  PROCESANDO...
                </>
              ) : "EXTRAER CONTENIDO"}
            </button>
          </div>
        </motion.div>

        {/* Panel de resultado */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-black border border-white/10 p-6 rounded-lg shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 mr-2 text-[#00ff00] bg-[#00ff00]/10 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 
                className="text-2xl uppercase text-white mb-0"
                style={{ fontFamily: 'var(--font-druk-text-wide)' }}
              >
                MARKDOWN
              </h2>
            </div>
            
            {result && (
              <button
                onClick={handleCopyResult}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors relative"
                title="Copiar al portapapeles"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                
                {showCopied && (
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-black text-xs py-1 px-2 rounded-md">
                    ¡Copiado!
                  </span>
                )}
              </button>
            )}
          </div>

          <div 
            ref={resultContainerRef}
            className="bg-black/50 border border-white/10 rounded-md p-4 h-[400px] overflow-y-auto font-mono text-sm text-white/90 custom-scrollbar"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-white/50">Extrayendo contenido...</div>
              </div>
            ) : result ? (
              <div className="markdown-content">
                <ReactMarkdown>
                  {result}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-white/50">Introduce una URL y haz clic en Extraer para ver el contenido en markdown</div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 0, 0.5);
        }
        
        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3,
        .markdown-content h4,
        .markdown-content h5,
        .markdown-content h6 {
          color: #00ff00;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
        
        .markdown-content p {
          margin-bottom: 1em;
        }
        
        .markdown-content a {
          color: #00ff00;
          text-decoration: underline;
        }
        
        .markdown-content ul,
        .markdown-content ol {
          margin-left: 1.5em;
          margin-bottom: 1em;
        }
        
        .markdown-content code {
          font-family: monospace;
          background-color: rgba(255, 255, 255, 0.1);
          padding: 0.2em 0.4em;
          border-radius: 3px;
        }
        
        .markdown-content pre {
          background-color: rgba(0, 0, 0, 0.3);
          padding: 1em;
          border-radius: 5px;
          overflow-x: auto;
          margin-bottom: 1em;
        }
      `}</style>
    </div>
  );
};

export default FirecrawlComponent;
