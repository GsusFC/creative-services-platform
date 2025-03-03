/**
 * Field Mapper Types
 * 
 * Definiciones de tipos para el Field Mapper, incluyendo tipos de campos,
 * estructuras de datos y tipos para monitoreo de rendimiento.
 */

// Importamos CompatibilityLevel desde validation.ts
import { CompatibilityLevel } from './validation';

// Tipos de campos de Notion
export type NotionFieldType = 
  | 'title'
  | 'richText'
  | 'number'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'people'
  | 'files'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone_number'
  | 'formula'
  | 'relation'
  | 'rollup'
  | 'created_time'
  | 'created_by'
  | 'last_edited_time'
  | 'last_edited_by'
  | 'status'
  | 'fallback'
  | 'template'
  | 'string'
  | 'text'
  | 'html'
  | 'float'
  | 'integer'
  | 'boolean'
  | 'datetime'
  | 'array'
  | 'tags'
  | 'categories'
  | 'image'
  | 'file'
  | 'gallery'
  | 'phone'
  | 'enum'
  | 'category'
  | 'reference'
  | 'user'
  | 'slug'
  | 'link'
  | 'website'
  | 'decreasing'
  | 'stable'
  | '24h'
  | '7d'
  | '30d'
  | 'all'
  | 'medium'
  | 'high'
  | 'critical'
  | 'validation'
  | 'api'
  | 'cache'
  | 'memory'
  | 'convert'
  | 'extract'
  | 'combine'
  | 'custom'
  | 'lenient'
  | 'none'
  | 'direct'
  | 'simple'
  | 'complex'
  | 'website-to-notion';

// Tipos de campos del sitio web
export type WebsiteFieldType = 
  | 'string'
  | 'text'
  | 'richText'
  | 'html'
  | 'number'
  | 'float'
  | 'integer'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'array'
  | 'tags'
  | 'categories'
  | 'image'
  | 'file'
  | 'gallery'
  | 'url'
  | 'email'
  | 'phone'
  | 'enum'
  | 'category'
  | 'status'
  | 'reference'
  | 'user'
  | 'slug'
  | 'link'
  | 'website'
  | 'decreasing'
  | 'stable'
  | '24h'
  | '7d'
  | '30d'
  | 'all'
  | 'medium'
  | 'high'
  | 'critical'
  | 'validation'
  | 'api'
  | 'cache'
  | 'memory'
  | 'convert'
  | 'extract'
  | 'combine'
  | 'custom'
  | 'lenient'
  | 'none'
  | 'direct'
  | 'simple'
  | 'complex'
  | 'template'
  | 'fallback'
  | 'website-to-notion';

// Definición de un campo de Notion
export interface NotionField {
  id: string;
  name: string;
  type: NotionFieldType;
  options?: string[];
  required?: boolean;
  description?: string;
}

// Definición de un campo del sitio web
export interface WebsiteField {
  id: string;
  name: string;
  type: WebsiteFieldType;
  required?: boolean;
  description?: string;
  defaultValue?: unknown;
}

// Definición de un campo genérico (usado en store?.ts)
export interface Field {
  id: string;
  name: string;
  type: string;
  source: 'notion' | 'website';
  typeDetails?: Record<string, unknown>;
  required?: boolean;
}

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  warning?: string;
  suggestion?: string;
  notionType?: string;
  websiteType?: string;
}

// Definición de un mapping entre campos
export interface FieldMapping {
  id: string;
  notionField: string;
  websiteField: string;
  notionType: string;
  websiteType: string;
  required?: boolean;
  transformation?: {
    type: string;
    options?: Record<string, unknown>;
  };
  validation?: ValidationResult;
}

// Tipos para monitoreo de rendimiento
export interface PerformanceMetrics {
  validationTime: number;
  renderTime: number;
  apiResponseTime: number;
  cacheHitRate: number;
  memoryUsage: number;
  operationsPerSecond: number;
}

export interface PerformanceDataPoint extends PerformanceMetrics {
  timestamp: number;
}

export interface ValidationPerformance {
  totalValidations: number;
  averageTime: number;
  maxTime: number;
  minTime: number;
  cacheHitRate: number;
  errorRate: number;
}

export interface RenderPerformance {
  totalRenders: number;
  averageTime: number;
  maxTime: number;
  minTime: number;
  componentsRendered: number;
}

export interface ApiPerformance {
  totalCalls: number;
  averageTime: number;
  maxTime: number;
  minTime: number;
  errorRate: number;
  timeoutRate: number;
}

export interface CachePerformance {
  size: number;
  hitRate: number;
  missRate: number;
  evictionRate: number;
  averageAccessTime: number;
  oldestEntry: number;
}

export interface MemoryPerformance {
  current: number;
  peak: number;
  average: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

// Tipos para el dashboard
export type PerformanceTimeRange = '1h' | '24h' | '7d' | '30d' | 'all';

export interface PerformanceSummary {
  validation: ValidationPerformance;
  render: RenderPerformance;
  api: ApiPerformance;
  cache: CachePerformance;
  memory: MemoryPerformance;
  history: PerformanceDataPoint[];
}

// Tipos para alertas y problemas
export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Issue {
  id: string;
  severity: IssueSeverity;
  title: string;
  description: string;
  timestamp: number;
  resolved: boolean;
  category: 'performance' | 'validation' | 'api' | 'cache' | 'memory';
  relatedData?: Record<string, unknown>;
}

// Configuración del Field Mapper
export interface FieldMapperConfig {
  cacheEnabled: boolean;
  workerEnabled: boolean;
  virtualizationEnabled: boolean;
  monitoringEnabled: boolean;
  cacheTTL: number;
  cacheMaxSize: number;
  apiTimeout: number;
  validationThrottleMs: number;
  persistCache: boolean;
}

// Estado global del Field Mapper
export interface FieldMapperState {
  notionFields: NotionField[];
  websiteFields: WebsiteField[];
  mappings: FieldMapping[];
  loading: boolean;
  error: string | null;
  lastSaved: number | null;
  performanceData: PerformanceSummary;
  issues: Issue[];
  config: FieldMapperConfig;
}

// Tipos para transformaciones
export interface TransformationTemplate {
  id: string;
  name: string;
  description: string;
  sourceType: NotionFieldType;
  targetType: WebsiteFieldType;
  code: string;
  category: 'format' | 'convert' | 'extract' | 'combine' | 'custom';
  compatibilityLevel?: number; // Nivel de compatibilidad
  isDefault?: boolean; // Si es la transformación predeterminada para este par de tipos
  examples?: Array<{
    input: unknown;
    output: unknown;
    description?: string;
  }>;
  metadata?: Record<string, unknown>;
}

// Tipos para resultados de transformación
export interface TransformationResult {
  success: boolean;
  value: unknown;
  error?: string;
  warnings?: string[];
  executionTime: number;
  inputType: string;
  outputType: string;
  transformationId: string;
}

// Tipos para resultados de pruebas
export interface TestResult {
  id: string;
  mappingId: string;
  timestamp: number;
  success: boolean;
  inputValue: unknown;
  outputValue: unknown;
  error?: string;
  executionTime: number;
  transformationId?: string;
  warnings?: string[];
  metadata?: Record<string, unknown>;
}

// Validation error type
export interface ValidationError {
  websiteField: string;
  notionField: string;
  websiteType: string;
  notionType: string;
  warning: string;
  suggestion?: string;
  compatibilityLevel?: number;
  possibleTransformations?: string[];
}

// Export type for transformation
export interface Transformation {
  type: string;
  options?: Record<string, unknown>;
  templateId?: string; // ID de la plantilla de transformación
  custom?: string; // Código personalizado para transformación
  fallback?: unknown; // Valor predeterminado en caso de error
  validationMode?: 'strict' | 'lenient' | 'none'; // Modo de validación
}

// Tipo para estrategias de transformación
export type TransformationStrategy = 
  | 'direct'        // Mapeo directo sin transformación
  | 'simple'        // Transformación simple (casting)
  | 'complex'       // Transformación compleja (con lógica personalizada)
  | 'template'      // Usar una plantilla predefinida
  | 'custom'        // Usar código personalizado
  | 'fallback';     // Usar valor predeterminado

// Interfaz para el contexto de transformación
export interface TransformationContext {
  sourceField: NotionField | WebsiteField;
  targetField: NotionField | WebsiteField;
  sourceValue: unknown;
  direction: 'notion-to-website' | 'website-to-notion';
  sourceType?: string;
  targetType?: string;
  metadata?: Record<string, unknown>;
}

// Interfaz para el resultado de validación extendido
export interface ValidationResultExtended extends ValidationResult {
  compatibilityLevel?: CompatibilityLevel;
  possibleTransformations?: TransformationTemplate[];
  suggestedStrategy?: TransformationStrategy;
  performanceMetrics?: {
    validationTime: number;
    lastValidated: number;
  };
}

// Tipo para los resultados de pruebas de mapeo
export interface TestResultType {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
  issues?: Array<{field: string, error: string}>;
  usingMockData?: boolean; // Indica si se están usando datos simulados
}
