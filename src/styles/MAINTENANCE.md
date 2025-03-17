# Guía de Mantenimiento de Estilos CSS

Esta guía proporciona instrucciones para el mantenimiento y extensión de los estilos CSS en el proyecto Creative Services Platform.

## Principios Generales

1. **Mantén la estructura**: Respeta la estructura de directorios y archivos establecida.
2. **Un propósito por archivo**: Cada archivo CSS debe tener un propósito claro y específico.
3. **Comentarios**: Documenta los estilos complejos o no evidentes con comentarios claros.
4. **Consistencia**: Mantén un estilo de código consistente en todos los archivos CSS.

## Añadir Nuevos Estilos

### Para componentes existentes

1. Identifica el archivo apropiado para el componente.
2. Añade los nuevos estilos al final del archivo.
3. Agrupa los estilos relacionados y usa comentarios para separar secciones.

### Para nuevos componentes

1. Si el componente es suficientemente complejo, considera crear un nuevo archivo en el directorio apropiado.
2. Nombra el archivo de manera descriptiva, usando kebab-case (ej. `new-component.css`).
3. Añade la importación del nuevo archivo a `main.css` en la sección correspondiente.

```css
/* En main.css */
/* Importaciones de componentes */
@import "./components/buttons.css";
@import "./components/forms.css";
@import "./components/range-slider.css";
@import "./components/new-component.css"; /* Nueva importación */
```

## Modificar Estilos Existentes

1. Localiza el archivo que contiene los estilos a modificar.
2. Haz los cambios necesarios, manteniendo la estructura y el propósito del archivo.
3. Si los cambios son significativos, añade comentarios explicando la razón.

## Eliminar Estilos

1. Antes de eliminar estilos, verifica que no se estén utilizando en ninguna parte de la aplicación.
2. Elimina los estilos completos, incluyendo comentarios relacionados.
3. Si eliminas un archivo completo, asegúrate de eliminar también su importación en `main.css`.

## Buenas Prácticas

### Uso de Tailwind CSS

1. Utiliza las clases de utilidad de Tailwind CSS siempre que sea posible.
2. Usa `@apply` para crear componentes reutilizables basados en utilidades de Tailwind.
3. Mantén las capas de Tailwind (`@layer`) para organizar los estilos.

### Organización de Código

1. Agrupa los estilos relacionados juntos.
2. Usa comentarios para separar secciones dentro de un archivo.
3. Mantén un orden lógico en las propiedades CSS (ej. posicionamiento, dimensiones, tipografía, colores).

### Rendimiento

1. Evita selectores excesivamente anidados o complejos.
2. Considera el uso de `will-change` y otras optimizaciones solo cuando sea necesario.
3. Minimiza el uso de `!important` y otras técnicas que puedan dificultar el mantenimiento.

## Resolución de Problemas

Si encuentras problemas con los estilos:

1. Verifica que el archivo esté correctamente importado en `main.css`.
2. Comprueba si hay conflictos con otros estilos (especialmente con Tailwind CSS).
3. Usa las herramientas de desarrollo del navegador para inspeccionar los estilos aplicados.
4. Considera el uso de clases más específicas o selectores con mayor especificidad si es necesario.

## Actualizaciones Futuras

Para futuras actualizaciones o refactorizaciones:

1. Considera la posibilidad de implementar CSS Modules o Styled Components para una mejor encapsulación.
2. Evalúa la posibilidad de cargar estilos de manera condicional para mejorar el rendimiento.
3. Mantén actualizado Tailwind CSS y otras dependencias relacionadas con los estilos.
