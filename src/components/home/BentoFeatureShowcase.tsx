import React from 'react'
import { useApp } from '../../context/AppContext'
import { LiquidMagneticButton } from '../ui/LiquidMagneticButton'
import {
  Layers,
  Network,
  ShieldAlert,
  Flame,
  Cpu,
  Activity,
  GitBranch,
  Wrench,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Database,
  Terminal,
  FileCode,
  Sparkles
} from 'lucide-react'

export const BentoFeatureShowcase: React.FC = () => {
  const { navigateToAppTab } = useApp()

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-2 block font-semibold">
          COMPLETE INTELLIGENCE STACK
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-display" style={{ color: 'var(--foreground)' }}>
          Engineered for Deep Software Visibility.
        </h2>
        <p className="text-sm sm:text-base mt-3 leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
          Explore the modular capabilities powering RepoMind's unified reliability platform.
        </p>
      </div>

      {/* Bento Grid Layout with varied card sizes and visual compositions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Card 1: Architecture Intelligence (Large Hero Card - 8 cols) */}
        <div 
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
          className="md:col-span-8 rounded-3xl border p-6 sm:p-8 flex flex-col justify-between group hover:border-amber-500/50 transition-all duration-300"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-500">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10" style={{ color: 'var(--muted-foreground)' }}>
                Code Intelligence
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold mb-2 font-display" style={{ color: 'var(--foreground)' }}>
              Architecture & Structural Coupling
            </h3>
            <p className="text-xs sm:text-sm max-w-xl leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
              Parse AST hierarchies into living service boundaries. Automatically uncover cyclic dependency rings, critical request pathways, and concentration bottlenecks.
            </p>

            {/* Visual Micro-Simulation */}
            <div className="grid grid-cols-3 gap-3 my-6 font-mono text-xs">
              <div 
                style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
                className="p-3 rounded-xl border"
              >
                <span className="text-[10px] block" style={{ color: 'var(--muted-foreground)' }}>Afferent Coupling (Ca)</span>
                <strong className="text-sm sm:text-base" style={{ color: 'var(--foreground)' }}>14 callers</strong>
              </div>
              <div 
                style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
                className="p-3 rounded-xl border"
              >
                <span className="text-[10px] block" style={{ color: 'var(--muted-foreground)' }}>Cyclomatic Index</span>
                <strong className="text-sm sm:text-base text-amber-500">Index: 38</strong>
              </div>
              <div 
                style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
                className="p-3 rounded-xl border"
              >
                <span className="text-[10px] block" style={{ color: 'var(--muted-foreground)' }}>Single Point of Failure</span>
                <strong className="text-sm sm:text-base text-red-500">Detected</strong>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>AST parsed across 10 microservices</span>
            <button
              onClick={() => navigateToAppTab('architecture')}
              className="text-xs font-semibold text-amber-500 hover:text-amber-600 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Knowledge Graph (Tall Card - 4 cols) */}
        <div 
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
          className="md:col-span-4 rounded-3xl border p-6 flex flex-col justify-between group hover:border-emerald-500/50 transition-all duration-300"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                <Network className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/20">
                Graph Engine
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold mb-2 font-display" style={{ color: 'var(--foreground)' }}>
              Topological Graph
            </h3>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--foreground-secondary)' }}>
              Interactive node-link graph mapping components, databases, queues, and external APIs with real-time risk heatmaps.
            </p>

            <div 
              style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
              className="p-3.5 rounded-xl border space-y-2 font-mono text-xs"
            >
              <div className="flex justify-between" style={{ color: 'var(--foreground-secondary)' }}>
                <span>PaymentService</span>
                <span className="text-rose-500 font-bold">Risk 91</span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--foreground-secondary)' }}>
                <span>Dependencies</span>
                <span className="font-bold" style={{ color: 'var(--foreground)' }}>11 direct</span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--foreground-secondary)' }}>
                <span>Dependents</span>
                <span className="font-bold" style={{ color: 'var(--foreground)' }}>14 callers</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>13 active edges</span>
            <button
              onClick={() => navigateToAppTab('graph')}
              className="text-xs font-semibold text-emerald-500 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
            >
              <span>View Graph</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Blast Radius Mapping (4 cols) */}
        <div 
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
          className="md:col-span-4 rounded-3xl border p-6 flex flex-col justify-between group hover:border-amber-500/50 transition-all duration-300"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20">
                Ripple Analysis
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold mb-2 font-display" style={{ color: 'var(--foreground)' }}>
              Blast Radius Mapping
            </h3>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--foreground-secondary)' }}>
              Calculate concentric waves of failure propagation when a core service degrades.
            </p>

            <div 
              style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
              className="p-3 rounded-xl border font-mono text-xs space-y-1"
            >
              <div className="text-amber-500 font-bold">Tier 1: OrderService (Stall)</div>
              <div style={{ color: 'var(--foreground-secondary)' }}>Tier 2: Checkout Frontend (504)</div>
              <div style={{ color: 'var(--muted-foreground)' }}>Tier 3: Invoice Worker (Backlogged)</div>
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>68% Blast Radius</span>
            <button
              onClick={() => navigateToAppTab('blast-radius')}
              className="text-xs font-semibold text-amber-500 hover:text-amber-600 flex items-center gap-1 cursor-pointer"
            >
              <span>Simulate Ripple</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 4: Incident Investigation & Root Cause (Medium Card - 4 cols) */}
        <div 
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
          className="md:col-span-4 rounded-3xl border p-6 flex flex-col justify-between group hover:border-rose-500/50 transition-all duration-300"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 font-medium border border-rose-500/20">
                Incident Correlation
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold mb-2 font-display" style={{ color: 'var(--foreground)' }}>
              Incident Root Cause
            </h3>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--foreground-secondary)' }}>
              Correlate Git commits, deployments, metrics, and OpenTelemetry spans into a unified causal timeline.
            </p>

            <div 
              style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
              className="p-3 rounded-xl border font-mono text-xs space-y-1"
            >
              <div className="text-rose-500 font-bold">Deploy #892 ➔ Lock Contention</div>
              <div style={{ color: 'var(--foreground-secondary)' }}>98% DB Connection Pool Saturate</div>
              <div style={{ color: 'var(--muted-foreground)' }}>Confidence: 92% Evidence-Backed</div>
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>Incident #INC-2024-892</span>
            <button
              onClick={() => navigateToAppTab('incidents')}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
            >
              <span>Investigate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 5: Remediation & Post-Fix Validation (Medium Card - 4 cols) */}
        <div 
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
          className="md:col-span-4 rounded-3xl border p-6 flex flex-col justify-between group hover:border-teal-500/50 transition-all duration-300"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-medium border border-teal-500/20">
                Remediation Engine
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold mb-2 font-display" style={{ color: 'var(--foreground)' }}>
              Validated Remediation
            </h3>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--foreground-secondary)' }}>
              Get prioritized fixes with Git patch diffs. Re-evaluate post-fix metrics to verify true system risk reduction.
            </p>

            <div 
              style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
              className="p-3 rounded-xl border font-mono text-xs space-y-1"
            >
              <div className="text-teal-500 font-bold">Risk: 91 ➔ 67 (Medium)</div>
              <div style={{ color: 'var(--foreground-secondary)' }}>DB Hold: 1,420ms ➔ 5.8ms</div>
              <div className="text-emerald-500 font-bold">+16 pts System Recovery</div>
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>Plan REM-892</span>
            <button
              onClick={() => navigateToAppTab('remediation')}
              className="text-xs font-semibold text-teal-500 hover:text-teal-600 flex items-center gap-1 cursor-pointer"
            >
              <span>View Patches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
