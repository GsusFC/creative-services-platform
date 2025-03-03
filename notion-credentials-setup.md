# Configuración de Credenciales de Notion

Para configurar correctamente las credenciales de la API de Notion, sigue estos pasos:

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Asegúrate de que contenga las siguientes variables (reemplaza los valores con tus credenciales reales):

```
# API Key de Notion (obtenida de https://www.notion.so/my-integrations)
NOTION_API_KEY=secret_tu_api_key_aquí

# ID de la base de datos de Notion
NOTION_DATABASE_ID=tu_database_id_aquí
```

## Cómo obtener las credenciales

### Para obtener la API Key:
1. Ve a [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Crea una nueva integración o selecciona una existente
3. Copia el "Internal Integration Token"

### Para obtener el ID de la base de datos:
1. Abre tu base de datos de proyectos en Notion
2. Observa la URL, que tendrá un formato como:
   `https://www.notion.so/workspace/123456789abcdef123456789abcdef12?v=...`
3. El ID de la base de datos es la parte `123456789abcdef123456789abcdef12`

## Compartir la base de datos con la integración
No olvides compartir tu base de datos con la integración:
1. Abre tu base de datos en Notion
2. Haz clic en "Share" en la esquina superior derecha
3. Busca y selecciona el nombre de tu integración

## Después de configurar
Una vez configuradas las credenciales:
1. Guarda el archivo `.env.local`
2. Reinicia el servidor de desarrollo para que los cambios surtan efecto
