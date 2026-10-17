import React, { useState, useEffect } from 'react'
import { useApp, RouteType } from '../../context/AppContext'
import { LiquidMagneticButton } from '../ui/LiquidMagneticButton'
import { ThemeSwitcher } from '../ui/ThemeSwitcher'
import {
  Layers,
  ShieldAlert,
  Flame,
  Activity,
  Cpu,
  Compass,
  ArrowRight,
  Menu,
  X,
  Search,
  CheckCircle2,
  Code2,
  FileCheck,
  Zap,
  Sparkles
} from 'lucide-react'

export const Navbar: React.FC = () => {
  const { currentRoute, setCurrentRoute, setCommandPaletteOpen, navigateToAppTab, setRepoModalOpen } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [intelligenceOpen, setIntelligenceOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks: { label: string; route: RouteType; hasDropdown?: boolean }[] = [
    { label: 'Product', route: 'product' },
    { label: 'How It Works', route: 'how-it-works' },
    { label: 'Intelligence', route: 'intelligence', hasDropdown: true },
    { label: 'Demo', route: 'demo' },
    { label: 'Security & Trust', route: 'security' },
    { label: 'Docs', route: 'docs' },
    { label: 'About', route: 'about' }
  ]

  const intelligenceCapabilities = [
    {
      title: 'Architecture Intelligence',
      desc: 'Understand deep service dependencies & topology',
      icon: <Layers className="w-4 h-4 text-sky-400" />,
      tab: 'architecture' as const
    },
    {
      title: 'Predictive Risk Scoring',
      desc: 'Identify high-risk hotspots before failure occurs',
      icon: <ShieldAlert className="w-4 h-4 text-amber-500" />,
      tab: 'risks' as const
    },
    {
      title: 'Blast Radius Mapping',
      desc: 'Trace ripple effects of breaking code changes',
      icon: <Flame className="w-4 h-4 text-orange-500" />,
      tab: 'blast-radius' as const
    },
    {
      title: 'Failure Simulation',
      desc: 'Test "What If?" hypothetical outages safely',
      icon: <Cpu className="w-4 h-4 text-emerald-500" />,
      tab: 'simulation' as const
    },
    {
      title: 'Incident Investigation',
      desc: 'Correlate Git commits, deployments, metrics & traces',
      icon: <Activity className="w-4 h-4 text-rose-500" />,
      tab: 'incidents' as const
    },
    {
      title: 'Remediation & Validation',
      desc: 'Apply evidence-backed patches & verify improvement',
      icon: <FileCheck className="w-4 h-4 text-teal-500" />,
      tab: 'validation' as const
    }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3.5 transition-all duration-300">
      <div
        className={`
          max-w-7xl mx-auto rounded-2xl transition-all duration-300 px-4 sm:px-6 py-2.5 flex items-center justify-between
          ${scrolled 
            ? 'glass-panel shadow-lg border border-[var(--border)]' 
            : 'bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border-subtle)]'}
        `}
      >
        {/* Brand Logo */}
        <button
          onClick={() => {
            setCurrentRoute('home')
            setMobileMenuOpen(false)
          }}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
        >
          <div className="relative w-8 h-8 rounded-lg bg-[var(--surface-interactive)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 group-hover:opacity-100 opacity-60 transition-opacity" />
            <div className="relative flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-[var(--accent-orange)] animate-pulse-subtle" />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-[var(--foreground)] group-hover:text-amber-500 transition-colors font-display">
                RepoMind
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-medium tracking-wide uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 rounded">
                v2.8
              </span>
            </div>
            <span className="text-[10px] text-[var(--muted-foreground)] font-mono tracking-wider uppercase -mt-0.5">
              Software Intelligence
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route

            if (link.hasDropdown) {
              return (
                <div
                  key={link.route}
                  className="relative"
                  onMouseEnter={() => setIntelligenceOpen(true)}
                  onMouseLeave={() => setIntelligenceOpen(false)}
                >
                  <button
                    onClick={() => setCurrentRoute(link.route)}
                    className={`
                      px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer
                      ${isActive ? 'text-[var(--foreground)] bg-[var(--surface-interactive)] font-semibold' : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-interactive)]'}
                    `}
                  >
                    <span>{link.label}</span>
                    <svg
                      className={`w-3.5 h-3.5 text-[var(--muted-foreground)] transition-transform duration-200 ${intelligenceOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Mega Menu Dropdown */}
                  {intelligenceOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[480px]">
                      <div className="glass-panel rounded-2xl p-3 shadow-2xl border border-[var(--border)] grid grid-cols-2 gap-2 backdrop-blur-2xl">
                        {intelligenceCapabilities.map((cap) => (
                          <button
                            key={cap.title}
                            onClick={() => {
                              setIntelligenceOpen(false)
                              navigateToAppTab(cap.tab)
                            }}
                            className="text-left p-2.5 rounded-xl hover:bg-[var(--surface-interactive)] transition-all group flex items-start gap-2.5 border border-transparent hover:border-[var(--border)]"
                          >
                            <div className="p-2 rounded-lg bg-[var(--surface-interactive)] border border-[var(--border-subtle)] group-hover:scale-105 transition-transform">
                              {cap.icon}
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-[var(--foreground)] group-hover:text-amber-500 transition-colors">
                                {cap.title}
                              </div>
                              <p className="text-[11px] text-[var(--muted-foreground)] leading-tight mt-0.5 font-sans">
                                {cap.desc}
                              </p>
                            </div>
                          </button>
                        ))}
                        <div className="col-span-2 mt-1 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between px-2 text-[11px]">
                          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            6-Stage Continuous Learning
                          </span>
                          <button
                            onClick={() => {
                              setIntelligenceOpen(false)
                              setCurrentRoute('intelligence')
                            }}
                            className="text-[var(--accent-orange)] hover:underline font-medium flex items-center gap-1"
                          >
                            Explore All Features →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            }

            return (
              <button
                key={link.route}
                onClick={() => setCurrentRoute(link.route)}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer
                  ${isActive ? 'text-[var(--foreground)] bg-[var(--surface-interactive)] font-semibold' : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-interactive)]'}
                `}
              >
                {link.label}
              </button>
            )
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Global Command Palette Trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-xl text-[var(--foreground-secondary)] hover:text-[var(--foreground)] bg-[var(--surface-interactive)] hover:border-[var(--border-highlight)] border border-[var(--border)] transition-colors cursor-pointer shadow-sm"
            title="Search RepoMind (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            <span className="text-[11px] font-mono">Search...</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--muted-foreground)] border border-[var(--border)]">
              ⌘K
            </kbd>
          </button>

          {/* Launch App Button */}
          <LiquidMagneticButton
            variant="glass"
            size="sm"
            onClick={() => {
              setCurrentRoute('app')
            }}
          >
            Launch App
          </LiquidMagneticButton>

          {/* Primary Analyze Repository CTA */}
          <LiquidMagneticButton
            variant="primary"
            size="sm"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => setRepoModalOpen(true)}
          >
            Analyze Repository
          </LiquidMagneticButton>
        </div>

        {/* Mobile Hamburger & Theme Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeSwitcher compact={true} />
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="p-2 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] bg-[var(--surface-interactive)] border border-[var(--border)]"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-2 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] bg-[var(--surface-interactive)] border border-[var(--border)] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-4 rounded-2xl glass-panel border border-[var(--border)] space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => {
                  setCurrentRoute(link.route)
                  setMobileMenuOpen(false)
                }}
                className={`
                  w-full text-left px-3 py-2 text-sm rounded-xl font-medium transition-colors
                  ${currentRoute === link.route ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold' : 'text-[var(--foreground-secondary)] hover:bg-[var(--surface-interactive)]'}
                `}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-2">
            <LiquidMagneticButton
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => {
                setCurrentRoute('app')
                setMobileMenuOpen(false)
              }}
            >
              Launch Platform Experience →
            </LiquidMagneticButton>
          </div>
        </div>
      )}
    </header>
  )
}
