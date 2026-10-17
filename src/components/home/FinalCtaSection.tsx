import React from 'react'
import { useApp } from '../../context/AppContext'
import { LiquidMagneticButton } from '../ui/LiquidMagneticButton'
import { ArrowRight, Sparkles, Terminal, CheckCircle2 } from 'lucide-react'

export const FinalCtaSection: React.FC = () => {
  const { setCurrentRoute, setRepositoryInput, startRepositoryAnalysis } = useApp()

  return (
    <section 
      style={{
        backgroundColor: 'var(--background-secondary)',
        borderColor: 'var(--border)'
      }}
      className="relative py-28 px-4 sm:px-8 border-t overflow-hidden transition-colors"
    >
      {/* Calm Converging Energy Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
        <div 
          style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-amber-600 dark:text-amber-400 text-xs font-mono font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>ZERO CONFIGURATION • READ-ONLY REPOSITORY ANALYSIS</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight font-display leading-tight" style={{ color: 'var(--foreground)' }}>
          Your software already has signals.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500">
            RepoMind connects them.
          </span>
        </h2>

        <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
          Understand what changed. See what could break. Investigate why. Fix with confidence.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <LiquidMagneticButton
            variant="primary"
            size="lg"
            onClick={() => {
              const el = document.getElementById('hero-repo-input')
              el?.scrollIntoView({ behavior: 'smooth' })
              el?.focus()
            }}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Analyze Your Repository →
          </LiquidMagneticButton>

          <LiquidMagneticButton
            variant="secondary"
            size="lg"
            onClick={() => {
              setCurrentRoute('demo')
            }}
          >
            Explore Interactive Demo Sandbox
          </LiquidMagneticButton>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Zero Code Storage (Ephemeral Ingestion)
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Deterministic AST + AI Triangulation
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            OpenTelemetry & Prometheus Ready
          </span>
        </div>
      </div>
    </section>
  )
}
