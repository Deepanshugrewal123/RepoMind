import React, { useState, useRef, useEffect } from 'react'
import { useApp, ThemeMode } from '../../context/AppContext'
import { Sun, Moon, Laptop, Check } from 'lucide-react'

interface ThemeSwitcherProps {
  className?: string
  compact?: boolean
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '', compact = false }) => {
  const { themeMode, effectiveTheme, setThemeMode } = useApp()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5 text-amber-500" /> },
    { mode: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5 text-sky-400" /> },
    { mode: 'system', label: 'System', icon: <Laptop className="w-3.5 h-3.5 text-slate-400" /> }
  ]

  if (compact) {
    // Single-click toggle button cycle
    const toggleNext = () => {
      if (themeMode === 'dark') setThemeMode('light')
      else if (themeMode === 'light') setThemeMode('system')
      else setThemeMode('dark')
    }

    return (
      <button
        onClick={toggleNext}
        className={`p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-interactive)] text-[var(--foreground)] hover:border-[var(--accent-orange)] transition-colors cursor-pointer flex items-center justify-center ${className}`}
        title={`Current theme: ${themeMode} (${effectiveTheme}). Click to cycle.`}
        aria-label="Toggle theme"
      >
        {effectiveTheme === 'dark' ? (
          <Moon className="w-4 h-4 text-amber-400" />
        ) : (
          <Sun className="w-4 h-4 text-amber-600" />
        )}
      </button>
    )
  }

  return (
    <div ref={menuRef} className={`relative inline-block ${className}`}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono border border-[var(--border)] bg-[var(--surface-interactive)] text-[var(--foreground)] hover:border-[var(--accent-orange)] transition-all cursor-pointer shadow-sm"
        aria-label="Select theme"
        aria-expanded={dropdownOpen}
      >
        {effectiveTheme === 'dark' ? (
          <Moon className="w-3.5 h-3.5 text-amber-400" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-600" />
        )}
        <span className="capitalize hidden sm:inline">{themeMode}</span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 rounded-2xl glass-panel border border-[var(--border)] p-1.5 shadow-2xl z-50 animate-in fade-in duration-150">
          {options.map((opt) => {
            const isSelected = themeMode === opt.mode
            return (
              <button
                key={opt.mode}
                onClick={() => {
                  setThemeMode(opt.mode)
                  setDropdownOpen(false)
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 text-[var(--accent-orange)] font-bold'
                    : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-interactive)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
