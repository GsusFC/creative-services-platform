'use client';

import React from 'react';

// Componentes dummy para resolver problemas de importación durante la compilación
export const Sheet = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export const SheetTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  return <div>{children}</div>;
};

export const SheetContent = ({ 
  children, 
  side, 
  className 
}: { 
  children: React.ReactNode; 
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}) => {
  return <div className={className}>{children}</div>;
};

export const SheetHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={className}>{children}</div>;
};

export const SheetTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h3 className={className}>{children}</h3>;
};

export const SheetDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <p className={className}>{children}</p>;
};
