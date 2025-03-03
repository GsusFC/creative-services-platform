# Configuración de Integración con Notion

Para que la integración con Notion funcione correctamente, necesitas configurar las siguientes variables de entorno en un archivo `.env.local` en la raíz del proyecto:

```
# API Key de Notion (obtenida de https://www.notion.so/my-integrations)
NOTION_API_KEY=secret_tu_api_key_aquí

# ID de la base de datos de Notion (el ID que aparece en la URL cuando abres la base de datos)
# Ejemplo: https://www.notion.so/workspace/123456789abcdef123456789abcdef12?v=...
# El ID sería: 123456789abcdef123456789abcdef12
NOTION_DATABASE_ID=tu_database_id_aquí
```

## Pasos para configurar la integración con Notion

1. Crea una integración en Notion:
   - Ve a [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
   - Haz clic en "New integration"
   - Dale un nombre (ej. "Creative Services Platform")
   - Selecciona el workspace donde está tu base de datos
   - En "Capabilities", asegúrate de habilitar "Read content" y "Update content"
   - Haz clic en "Submit" para crear la integración
   - Copia el "Internal Integration Token" (esta será tu NOTION_API_KEY)

2. Comparte tu base de datos con la integración:
   - Abre tu base de datos en Notion
   - Haz clic en "Share" en la esquina superior derecha
   - En el campo de búsqueda, busca el nombre de tu integración
   - Selecciona tu integración para compartir la base de datos con ella

3. Obtén el ID de la base de datos:
   - Abre tu base de datos en Notion
   - Copia el ID de la URL (el formato es: 123456789abcdef123456789abcdef12)

4. Crea un archivo `.env.local` en la raíz del proyecto con las variables de entorno mencionadas anteriormente

5. Reinicia el servidor de desarrollo para que los cambios surtan efecto
