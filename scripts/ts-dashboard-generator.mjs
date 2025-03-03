/**
 * TS-Dashboard-Generator
 * 
 * Genera un dashboard HTML interactivo que muestra el progreso de las correcciones
 * de TypeScript con gráficos, estadísticas y tendencias.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función principal
async function generateDashboard() {
  console.log('📊 Generando dashboard de progreso de TypeScript...');
  
  // Obtener historial de errores (si existe)
  const historyPath = path.join(__dirname, '../ts-errors-history.json');
  let history = [];
  
  if (fs.existsSync(historyPath)) {
    history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  }
  
  // Analizar errores actuales
  const currentStats = analyzeErrors();
  
  // Añadir registro actual al historial
  history.push({
    timestamp: new Date().toISOString(),
    ...currentStats
  });
  
  // Limitar el historial a los últimos 100 registros
  if (history.length > 100) {
    history = history.slice(history.length - 100);
  }
  
  // Guardar historial actualizado
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  
  // Generar el HTML del dashboard
  const dashboardHtml = generateHtml(history, currentStats);
  const dashboardPath = path.join(__dirname, '../ts-progress-dashboard.html');
  fs.writeFileSync(dashboardPath, dashboardHtml);
  
  console.log(`✅ Dashboard generado: ${dashboardPath}`);
  console.log('   Abre este archivo en tu navegador para ver el progreso');
}

// Analizar los errores actuales
function analyzeErrors() {
  try {
    // Intentar compilar para ver si hay errores
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    return {
      totalErrors: 0,
      errorsByFile: {},
      errorsByType: {},
      filesWithErrors: 0
    };
  } catch (error) {
    const output = error.stdout.toString();
    const errorLines = output.split('\n').filter(line => line.includes('error TS'));
    
    // Contadores para diferentes categorías
    const errorsByFile = {};
    const errorsByType = {};
    
    // Analizar cada línea de error
    errorLines.forEach(line => {
      // Ejemplo: src/components/App.tsx(10,5): error TS2322: Type '...' is not assignable to type '...'
      const fileMatch = line.match(/^(.+?)\(\d+,\d+\)/);
      if (!fileMatch) return;
      
      const file = fileMatch[1];
      if (!errorsByFile[file]) errorsByFile[file] = 0;
      errorsByFile[file]++;
      
      // Obtener tipo de error
      const typeMatch = line.match(/error (TS\d+):/);
      if (!typeMatch) return;
      
      const errorType = typeMatch[1];
      if (!errorsByType[errorType]) errorsByType[errorType] = 0;
      errorsByType[errorType]++;
    });
    
    return {
      totalErrors: errorLines.length,
      errorsByFile,
      errorsByType,
      filesWithErrors: Object.keys(errorsByFile).length
    };
  }
}

// Generar HTML para el dashboard
function generateHtml(history, currentStats) {
  // Preparar datos para los gráficos
  const timeLabels = history.map(entry => {
    const date = new Date(entry.timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  });
  
  const errorCounts = history.map(entry => entry.totalErrors);
  const fileCounts = history.map(entry => entry.filesWithErrors);
  
  // Ordenar archivos por cantidad de errores
  const topErrorFiles = Object.entries(currentStats.errorsByFile)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([file, count]) => ({ file: path.basename(file), count }));
  
  // Ordenar tipos de error por frecuencia
  const topErrorTypes = Object.entries(currentStats.errorsByType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([type, count]) => ({ type, count }));
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TypeScript Progress Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f7;
      color: #333;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    header {
      text-align: center;
      margin-bottom: 30px;
    }
    h1 {
      color: #333;
      margin-bottom: 10px;
    }
    .summary {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      gap: 20px;
    }
    .summary-card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      flex: 1;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      text-align: center;
    }
    .summary-card h2 {
      font-size: 36px;
      margin: 10px 0;
    }
    .summary-card p {
      color: #666;
      margin: 0;
    }
    .chart-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }
    .chart-card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .tables {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    th, td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    th {
      background-color: #f8f9fa;
    }
    tr:hover {
      background-color: #f5f5f5;
    }
    .status {
      margin-top: 10px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .trend {
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .trend.positive {
      color: #34c759;
    }
    .trend.negative {
      color: #ff3b30;
    }
    .trend-icon {
      margin-right: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>TypeScript Progress Dashboard</h1>
      <p>Seguimiento en tiempo real del progreso de corrección de errores</p>
    </header>
    
    <div class="summary">
      <div class="summary-card">
        <p>Errores Totales</p>
        <h2>${currentStats.totalErrors}</h2>
        ${history.length > 1 ? `
        <div class="trend ${currentStats.totalErrors <= history[history.length - 2].totalErrors ? 'positive' : 'negative'}">
          <span class="trend-icon">${currentStats.totalErrors <= history[history.length - 2].totalErrors ? '↓' : '↑'}</span>
          <span>${Math.abs(currentStats.totalErrors - history[history.length - 2].totalErrors)} desde última medición</span>
        </div>` : ''}
      </div>
      
      <div class="summary-card">
        <p>Archivos con Errores</p>
        <h2>${currentStats.filesWithErrors}</h2>
        ${history.length > 1 ? `
        <div class="trend ${currentStats.filesWithErrors <= history[history.length - 2].filesWithErrors ? 'positive' : 'negative'}">
          <span class="trend-icon">${currentStats.filesWithErrors <= history[history.length - 2].filesWithErrors ? '↓' : '↑'}</span>
          <span>${Math.abs(currentStats.filesWithErrors - history[history.length - 2].filesWithErrors)} desde última medición</span>
        </div>` : ''}
      </div>
      
      <div class="summary-card">
        <p>Tipos de Errores</p>
        <h2>${Object.keys(currentStats.errorsByType).length}</h2>
      </div>
      
      <div class="summary-card">
        <p>Promedio de Errores por Archivo</p>
        <h2>${currentStats.filesWithErrors > 0 ? (currentStats.totalErrors / currentStats.filesWithErrors).toFixed(1) : 0}</h2>
      </div>
    </div>
    
    <div class="chart-container">
      <div class="chart-card">
        <h3>Tendencia de Errores</h3>
        <canvas id="errorsChart"></canvas>
      </div>
      
      <div class="chart-card">
        <h3>Archivos con Errores</h3>
        <canvas id="filesChart"></canvas>
      </div>
    </div>
    
    <div class="tables">
      <table>
        <thead>
          <tr>
            <th>Archivo</th>
            <th>Errores</th>
          </tr>
        </thead>
        <tbody>
          ${topErrorFiles.map(item => `
          <tr>
            <td>${item.file}</td>
            <td>${item.count}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
      
      <table>
        <thead>
          <tr>
            <th>Tipo de Error</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          ${topErrorTypes.map(item => `
          <tr>
            <td>${item.type}</td>
            <td>${item.count}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="status">
      <p>Generado el ${new Date().toLocaleString()}</p>
    </div>
  </div>
  
  <script>
    // Configurar gráficos con Chart.js
    const errorsCtx = document.getElementById('errorsChart').getContext('2d');
    new Chart(errorsCtx, {
      type: 'line',
      data: {
        labels: ${JSON.stringify(timeLabels)},
        datasets: [{
          label: 'Errores Totales',
          data: ${JSON.stringify(errorCounts)},
          borderColor: '#007aff',
          backgroundColor: 'rgba(0, 122, 255, 0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
    
    const filesCtx = document.getElementById('filesChart').getContext('2d');
    new Chart(filesCtx, {
      type: 'line',
      data: {
        labels: ${JSON.stringify(timeLabels)},
        datasets: [{
          label: 'Archivos con Errores',
          data: ${JSON.stringify(fileCounts)},
          borderColor: '#5856d6',
          backgroundColor: 'rgba(88, 86, 214, 0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  </script>
</body>
</html>`;
}

// Ejecutar función principal
generateDashboard().catch(console.error);
