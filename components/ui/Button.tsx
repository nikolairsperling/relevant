'use client'

import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white disabled:opacity-40 disabled:cursor-not-allowed select-none'

  const variants = {
    primary:
      'bg-white text-black hover:bg-accent-dim active:scale-[0.98]',
    secondary:
      'bg-bg-elevated text-text-primary border border-border hover:border-text-secondary active:scale-[0.98]',
    ghost:
      'text-text-secondary hover:text-text-primary hover:bg-bg-elevated active:scale-[0.98]',
    outline:
      'border border-border text-text-primary hover:border-text-secondary active:scale-[0.98]',
  }

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-md gap-2',
    lg: 'text-sm px-6 py-3.5 rounded-md gap-2',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 rounded-full border border-current border-t-transparent animate-spin" />
      )}
      {children}
    </button>
  )
}
