#!/bin/bash

# Lista de archivos que necesitan 'use client'
FILES=(
  "./src/components/field-mapper/ActionButtons.tsx"
  "./src/components/field-mapper/FieldList.tsx"
  "./src/components/field-mapper/FieldMapperContainer.tsx"
  "./src/components/field-mapper/Mapping.tsx"
  "./src/components/field-mapper/OptimizationRecommendations.tsx"
  "./src/components/field-mapper/OptimizedMapping.tsx"
  "./src/components/field-mapper/PerformanceCharts.tsx"
  "./src/components/field-mapper/SimpleFieldMapper.tsx"
  "./src/components/field-mapper/TestingPanel.tsx"
  "./src/components/field-mapper/TransformationConfig.tsx"
  "./src/components/field-mapper/VirtualizedMappingList.tsx"
  "./src/components/ui/select.tsx"
)

# Agregar 'use client' a cada archivo
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Procesando $file..."
    # Verificar si el archivo ya tiene 'use client'
    if ! grep -q "^'use client'" "$file"; then
      # Crear archivo temporal
      tmp_file=$(mktemp)
      # Agregar 'use client' al inicio del archivo
      echo "'use client';" > "$tmp_file"
      echo "" >> "$tmp_file"
      cat "$file" >> "$tmp_file"
      # Reemplazar el archivo original
      mv "$tmp_file" "$file"
      echo "  ✅ 'use client' agregado a $file"
    else
      echo "  ⚠️ El archivo ya contiene 'use client'"
    fi
  else
    echo "⚠️ El archivo $file no existe"
  fi
done

echo "Proceso completado"
