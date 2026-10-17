import React from 'react'
import { useApp } from '../context/AppContext'
import { LiquidMagneticButton } from '../components/ui/LiquidMagneticButton'
import { Footer } from '../components/common/Footer'
import {
  Code2,
  Network,
  Cpu,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Database,
  Activity,
  Layers,
  Terminal,
  ShieldCheck
} from 'lucide-react'

export const HowItWorksPage: React.FC = () => {
  const { navigateToAppTab } = useApp()

  const pipelineSteps = [
    {
      step: '01',
      title: 'Repository Ingestion & AST Parsing',
      type: 'Deterministic Static Analysis',
      desc: 'RepoMind accepts GitHub/GitLab repository URLs or code directories. It parses Abstract Syntax Trees (AST) across Go, TypeScript, Python, and Java without executing untrusted code.',
      details: [
        'Extracts function call hierarchies, import graphs, and query definitions',
        'Calculates cyclomatic complexity and afferent/efferent coupling indices',
        'Runs completely in ephemeral memory with zero persistent code storage'
      ],
      icon: <Code2 className="w-5 h-5 text-sky-400" />
    },
    {
      step: '02',
      title: 'Knowledge Graph Synthesis',
      type: 'Graph Intelligence & Centrality',
      desc: 'Maps code components, databases, message buses, and third-party integrations into a directed acyclic graph (DAG).',
      details: [
        'Calculates betweenness centrality to identify single points of failure',
        'Evaluates transitive dependency propagation paths',
        'Simulates blast radius for any hypothetical breaking changes'
      ],
      icon: <Network className="w-5 h-5 text-emerald-400" />
    },
    {
      step: '03',
      title: 'Telemetry Correlation & Anomaly Detection',
      type: 'Classical Machine Learning',
      desc: 'Ingests Prometheus metrics, OpenTelemetry distributed spans, and Git commit logs to detect anomalous operational shifts.',
      details: [
        'Isolation Forest algorithms detect latency and connection pool outliers',
        'Change-point detection syncs deployment timestamps with error spikes',
        'Triangulates static code risk warnings with actual runtime behavior'
      ],
      icon: <Cpu className="w-5 h-5 text-amber-400" />
    },
    {
      step: '04',
      title: 'Root Cause Synthesis & Remediation',
      type: 'Contextual AI & AST Rewriting',
      desc: 'Transforms raw anomalies and code dependencies into human-readable causal narratives and suggested code patch diffs.',
      details: [
        'Ranks root cause hypotheses with explicit confidence percentages',
        'Proposes side-by-side Git diffs adhering to architectural safety constraints',
        'Provides step-by-step developer remediation runbooks'
      ],
      icon: <Sparkles className="w-5 h-5 text-purple-400" />
    },
    {
      step: '05',
      title: 'Post-Fix Differential Validation',
      type: 'Continuous Closed-Loop Learning',
      desc: 'Re-evaluates system health immediately after remediation to verify that risk truly decreased and no regressions were introduced.',
      details: [
        'Compares Before vs After coupling metrics and connection hold durations',
        'Calibrates predictive models with resolution outcomes',
        'Synthesizes preventive CI guardrails to stop similar issues from recurring'
      ],
      icon: <CheckCircle2 className="w-5 h-5 text-teal-400" />
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
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium"
        >
          <span>THE INTELLIGENCE PIPELINE</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight" style={{ color: 'var(--foreground)' }}>
          How RepoMind Reasons<br />About Software Systems.
        </h1>
        <p className="text-base sm:text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
          RepoMind does not guess. It combines deterministic static code parsing, mathematical graph theory, classical anomaly detection, and contextual AI reasoning.
        </p>
      </section>

      {/* Step by step pipeline */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto space-y-8">
        {pipelineSteps.map((step, idx) => (
          <div
            key={step.step}
            style={{
              backgroundColor: 'var(--surface-elevated)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--card-shadow)'
            }}
            className="rounded-3xl border p-6 sm:p-8 space-y-4 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono font-bold flex items-center justify-center text-sm border border-amber-500/30">
                  {step.step}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
                  {step.title}
                </h3>
              </div>
              <span 
                style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)', color: 'var(--muted-foreground)' }}
                className="text-xs font-mono px-2.5 py-1 rounded-full border self-start sm:self-auto"
              >
                {step.type}
              </span>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
              {step.desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {step.details.map((item, i) => (
                <div
                  key={i}
                  style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)', color: 'var(--foreground-secondary)' }}
                  className="p-3 rounded-xl border text-xs font-mono flex items-start gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-8 text-center">
          <LiquidMagneticButton
            variant="primary"
            size="lg"
            onClick={() => navigateToAppTab('overview')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Experience the Intelligence Pipeline Live
          </LiquidMagneticButton>
        </div>
      </section>

      <Footer />
    </div>
  )
}
