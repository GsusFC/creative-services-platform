#!/bin/bash

# Script para iniciar el monitoreo en segundo plano

# Directorio raíz del proyecto
PROJECT_ROOT="/Users/gsus/CascadeProjects/creative-services-platform"

# Ruta al script de monitoreo
WATCHER_SCRIPT="$PROJECT_ROOT/scripts/simple-watcher.sh"

# Archivo de log
LOG_FILE="$PROJECT_ROOT/watcher.log"

# Verificar si ya hay un proceso en ejecución
PID_FILE="$PROJECT_ROOT/.watcher.pid"

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null; then
        echo "El monitoreo ya está en ejecución (PID: $PID)"
        echo "Para detenerlo, ejecuta: kill $PID"
        exit 0
    else
        echo "El archivo PID existe pero el proceso no está en ejecución. Limpiando..."
        rm "$PID_FILE"
    fi
fi

# Iniciar el script de monitoreo en segundo plano
nohup "$WATCHER_SCRIPT" > "$LOG_FILE" 2>&1 &

# Guardar el PID
echo $! > "$PID_FILE"

echo "Monitoreo iniciado en segundo plano (PID: $!)"
echo "Los logs se guardan en: $LOG_FILE"
echo "Para detener el monitoreo, ejecuta: kill $(cat "$PID_FILE")"
