'use client';

import { ReactNode } from 'react';

interface LiquidCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  elevated?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

export const LiquidCard = ({
  children,
  className = '',
  hover = false,
  elevated = false,
  variant = 'default',
}: LiquidCardProps) => {
  const variantClasses = {
    default: 'liquid-glass',
    primary: 'liquid-glass-primary',
    secondary: 'liquid-glass-secondary',
    accent: 'liquid-glass-accent',
  };

  return (
    <div
      className={`
        liquid-card
        ${variantClasses[variant]}
        ${hover ? 'liquid-morph liquid-glass-specular' : ''}
        ${elevated ? 'liquid-float' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};