# Creative Services Platform - Contexto Técnico

## Stack Tecnológico Básico

### Frontend
- **Framework**: Next.js 13
- **UI Framework**: React 17 con componentes funcionales
- **Styling**: TailwindCSS básico
- **Estado Local**: Zustand para estado sencillo
- **Formularios**: React Hook Form básico
- **UI Componentes**: Componentes propios y algunos de Chakra UI

### Backend
- **Runtime**: Node.js 16 LTS
- **API Routes**: Next.js API Routes básicas
- **Validación**: Yup para validación simple
- **Logging**: Logs estándar en archivos

### Datos
- **ORM**: Prisma básico
- **Base de Datos**: SQLite para desarrollo, PostgreSQL pequeño en producción
- **Almacenamiento**: Sistema de archivos local + carpeta compartida

### Herramientas de Desarrollo
- **Control de versiones**: Git interno
- **Entorno de Desarrollo**: VSCode con configuración básica
- **Testing**: Testing manual y algunos tests básicos
- **Linting**: ESLint con reglas estándar

## Configuración de Desarrollo

### Setup Básico
1. Node.js 16+
2. NPM como gestor de paquetes
3. SQLite local para desarrollo
4. VSCode con extensiones básicas:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense

### Scripts Principales
- `npm run dev`: Entorno de desarrollo
- `npm run build`: Compilación para producción
- `npm run lint`: Verificación de linting
- `npm run test`: Tests básicos

### Variables de Entorno
- `.env.local`: Configuración local
- `.env.production`: Configuración para producción

## Estructura del Proyecto

### Organización de Archivos
```
src/
├── pages/            # Rutas de Next.js
│   ├── api/          # Endpoints de API
│   └── [routes]/     # Páginas de la aplicación
├── components/       # Componentes React
├── lib/              # Funciones utilitarias
│   ├── db/           # Interacción con base de datos
│   └── utils/        # Funciones generales
├── styles/           # Estilos globales
└── types/            # Tipos básicos de TypeScript
```

### Convenciones de Código
- TypeScript básico, con flexibilidad en uso de `any` cuando sea necesario
- Nombres descriptivos para funciones y variables
- Comentarios para secciones complejas
- No estricto en todos los casos para facilitar el desarrollo

### Manejo de Estado
- Estados locales con useState principalmente
- Zustand para estado global sencillo
- Almacenamiento en localStorage para persistencia básica

## Integración con Sistemas Internos

### Conexiones Principales
1. **CMS Interno**: Conector simple para nuestro sistema actual
2. **SharePoint**: Acceso básico para documentos compartidos
3. **Directorio de Archivos**: Acceso a recursos multimedia internos

### Autenticación Simple
- Autenticación básica con credenciales internas
- Sin necesidad de autenticación externa
- Permisos simples por departamento

## Funcionalidades Básicas

### Rendimiento
- Optimización básica para nuestra carga de trabajo interna
- Paginación simple para listas
- Carga estándar de imágenes

### Usabilidad
- Interfaz sencilla y funcional
- Navegación clara entre secciones
- Mensajes informativos para errores comunes

### Salida de Datos
- Exportación a Word y PDF
- Generación de URLs internas compartibles
- Opciones para impresión directa

## Limitaciones Actuales

1. **Capacidad**: Diseñado para nuestro equipo interno (15-20 usuarios)
2. **Conexiones**: Sólo integrado con nuestros sistemas principales
3. **Funcionalidades**: Centrado en tareas específicas de nuestro flujo de trabajo
4. **Rendimiento**: Optimizado para nuestro volumen actual de datos
5. **Mantenimiento**: Soportado por nuestro equipo técnico interno
