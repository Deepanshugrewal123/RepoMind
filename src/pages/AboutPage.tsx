import React from 'react'
import { Footer } from '../components/common/Footer'
import {
  Compass,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Terminal,
  Activity,
  Boxes
} from 'lucide-react'

export const AboutPage: React.FC = () => {
  return (
    <div
      className="min-h-screen pt-28 transition-colors duration-200"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)'
      }}
    >
      {/* Header */}
      <section
        className="px-4 sm:px-8 max-w-7xl mx-auto py-12 text-center space-y-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: 'var(--accent-orange)'
          }}
        >
          <Compass className="w-4 h-4" />
          <span>[COORD // 07.ABOUT] — MISSION & PHILOSOPHY</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight">
          About RepoMind
        </h1>
        <p
          className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-sans"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          The story, engineering philosophy, and design principles behind the operating intelligence layer for modern software systems.
        </p>
      </section>

      {/* Main Narrative */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
        <div
          className="rounded-3xl p-6 sm:p-10 relative overflow-hidden transition-colors"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border)'
          }}
        >
          {/* Spatial Corner Crosshairs */}
          <span className="absolute top-3 left-3 font-mono text-[10px] text-orange-500/40 select-none">+</span>
          <span className="absolute top-3 right-3 font-mono text-[10px] text-orange-500/40 select-none">+</span>
          <span className="absolute bottom-3 left-3 font-mono text-[10px] text-orange-500/40 select-none">+</span>
          <span className="absolute bottom-3 right-3 font-mono text-[10px] text-orange-500/40 select-none">+</span>

          <div className="flex items-center gap-2 mb-4 font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--accent-orange)' }}>
            <Activity className="w-4 h-4" />
            <span>FOUNDATIONAL THESIS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-display mb-4">
            Software as a Living, Reactive System
          </h2>
          <div className="space-y-4 text-sm sm:text-base leading-relaxed font-sans" style={{ color: 'var(--foreground-secondary)' }}>
            <p>
              Software is no longer a static collection of source files; it is a dynamic, living ecosystem with evolving dependencies, asynchronous distributed workflows, and continuous production deployments. Traditional static analysis tools look at isolated files, while monitoring dashboards merely scream when something has already broken in production.
            </p>
            <p>
              RepoMind was born from the belief that <strong style={{ color: 'var(--foreground)' }}>the gap between static codebase architecture and runtime observability must be bridged.</strong> When engineers understand structural coupling, they can predict failures before deployment. When incidents inevitably occur, they can trace symptoms directly back to source commits with evidence.
            </p>
          </div>
        </div>

        {/* 3 Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="p-6 rounded-3xl relative transition-colors flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border)'
            }}
          >
            <div>
              <div className="text-xs font-mono uppercase font-bold mb-2" style={{ color: 'var(--accent-orange)' }}>
                Principle 1
              </div>
              <h3 className="text-lg font-bold font-display mb-2">Simple Outside, Deep Inside</h3>
              <p className="text-xs sm:text-sm leading-relaxed font-sans" style={{ color: 'var(--foreground-secondary)' }}>
                Anyone should grasp what RepoMind does in 20 seconds. Yet developers and architects can inspect cyclomatic matrices, DAG topologies, and telemetry traces.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t font-mono text-[11px]" style={{ borderColor: 'var(--border-subtle)', color: 'var(--muted-foreground)' }}>
              Progressive disclosure UX
            </div>
          </div>

          <div
            className="p-6 rounded-3xl relative transition-colors flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border)'
            }}
          >
            <div>
              <div className="text-xs font-mono uppercase font-bold mb-2" style={{ color: 'var(--accent-green)' }}>
                Principle 2
              </div>
              <h3 className="text-lg font-bold font-display mb-2">Evidence-First UX</h3>
              <p className="text-xs sm:text-sm leading-relaxed font-sans" style={{ color: 'var(--foreground-secondary)' }}>
                Never present a black-box AI recommendation without transparent, inspectable ground truth (AST metrics, call volumes, commit diffs, and confidence percentages).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t font-mono text-[11px]" style={{ borderColor: 'var(--border-subtle)', color: 'var(--muted-foreground)' }}>
              Deterministic ground truth
            </div>
          </div>

          <div
            className="p-6 rounded-3xl relative transition-colors flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border)'
            }}
          >
            <div>
              <div className="text-xs font-mono uppercase font-bold mb-2" style={{ color: '#38bdf8' }}>
                Principle 3
              </div>
              <h3 className="text-lg font-bold font-display mb-2">Continuous Learning</h3>
              <p className="text-xs sm:text-sm leading-relaxed font-sans" style={{ color: 'var(--foreground-secondary)' }}>
                Software reliability requires closing the loop: understand ➔ predict ➔ investigate ➔ resolve ➔ validate ➔ learn from every resolved incident.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t font-mono text-[11px]" style={{ borderColor: 'var(--border-subtle)', color: 'var(--muted-foreground)' }}>
              Closed-loop verification
            </div>
          </div>
        </div>

        {/* Engineering Integrity Pledge */}
        <div
          className="rounded-3xl p-6 sm:p-8 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{
            backgroundColor: 'var(--surface-interactive)',
            border: '1px solid var(--border)'
          }}
        >
          <div className="space-y-1">
            <h4 className="font-bold text-base sm:text-lg font-display">Built for Real Engineering Teams</h4>
            <p className="text-xs sm:text-sm font-sans" style={{ color: 'var(--foreground-secondary)' }}>
              Zero hallucinated metrics. Every insight is derived from real source code AST parsing and standard OpenTelemetry traces.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs shrink-0" style={{ backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border)' }}>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>OpenTelemetry & Git Native</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
