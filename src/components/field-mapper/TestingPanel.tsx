import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { PlayIcon, Loader2Icon, CheckIcon, XIcon } from 'lucide-react';
import { useFieldMapperStore } from '@/lib/field-mapper/store';
import { testMapping } from '@/lib/field-mapper/test-mapping';
import toast from '@/lib/toast';

export default function TestingPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Selector memoizado para evitar recreación
  const mappings = useFieldMapperStore(useCallback(state => state.mappings, []));

  // Probar los mappings con Notion
  const runTest = async () => {
    if (mappings.length === 0) {
      toast({
        status: 'warning',
        title: 'No hay mappings para probar. Crea al menos un mapping primero.'
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setTestResult(null);

    try {
      // Llamar al API real para probar los mappings
      const result = await testMapping(mappings);
      setTestResult(result);
      
      if (result.success) {
        toast({
          status: 'success',
          title: 'Prueba exitosa! Los mappings funcionan correctamente.'
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error al probar los mappings';
      setError(errorMessage);
      toast({
        status: 'error',
        title: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-3">
      <Button
        onClick={runTest}
        disabled={isLoading}
        className="w-full bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-300 border-emerald-900/30"
        style={{ fontFamily: 'var(--font-geist-mono)' }}
      >
        {isLoading ? (
          <>
            <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
            Probando...
          </>
        ) : (
          <>
            <PlayIcon className="h-4 w-4 mr-2" />
            Probar Mappings
          </>
        )}
      </Button>
      
      {error && (
        <div className="p-3 border border-red-900/30 bg-red-950/20 text-red-400 rounded-md">
          <div className="flex items-center gap-2">
            <XIcon className="h-4 w-4 text-red-400" />
            <p className="font-medium text-sm" style={{ fontFamily: 'var(--font-geist-mono)' }}>{error}</p>
          </div>
        </div>
      )}
      
      {testResult && testResult.success && (
        <div className="p-3 border border-green-900/30 bg-green-950/20 text-green-400 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <CheckIcon className="h-4 w-4 text-green-400" />
            <p className="font-medium text-sm" style={{ fontFamily: 'var(--font-geist-mono)' }}>¡Prueba exitosa!</p>
          </div>
          <p className="text-xs text-gray-300 mb-2" style={{ fontFamily: 'var(--font-geist-mono)' }}>Vista previa de datos mapeados:</p>
          <div className="bg-black/40 rounded p-2 max-h-40 overflow-y-auto text-xs text-gray-300 font-mono">
            <pre style={{ fontFamily: 'var(--font-geist-mono)' }}>{JSON.stringify(testResult.data, null, 2)}</pre>
          </div>
        </div>
      )}
      
      {!isLoading && !error && !testResult && (
        <div className="p-3 text-gray-400 text-sm" style={{ fontFamily: 'var(--font-geist-mono)' }}>
          <p>Haz clic en "Probar Mappings" para verificar tus configuraciones con datos reales de Notion.</p>
          <p className="text-xs mt-1 text-gray-500" style={{ fontFamily: 'var(--font-geist-mono)' }}>Esto ayuda a asegurar que los campos estén correctamente mapeados antes de publicar tu contenido.</p>
        </div>
      )}
    </div>
  );
}
