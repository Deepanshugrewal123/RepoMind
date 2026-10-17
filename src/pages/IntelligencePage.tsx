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
  Network
} from 'lucide-react'

export const IntelligencePage: React.FC = () => {
  const { navigateToAppTab } = useApp()

  const capabilities = [
    {
      id: 'architecture',
      title: 'Architecture Intelligence',
      subtitle: 'Understand system structure & dependencies',
      desc: 'Parses codebase syntax trees and service mesh topologies to reveal how services communicate, where synchronous bottlenecks reside, and how data traverses the cluster.',
      tab: 'architecture' as const,
      icon: <Layers className="w-5 h-5 text-sky-400" />
    },
    {
      id: 'graph',
      title: 'Software Knowledge Graph',
      subtitle: 'Explore how components connect',
      desc: 'A machine-readable and visual graph tracking files, classes, microservices, databases, queues, and authors. Used as the foundation for risk propagation and blast radius analysis.',
      tab: 'graph' as const,
      icon: <Network className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 'risks',
      title: 'Risk Intelligence Matrix',
      subtitle: 'Identify weak points before failures occur',
      desc: 'Computes multi-dimensional risk scores across architecture coupling, fault tolerance, database lock vulnerability, code churn, and single-author bus factors.',
      tab: 'risks' as const,
      icon: <ShieldAlert className="w-5 h-5 text-orange-400" />
    },
    {
      id: 'blast-radius',
      title: 'Blast Radius Mapping',
      subtitle: 'Understand ripple effects of component failure',
      desc: 'Predicts the concentric ripple effect across downstream callers and consumers if a component crashes or experiences high latency.',
      tab: 'blast-radius' as const,
      icon: <Flame className="w-5 h-5 text-amber-400" />
    },
    {
      id: 'simulation',
      title: 'Failure Simulation ("What If?")',
      subtitle: 'Test hypothetical failure scenarios safely',
      desc: 'Run interactive simulations of real-world shocks (e.g. database latency surges, traffic 10x spikes, dependency outages) to evaluate system resilience.',
      tab: 'simulation' as const,
      icon: <Cpu className="w-5 h-5 text-indigo-400" />
    },
    {
      id: 'incidents',
      title: 'Incident Telemetry Correlation',
      subtitle: 'Connect logs, metrics, traces, and code changes',
      desc: 'Reconstructs incident timelines linking deployment commits with latency anomalies, connection pool saturation, and 5xx error spikes.',
      tab: 'incidents' as const,
      icon: <Activity className="w-5 h-5 text-rose-400" />
    },
    {
      id: 'root-cause',
      title: 'Root Cause Reasoning DAG',
      subtitle: 'Move from symptoms toward evidence-backed causes',
      desc: 'Generates causal DAGs distinguishing symptoms from actual root causes, backed by counterfactual rollback simulations.',
      tab: 'root-cause' as const,
      icon: <GitBranch className="w-5 h-5 text-yellow-400" />
    },
    {
      id: 'remediation',
      title: 'Evidence-Backed Remediation',
      subtitle: 'Get prioritized recommendations & patch diffs',
      desc: 'Provides actionable step-by-step remediation runbooks with reviewable Git code diffs addressing root causes directly.',
      tab: 'remediation' as const,
      icon: <Wrench className="w-5 h-5 text-teal-400" />
    },
    {
      id: 'validation',
      title: 'Post-Fix Validation',
      subtitle: 'Verify whether the fix actually improved the system',
      desc: 'Calculates Before vs After differential metrics (coupling, hold duration, risk scores) to verify that system health objectively recovered.',
      tab: 'validation' as const,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
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
      {/* Header */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto py-12 border-b text-center space-y-4" style={{ borderColor: 'var(--border)' }}>
        <div 
          style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-amber-600 dark:text-amber-400 text-xs font-mono font-medium"
        >
          <span>CAPABILITY INDEX</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight" style={{ color: 'var(--foreground)' }}>
          RepoMind Intelligence Capabilities
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
          Explore the individual intelligence engines powering system observability, predictive risk reasoning, and validated incident resolution.
        </p>
      </section>

      {/* Grid of Capabilities */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <div
              key={cap.id}
              style={{
                backgroundColor: 'var(--surface-elevated)',
                borderColor: 'var(--border)',
                boxShadow: 'var(--card-shadow)'
              }}
              className="rounded-3xl border p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div 
                    style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
                    className="p-2.5 rounded-xl border"
                  >
                    {cap.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase" style={{ color: 'var(--muted-foreground)' }}>
                    Capability
                  </span>
                </div>

                <h3 className="text-lg font-bold font-display mb-1 group-hover:text-amber-500 transition-colors" style={{ color: 'var(--foreground)' }}>
                  {cap.title}
                </h3>
                <div className="text-xs font-medium mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  "{cap.subtitle}"
                </div>
                <p className="text-xs leading-relaxed mb-6" style={{ color: 'var(--foreground-secondary)' }}>
                  {cap.desc}
                </p>
              </div>

              <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  onClick={() => navigateToAppTab(cap.tab)}
                  className="text-xs font-semibold text-amber-500 hover:text-amber-600 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Launch in App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
