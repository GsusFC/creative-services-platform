// Interfaz simple para el CMS que no depende del field mapper directamente
export interface MappingResult {
  source: string;
  target: string;
  value: any;
}

// Función independiente para servir datos al CMS
export function getFinalMappings(): MappingResult[] {
  try {
    // Si el field mapper está desactivado, usar datos estáticos/por defecto
    return [
      { source: 'project_name', target: 'title', value: 'Ejemplo de Caso de Estudio' },
      { source: 'description', target: 'content', value: 'Descripción de ejemplo' }
      // Otros mapeos predeterminados...
    ];
  } catch (error) {
    console.error('Error al obtener mapeos:', error);
    return []; // Valor por defecto seguro en caso de error
  }
}