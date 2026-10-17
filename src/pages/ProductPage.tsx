import React from 'react'
import { useApp } from '../context/AppContext'
import { LiquidMagneticButton } from '../components/ui/LiquidMagneticButton'
import { Footer } from '../components/common/Footer'
import {
  Layers,
  ShieldAlert,
  Flame,
  Activity,
  GitBranch,
  Wrench,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Database,
  Terminal,
  Sparkles,
  Lock,
  Code2
} from 'lucide-react'

export const ProductPage: React.FC = () => {
  const { navigateToAppTab } = useApp()

  const modules = [
    {
      id: 'understand',
      title: 'Software Understanding Layer',
      subtitle: 'What is this software and how does it actually work?',
      desc: 'RepoMind parses your repository AST, maps direct and transitive dependencies, clusters microservices into logical boundaries, and monitors code churn volatility.',
      features: [
        'Automatic language & framework detection (Go, TypeScript, Python, Java)',
        'Efferent and afferent architectural coupling metrics',
        'Topological knowledge graph representing files, functions, and database queries',
        'Engineering behavior profiling and maintainer bus factor detection'
      ],
      tab: 'architecture' as const,
      color: 'border-sky-500/40 text-sky-400 bg-sky-500/10'
    },
    {
      id: 'predict',
      title: 'Predictive Risk Intelligence',
      subtitle: 'Where is this system most likely to fail or become unmaintainable?',
      desc: 'Instead of drowning developers in 300 trivial warnings, RepoMind calculates multi-dimensional risk scores backed by deterministic evidence.',
      features: [
        'Multi-factor scoring: Architecture, Reliability, Scalability, Security, Maintainability',
        'Failure simulation ("What if traffic increases 10x? What if Postgres latency increases 5x?")',
        'Concentric blast radius mapping for planned code refactors',
        'Automated fix prioritization ranked by impact vs effort'
      ],
      tab: 'risks' as const,
      color: 'border-orange-500/40 text-orange-400 bg-orange-500/10'
    },
    {
      id: 'investigate',
      title: 'Incident Telemetry Correlation',
      subtitle: 'Something went wrong. What happened and what is the probable root cause?',
      desc: 'When production issues occur, RepoMind correlates runtime signals (Prometheus metrics, OpenTelemetry traces, error logs) directly back to recent Git commits and PRs.',
      features: [
        'Synchronized incident timeline mapping deployment to latency spike',
        'Causal root cause reasoning DAG with evidence confidence scores',
        'Counterfactual rollback simulation (estimate error rate drop before reverting)',
        'Cross-layer correlation connecting pre-incident risk warnings with actual outages'
      ],
      tab: 'incidents' as const,
      color: 'border-rose-500/40 text-rose-400 bg-rose-500/10'
    },
    {
      id: 'remediation',
      title: 'Remediation & Closed-Loop Validation',
      subtitle: 'What should we fix first, and did the fix actually reduce the risk?',
      desc: 'RepoMind generates prioritized corrective action plans, proposes reviewable code patch diffs, and measures Before vs After metrics to prove true risk reduction.',
      features: [
        'Actionable step-by-step remediation runbooks with git diff previews',
        'Post-fix validation re-evaluating coupling and connection hold durations',
        'Automated preventive guardrail generation for CI/CD pipelines',
        'Continuous learning engine that prevents similar failures from reoccurring'
      ],
      tab: 'remediation' as const,
      color: 'border-teal-500/40 text-teal-400 bg-teal-500/10'
    }
  ]

  return (
    <div 
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)'
      }}
      className="min-h-screen pt-28 transition-colors"
    >
      {/* Product Hero */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto py-12 border-b text-center space-y-4" style={{ borderColor: 'var(--border)' }}>
        <div 
          style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-amber-600 dark:text-amber-400 text-xs font-mono font-medium"
        >
          <span>THE REPOMIND PLATFORM</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight" style={{ color: 'var(--foreground)' }}>
          The Operating Intelligence Layer<br />for Modern Software.
        </h1>
        <p className="text-base sm:text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
          RepoMind is not an isolated linter or simple APM dashboard. It is a unified software intelligence system that unifies codebase architecture, risk prediction, incident investigation, and validated remediation.
        </p>

        <div className="pt-4 flex items-center justify-center gap-4">
          <LiquidMagneticButton
            variant="primary"
            size="md"
            onClick={() => navigateToAppTab('overview')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Launch Live Platform Experience
          </LiquidMagneticButton>
        </div>
      </section>

      {/* 4 Foundational Modules */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
            Four Foundational Intelligence Layers
          </h2>
          <p className="text-xs sm:text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>
            Interconnected modules operating as one cohesive reliability engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map((mod) => (
            <div
              key={mod.id}
              style={{
                backgroundColor: 'var(--surface-elevated)',
                borderColor: 'var(--border)',
                boxShadow: 'var(--card-shadow)'
              }}
              className="rounded-3xl border p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${mod.color}`}>
                    {mod.title}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold mb-2 font-display" style={{ color: 'var(--foreground)' }}>
                  {mod.subtitle}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: 'var(--foreground-secondary)' }}>
                  {mod.desc}
                </p>

                <div className="space-y-2 mb-6">
                  {mod.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs font-mono" style={{ color: 'var(--foreground-secondary)' }}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  onClick={() => navigateToAppTab(mod.tab)}
                  className="text-xs font-semibold text-amber-500 hover:text-amber-600 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Launch Module in Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closed-Loop Intelligence Architecture Flow */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t" style={{ borderColor: 'var(--border)' }}>
        <div 
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
          className="rounded-3xl border p-8 text-center space-y-6"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-500 font-semibold">
            THE BIGGEST DIFFERENTIATOR
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
            Closed-Loop Software Intelligence
          </h2>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
            When RepoMind predicts a high risk (e.g. database pool starvation), and that component subsequently triggers an incident, the system correlates the outcome and autonomously trains preventative guardrails for your CI pipeline.
          </p>

          <div 
            style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
            className="p-4 sm:p-6 rounded-2xl border max-w-3xl mx-auto font-mono text-xs text-left space-y-2"
          >
            <div className="text-sky-500 font-bold">1. Risk Engine Predicts: PaymentService ➔ High Risk (Connection Contention)</div>
            <div style={{ color: 'var(--muted-foreground)' }}>2. Remediation Engine Proposes: Decouple external calls outside transaction boundary</div>
            <div className="text-amber-500">3. Production Incident #892: Connection pool hits 98% saturation</div>
            <div className="text-rose-500 font-bold">4. Incident Correlator Proves: Predicted Risk ➔ Actual Incident Root Cause</div>
            <div className="text-teal-500">5. Developer Applies Fix: Risk drops 91 ➔ 67, DB hold drops 1,420ms ➔ 5.8ms</div>
            <div className="text-emerald-500 font-bold">6. Continuous Learning: CI linter guardrail activated automatically</div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
