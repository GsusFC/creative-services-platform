# Scripts para Monitoreo de Estructura de Archivos

Este directorio contiene scripts para mantener actualizada la estructura de archivos del proyecto, lo que ayuda a Claude a tener una mejor comprensión de la jerarquía de la aplicación.

## Scripts disponibles

### `update-file-structure.sh`
Genera un archivo con la estructura actual del proyecto en formato Markdown y JSON.

### `simple-watcher.sh`
Monitorea cambios en el sistema de archivos y ejecuta `update-file-structure.sh` cuando detecta modificaciones.

### `start-watcher.sh`
Inicia el monitoreo en segundo plano.

### `stop-watcher.sh`
Detiene el monitoreo en segundo plano.

## Uso

1. **Actualización manual de la estructura**:
   ```bash
   ./scripts/update-file-structure.sh
   ```

2. **Iniciar monitoreo automático**:
   ```bash
   ./scripts/start-watcher.sh
   ```

3. **Detener monitoreo automático**:
   ```bash
   ./scripts/stop-watcher.sh
   ```

## Archivos generados

- `project-structure.md`: Estructura del proyecto en formato Markdown.
- `project-structure.json`: Estructura del proyecto en formato JSON.
- `watcher.log`: Registro de actividad del monitoreo.
- `.watcher.pid`: Archivo que almacena el PID del proceso de monitoreo.
- `.file_structure_hash`: Hash del estado actual de los archivos.

## Notas

- El monitoreo se realiza cada 30 segundos para evitar un uso excesivo de recursos.
- Se excluyen directorios como `node_modules`, `.git`, `dist`, `build` y `.next` para evitar actualizaciones innecesarias.
- Para una solución más robusta, considera instalar `fswatch` con `brew install fswatch` y usar el script `file-watcher.sh`.
