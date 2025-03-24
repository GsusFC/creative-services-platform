'use client'

import { useEffect, useState } from 'react';

interface MediaItemProps {
  url: Promise<string> | string;
  alt: string;
  type: string;
}

export function MediaItem({ url, alt, type }: MediaItemProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string>('');

  useEffect(() => {
    const resolveUrl = async () => {
      try {
        const finalUrl = url instanceof Promise ? await url : url;
        setResolvedUrl(finalUrl);
      } catch (error) {
        console.error('Error resolviendo URL:', error);
      }
    };

    resolveUrl();
  }, [url]);

  if (type === 'image') {
    return (
      <div className="space-y-2">
        {resolvedUrl && (
          <img 
            src={resolvedUrl} 
            alt={alt || ''} 
            className="w-full"
            onError={(e) => {
              console.error(`Error loading image: ${resolvedUrl}`);
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <p className="text-sm text-gray-600">{alt}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded">
      <p>Video URL: {resolvedUrl}</p>
    </div>
  );
}
