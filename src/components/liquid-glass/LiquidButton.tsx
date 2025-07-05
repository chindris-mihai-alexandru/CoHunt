'use client';

import { ReactNode, MouseEvent } from 'react';

interface LiquidButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export const LiquidButton = ({
  children,
  onClick,
  variant = 'glass',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
}: LiquidButtonProps) => {
  const variantClasses: Record<string, string> = {
    primary: 'liquid-glass-primary text-blue-900 hover:text-blue-950',
    secondary: 'liquid-glass-secondary text-purple-900 hover:text-purple-950',
    accent: 'liquid-glass-accent text-pink-900 hover:text-pink-950',
    glass: 'liquid-glass text-gray-800 hover:text-gray-900',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        liquid-button liquid-glass-specular
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        relative inline-flex items-center justify-center
        font-medium transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};