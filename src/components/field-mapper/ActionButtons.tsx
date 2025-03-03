'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { SaveIcon, DownloadIcon, Loader2Icon } from 'lucide-react';
import { useFieldMapperStore } from '@/lib/field-mapper/store';
import { toast } from 'sonner';

export default function ActionButtons() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Selectores memoizados
  const mappings = useFieldMapperStore(useCallback(state => state.mappings, []));
  const setMappings = useFieldMapperStore(useCallback(state => state.setMappings, []));

  // Guardar los mappings actuales
  const saveCurrentMappings = async () => {
    if (mappings.length === 0) {
      toast.warning('No hay mappings para guardar');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/notion/mappings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mappings }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar los mappings');
      }

      toast.success('Mappings guardados correctamente');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar los mappings');
    } finally {
      setIsSaving(false);
    }
  };

  // Cargar los mappings guardados
  const loadSavedMappings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notion/mappings');
      if (!response.ok) {
        throw new Error('Error al cargar los mappings');
      }

      const data = await response.json();
      if (data.mappings && Array.isArray(data.mappings)) {
        setMappings(data.mappings);
        toast.success(`${data.mappings.length} mappings cargados correctamente`);
      } else {
        toast.info('No se encontraron mappings guardados');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar los mappings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        variant="default"
        className="bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 border-blue-900/30"
        onClick={saveCurrentMappings}
        disabled={isSaving}
        style={{ fontFamily: 'var(--font-geist-mono)' }}
      >
        {isSaving ? (
          <>
            <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <SaveIcon className="h-4 w-4 mr-2" />
            Guardar
          </>
        )}
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        className="border-gray-700 text-gray-300 hover:bg-gray-800/50"
        onClick={loadSavedMappings}
        disabled={isLoading}
        style={{ fontFamily: 'var(--font-geist-mono)' }}
      >
        {isLoading ? (
          <>
            <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
            Cargando...
          </>
        ) : (
          <>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Cargar
          </>
        )}
      </Button>
    </div>
  );
}
