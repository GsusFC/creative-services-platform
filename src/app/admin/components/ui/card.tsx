'use client';

import React from 'react';

// Componentes dummy para resolver problemas de importación durante la compilación
export const Card = ({ className, children, ...props }: React.HTMLProps<HTMLDivElement> & { className?: string }) => (
  <div className={`rounded-lg border shadow-sm ${className}`} {...props}>{children}</div>
);

export const CardHeader = ({ className, children, ...props }: React.HTMLProps<HTMLDivElement> & { className?: string }) => (
  <div className={`flex flex-col p-6 ${className}`} {...props}>{children}</div>
);

export const CardTitle = ({ className, children, ...props }: React.HTMLProps<HTMLHeadingElement> & { className?: string }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>{children}</h3>
);

export const CardDescription = ({ className, children, ...props }: React.HTMLProps<HTMLParagraphElement> & { className?: string }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>{children}</p>
);

export const CardContent = ({ className, children, ...props }: React.HTMLProps<HTMLDivElement> & { className?: string }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>{children}</div>
);

export const CardFooter = ({ className, children, ...props }: React.HTMLProps<HTMLDivElement> & { className?: string }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>{children}</div>
);
