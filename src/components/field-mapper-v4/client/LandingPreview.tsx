'use client';

export default function LandingPreview() {
  return (
    <div className="bg-black text-white p-8 rounded-lg border border-gray-800">
      <div className="flex space-x-4 mb-2">
        <div className="h-3 w-3 rounded-full bg-red-500"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4 h-[250px]">
        <div className="bg-gray-900/70 p-3 rounded-md border border-gray-700">
          <div className="font-geist-mono text-sm text-gray-400">Campos de Notion</div>
          <div className="mt-2 space-y-2">
            {[1, 2, 3, 4].map(item => (
              <div key={item} className="bg-gray-800/50 h-6 rounded-sm"></div>
            ))}
          </div>
        </div>
        <div className="col-span-1 bg-gray-900/60 p-3 rounded-md border border-gray-700">
          <div className="font-geist-mono text-sm text-gray-400">Estructura de Case Study</div>
          <div className="mt-2 space-y-3">
            {[1, 2].map(section => (
              <div key={section} className="space-y-2">
                <div className="bg-gray-800/70 h-5 w-3/4 rounded-sm"></div>
                <div className="pl-2 space-y-2">
                  {[1, 2].map(field => (
                    <div key={field} className="flex justify-between items-center">
                      <div className="bg-gray-800/50 h-4 w-1/3 rounded-sm"></div>
                      <div className="bg-purple-900/30 h-4 w-1/2 rounded-sm"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-900/50 p-3 rounded-md border border-gray-700">
          <div className="font-geist-mono text-sm text-gray-400">Resumen</div>
          <div className="mt-3 space-y-2">
            <div className="w-full bg-gray-800/30 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-600 w-2/3 h-full"></div>
            </div>
            <div className="bg-gray-800/50 h-4 rounded-sm"></div>
            <div className="bg-gray-800/50 h-4 rounded-sm"></div>
            <div className="mt-4">
              <div className="bg-green-900/40 h-8 rounded-sm border border-green-800/30"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
