'use client';

import { useState } from 'react';

export default function FontTestPage() {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="text-4xl text-white mb-8">Prueba de Tipografías</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-2xl text-white mb-4">Usando clases de Tailwind</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl text-white mb-2">font-druk</h3>
              <p className="font-druk text-white text-2xl">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p className="font-druk text-white text-lg">1234567890</p>
            </div>
            
            <div>
              <h3 className="text-xl text-white mb-2">font-sans (Geist Mono)</h3>
              <p className="font-sans text-white text-2xl">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p className="font-sans text-white text-lg">abcdefghijklmnopqrstuvwxyz</p>
              <p className="font-sans text-white text-lg">1234567890</p>
            </div>
            
            <div>
              <h3 className="text-xl text-white mb-2">font-mono (Geist Mono)</h3>
              <p className="font-mono text-white text-2xl">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p className="font-mono text-white text-lg">abcdefghijklmnopqrstuvwxyz</p>
              <p className="font-mono text-white text-lg">1234567890</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-2xl text-white mb-4">Usando variables CSS directamente</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl text-white mb-2">var(--font-druk-text-wide)</h3>
              <p className="text-white text-2xl" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p className="text-white text-lg" style={{ fontFamily: 'var(--font-druk-text-wide)' }}>1234567890</p>
            </div>
            
            <div>
              <h3 className="text-xl text-white mb-2">var(--font-geist-mono) - Igual que font-mono</h3>
              <p className="text-white text-2xl" style={{ fontFamily: 'var(--font-geist-mono)' }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p className="text-white text-lg" style={{ fontFamily: 'var(--font-geist-mono)' }}>abcdefghijklmnopqrstuvwxyz</p>
              <p className="text-white text-lg" style={{ fontFamily: 'var(--font-geist-mono)' }}>1234567890</p>
            </div>
            
            <div>
              <h3 className="text-xl text-white mb-2">var(--font-sans)</h3>
              <p className="text-white text-2xl" style={{ fontFamily: 'var(--font-sans)' }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p className="text-white text-lg" style={{ fontFamily: 'var(--font-sans)' }}>abcdefghijklmnopqrstuvwxyz</p>
              <p className="text-white text-lg" style={{ fontFamily: 'var(--font-sans)' }}>1234567890</p>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        className="mt-8 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'Ocultar detalles' : 'Mostrar detalles técnicos'}
      </button>
      
      {showDetails && (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl text-white mb-4">Detalles Técnicos</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl text-white mb-2">Variables CSS en :root</h3>
              <pre className="bg-black p-4 rounded text-green-400 overflow-x-auto">
                {`--font-sans: var(--font-inter), system-ui, sans-serif;
--font-mono: var(--font-geist-mono), monospace;
--font-display: var(--font-druk-text-wide), sans-serif;`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-xl text-white mb-2">Configuración de Tailwind</h3>
              <pre className="bg-black p-4 rounded text-green-400 overflow-x-auto">
                {`fontFamily: {
  'druk': ['var(--font-druk-text-wide)', 'sans-serif'],
  sans: ['var(--font-geist-mono)', 'monospace'],
  mono: ['var(--font-geist-mono)', 'monospace'],
  display: ['var(--font-druk-text-wide)', 'sans-serif'],
}`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-xl text-white mb-2">Clases en el body</h3>
              <pre className="bg-black p-4 rounded text-green-400 overflow-x-auto">
                {`<body class="antialiased ${typeof window !== 'undefined' ? document.body.className : ''}">...</body>`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
