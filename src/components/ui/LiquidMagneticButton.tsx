import React, { useRef, useState, useEffect } from 'react'

interface LiquidMagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  magneticStrength?: number // default 0.2
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  isLoading?: boolean
  loadingText?: string
}

export const LiquidMagneticButton: React.FC<LiquidMagneticButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  magneticStrength = 0.2,
  icon,
  iconPosition = 'right',
  isLoading = false,
  loadingText = 'Analyzing...',
  className = '',
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [specular, setSpecular] = useState({ x: 50, y: 50, opacity: 0 })
  const [isPressed, setIsPressed] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Only apply magnetic pull on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Magnetic pull toward mouse
    const distanceX = (e.clientX - centerX) * magneticStrength
    const distanceY = (e.clientY - centerY) * magneticStrength
    setPosition({ x: distanceX, y: distanceY })

    // Internal specular highlight follows cursor
    const specX = ((e.clientX - rect.left) / rect.width) * 100
    const specY = ((e.clientY - rect.top) / rect.height) * 100
    setSpecular({ x: specX, y: specY, opacity: 1 })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
    setSpecular(prev => ({ ...prev, opacity: 0 }))
    setIsPressed(false)
  }

  const handleMouseDown = () => setIsPressed(true)
  const handleMouseUp = () => setIsPressed(false)

  // Styling maps
  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2 font-medium',
    lg: 'px-6 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base rounded-2xl gap-2.5 font-semibold'
  }[size]

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 text-slate-950 font-semibold
      shadow-[0_4px_20px_rgba(245,158,11,0.25)] hover:shadow-[0_4px_28px_rgba(245,158,11,0.4)]
      border border-amber-300/40 dark:border-amber-400/30
    `,
    secondary: `
      bg-[var(--surface-elevated)] text-[var(--foreground)] hover:text-[var(--foreground)]
      border border-[var(--border)] hover:border-[var(--accent-orange)]
      shadow-sm hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]
    `,
    glass: `
      glass-pill text-[var(--foreground)] hover:text-[var(--foreground)]
      border border-[var(--border)] hover:border-[var(--accent-green)]
      shadow-[var(--card-shadow)]
    `,
    ghost: `
      bg-transparent text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-interactive)]
      border border-transparent
    `,
    danger: `
      bg-red-500/15 text-red-600 dark:text-red-300 hover:bg-red-500/25
      border border-red-500/30
    `
  }[variant]

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      disabled={isLoading}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isPressed ? 0.96 : 1})`,
        transition: isPressed 
          ? 'transform 0.08s ease-out' 
          : 'transform 0.22s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.25s ease'
      }}
      className={`
        relative inline-flex items-center justify-center overflow-hidden cursor-pointer
        select-none backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-amber-500
        ${sizeStyles} ${variantStyles} ${className}
      `}
      {...props}
    >
      {/* Specular Liquid Light reflection overlay */}
      <span
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 rounded-[inherit]"
        style={{
          opacity: specular.opacity,
          background: `radial-gradient(120px circle at ${specular.x}% ${specular.y}%, rgba(255, 255, 255, 0.35), transparent 70%)`
        }}
      />

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-0.5 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="transition-transform duration-200">{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === 'right' && <span className="transition-transform duration-200 group-hover:translate-x-1">{icon}</span>}
          </>
        )}
      </span>
    </button>
  )
}
