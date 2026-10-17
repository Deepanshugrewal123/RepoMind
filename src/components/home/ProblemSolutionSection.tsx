import React from 'react'
import {
  Code2,
  GitBranch,
  Layers,
  Activity,
  AlertTriangle,
  ArrowDown,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Cpu
} from 'lucide-react'

export const ProblemSolutionSection: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-2 block font-semibold">
          THE ARCHITECTURAL IMPASSE
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-display" style={{ color: 'var(--foreground)' }}>
          Software becomes harder to understand as it grows.
        </h2>
        <p className="text-sm sm:text-base mt-3 leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
          Modern teams deploy across microservices, async queues, third-party APIs, and frequent pull requests. But developers still have to mentally connect all the scattered signals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* The Problem: Fragmented Chaos */}
        <div 
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)'
          }}
          className="rounded-3xl p-6 sm:p-8 border border-red-500/25 relative overflow-hidden flex flex-col justify-between shadow-sm"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-red-500 flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4" />
                The Fragmented Reality
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20 font-medium">
                Siloed Data
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold mb-3 font-display" style={{ color: 'var(--foreground)' }}>
              Isolated tools solve isolated symptoms.
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: 'var(--foreground-secondary)' }}>
              Your static linter warns about syntax. Your APM alerts when CPU spikes. Your incident tool sends PagerDuty pings. But none of them understand the causal thread between a 2-line Git commit and a database connection lock.
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              {[
                { title: 'More Code', desc: '10,000+ files with undocumented business assumptions' },
                { title: 'More Dependencies', desc: 'Hundreds of direct & transitive external packages' },
                { title: 'More Deployments', desc: 'Dozens of daily PR merges across distributed authors' },
                { title: 'More Microservices', desc: 'Silent cascading failures hidden behind gRPC & HTTP calls' },
                { title: 'More Hidden Risk', desc: 'Single developer bus factors and unindexed SQL query loops' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
                  className="p-3 rounded-xl border flex items-center justify-between"
                >
                  <span className="font-bold text-red-500">{item.title}</span>
                  <span className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-red-500/20 text-[11px] font-mono text-red-500">
            Result: 44-minute production outages while engineers manually search logs.
          </div>
        </div>

        {/* The Solution: RepoMind Unified Intelligence */}
        <div 
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)'
          }}
          className="rounded-3xl p-6 sm:p-8 border border-emerald-500/30 relative overflow-hidden flex flex-col justify-between shadow-sm"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-500 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4" />
                The RepoMind Layer
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
                Unified Intelligence
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold mb-3 font-display" style={{ color: 'var(--foreground)' }}>
              One living intelligence layer across your system.
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: 'var(--foreground-secondary)' }}>
              RepoMind triangulates static codebase AST, development history, runtime telemetry, and incident timelines into a connected graph that reasons about failure before and after it occurs.
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              {[
                { source: 'Repository AST', badge: 'Architecture', desc: 'Deep architectural dependency parsing' },
                { source: 'Git History', badge: 'Behavior', desc: 'Code churn heatmaps and maintainer bus factor' },
                { source: 'Runtime Telemetry', badge: 'Observability', desc: 'Live OpenTelemetry traces, error rates, p99 latency' },
                { source: 'Causal Root Cause DAG', badge: 'Root Cause', desc: 'Trace failure backward from symptom to deployment commit' },
                { source: 'Validation Engine', badge: 'Verification', desc: 'Verify risk reduction before and after patch application' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
                  className="p-3 rounded-xl border flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.source}</span>
                  </div>
                  <span className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            <span>Result: Deterministic evidence, instant root causes, validated fixes.</span>
            <span className="font-bold">Closed-Loop Learning</span>
          </div>
        </div>
      </div>
    </section>
  )
}
