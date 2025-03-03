# Monitoreo de Estructura de Archivos

Este proyecto cuenta con dos soluciones para mantener actualizada la estructura de archivos, lo que ayuda a Claude a tener una mejor comprensión de la jerarquía de la aplicación. Ambas soluciones utilizan un script unificado con mecanismo de bloqueo para evitar conflictos.

## Script Unificado

El script `.scripts/update_structure_safe.sh` es utilizado por ambas soluciones y cuenta con:
- Mecanismo de bloqueo para evitar ejecuciones simultáneas
- Manejo de señales para limpiar correctamente en caso de interrupción
- Generación de archivos Markdown y JSON con la estructura del proyecto

## Solución 1: Agente de Windsurf

Esta solución utiliza las reglas de agente nativas de Windsurf para ejecutar un script cada vez que se crean nuevos archivos.

### Archivos relacionados:
- `.windsurf/agent-rules.md`: Reglas para el agente.
- `.scripts/update_structure_safe.sh`: Script unificado que actualiza la estructura.

### Ventajas:
- Simple y directo.
- No requiere procesos en segundo plano.
- Se integra con Windsurf.

## Solución 2: Monitoreo Continuo

Esta solución utiliza scripts bash para monitorear continuamente los cambios en el sistema de archivos y actualizar la estructura automáticamente.

### Archivos relacionados:
- `.scripts/update_structure_safe.sh`: Script unificado que actualiza la estructura.
- `scripts/simple-watcher.sh`: Script que monitorea cambios.
- `scripts/start-watcher.sh`: Script para iniciar el monitoreo.
- `scripts/stop-watcher.sh`: Script para detener el monitoreo.

### Ventajas:
- Monitoreo continuo sin intervención del usuario.
- Actualización automática cuando se detectan cambios.
- Más robusto para cambios frecuentes.

## Archivos generados

Ambas soluciones generan los siguientes archivos:
- `project-structure.md`: Estructura del proyecto en formato Markdown.
- `project-structure.json`: Estructura del proyecto en formato JSON.

## Uso

### Solución 1 (Agente de Windsurf)
El agente ejecutará automáticamente el script cuando crees nuevos archivos. También puedes ejecutarlo manualmente:
```bash
bash ./.scripts/update_structure_safe.sh
```

### Solución 2 (Monitoreo Continuo)
1. **Iniciar monitoreo**:
   ```bash
   ./scripts/start-watcher.sh
   ```

2. **Detener monitoreo**:
   ```bash
   ./scripts/stop-watcher.sh
   ```

3. **Actualización manual**:
   ```bash
   ./.scripts/update_structure_safe.sh
   ```

## Mecanismo de Bloqueo

El script unificado utiliza un archivo de bloqueo (`.structure_update.lock`) para evitar ejecuciones simultáneas. Si detecta que ya hay una instancia en ejecución, no iniciará una nueva. Esto previene posibles conflictos entre las dos soluciones.
