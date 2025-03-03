#!/bin/bash

# Script unificado para generar la estructura del proyecto
# Incluye mecanismo de bloqueo para evitar ejecuciones simultáneas

# Directorio raíz del proyecto
PROJECT_ROOT="/Users/gsus/CascadeProjects/creative-services-platform"

# Archivo de bloqueo
LOCK_FILE="$PROJECT_ROOT/.structure_update.lock"

# Archivo de salida donde se guardará la estructura
OUTPUT_FILE="$PROJECT_ROOT/project-structure.md"
JSON_OUTPUT="$PROJECT_ROOT/project-structure.json"

# Función para limpiar el archivo de bloqueo en caso de interrupción
cleanup() {
    echo "Limpiando archivo de bloqueo..."
    rm -f "$LOCK_FILE"
    exit 1
}

# Capturar señales de interrupción para limpiar el archivo de bloqueo
trap cleanup SIGHUP SIGINT SIGTERM

# Verificar si ya hay una instancia en ejecución
if [ -f "$LOCK_FILE" ]; then
    # Verificar si el proceso sigue en ejecución
    if ps -p $(cat "$LOCK_FILE") > /dev/null 2>&1; then
        echo "Ya hay una instancia del script en ejecución (PID: $(cat "$LOCK_FILE"))"
        exit 0
    else
        echo "Archivo de bloqueo encontrado pero el proceso no está en ejecución. Limpiando..."
        rm -f "$LOCK_FILE"
    fi
fi

# Crear archivo de bloqueo con el PID actual
echo $$ > "$LOCK_FILE"

# Crear el archivo de salida con un encabezado
echo "# Estructura del Proyecto Creative Services Platform" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "Última actualización: $(date)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"

# Generar la estructura de directorios excluyendo node_modules, .git, etc.
find "$PROJECT_ROOT" -type d -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/build/*" -not -path "*/.next/*" | sort | sed -e "s|$PROJECT_ROOT||" -e 's|[^/]*/|  |g' >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "## Archivos principales:" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Listar archivos importantes (puedes personalizar esta lista)
find "$PROJECT_ROOT/src" -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | sort | sed -e "s|$PROJECT_ROOT||" >> "$OUTPUT_FILE"

echo "\`\`\`" >> "$OUTPUT_FILE"

echo "Estructura de archivos actualizada en $OUTPUT_FILE"

# Generar un archivo JSON con la estructura para herramientas automáticas
echo "{" > "$JSON_OUTPUT"
echo "  \"lastUpdated\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"," >> "$JSON_OUTPUT"
echo "  \"directories\": [" >> "$JSON_OUTPUT"

# Generar lista de directorios en formato JSON
find "$PROJECT_ROOT" -type d -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/build/*" -not -path "*/.next/*" | sort | sed -e "s|$PROJECT_ROOT||" | awk 'NF' | sed 's/^/    "/' | sed 's/$/",/' | sed '$ s/,$//' >> "$JSON_OUTPUT"

echo "  ]," >> "$JSON_OUTPUT"
echo "  \"files\": [" >> "$JSON_OUTPUT"

# Generar lista de archivos en formato JSON
find "$PROJECT_ROOT/src" -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | sort | sed -e "s|$PROJECT_ROOT||" | awk 'NF' | sed 's/^/    "/' | sed 's/$/",/' | sed '$ s/,$//' >> "$JSON_OUTPUT"

echo "  ]" >> "$JSON_OUTPUT"
echo "}" >> "$JSON_OUTPUT"

echo "Estructura JSON actualizada en $JSON_OUTPUT"

# Eliminar el archivo de bloqueo
rm -f "$LOCK_FILE"
