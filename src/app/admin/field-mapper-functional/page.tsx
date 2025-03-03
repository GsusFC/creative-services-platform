'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, SaveIcon } from 'lucide-react';
import OptimizedMapping from '@/components/field-mapper/OptimizedMapping';
import { v4 as uuidv4 } from 'uuid';
import { FieldMapping } from '@/lib/field-mapper/types';

// Datos de ejemplo para demostración
const SAMPLE_NOTION_FIELDS = [
  { id: 'n1', name: 'Título', type: 'title' },
  { id: 'n2', name: 'Descripción', type: 'richText' },
  { id: 'n3', name: 'Precio', type: 'number' },
  { id: 'n4', name: 'Categoría', type: 'select' },
  { id: 'n5', name: 'Tags', type: 'multi_select' },
  { id: 'n6', name: 'Fecha', type: 'date' },
  { id: 'n7', name: 'Imagen', type: 'files' }
];

const SAMPLE_WEBSITE_FIELDS = [
  { id: 'w1', name: 'Título', type: 'text' },
  { id: 'w2', name: 'Contenido', type: 'richText' },
  { id: 'w3', name: 'Precio', type: 'number' },
  { id: 'w4', name: 'Categoría', type: 'category' },
  { id: 'w5', name: 'Etiquetas', type: 'tags' },
  { id: 'w6', name: 'Fecha de publicación', type: 'date' },
  { id: 'w7', name: 'Galería', type: 'gallery' }
];

// Crear un mapping de ejemplo
const createEmptyMapping = (): FieldMapping => ({
  id: uuidv4(),
  notionField: '',
  websiteField: '',
  notionType: '',
  websiteType: '',
  type: 'standard',
  validation: undefined
});

export default function FieldMapperFunctional() {
  // Estado para los mappings
  const [mappings, setMappings] = useState<FieldMapping[]>([createEmptyMapping()]);
  const [savedState, setSavedState] = useState<boolean>(false);
  
  // Manejador para actualizar un mapping
  const handleUpdateMapping = (index: number, mapping: FieldMapping) => {
    const newMappings = [...mappings];
    newMappings[index] = mapping;
    setMappings(newMappings);
    setSavedState(false);
  };
  
  // Manejador para eliminar un mapping
  const handleRemoveMapping = (index: number) => {
    const newMappings = [...mappings];
    newMappings.splice(index, 1);
    setMappings(newMappings);
    setSavedState(false);
  };
  
  // Manejador para añadir un nuevo mapping
  const handleAddMapping = () => {
    setMappings([...mappings, createEmptyMapping()]);
    setSavedState(false);
  };
  
  // Simulación de guardado
  const handleSave = () => {
    // Aquí iría la lógica para guardar en la API
    console.log('Guardando mappings:', mappings);
    
    // Simular una operación de guardado
    setTimeout(() => {
      setSavedState(true);
    }, 1000);
  };
  
  return (
    <div className="container py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Field Mapper (Versión Funcional)</CardTitle>
          <CardDescription>
            Mapeo simplificado de campos entre Notion y el sitio web
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium">Mappings ({mappings.length})</h3>
              <p className="text-sm text-gray-500">
                Define cómo se mapean los campos de Notion a los campos del sitio web
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleAddMapping}
                className="flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Añadir Mapping
              </Button>
              
              <Button 
                onClick={handleSave}
                className="flex items-center"
                disabled={savedState}
              >
                <SaveIcon className="h-4 w-4 mr-1" />
                {savedState ? 'Guardado' : 'Guardar'}
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {mappings.map((mapping, index) => (
              <OptimizedMapping
                key={mapping.id}
                mapping={mapping}
                index={index}
                notionFields={SAMPLE_NOTION_FIELDS}
                websiteFields={SAMPLE_WEBSITE_FIELDS}
                onUpdateMapping={handleUpdateMapping}
                onRemoveMapping={handleRemoveMapping}
              />
            ))}
          </div>
          
          {mappings.length === 0 && (
            <div className="text-center py-6 border border-dashed rounded-md">
              <p className="text-gray-500">No hay mappings definidos</p>
              <Button 
                variant="link" 
                onClick={handleAddMapping}
                className="mt-2"
              >
                Añadir mapping
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
