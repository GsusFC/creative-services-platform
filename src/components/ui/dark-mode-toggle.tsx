"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Efecto para manejar el montaje del componente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Función para crear el efecto ripple
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add("ripple");
    
    const existingRipple = button.querySelector(".ripple");
    if (existingRipple) {
      existingRipple.remove();
    }
    
    button.appendChild(ripple);
    
    // Eliminar el ripple después de la animación
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  // Manejar el toggle del tema
  const handleToggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTheme(theme === "dark" ? "light" : "dark");
    createRipple(event);
  };

  // No renderizar nada hasta que el componente esté montado
  if (!mounted) return null;

  return (
    <button
      aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
      onClick={handleToggleTheme}
      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 bg-white/10 backdrop-blur-sm shadow-lg dark:bg-black/20 dark:shadow-[0_4px_10px_rgba(0,0,0,0.4),0_0_5px_rgba(0,0,255,0.3),0_0_10px_rgba(255,0,0,0.2),0_0_15px_rgba(0,255,0,0.1)]"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggleTheme(e as unknown as React.MouseEvent<HTMLButtonElement>);
        }
      }}
    >
      <span className="toggle-icon">
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
};

export default DarkModeToggle;
