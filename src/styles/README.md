# Estructura de Estilos CSS

Este directorio contiene la estructura organizada de estilos CSS para el proyecto Creative Services Platform.

## Estructura de Archivos

```
styles/
├── base/                  # Estilos base y fundamentales
│   ├── reset.css          # Normalización y estilos base
│   ├── typography.css     # Tipografía y estilos de texto
│   └── variables.css      # Variables CSS y configuración de temas
│
├── components/            # Estilos específicos de componentes
│   ├── buttons.css        # Estilos para botones
│   ├── forms.css          # Estilos para elementos de formulario
│   ├── gradient-card.css  # Estilos para tarjetas con efecto de gradiente
│   └── range-slider.css   # Estilos para input[type='range']
│
├── layout/                # Estilos de layout y estructura
│   ├── admin.css          # Estilos específicos para la página de administración
│   ├── containers.css     # Estilos para contenedores
│   └── grid.css           # Sistema de grid y layout
│
├── utilities/             # Utilidades y helpers
│   ├── animations.css     # Animaciones y transiciones
│   ├── helpers.css        # Clases utilitarias específicas
│   └── scrollbar.css      # Estilos para scrollbar personalizada
│
├── MAINTENANCE.md         # Guía de mantenimiento de estilos CSS
└── main.css               # Archivo principal que importa todos los estilos
```

## Uso

El archivo principal `main.css` importa todos los demás archivos CSS en el orden correcto. Para usar estos estilos en tu aplicación, simplemente importa `main.css` en tu archivo de layout principal:

```javascript
import '../styles/main.css';
```

## Convenciones

1. **Organización**: Los estilos están organizados por funcionalidad y propósito.
2. **Nomenclatura**: Se utiliza kebab-case para los nombres de archivos.
3. **Tailwind**: Se utiliza Tailwind CSS con la directiva `@apply` para estilos reutilizables.
4. **Capas**: Se utilizan las capas de Tailwind (`@layer`) para organizar los estilos.

## Mantenimiento

Al agregar nuevos estilos:

1. Identifica la categoría adecuada para tu estilo (base, componentes, layout, utilidades).
2. Agrega el estilo al archivo correspondiente o crea uno nuevo si es necesario.
3. Si creas un nuevo archivo, asegúrate de importarlo en `main.css`.
4. Documenta cualquier estilo complejo con comentarios.
