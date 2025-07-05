'use client';

import { ReactNode } from 'react';

interface LiquidNavProps {
  children: ReactNode;
  className?: string;
  fixed?: boolean;
}

export const LiquidNav = ({
  children,
  className = '',
  fixed = true,
}: LiquidNavProps) => {
  return (
    <nav
      className={`
        liquid-nav
        ${fixed ? 'fixed top-0 left-0 right-0' : ''}
        z-50 px-6 py-4
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </nav>
  );
};