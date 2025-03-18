'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/admin/components/ui/card";

export const SystemTools: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/95 border border-white/10 shadow-xl w-full">
      <CardHeader className="pb-4 border-b border-white/5 bg-black/20">
        <CardTitle className="flex items-center gap-3 text-xl text-white">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <span className="text-indigo-400">T</span>
          </div>
          Herramientas del Sistema
        </CardTitle>
        <CardDescription className="text-gray-400">
          Utilidades para desarrollo y diagnóstico
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full">
              <div className="bg-gray-800/30 p-5 rounded-lg border border-gray-700/50">
                <h3 className="text-lg text-white mb-4 font-druk">CLASES DE TAILWIND</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md text-gray-300 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      font-druk
                    </h4>
                    <p className="font-druk text-white text-2xl">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                    <p className="font-druk text-white text-lg">1234567890</p>
                  </div>
                  
                  <div>
                    <h4 className="text-md text-gray-300 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      font-sans (Geist Mono)
                    </h4>
                    <p className="font-sans text-white text-2xl">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                    <p className="font-sans text-white text-lg">abcdefghijklmnopqrstuvwxyz</p>
                    <p className="font-sans text-white text-lg">1234567890</p>
                  </div>
                  
                  <div>
                    <h4 className="text-md text-gray-300 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      font-mono (Geist Mono)
                    </h4>
                    <p className="font-mono text-white text-2xl">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                    <p className="font-mono text-white text-lg">abcdefghijklmnopqrstuvwxyz</p>
                    <p className="font-mono text-white text-lg">1234567890</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/30 p-5 rounded-lg border border-gray-700/50">
                <h3 className="text-lg text-white mb-4 font-druk">VARIABLES CSS</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md text-gray-300 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      var(--font-druk-text-wide)
                    </h4>
                    <p className="text-white text-2xl" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                    <p className="text-white text-lg" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>1234567890</p>
                  </div>
                  
                  <div>
                    <h4 className="text-md text-gray-300 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      var(--font-geist-mono)
                    </h4>
                    <p className="text-white text-2xl" style={{ fontFamily: 'var(--font-geist-mono)' }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                    <p className="text-white text-lg" style={{ fontFamily: 'var(--font-geist-mono)' }}>abcdefghijklmnopqrstuvwxyz</p>
                    <p className="text-white text-lg" style={{ fontFamily: 'var(--font-geist-mono)' }}>1234567890</p>
                  </div>
                  
                  <div>
                    <h4 className="text-md text-gray-300 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      var(--font-sans)
                    </h4>
                    <p className="text-white text-2xl" style={{ fontFamily: 'var(--font-sans)' }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                    <p className="text-white text-lg" style={{ fontFamily: 'var(--font-sans)' }}>abcdefghijklmnopqrstuvwxyz</p>
                    <p className="text-white text-lg" style={{ fontFamily: 'var(--font-sans)' }}>1234567890</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/30 p-5 rounded-lg border border-gray-700/50">
                <h3 className="text-lg text-white mb-4 font-druk">TAMAÑOS DE TEXTO</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md text-gray-300 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      Tamaños de texto (font-druk)
                    </h4>
                    <p className="font-druk text-white text-xs">text-xs</p>
                    <p className="font-druk text-white text-sm">text-sm</p>
                    <p className="font-druk text-white text-base">text-base</p>
                    <p className="font-druk text-white text-lg">text-lg</p>
                    <p className="font-druk text-white text-xl">text-xl</p>
                    <p className="font-druk text-white text-2xl">text-2xl</p>
                    <p className="font-druk text-white text-3xl">text-3xl</p>
                  </div>
                  
                  <div>
                    <h4 className="text-md text-gray-300 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      Tamaños de texto (font-sans)
                    </h4>
                    <p className="font-sans text-white text-xs">text-xs</p>
                    <p className="font-sans text-white text-sm">text-sm</p>
                    <p className="font-sans text-white text-base">text-base</p>
                    <p className="font-sans text-white text-lg">text-lg</p>
                    <p className="font-sans text-white text-xl">text-xl</p>
                    <p className="font-sans text-white text-2xl">text-2xl</p>
                    <p className="font-sans text-white text-3xl">text-3xl</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              className="mt-6 px-4 py-2 bg-indigo-600/70 hover:bg-indigo-500/70 text-white rounded transition-colors flex items-center gap-2 text-sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Ocultar detalles' : 'Mostrar detalles técnicos'}
            </button>
            
            {showDetails && (
              <div className="mt-6 bg-gray-800/50 p-5 rounded-lg border border-gray-700/50">
                <h3 className="text-lg text-white mb-4 font-druk">DETALLES TÉCNICOS</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md text-gray-300 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      Variables CSS en :root
                    </h4>
                    <pre className="bg-black/50 p-4 rounded text-green-400 overflow-x-auto text-sm">
                      {`--font-sans: var(--font-inter), system-ui, sans-serif;
--font-mono: var(--font-geist-mono), monospace;
--font-display: var(--font-druk-text-wide), sans-serif;`}
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="text-md text-gray-300 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      Configuración de Tailwind
                    </h4>
                    <pre className="bg-black/50 p-4 rounded text-green-400 overflow-x-auto text-sm">
                      {`fontFamily: {
  'druk': ['var(--font-druk-text-wide)', 'sans-serif'],
  sans: ['var(--font-geist-mono)', 'monospace'],
  mono: ['var(--font-geist-mono)', 'monospace'],
  display: ['var(--font-druk-text-wide)', 'sans-serif'],
}`}
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="text-md text-gray-300 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      Clases en el body
                    </h4>
                    <pre className="bg-black/50 p-4 rounded text-green-400 overflow-x-auto text-sm">
                      {`<body class="antialiased">...</body>`}
                    </pre>
                  </div>
                </div>
              </div>
            )}
      </CardContent>
    </Card>
  );
};

export default SystemTools;
