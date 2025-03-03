# Sistema de Depuración para Field Mapper V3

Este sistema proporciona una infraestructura completa para depurar y diagnosticar problemas en el componente Field Mapper V3, especialmente enfocado en validación, transformaciones y mapeo de campos entre Notion y landing pages.

## Características Principales

- 🔍 **Captura de errores** con diferentes niveles de severidad
- 📊 **Análisis de estado** para detectar inconsistencias en mappings
- 🧪 **Pruebas de validación** para verificar la integridad de datos
- 📝 **Generación de informes** para documentar errores
- 🔄 **Captura de consola** para registrar errores de JavaScript
- 📱 **Panel de depuración interactivo** integrado en la UI

## Componentes del Sistema

### 1. Depurador General (`field-mapper-debugger.ts`)

El componente principal que maneja el registro y gestión de errores:

```typescript
import { useFieldMapperDebugger } from '@/lib/debug';

// Capturar un error
useFieldMapperDebugger().captureError(
  'ComponentName',  // Origen del error
  'Mensaje de error', // Descripción
  'medium',  // Severidad: 'low', 'medium', 'high', 'critical'
  { context: 'datos adicionales' } // Contexto opcional
);

// Generar un informe
const report = useFieldMapperDebugger().generateReport();
```

### 2. Depurador de Validación (`field-mapper-validation-debugger.ts`)

Especializado en detectar problemas específicos de validación:

```typescript
import { useValidationDebugger, analyzeFieldMapperState } from '@/lib/debug';

// Ejecutar todas las pruebas de validación
const results = await useValidationDebugger().runAllTests(stateData);

// Analizar el estado actual
const analysis = analyzeFieldMapperState(stateData);
```

### 3. Panel de Depuración (`FieldMapperDebugPanel.tsx`)

Componente de UI que muestra los errores y proporciona herramientas interactivas:

```typescript
import FieldMapperDebugPanel from '@/components/field-mapper/FieldMapperDebugPanel';
// O usando la ruta relativa:
// import FieldMapperDebugPanel from '../../components/field-mapper/FieldMapperDebugPanel';

// Agregar el panel en cualquier componente (solo visible en desarrollo)
return (
  <>
    <MiComponente />
    {process.env.NODE_ENV !== 'production' && <FieldMapperDebugPanel />}
  </>
);
```

### 4. Configuración de Depuración (`index.ts`)

Configuración centralizada para todo el sistema:

```typescript
import { DEBUG_CONFIG } from '@/lib/debug';

// Modificar la configuración
DEBUG_CONFIG.captureConsole = true;
DEBUG_CONFIG.showDebugPanel = true;
```

## Guía de Uso

### Para Errores Generales

Usa el depurador general para capturar cualquier tipo de error:

```typescript
import { useFieldMapperDebugger } from '@/lib/debug';

try {
  // Código que puede fallar
} catch (error) {
  useFieldMapperDebugger().captureError(
    'MiComponente',
    `Error al ejecutar operación: ${error.message}`,
    'high',
    { error, context: 'operación específica' }
  );
}
```

### Para Problemas de Validación

Utiliza el depurador de validación para problemas de mapeo:

```typescript
import { useValidationDebugger } from '@/lib/debug';

// Analizar un mapping específico
const result = useValidationDebugger().analyzeMapping(
  mapping,
  pageComponents,
  notionComponents
);

if (!result.valid) {
  console.warn('Problemas en mapping:', result.issues);
}
```

### Para Pruebas del Sistema

Puedes usar el script de pruebas para verificar el funcionamiento:

```typescript
import { runDebugSystemTests } from '@/lib/debug/debug-tester';

// Generar datos de prueba y ejecutar validaciones
const { mockState, analysisReport } = runDebugSystemTests();
```

## Niveles de Severidad

- **low**: Información o advertencia menor que no afecta la funcionalidad
- **medium**: Advertencia que podría causar problemas pero no bloquea la operación
- **high**: Error que afecta la funcionalidad pero no rompe la aplicación
- **critical**: Error grave que impide el funcionamiento normal

## Contribuyendo al Sistema de Depuración

Si necesitas añadir nuevas pruebas de validación, edita `field-mapper-validation-debugger.ts` y añade nuevos objetos al array `validationTests`.

Para personalizar el panel de depuración, modifica `FieldMapperDebugPanel.tsx` añadiendo nuevas pestañas o acciones según sea necesario.

## Ejemplos de Uso

### Capturar el Estado Actual

```typescript
import { captureFieldMapperState } from '@/lib/debug';

// Guardar el estado para análisis
captureFieldMapperState('NombreDelContexto', estadoActual);
```

### Ejecutar un Análisis Completo

```typescript
import { analyzeFieldMapperState } from '@/lib/debug';

// Generar un reporte completo del estado actual
const report = analyzeFieldMapperState({
  notionAssets,
  mappings,
  selectedNotionAssetId,
  selectedPageSectionId,
  validationResults,
  pageStructure
});

console.info(report); // Ver resultado en consola
