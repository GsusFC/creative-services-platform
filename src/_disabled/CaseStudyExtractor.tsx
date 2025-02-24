'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ExtractedData {
  company_name?: string;
  description?: string;
  key_features?: string[];
  technologies?: string[];
  website_url?: string;
  visual_style?: {
    colors?: string[];
    typography?: string;
    design_elements?: string[];
  };
}

export default function CaseStudyExtractor() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState('');

  const extractData = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Starting extraction with API key:', process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY);
      
      // First, get the extraction job ID
      const extractResponse = await fetch('https://api.firecrawl.dev/v1/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY}`
        },
        body: JSON.stringify({
          urls: [url],
          prompt: "Extract information about this company's website design and technology stack.",
          schema: {
            type: "object",
            properties: {
              company_name: { type: "string" },
              description: { type: "string" },
              key_features: { 
                type: "array",
                items: { type: "string" }
              },
              technologies: {
                type: "array",
                items: { type: "string" }
              },
              website_url: { type: "string" },
              visual_style: {
                type: "object",
                properties: {
                  colors: {
                    type: "array",
                    items: { type: "string" }
                  },
                  typography: { type: "string" },
                  design_elements: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            }
          }
        })
      });

      if (!extractResponse.ok) {
        const errorData = await extractResponse.json();
        console.error('Extract API Error:', errorData);
        throw new Error(`Failed to start extraction: ${errorData.message || extractResponse.statusText}`);
      }

      const { id, success } = await extractResponse.json();
      console.log('Extraction job created:', { id, success });

      if (!success || !id) {
        throw new Error('Failed to get extraction job ID');
      }

      // Poll for results
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout
      
      while (attempts < maxAttempts) {
        const checkResponse = await fetch(`https://api.firecrawl.dev/v1/extract/${id}`, {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY}`
          }
        });

        if (!checkResponse.ok) {
          const errorData = await checkResponse.json();
          console.error('Check status API Error:', errorData);
          throw new Error(`Failed to check extraction status: ${errorData.message || checkResponse.statusText}`);
        }

        const result = await checkResponse.json();
        console.log('Check status response:', result);

        if (result.status === 'completed' && result.data) {
          setData(result.data);
          return;
        } else if (result.status === 'failed') {
          throw new Error('Extraction failed: ' + (result.error || 'Unknown error'));
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before next check
      }

      throw new Error('Extraction timed out');
    } catch (err) {
      console.error('Extraction error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="font-druk text-4xl uppercase mb-8">Case Study Extractor</h2>
      
      <div className="mb-8">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
          className="w-full bg-black border border-[rgb(51,51,51)] p-4 font-geist uppercase"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={extractData}
          disabled={loading}
          className={`mt-4 w-full p-4 font-geist uppercase ${
            loading ? 'bg-[rgb(51,51,51)]' : 'bg-[rgb(255,0,0)]'
          }`}
        >
          {loading ? 'Extracting...' : 'Extract Data'}
        </motion.button>
      </div>

      {error && (
        <div className="text-[rgb(255,0,0)] font-geist mb-8">
          {error}
        </div>
      )}

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-geist"
        >
          <h3 className="text-2xl uppercase mb-4">{data.company_name}</h3>
          <p className="mb-4">{data.description}</p>
          
          {data.key_features && data.key_features.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xl uppercase mb-2">Key Features</h4>
              <ul className="list-disc pl-6">
                {data.key_features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {data.technologies && data.technologies.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xl uppercase mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {data.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-[rgb(51,51,51)] px-3 py-1"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.visual_style && (
            <div className="mb-4">
              <h4 className="text-xl uppercase mb-2">Visual Style</h4>
              {data.visual_style.colors && (
                <div className="flex gap-2 mb-2">
                  {data.visual_style.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 border border-[rgb(51,51,51)]"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              )}
              {data.visual_style.typography && (
                <p className="mb-2">Typography: {data.visual_style.typography}</p>
              )}
              {data.visual_style.design_elements && (
                <div>
                  <p className="mb-1">Design Elements:</p>
                  <ul className="list-disc pl-6">
                    {data.visual_style.design_elements.map((element, index) => (
                      <li key={index}>{element}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
