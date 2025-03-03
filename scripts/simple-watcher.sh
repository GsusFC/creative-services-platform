#!/bin/bash

# Script simple para monitorear cambios en el sistema de archivos
# Este script debe ejecutarse en segundo plano

# Directorio raíz del proyecto
PROJECT_ROOT="/Users/gsus/CascadeProjects/creative-services-platform"

# Ruta al script de actualización
UPDATE_SCRIPT="$PROJECT_ROOT/.scripts/update_structure_safe.sh"

# Archivo para almacenar el hash del último estado
HASH_FILE="$PROJECT_ROOT/.file_structure_hash"

echo "Iniciando monitoreo simple de archivos en $PROJECT_ROOT..."
echo "Este script se ejecutará cada 30 segundos."
echo "Presiona Ctrl+C para detener."

# Función para calcular el hash del estado actual de los archivos
calculate_hash() {
    find "$PROJECT_ROOT" -type f -not -path "*/node_modules/*" -not -path "*/.git/*" \
        -not -path "*/dist/*" -not -path "*/build/*" -not -path "*/.next/*" \
        -not -path "*/.file_structure_hash" | sort | xargs ls -la | md5
}

# Ejecutar el script de actualización inicialmente
"$UPDATE_SCRIPT"

# Guardar el hash inicial
calculate_hash > "$HASH_FILE"

# Bucle infinito para monitorear cambios
while true; do
    # Esperar 30 segundos
    sleep 30
    
    # Calcular el hash actual
    CURRENT_HASH=$(calculate_hash)
    
    # Obtener el hash anterior
    PREVIOUS_HASH=$(cat "$HASH_FILE")
    
    # Comparar los hashes
    if [ "$CURRENT_HASH" != "$PREVIOUS_HASH" ]; then
        echo "Detectados cambios en la estructura de archivos. Actualizando..."
        "$UPDATE_SCRIPT"
        echo "$CURRENT_HASH" > "$HASH_FILE"
    fi
done
