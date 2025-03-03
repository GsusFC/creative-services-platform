import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Field, NotionFieldType, WebsiteFieldType } from '@/lib/field-mapper/types';
import { 
  Type, 
  Calendar, 
  Image, 
  Link, 
  Hash, 
  List, 
  FileText, 
  Tag, 
  Check, 
  Database, 
  AlignLeft,
  FileCode,
  Mail,
  Phone,
  User,
  Clock,
  Bookmark,
  FileImage,
  File,
  Grid,
  ToggleLeft,
  Activity
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CompatibilityLevel, getCompatibilityLevel } from '@/lib/field-mapper/validation';

// Map field types to colors and icons
const typeConfig: Record<string, { icon: React.ReactNode; variant: string; description: string }> = {
  // Notion types
  'title': { 
    icon: <Type className="h-3 w-3 mr-1" />, 
    variant: 'notion',
    description: 'Título principal del elemento en Notion'
  },
  'richText': { 
    icon: <FileText className="h-3 w-3 mr-1" />, 
    variant: 'notion',
    description: 'Texto enriquecido con formato en Notion'
  },
  'date': { 
    icon: <Calendar className="h-3 w-3 mr-1" />, 
    variant: 'notion',
    description: 'Fecha y/o hora en Notion'
  },
  'select': { 
    icon: <Tag className="h-3 w-3 mr-1" />, 
    variant: 'notion',
    description: 'Selector de una opción en Notion'
  },
  'multi_select': { 
    icon: <List className="h-3 w-3 mr-1" />, 
    variant: 'notion',
    description: 'Selector de múltiples opciones en Notion'
  },
  'files': { 
    icon: <Image className="h-3 w-3 mr-1" />, 
    variant: 'notion',
    description: 'Archivos adjuntos en Notion'
  },
  'url': { 
    icon: <Link className="h-3 w-3 mr-1" />, 
    variant: 'notion',
    description: 'URL en Notion'
  },
  'status': { 
    icon: <Activity className="h-3 w-3 mr-1" />, 
    variant: 'notion',
    description: 'Estado en Notion'
  },
  'number': { 
    icon: <Hash className="h-3 w-3 mr-1" />, 
    variant: 'notion',
    description: 'Número en Notion'
  },
  'relation': { 
    icon: <Database className="h-3 w-3 mr-1" />, 
    variant: 'notion',
    description: 'Relación a otra base de datos en Notion'
  },
  'checkbox': { 
    icon: <ToggleLeft className="h-3 w-3 mr-1" />, 
    variant: 'notion',
    description: 'Casilla de verificación en Notion'
  },
  'email': { 
    icon: <Mail className="h-3 w-3 mr-1" />, 
    variant: 'notion',
    description: 'Correo electrónico en Notion'
  },
  'phone_number': { 
    icon: <Phone className="h-3 w-3 mr-1" />, 
    variant: 'notion',
    description: 'Número de teléfono en Notion'
  },
  'created_time': { 
    icon: <Clock className="h-3 w-3 mr-1" />, 
    variant: 'notion',
    description: 'Fecha de creación en Notion'
  },
  'last_edited_time': { 
    icon: <Clock className="h-3 w-3 mr-1" />, 
    variant: 'notion',
    description: 'Fecha de última edición en Notion'
  },
  'created_by': { 
    icon: <User className="h-3 w-3 mr-1" />, 
    variant: 'notion',
    description: 'Usuario que creó el elemento en Notion'
  },
  'last_edited_by': { 
    icon: <User className="h-3 w-3 mr-1" />, 
    variant: 'notion',
    description: 'Usuario que editó por última vez el elemento en Notion'
  },
  
  // Website types
  'string': { 
    icon: <Type className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Cadena de texto simple'
  },
  'text': { 
    icon: <FileText className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Texto de múltiples líneas'
  },
  'richText': { 
    icon: <AlignLeft className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Texto con formato enriquecido'
  },
  'html': { 
    icon: <FileCode className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Contenido HTML'
  },
  'image': { 
    icon: <Image className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Imagen única'
  },
  'gallery': { 
    icon: <Grid className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Galería de imágenes'
  },
  'file': { 
    icon: <File className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Archivo adjunto'
  },
  'slug': { 
    icon: <Bookmark className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Slug para URL amigable'
  },
  'url': { 
    icon: <Link className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'URL o enlace'
  },
  'array': { 
    icon: <List className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Lista de elementos'
  },
  'tags': { 
    icon: <Tag className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Lista de etiquetas'
  },
  'categories': { 
    icon: <Tag className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Lista de categorías'
  },
  'number': { 
    icon: <Hash className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Valor numérico'
  },
  'float': { 
    icon: <Hash className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Número decimal'
  },
  'integer': { 
    icon: <Hash className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Número entero'
  },
  'boolean': { 
    icon: <ToggleLeft className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Valor verdadero/falso'
  },
  'date': { 
    icon: <Calendar className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Fecha'
  },
  'datetime': { 
    icon: <Calendar className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Fecha y hora'
  },
  'email': { 
    icon: <Mail className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Dirección de correo electrónico'
  },
  'phone': { 
    icon: <Phone className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Número de teléfono'
  },
  'user': { 
    icon: <User className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Usuario o autor'
  },
  'reference': { 
    icon: <Database className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Referencia a otro contenido'
  },
  'status': { 
    icon: <Activity className="h-3 w-3 mr-1" />, 
    variant: 'website',
    description: 'Estado o etapa'
  },
  
  // Default
  'default': { 
    icon: <Type className="h-3 w-3 mr-1" />, 
    variant: 'secondary',
    description: 'Tipo de campo desconocido'
  },
};

interface FieldTypeBadgeProps {
  field: Field;
  className?: string;
  compareWith?: Field;
  showCompatibility?: boolean;
}

export function FieldTypeBadge({ 
  field, 
  className = '', 
  compareWith, 
  showCompatibility = false 
}: FieldTypeBadgeProps) {
  const config = typeConfig[field?.type] || typeConfig?.default;
  
  // Determinar el nivel de compatibilidad si se proporciona un campo para comparar
  let compatibilityLevel: CompatibilityLevel | undefined;
  let compatibilityClass = '';
  let compatibilityText = '';
  
  if (showCompatibility && compareWith && (field?.source) !== compareWith?.source) {
    const sourceType = field?.source === 'notion' 
      ? field?.type as NotionFieldType 
      : compareWith?.type as NotionFieldType;
      
    const targetType = field?.source === 'website' 
      ? field?.type as WebsiteFieldType 
      : compareWith?.type as WebsiteFieldType;
    
    compatibilityLevel = getCompatibilityLevel(sourceType, targetType);
    
    // Asignar clase CSS basada en el nivel de compatibilidad
    switch (compatibilityLevel) {
      case CompatibilityLevel?.PERFECT:
        compatibilityClass = 'bg-green-100 border-green-500';
        compatibilityText = 'Compatibilidad perfecta';
        break;
      case CompatibilityLevel?.HIGH:
        compatibilityClass = 'bg-green-50 border-green-300';
        compatibilityText = 'Alta compatibilidad';
        break;
      case CompatibilityLevel?.MEDIUM:
        compatibilityClass = 'bg-yellow-50 border-yellow-300';
        compatibilityText = 'Compatibilidad media';
        break;
      case CompatibilityLevel?.LOW:
        compatibilityClass = 'bg-orange-50 border-orange-300';
        compatibilityText = 'Baja compatibilidad';
        break;
      case CompatibilityLevel?.NONE:
      default:
        compatibilityClass = 'bg-red-50 border-red-300';
        compatibilityText = 'No compatible';
        break;
    }
  }
  
  const badgeVariant = config?.variant === 'notion' 
    ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
    : 'bg-blue-100 text-blue-800 hover:bg-blue-200';
  
  const finalClassName = `${badgeVariant} ${showCompatibility && compatibilityClass} ${className}`;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={finalClassName}
          >
            {config?.icon}
            {field?.type}
            {showCompatibility && compatibilityLevel !== undefined && (
              <span className="ml-1 inline-flex h-2 w-2 rounded-full" style={{
                backgroundColor: 
                  compatibilityLevel === CompatibilityLevel?.PERFECT ? 'rgb(34, 197, 94)' :
                  compatibilityLevel === CompatibilityLevel?.HIGH ? 'rgb(74, 222, 128)' :
                  compatibilityLevel === CompatibilityLevel?.MEDIUM ? 'rgb(234, 179, 8)' :
                  compatibilityLevel === CompatibilityLevel?.LOW ? 'rgb(249, 115, 22)' :
                  'rgb(239, 68, 68)'
              }} />
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-semibold">{field?.type}</p>
            <p className="text-xs text-gray-500">{config?.description}</p>
            {showCompatibility && compatibilityLevel !== undefined && (
              <div className="mt-1 pt-1 border-t border-gray-200">
                <p className="text-xs font-medium">{compatibilityText}</p>
                {compatibilityLevel < CompatibilityLevel?.HIGH && (
                  <p className="text-xs text-gray-500">Puede requerir transformación</p>
                )}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function getFieldTypeIcon(type: string) {
  const config = typeConfig[type] || typeConfig?.default;
  return config?.icon;
}

export function getFieldTypeVariant(type: string) {
  const config = typeConfig[type] || typeConfig?.default;
  return config?.variant;
}

export function getFieldTypeDescription(type: string) {
  const config = typeConfig[type] || typeConfig?.default;
  return config?.description;
}
