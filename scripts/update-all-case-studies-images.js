#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getCaseStudyIds() {
  const caseStudiesDir = path.join(process.cwd(), 'data', 'case-studies');
  const files = await fs.readdir(caseStudiesDir);
  
  return files
    .filter(file => file.endsWith('.json') && !file.endsWith('.bak'))
    .map(file => file.replace('.json', ''));
}

async function updateAllCaseStudies() {
  try {
    const caseStudyIds = await getCaseStudyIds();
    console.log(`Encontrados ${caseStudyIds.length} case studies para actualizar`);

    for (const id of caseStudyIds) {
      console.log(`\nProcesando case study: ${id}`);
      await new Promise((resolve, reject) => {
        exec(`node scripts/update-case-study-image-urls.js ${id}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error procesando ${id}:`, stderr);
          } else {
            console.log(stdout);
          }
          resolve();
        });
      });
    }

    console.log('\nProceso completado para todos los case studies');
  } catch (error) {
    console.error('Error en updateAllCaseStudies:', error);
    process.exit(1);
  }
}

updateAllCaseStudies().catch(console.error);
