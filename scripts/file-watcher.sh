#!/bin/bash

# Script para monitorear cambios en el sistema de archivos y actualizar la estructura
# Este script debe ejecutarse en segundo plano

# Directorio raíz del proyecto
PROJECT_ROOT="/Users/gsus/CascadeProjects/creative-services-platform"

# Ruta al script de actualización
UPDATE_SCRIPT="$PROJECT_ROOT/scripts/update-file-structure.sh"

# Verificar si fswatch está instalado
if ! command -v fswatch &> /dev/null; then
    echo "fswatch no está instalado. Por favor, instálalo con: brew install fswatch"
    echo "Si no tienes Homebrew, puedes instalarlo desde: https://brew.sh/"
    exit 1
fi

echo "Iniciando monitoreo de archivos en $PROJECT_ROOT..."
echo "Presiona Ctrl+C para detener."

# Monitorear cambios en el directorio del proyecto
# Excluir directorios que no queremos monitorear
fswatch -e ".*/.git/" -e ".*/node_modules/" -e ".*/dist/" -e ".*/build/" -e "*/.next/" -o "$PROJECT_ROOT" | while read -r line
do
    # Ejecutar el script de actualización
    "$UPDATE_SCRIPT"
    echo "Estructura actualizada debido a cambios en: $line"
done
