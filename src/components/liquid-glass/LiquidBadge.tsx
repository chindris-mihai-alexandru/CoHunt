'use client';

import { ReactNode } from 'react';

interface LiquidBadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LiquidBadge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: LiquidBadgeProps) => {
  const variantClasses: Record<string, string> = {
    default: 'liquid-glass text-gray-800',
    primary: 'liquid-glass-primary text-blue-900',
    secondary: 'liquid-glass-secondary text-purple-900',
    success: 'bg-green-500/70 text-green-900 border-green-300',
    warning: 'bg-yellow-500/70 text-yellow-900 border-yellow-300',
    danger: 'bg-red-500/70 text-red-900 border-red-300',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={`
        liquid-badge
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};