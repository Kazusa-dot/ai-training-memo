import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background active:scale-95',
          {
            // Primary: Electric Cyan Text on Dark or Cyan Background with Dark Text?
            // Design says: background: var(--primary); color: var(--background);
            'bg-electric text-background hover:bg-primaryHover hover:shadow-[0_4px_12px_rgba(0,229,255,0.2)]': variant === 'primary',
            
            // Secondary: Surface Elevated
            'bg-surfaceHighlight text-white hover:bg-slate-700': variant === 'secondary',
            
            // Outline
            'border border-slate-700 bg-transparent hover:bg-surfaceHighlight text-slate-300': variant === 'outline',
            
            // Ghost
            'hover:bg-surfaceHighlight text-slate-300 hover:text-white': variant === 'ghost',
            
            // Danger
            'bg-error/10 text-error hover:bg-error/20': variant === 'danger',
            
            'h-10 px-4 text-sm': size === 'sm',
            'h-12 px-6 py-2 text-base': size === 'md',
            'h-14 px-8 text-lg': size === 'lg',
            'h-10 w-10 p-0': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';