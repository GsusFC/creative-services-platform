import fs from 'fs';
import path from 'path';

// Crear archivo de configuración de features
const featuresConfig = `export const FEATURES = {
  fieldMapper: {
    enabled: false,
    versions: {
      base: false,
      functional: false,
      v2: false,
      v3: false,
      v4: false
    }
  },
  cms: {
    enabled: true,
    caseStudies: true
  }
};`;

// Asegurarse que existe el directorio config
const configDir = path.join(process.cwd(), 'src', 'config');
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

// Escribir el archivo de configuración
fs.writeFileSync(path.join(configDir, 'features.ts'), featuresConfig);

console.log('✅ Configuración de features creada');

// Crear la página not-available
const notAvailableContent = `export default function NotAvailable() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-red-500">Módulo Desactivado</h1>
      <p className="mt-4">Este módulo está temporalmente desactivado para priorizar el desarrollo de Case Studies y CMS.</p>
      <a href="/admin" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded">
        Volver al Panel Principal
      </a>
    </div>
  );
}`;

fs.writeFileSync(path.join(process.cwd(), 'src', 'app', 'admin', 'not-available.tsx'), notAvailableContent);

console.log('✅ Página not-available creada');

// Crear layouts de redirección para cada versión
const createRedirectLayout = (folder, version) => {
  const layoutContent = `import { FEATURES } from '@/config/features';
import { redirect } from 'next/navigation';

export default function FieldMapper${version}Layout({ children }: { children: React.ReactNode }) {
  if (!FEATURES.fieldMapper.enabled || !FEATURES.fieldMapper.versions.${version.toLowerCase()}) {
    redirect('/admin/not-available');
  }
  return <>{children}</>;
}`;

  const layoutPath = path.join(process.cwd(), 'src', 'app', 'admin', folder, 'layout.tsx');
  fs.writeFileSync(layoutPath, layoutContent);
  console.log(`✅ Layout de redirección creado para ${folder}`);
};

// Crear layouts para todas las versiones
createRedirectLayout('field-mapper', 'Base');
createRedirectLayout('field-mapper-functional', 'Functional');
createRedirectLayout('field-mapper-v2', 'V2');
createRedirectLayout('field-mapper-v4', 'V4');

console.log('✅ Todos los layouts de redirección han sido creados');

// Crear el adaptador para el CMS
const adapterContent = `// Interfaz simple para el CMS que no depende del field mapper directamente
export interface MappingResult {
  source: string;
  target: string;
  value: any;
}

// Función independiente para servir datos al CMS
export function getFinalMappings(): MappingResult[] {
  try {
    // Si el field mapper está desactivado, usar datos estáticos/por defecto
    return [
      { source: 'project_name', target: 'title', value: 'Ejemplo de Caso de Estudio' },
      { source: 'description', target: 'content', value: 'Descripción de ejemplo' }
      // Otros mapeos predeterminados...
    ];
  } catch (error) {
    console.error('Error al obtener mapeos:', error);
    return []; // Valor por defecto seguro en caso de error
  }
}`;

const cmsDir = path.join(process.cwd(), 'src', 'lib', 'cms');
if (!fs.existsSync(cmsDir)) {
  fs.mkdirSync(cmsDir, { recursive: true });
}

fs.writeFileSync(path.join(cmsDir, 'field-mapper-adapter.ts'), adapterContent);

console.log('✅ Adaptador para CMS creado');
console.log('✅ Todo listo! Ahora puedes centrarte en el CMS y los Case Studies');
