#!/usr/bin/env node
import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';

type NotionPage = {
  properties: Record<string, NotionProperty>;
};

type NotionProperty = {
  id: string;
  type: string;
  files?: Array<{
    type: 'file' | 'external';
    name?: string;
    file?: { url: string; expiry_time?: string };
    external?: { url: string };
  }>;
};

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

async function main() {
  console.log('Iniciando script...');
  try {
    console.log('🔄 Conectando con Notion...');
    const apiKey = process.env['NEXT_PUBLIC_NOTION_API_KEY'];
    if (!apiKey) throw new Error('API Key no encontrada');
    
    const notion = new Client({ auth: apiKey });
    
    console.log('🔍 Consultando la página de Build en Notion...');
    const page = await notion.pages.retrieve({
      page_id: '137a44dc-3505-8037-a0aa-f3ce17af874d'
    }) as unknown as NotionPage;
    
    if (!('properties' in page)) {
      throw new Error('No se encontraron propiedades en la página');
    }
    
    // Mostrar resumen de propiedades de imagen
    console.log('\n📊 Resumen de propiedades de imagen:\n');
    const imageProperties = Object.entries(page.properties)
      .filter((entry): entry is [string, NotionProperty] => {
        const [_, value] = entry;
        return value && typeof value === 'object' && 'type' in value && value.type === 'files';
      })
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => {
        // Ordenar primero las imágenes especiales (Cover, Hero, Avatar)
        const specialImages = ['Cover', 'Hero Image', 'Avatar'];
        const aIsSpecial = specialImages.includes(a.key);
        const bIsSpecial = specialImages.includes(b.key);
        if (aIsSpecial && !bIsSpecial) return -1;
        if (!aIsSpecial && bIsSpecial) return 1;
        
        // Luego ordenar por número si son Image [N]
        const aMatch = a.key.match(/Image \[(\d+)\]/);
        const bMatch = b.key.match(/Image \[(\d+)\]/);
        const aNum = aMatch?.[1] ? parseInt(aMatch[1], 10) : null;
        const bNum = bMatch?.[1] ? parseInt(bMatch[1], 10) : null;
        if (aNum !== null && bNum !== null) {
          return aNum - bNum;
        }
        return a.key.localeCompare(b.key);
      });

    // Mostrar las propiedades ordenadas
    for (const { key, value } of imageProperties) {
      console.log(`  - ${key}:`);
      if (!value.files || value.files.length === 0) {
        console.log('    ❌ Sin archivos');
      } else {
        value.files.forEach((file) => {
          let name = 'Sin nombre';
          if (file.type === 'file' && file.file?.url) {
            const urlParts = file.file.url.split('/');
            name = urlParts[urlParts.length - 1] || 'Sin nombre';
          } else if (file.type === 'external' && file.external?.url) {
            const urlParts = file.external.url.split('/');
            name = urlParts[urlParts.length - 1] || 'Sin nombre';
          }
          console.log(`    ✅ ${name}`);
        });
      }
    }

    // Analizar propiedades de imagen
    console.log('\n📝 Análisis de propiedades de imagen:');
    
    // Propiedades esperadas
    const expectedProperties = [
      'Avatar',
      'Cover',
      'Hero Image',
      ...Array.from({length: 12}, (_, i) => `Image [${i + 1}]`)
    ];

    // Encontrar todas las propiedades de tipo 'files'
    const fileEntries = Object.entries(page.properties)
      .filter(([_, value]) => value.type === 'files' && Array.isArray(value.files));

    // Agrupar propiedades por nombre base (sin espacios)
    const propertyGroups = fileEntries.reduce<Record<string, Array<{key: string; value: NotionProperty}>>>((groups, [key, value]) => {
      const baseKey = key.trim();
      if (!groups[baseKey]) groups[baseKey] = [];
      groups[baseKey].push({ key, value });
      return groups;
    }, {} as Record<string, { key: string, value: any }[]>);

    // Encontrar propiedades duplicadas
    const duplicateProperties = Object.entries(propertyGroups)
      .filter(([_, group]) => group.length > 1);

    if (duplicateProperties.length > 0) {
      console.log('\n🔄 Propiedades duplicadas:');
      duplicateProperties.forEach(([baseKey, group]) => {
        console.log(`  ${baseKey}:`);
        group.forEach(({ key }) => {
          console.log(`    - "${key}" (${key === baseKey ? 'sin espacios' : 'con espacios'})`);
        });
      });
    }

    // Encontrar propiedades inesperadas
    const unexpectedProperties = Object.keys(propertyGroups)
      .filter(key => 
        !expectedProperties.includes(key) && 
        key.toLowerCase().includes('image')
      );

    if (unexpectedProperties.length > 0) {
      console.log('\n⚠️ Propiedades de imagen inesperadas:');
      unexpectedProperties.forEach(prop => {
        console.log(`  - ${prop}`);
      });
    }

    // Verificar propiedades faltantes
    const missingProperties = expectedProperties.filter(prop => 
      !Object.keys(propertyGroups).includes(prop)
    );

    if (missingProperties.length > 0) {
      console.log('\n❌ Propiedades de imagen faltantes:');
      missingProperties.forEach(prop => {
        console.log(`  - ${prop}`);
      });
    }

    // Verificar propiedades vacías
    const emptyProperties = Object.entries(propertyGroups)
      .filter(([key, group]) => 
        group.every(({ value }) => !value.files || value.files.length === 0) && 
        expectedProperties.includes(key)
      )
      .map(([key]) => key);

    if (emptyProperties.length > 0) {
      console.log('\n⚠️ Propiedades de imagen vacías:');
      emptyProperties.forEach(prop => {
        console.log(`  - ${prop}`);
      });
    }

    // También revisar las propiedades de video
    const videoProperties = ['Video 1', 'Video 2'].map(key => {
      const prop = page.properties[key] as { type: string; url?: string } | undefined;
      return prop?.type === 'url' && prop.url ? prop.url : null;
    });

    console.log('\n🎥 Videos:');
    videoProperties.forEach((url, index) => {
      if (url) {
        console.log(`  - Video ${index + 1}: ${url}`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();
