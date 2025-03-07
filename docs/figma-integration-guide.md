# Guía de Integración de Figma con MCP

Hemos configurado un servidor MCP (Model Context Protocol) para Figma que te permite acceder directamente a tus diseños de Figma desde herramientas de IA como Cline y Claude Desktop. Esto facilita la implementación precisa de los diseños en tu código.

## ¿Qué es el servidor MCP de Figma?

El servidor MCP de Figma proporciona una interfaz entre tus herramientas de IA y la API de Figma, permitiendo:

- Obtener información detallada sobre diseños en Figma
- Traducir elementos visuales a código de manera más precisa
- Descargar imágenes y SVGs desde Figma para su uso en tu proyecto

## Herramientas disponibles

El servidor proporciona las siguientes herramientas:

### 1. `get_figma_data`

Esta herramienta obtiene información detallada sobre un archivo o nodo específico de Figma.

**Parámetros:**
- `fileKey`: La clave del archivo Figma (se encuentra en la URL)
- `nodeId`: (Opcional) El ID del nodo específico si quieres enfocarte en un elemento particular
- `depth`: (Opcional) La profundidad de niveles a explorar en el árbol de nodos

### 2. `download_figma_images`

Esta herramienta descarga imágenes SVG y PNG utilizadas en un archivo de Figma basándose en los IDs de nodos de imágenes o iconos.

**Parámetros:**
- `fileKey`: La clave del archivo Figma
- `nodes`: Array de objetos con:
  - `nodeId`: El ID del nodo de imagen a descargar
  - `imageRef`: (Si es necesario) Referencia de imagen si el nodo tiene un relleno de imagen
  - `fileName`: El nombre para guardar el archivo descargado
- `localPath`: La ruta absoluta donde se guardarán las imágenes

## Cómo usar el servidor MCP de Figma en tu proyecto

### Obtener la clave de un archivo Figma

La clave de un archivo Figma se encuentra en la URL cuando lo abres:
```
https://www.figma.com/file/CLAVE_DEL_ARCHIVO/Nombre-Del-Archivo
```

### Obtener el ID de un nodo específico

Para obtener el ID de un elemento específico:
1. Selecciona el elemento en Figma
2. Presiona CMD+L o usa el menú contextual para "Copy link to selection"
3. El enlace tendrá un parámetro `node-id` que necesitarás

### Ejemplos de uso para tu proyecto

#### Ejemplo 1: Implementar un componente de la pantalla de servicios

1. Comparte el enlace al frame o componente en Figma con Cline
2. Pide la implementación: "Implementa este componente de servicio en React y Tailwind CSS basándote en este diseño de Figma"

#### Ejemplo 2: Extraer iconos SVG del sistema de banderas

```
// Usando Cline o Claude Desktop
Necesito extraer los iconos SVG de banderas del archivo Figma (enlace) para usarlos en el componente FlagSystem.tsx
```

#### Ejemplo 3: Hacer que un componente sea pixel-perfect según el diseño

```
// Usando Cline o Claude Desktop
Compara este componente implementado (ClassicDisplay.tsx) con su diseño en Figma (enlace) y ajusta el código para que sea pixel-perfect
```

## Recomendaciones para un uso eficiente

1. **Proporciona enlaces específicos**: Siempre que sea posible, enlaza a frames o componentes específicos en lugar de archivos completos
2. **Sé específico con tus solicitudes**: Especifica el framework y los estilos que estás utilizando (Next.js, Tailwind, etc.)
3. **Proporciona contexto adicional**: Menciona cómo se integrará el componente en la estructura existente

## Solución de problemas

Si encuentras problemas con la integración de Figma:

1. Asegúrate de que el token de API de Figma está activo y tiene permisos adecuados
2. Verifica que los enlaces a Figma son correctos y accesibles
3. Si Cline o Claude no reconocen un comando de Figma, asegúrate de que el servidor MCP está conectado correctamente

## Recursos adicionales

- [Documentación oficial de la API de Figma](https://www.figma.com/developers/api)
- [Repositorio de Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP)
- [MCP (Model Context Protocol)](https://modelcontextprotocol.io/introduction)
