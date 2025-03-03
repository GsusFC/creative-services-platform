# Guía: Integración entre Notion y CMS

## Introducción

Este documento explica cómo funciona la integración entre Notion y el CMS de Case Studies, y cómo solucionar problemas comunes.

## Arquitectura

La integración entre Notion y el CMS sigue una arquitectura desacoplada:

1. **Capa de Feature Flags**: `src/config/features.ts` controla qué partes de la integración están activas
2. **Adaptador de Notion**: `src/lib/cms/notion-adapter.ts` proporciona una capa de abstracción entre Notion y el CMS
3. **Layouts de seguridad**: `src/app/admin/notion-importer/layout.tsx` redirecciona a usuarios si la funcionalidad está desactivada

## Características disponibles

La integración proporciona las siguientes funcionalidades:

- **Importador de proyectos**: Permite importar proyectos desde una base de datos de Notion
- **Conversor a Case Studies**: Convierte proyectos de Notion a Case Studies
- **Programador de sincronización**: Permite programar importaciones automáticas
- **Gestor de conflictos**: Gestiona conflictos entre datos de Notion y Case Studies existentes

## Scripts de configuración

El proyecto incluye scripts para habilitar o deshabilitar la integración con Notion:

- **Habilitar**: `node scripts/enable-notion-integration.js`
- **Deshabilitar**: `node scripts/disable-notion-integration.js`

Estos scripts modifican los feature flags en `src/config/features.ts` para activar o desactivar las funcionalidades.

## Modo sin dependencia de Notion

Si la integración con Notion está desactivada, el CMS sigue funcionando gracias al adaptador:

- El adaptador proporciona datos de prueba para desarrollo
- Las características dependientes de Notion se ocultan automáticamente
- Las rutas protegidas redirigen a páginas de "no disponible"

## Solución de problemas

### Error en importación

Si ocurre un "error inesperado" durante la importación:

1. Verificar que el JSON recibido de Notion es válido con el adaptador de tipos
2. Consultar los logs de la consola para mensajes específicos
3. Ejecutar `node scripts/disable-notion-integration.js` para deshabilitar temporalmente
4. Usar los datos de prueba mientras se resuelve el problema

### Errores de infinite loop/maximum update depth exceeded

Estos errores suelen estar relacionados con:

1. Peticiones circulares en los componentes
2. Estados que se actualizan continuamente sin condición de parada
3. Dependencias faltantes en useEffect

La solución recomendada:

1. Deshabilitar temporalmente la integración con Notion
2. Verificar los useEffect en los componentes relevantes
3. Asegurarse de que las funciones de actualización de estado estén envueltas en useCallback

## Trabajar sin Notion

Si quieres concentrarte solo en el CMS:

1. Ejecuta `node scripts/disable-notion-integration.js`
2. Trabaja con los datos de prueba proporcionados por el adaptador
3. Cuando necesites volver a la integración, ejecuta `node scripts/enable-notion-integration.js`

## Extender el adaptador

Para añadir nuevos campos o funcionalidades:

1. Actualiza los tipos en `src/lib/cms/notion-adapter.ts`
2. Añade las funciones de ayuda necesarias para filtrado/conversión
3. Actualiza la función `convertToCaseStudy` según sea necesario

## Buenas prácticas

- Siempre usa el adaptador para acceder a datos de Notion, nunca directamente
- Verifica si las características están habilitadas con `isNotionEnabled()`
- Proporciona valores por defecto para casos donde la integración esté deshabilitada
- Usa type guards para manejar los diferentes tipos de propiedades de Notion
