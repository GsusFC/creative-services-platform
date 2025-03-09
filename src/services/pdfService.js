/**
 * Servicio para generar PDFs de presupuestos
 * Nota: Este es un servicio simulado ya que no tenemos la dependencia jsPDF instalada
 */

// Simular la generación de PDF
export function generateBudgetPDF(budget) {
  console.log('Simulando generación de PDF para presupuesto:', budget.code);
  
  // En una implementación real, aquí utilizaríamos jsPDF
  // Para demostración, retornamos un objeto simulado
  return {
    output: (type) => {
      if (type === 'datauristring') {
        return `data:application/pdf;base64,JVBERi0xLjcKJc...`;
      }
      return null;
    },
    save: (filename) => {
      console.log(`PDF guardado como: ${filename}`);
    }
  };
}

// Guardar PDF
export function savePDF(budget) {
  const doc = generateBudgetPDF(budget);
  const filename = `Presupuesto_${budget.code}_${budget.client.name.replace(/\s+/g, '_')}.pdf`;
  
  // En un entorno de navegador, esto descargaría el archivo
  console.log(`Simulando descarga de PDF: ${filename}`);
  
  // En una implementación real
  doc.save(filename);
  
  return filename;
}

// Enviar PDF por email (simulado)
export function emailPDF(budget, recipientEmail) {
  const doc = generateBudgetPDF(budget);
  const pdfBase64 = doc.output('datauristring');
  
  console.log(`Simulando envío de PDF a ${recipientEmail}`);
  
  // En una implementación real, esto se conectaría a un servicio de email
  // como EmailJS, SendGrid, etc.
  
  // Simular respuesta exitosa
  return {
    success: true,
    message: `El presupuesto ${budget.code} ha sido enviado a ${recipientEmail}`
  };
}
