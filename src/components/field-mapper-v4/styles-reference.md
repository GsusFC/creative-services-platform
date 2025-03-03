# Guía de Estilo para Field Mapper V4 (Tema Oscuro)

Este documento sirve como referencia de estilos y componentes de la versión 1 del Field Mapper para mantener la consistencia visual durante el desarrollo del Field Mapper V4 con tema oscuro.

## Paleta de Colores

### Fondos
- Fondo principal (contenedor): `bg-gray-950` o `bg-gray-900`
- Fondos de paneles: `bg-gray-900` o `bg-gray-800`
- Fondos de tarjetas/elementos: `bg-gray-800` o `bg-gray-850`
- Fondos para elementos activos/seleccionados: `bg-gray-700`
- Fondos para hover: `hover:bg-gray-700`

### Bordes
- Bordes primarios: `border-gray-800` o `border-gray-700`
- Bordes secundarios/sutiles: `border-gray-700` o `border-gray-600`
- Bordes de divisiones: `border-b border-gray-800`

### Textos
- Texto primario: `text-white` o `text-gray-100`
- Texto secundario: `text-gray-300` o `text-gray-400`
- Texto terciario/muted: `text-gray-400` o `text-gray-500`
- Texto de etiquetas/badge: `text-xs text-gray-300`

### Acentos/Indicadores
- Azul (principal): `text-blue-500`, `bg-blue-600`, `border-blue-500`
- Verde (éxito): `text-green-500`, `bg-green-600`
- Rojo (error): `text-red-500`, `bg-red-600`
- Amarillo (advertencia): `text-yellow-500`, `bg-yellow-600`
- Púrpura (especial): `text-purple-500`, `bg-purple-600`

## Componentes Principales

### Botones
```tsx
// Botón principal
<button className="py-2 px-4 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
  Texto del botón
</button>

// Botón secundario
<button className="py-2 px-4 text-white bg-gray-700 rounded hover:bg-gray-600">
  Texto del botón
</button>

// Botón outline
<button className="py-2 px-4 border border-gray-700 rounded hover:bg-gray-700 text-gray-300">
  Texto del botón
</button>

// Botón pequeño
<button className="h-7 px-2 bg-gray-800 border-gray-700 hover:bg-gray-700 text-xs text-gray-300">
  Texto del botón
</button>
```

### Tarjetas/Paneles
```tsx
// Panel principal
<div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
  <h3 className="mb-3 text-base font-medium text-white">Título del panel</h3>
  <div className="space-y-3">
    {/* Contenido */}
  </div>
</div>

// Tarjeta de elemento
<div className="p-3 bg-gray-900 border border-gray-700 rounded">
  <div className="flex items-center justify-between mb-1">
    <span className="font-medium text-white">Título del elemento</span>
    <span className="px-2 py-1 text-xs text-gray-300 bg-gray-800 rounded-full">
      Etiqueta
    </span>
  </div>
  <div className="text-xs text-gray-400 mb-2">
    Descripción del elemento
  </div>
</div>
```

### Badges/Etiquetas
```tsx
// Badge principal
<span className="px-2 py-1 text-xs text-gray-300 bg-gray-800 rounded-full">
  Etiqueta
</span>

// Badge con variantes
<Badge variant="outline" className="text-xs py-0 h-5 bg-gray-950/60 border-gray-800">
  {text}
</Badge>

// Badge secundario
<Badge variant="secondary" className="ml-1 text-xs py-0 h-5 bg-gray-800 text-gray-300">
  Requerido
</Badge>
```

### Elementos de formulario
```tsx
// Select
<select className="p-2 bg-gray-800 rounded text-white">
  <option value="option1">Opción 1</option>
  <option value="option2">Opción 2</option>
</select>

// Input
<input
  type="text"
  placeholder="Placeholder"
  className="p-2 bg-gray-800 rounded text-white"
/>
```

### Indicadores de estado
```tsx
// Loader/Spinner
<div className="w-12 h-12 border-4 border-t-blue-600 rounded-full animate-spin"></div>

// Mensaje de carga
<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-80">
  <div className="flex flex-col items-center">
    <div className="w-12 h-12 border-4 border-t-blue-600 rounded-full animate-spin"></div>
    <span className="mt-3 text-lg text-white">Cargando...</span>
  </div>
</div>
```

## Layouts

### Layout principal de tres columnas
```tsx
<div className="flex flex-col h-full bg-gray-900 text-gray-100">
  {/* Barra superior */}
  <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800">
    <h1 className="text-xl font-bold text-white">Field Mapper V4</h1>
    <div className="flex space-x-2">
      {/* Acciones */}
    </div>
  </div>

  {/* Contenido principal - Tres columnas */}
  <div className="flex flex-1 overflow-hidden">
    {/* Panel izquierdo */}
    <div className="w-1/3 h-full p-4 overflow-y-auto border-r border-gray-800 bg-gray-900">
      {/* Contenido */}
    </div>
    
    {/* Panel central */}
    <div className="w-1/3 h-full p-4 overflow-y-auto border-r border-gray-800 bg-gray-900">
      {/* Contenido */}
    </div>
    
    {/* Panel derecho */}
    <div className="w-1/3 h-full p-4 overflow-y-auto bg-gray-900">
      {/* Contenido */}
    </div>
  </div>
</div>
```

## Indicadores de compatibilidad

Los indicadores visuales en ConnectionLine y CompatibilityIndicator deben usar los siguientes colores:

- Compatible directo: `text-green-500` o `bg-green-500`
- Requiere transformación: `text-yellow-500` o `bg-yellow-500`
- Incompatible: `text-red-500` o `bg-red-500`

## Iconos

Usar iconos de Lucide con los siguientes estilos:

```tsx
<ImageIcon className="h-4 w-4 text-purple-500" />
<FileTextIcon className="h-4 w-4 text-blue-500" />
<ListIcon className="h-4 w-4 text-green-500" />
<AlertCircle className="h-4 w-4 text-red-500" />
<ArrowRightLeft className="h-4 w-4 text-yellow-500" />
```

## Consistencia de nomenclatura

Mantener el español en toda la interfaz:
- "Conectar" en lugar de "Connect"
- "Guardar mapeo" en lugar de "Save mapping"
- "Campos compatibles" en lugar de "Compatible fields"
- "Requiere transformación" en lugar de "Requires transformation"
