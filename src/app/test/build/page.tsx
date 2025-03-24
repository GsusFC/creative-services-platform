import { getCaseStudy } from '@/app/actions/case-studies'
import { MediaItem } from './components/MediaItem'

import { saveBase64Image } from '@/lib/utils/image-utils';

async function getImageUrl(url: string): Promise<string> {
  try {
    // Si la URL es absoluta (http o https), la devolvemos tal cual
    if (url.startsWith('http')) {
      console.log('URL absoluta:', url);
      return url;
    }

    // Si es base64, convertir y guardar
    if (url.startsWith('data:')) {
      console.log('Procesando imagen base64...');
      return await saveBase64Image(url);
    }

    // Si no, asumimos que es una ruta relativa y añadimos la ruta base
    const finalUrl = url.startsWith('/') ? url : `/${url}`;
    console.log('URL relativa:', url, '-> URL final:', finalUrl);
    return finalUrl;
  } catch (error) {
    console.error('Error procesando URL de imagen:', error);
    return url;
  }
}

export default async function BuildPage() {
  const study = await getCaseStudy('137a44dc-3505-8037-a0aa-f3ce17af874d')

  return (
    <div className="p-8">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{study.title}</h1>
        <p className="text-xl mb-2">{study.tagline}</p>
        <p className="text-sm">{study.closingClaim}</p>
      </header>

      {/* Description */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <p className="whitespace-pre-wrap">{study.description}</p>
      </section>

      {/* Tags */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Tags</h2>
        <div className="flex gap-2">
          {study.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-100 rounded">{tag}</span>
          ))}
        </div>
      </section>

      {/* Media Items */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Media Items ({study.mediaItems.length})</h2>
        <div className="grid grid-cols-1 gap-8">
          {study.mediaItems.map((item, index) => {
            console.log(`Rendering media item ${index}:`, item);
            return (
              <div key={index} className="space-y-2">
                <MediaItem 
                  url={getImageUrl(item.url)}
                  alt={item.alt || ''}
                  type={item.type}
                />
              </div>
            );
          })}
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(study.mediaItems, null, 2)}
          </pre>
        </div>
      </section>
    </div>
  )
}
