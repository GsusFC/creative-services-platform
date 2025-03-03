import { NextRequest, NextResponse } from 'next/server';

// Simulación de latencia para pruebas realistas
const simulateLatency = () => new Promise(resolve => setTimeout(resolve, 500));

// Tipo para la programación de sincronización
interface SyncSchedule {
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly';
  time?: string;       // HH:mm formato - requerido para daily y weekly
  day?: string;        // día de la semana - requerido para weekly
  lastRun?: string;    // ISO date string
  nextScheduledRun?: string; // ISO date string
}

// Datos de programación mock (en un sistema real, estaría almacenado en base de datos)
let mockSchedule: SyncSchedule = {
  enabled: true,
  frequency: 'daily',
  time: '03:00',
  lastRun: new Date(Date.now() - 86400000).toISOString(), // Ayer
  nextScheduledRun: new Date(Date.now() + 86400000).toISOString() // Mañana
};

// Manejador de peticiones GET para obtener la configuración de programación
export async function GET() {
  await simulateLatency();
  
  try {
    return NextResponse.json({
      success: true,
      schedule: mockSchedule
    }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener programación:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error al procesar la solicitud',
      error: error instanceof Error ? error.message : 'Error desconocido',
      errorCode: 'SERVER_ERROR'
    }, { status: 500 });
  }
}

// Manejador de peticiones POST para actualizar la configuración de programación
export async function POST(request: NextRequest) {
  await simulateLatency();
  
  try {
    const body = await request.json();
    const newSchedule: SyncSchedule = body.schedule;
    
    // Validaciones básicas
    if (newSchedule === undefined) {
      return NextResponse.json({
        success: false,
        message: 'Se requiere un objeto de programación',
        errorCode: 'MISSING_SCHEDULE'
      }, { status: 400 });
    }
    
    // Validación del objeto de programación
    if (newSchedule.enabled === true) {
      // Verificar que la frecuencia sea válida
      if (!['hourly', 'daily', 'weekly'].includes(newSchedule.frequency)) {
        return NextResponse.json({
          success: false,
          message: 'Frecuencia no válida. Debe ser "hourly", "daily" o "weekly"',
          errorCode: 'INVALID_FREQUENCY'
        }, { status: 400 });
      }
      
      // Verificar que se proporcione tiempo para frecuencias diarias y semanales
      if (newSchedule.frequency !== 'hourly' && !newSchedule.time) {
        return NextResponse.json({
          success: false,
          message: 'Se requiere un tiempo (HH:MM) para frecuencias diarias y semanales',
          errorCode: 'MISSING_TIME'
        }, { status: 400 });
      }
      
      // Verificar que se proporcione día para frecuencia semanal
      if (newSchedule.frequency === 'weekly' && !newSchedule.day) {
        return NextResponse.json({
          success: false,
          message: 'Se requiere un día de la semana para frecuencia semanal',
          errorCode: 'MISSING_DAY'
        }, { status: 400 });
      }
    }
    
    // Actualizar la programación
    mockSchedule = {
      ...mockSchedule,
      ...newSchedule,
      // Calcular próxima ejecución (simple para mock)
      nextScheduledRun: calculateNextRun(newSchedule)
    };
    
    return NextResponse.json({
      success: true,
      message: 'Configuración de programación actualizada correctamente',
      schedule: mockSchedule
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error al actualizar programación:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error al procesar la solicitud',
      error: error instanceof Error ? error.message : 'Error desconocido',
      errorCode: 'SERVER_ERROR'
    }, { status: 500 });
  }
}

// Función para calcular la próxima ejecución programada
function calculateNextRun(schedule: SyncSchedule): string {
  if (!schedule.enabled) {
    return '';
  }
  
  const now = new Date();
  let nextRun = new Date(now);
  
  switch (schedule.frequency) {
    case 'hourly':
      // Próxima hora en punto
      nextRun.setHours(nextRun.getHours() + 1);
      nextRun.setMinutes(0, 0, 0);
      break;
      
    case 'daily':
      // Configurar para el tiempo especificado
      if (schedule.time) {
        const [hours, minutes] = schedule.time.split(':').map(Number);
        nextRun.setHours(hours, minutes, 0, 0);
        
        // Si la hora ya pasó hoy, configurar para mañana
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
      }
      break;
      
    case 'weekly':
      // Configurar para el día y tiempo especificado
      if (schedule.day && schedule.time) {
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const targetDayIndex = daysOfWeek.indexOf(schedule.day);
        
        if (targetDayIndex !== -1) {
          const [hours, minutes] = schedule.time.split(':').map(Number);
          const currentDayIndex = now.getDay();
          let daysToAdd = targetDayIndex - currentDayIndex;
          
          // Ajustar si es el mismo día pero la hora ya pasó
          if (daysToAdd === 0 && (now.getHours() > hours || (now.getHours() === hours && now.getMinutes() >= minutes))) {
            daysToAdd = 7;
          }
          
          // Ajustar si el día objetivo es anterior al actual en la semana
          if (daysToAdd < 0) {
            daysToAdd += 7;
          }
          
          nextRun.setDate(now.getDate() + daysToAdd);
          nextRun.setHours(hours, minutes, 0, 0);
        }
      }
      break;
  }
  
  return nextRun.toISOString();
}
