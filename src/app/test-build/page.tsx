'use client'

import { useEffect, useState } from 'react'
import { getLocalStudyBySlug } from '@/lib/storage/case-studies'
import type { CaseStudy, MediaItem } from '@/types/case-study'

export default function TestBuildPage() {
  const [study, setStudy] = useState<CaseStudy | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getLocalStudyBySlug('build')
        setStudy(data)
      } catch (error) {
        console.error('Error loading study:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])
  if (loading) return <div>Loading...</div>
  if (!study) return <div>Case study not found</div>

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>Test Page for Build Case Study</h1>
      <h2>Basic Info</h2>
      <pre>{JSON.stringify({
        title: study.title,
        client: study.client,
        description: study.description,
        tagline: study.tagline,
        closingClaim: study.closingClaim,
        tags: study.tags,
        status: study.status
      }, null, 2)}</pre>

      <h2>Media Items ({study.mediaItems.length})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {study.mediaItems.map((item: MediaItem, index: number) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <h3>Item {index} - {item.type}</h3>
            <p>Alt: {item.alt}</p>
            <p>URL: {item.url}</p>
            {item.type === 'image' && (
              <div style={{ marginTop: '10px' }}>
                <img 
                  src={item.url} 
                  alt={item.alt} 
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
