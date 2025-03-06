import FeaturedCasesManager from "@/components/admin/FeaturedCasesManager";

/**
 * Página de administración para gestionar los casos destacados
 * Integra el componente FeaturedCasesManager
 */
export default function FeaturedCasesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-druk mb-2">CASOS DESTACADOS</h1>
          <p className="text-gray-400 font-mono">
            Gestiona los casos de estudio que aparecen en la página principal
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <div className="bg-gray-900/30 rounded-lg p-2 mb-6">
            <h2 className="font-druk text-2xl mb-4">INSTRUCCIONES</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-300 font-mono text-sm">
              <li>Solo puedes destacar un máximo de 4 casos de estudio</li>
              <li>El orden en que aparecen en la lista determina su posición en la página principal</li>
              <li>Usa las flechas para reorganizar los casos destacados</li>
              <li>Usa el botón ❌ para quitar un caso de los destacados</li>
              <li>Usa el botón ➕ para añadir un caso a los destacados</li>
              <li>Recuerda guardar los cambios cuando termines</li>
            </ul>
          </div>

          {/* Componente principal para gestionar casos destacados */}
          <FeaturedCasesManager />
          
          <div className="mt-8 text-gray-400 font-mono text-xs">
            <h3 className="font-druk text-gray-300 text-sm mb-2">CONSIDERACIONES:</h3>
            <p>Los cambios realizados en esta página afectarán inmediatamente a la visualización de los casos destacados en la página principal.</p>
            <p className="mt-2">Si no ves tus cambios reflejados, puede ser necesario regenerar la página home o limpiar la caché del navegador.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
