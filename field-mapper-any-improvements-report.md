# Informe de mejora de tipos any en el Field Mapper

## Resumen
- Archivos modificados: 6
- Total de cambios: 133

## Detalles por tipo de reemplazo
- any[] → unknown[]: 2 reemplazos
- as any → tipo específico: 5 reemplazos
- (...args: any[]) → (...args: Parameters<T>): 2 reemplazos
- (result: any) → (result: TransformationResult): 1 reemplazos
- (performance as any).memory → performance as { memory: { usedJSHeapSize: number } }: 3 reemplazos
- Record<string, any> → Record<string, unknown>: 10 reemplazos
- useState<any → useState<unknown: 1 reemplazos
- (option: any) → (option: { name: string; id?: string; color?: string }): 3 reemplazos
- (group: any) → (group: { name: string; id?: string; color?: string }): 1 reemplazos
- : any → tipos específicos: 1 reemplazos
- (t: any) → (t: { plain_text: string }): 2 reemplazos
- (s: any) → (s: { name: string }): 1 reemplazos
- (f: any) → (f: { file?: { url: string }; external?: { url: string } }): 1 reemplazos

## Fecha de ejecución
2025-02-26T20:18:49.245Z
