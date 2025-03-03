'use client';

import { useEffect, useState } from 'react';

type NotionProperty = {
  id: string;
  type: string;
  title?: Array<{ plain_text: string }>;
  rich_text?: Array<{ plain_text: string }>;
  select?: { name: string };
  multi_select?: Array<{ name: string }>;
  files?: Array<{ file?: { url: string } }>;
  [key: string]: unknown;
};

type NotionItem = {
  id: string;
  properties: {
    [key: string]: NotionProperty;
  };
};

export function NotionData() {
  const [data, setData] = useState<NotionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/notion');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText || 'Failed to fetch data'}`);
        }
        const notionData = await response.json();
        
        if (!Array.isArray(notionData)) {
          throw new Error('Invalid data format received from API');
        }
        
        setData(notionData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-red-500 p-4 rounded-lg bg-red-500/10">
      <h3 className="font-bold mb-2">Error</h3>
      <p>{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
      >
        Intentar nuevamente
      </button>
    </div>
  );

  if (data.length === 0) return (
    <div className="text-white/60 p-4 rounded-lg bg-white/5">
      <p>No hay datos disponibles actualmente.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {data.map((item) => {
        // Extraer datos con validación
        const name = item.properties?.Name?.title?.[0]?.plain_text || 'Untitled';
        const status = item.properties?.Status?.status || item.properties?.Status?.select || {};
        const priority = item.properties?.Priority?.select || {};
        const description = item.properties?.Description?.rich_text?.[0]?.plain_text || '';

        return (
          <div 
            key={item.id}
            className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{name}</h3>
              <div className="flex gap-2">
                {status && 'name' in status && (
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white/80"
                  >
                    {status.name}
                  </span>
                )}
                {priority && 'name' in priority && (
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white/80"
                  >
                    {priority.name}
                  </span>
                )}
              </div>
            </div>
            {description && (
              <p className="text-white/60">{description}</p>
            )}
            <pre className="mt-4 p-4 bg-black/30 rounded text-xs overflow-x-auto">
              {JSON.stringify(item.properties, null, 2)}
            </pre>
          </div>
        );
      })}
    </div>
  );
}
