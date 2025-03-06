'use client'

import { useEffect } from 'react'

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Ocultamos cualquier campo de texto extra que pueda aparecer en la interfaz
  useEffect(() => {
    // Ocultar los campos de texto problemáticos después de cargar
    const hideExtraFields = () => {
      // Identificar y ocultar los campos de texto utilizando los selectores específicos
      const extraTextFields = document.querySelectorAll('.extra-input-field, .legacy-text-field')
      
      if (extraTextFields.length > 0) {
        extraTextFields.forEach(field => {
          // Ocultar el campo
          (field as HTMLElement).style.display = 'none'
        })
        console.log(`Se ocultaron ${extraTextFields.length} campos de texto adicionales`)
      }
    }
    
    // Ejecutar inmediatamente y nuevamente después de un pequeño retraso 
    // para asegurar que los elementos estén en el DOM
    hideExtraFields()
    const timer = setTimeout(hideExtraFields, 500)
    
    // También escuchar cambios en el DOM por si los campos aparecen dinámicamente
    const observer = new MutationObserver(() => {
      hideExtraFields()
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
    
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {children}
    </>
  )
}
