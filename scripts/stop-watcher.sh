#!/bin/bash

# Script para detener el monitoreo

# Directorio raíz del proyecto
PROJECT_ROOT="/Users/gsus/CascadeProjects/creative-services-platform"

# Archivo PID
PID_FILE="$PROJECT_ROOT/.watcher.pid"

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null; then
        echo "Deteniendo el monitoreo (PID: $PID)..."
        kill "$PID"
        rm "$PID_FILE"
        echo "Monitoreo detenido."
    else
        echo "El proceso de monitoreo no está en ejecución."
        rm "$PID_FILE"
    fi
else
    echo "No se encontró un proceso de monitoreo en ejecución."
fi
