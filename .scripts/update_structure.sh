#!/bin/bash

# Script para generar un archivo con la estructura del proyecto
# Se ejecutará automáticamente cuando se creen nuevos archivos

# Directorio raíz del proyecto
PROJECT_ROOT="/Users/gsus/CascadeProjects/creative-services-platform"

# Archivo de salida donde se guardará la estructura
OUTPUT_FILE="$PROJECT_ROOT/project-structure.md"

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

# Opcional: Generar un archivo JSON con la estructura para herramientas automáticas
JSON_OUTPUT="$PROJECT_ROOT/project-structure.json"
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
