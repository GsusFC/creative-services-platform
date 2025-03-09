/**
 * Servicio simplificado de gestión de datos usando localStorage
 */

// Guardar presupuesto
export function saveBudget(budgetData) {
  // Generar un código único
  const code = generateBudgetCode();
  
  // Agregar fecha y código
  const budgetToSave = {
    ...budgetData,
    code,
    createdAt: new Date().toISOString(),
    status: 'pending' // pending, approved, rejected
  };
  
  // Guardar en localStorage
  localStorage.setItem(`budget_${code}`, JSON.stringify(budgetToSave));
  
  // Guardar índice de presupuestos
  const budgetIndex = getBudgetIndex();
  budgetIndex.push({
    code,
    clientName: budgetData.client.name,
    clientEmail: budgetData.client.email,
    totalPrice: budgetData.totalPrice,
    createdAt: budgetToSave.createdAt,
    status: 'pending'
  });
  localStorage.setItem('budget_index', JSON.stringify(budgetIndex));
  
  return code;
}

// Recuperar presupuesto por código
export function getBudgetByCode(code) {
  const budgetData = localStorage.getItem(`budget_${code}`);
  return budgetData ? JSON.parse(budgetData) : null;
}

// Obtener lista de presupuestos
export function getBudgetIndex() {
  const index = localStorage.getItem('budget_index');
  return index ? JSON.parse(index) : [];
}

// Actualizar estado de presupuesto
export function updateBudgetStatus(code, status) {
  const budget = getBudgetByCode(code);
  if (budget) {
    budget.status = status;
    localStorage.setItem(`budget_${code}`, JSON.stringify(budget));
    
    // Actualizar índice
    const budgetIndex = getBudgetIndex();
    const updatedIndex = budgetIndex.map(item => {
      if (item.code === code) {
        return { ...item, status };
      }
      return item;
    });
    localStorage.setItem('budget_index', JSON.stringify(updatedIndex));
    
    return true;
  }
  return false;
}

// Generar código de presupuesto
export function generateBudgetCode() {
  const prefix = 'P';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

// Exportar todos los presupuestos como JSON
export function exportAllBudgets() {
  const budgetIndex = getBudgetIndex();
  const allBudgets = {};
  
  budgetIndex.forEach(item => {
    const budget = getBudgetByCode(item.code);
    if (budget) {
      allBudgets[item.code] = budget;
    }
  });
  
  return JSON.stringify(allBudgets, null, 2);
}

// Importar presupuestos desde JSON
export function importBudgets(jsonData) {
  try {
    const budgets = JSON.parse(jsonData);
    const codes = Object.keys(budgets);
    const importedIndex = [];
    
    codes.forEach(code => {
      const budget = budgets[code];
      localStorage.setItem(`budget_${code}`, JSON.stringify(budget));
      
      importedIndex.push({
        code,
        clientName: budget.client.name,
        clientEmail: budget.client.email,
        totalPrice: budget.totalPrice,
        createdAt: budget.createdAt,
        status: budget.status
      });
    });
    
    // Combinar con el índice existente
    const currentIndex = getBudgetIndex();
    const newIndex = [...currentIndex];
    
    importedIndex.forEach(imported => {
      const exists = currentIndex.some(item => item.code === imported.code);
      if (!exists) {
        newIndex.push(imported);
      }
    });
    
    localStorage.setItem('budget_index', JSON.stringify(newIndex));
    
    return {
      success: true,
      count: codes.length
    };
  } catch (error) {
    console.error('Error importing budgets', error);
    return {
      success: false,
      error: 'Invalid JSON format'
    };
  }
}
