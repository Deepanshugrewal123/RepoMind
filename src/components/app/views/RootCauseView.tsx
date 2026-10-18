import React, { useState } from 'react'
import { useApp } from '../../../context/AppContext'
import { LiquidMagneticButton } from '../../ui/LiquidMagneticButton'
import {
  GitBranch,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  GitCommit,
  Database,
  Flame,
  Activity,
  Layers,
  Sparkles,
  Radio
} from 'lucide-react'

export const RootCauseView: React.FC = () => {
  const { navigateToAppTab, isCustomRepo, currentRepoName, resetToOnboarding } = useApp()
  const [selectedChainIndex, setSelectedChainIndex] = useState(4)
  const [isRollbackSimulated, setIsRollbackSimulated] = useState(false)

  // Causal Chain:
  // Observed Symptom -> Correlated Signal -> Recent Change -> Dependency -> Likely Root Cause
  const causalChain = [
    {
      stage: 'Observed Symptom',
      title: 'Checkout 504 Gateway Timeouts & 31.4% Failure Rate',
      type: 'End-User Impact',
      component: 'APIGateway / Checkout Web',
      desc: 'Customer transactions failing with 504 Gateway Timeout and 500 ConnectionAcquireTimeout.',
      evidence: '382 failed transactions/min; error spikes logged in Envoy reverse proxy ingress.',
      color: 'border-rose-500/40 text-rose-400 bg-rose-500/10'
    },
    {
      stage: 'Correlated Signal',
      title: 'Database Connection Pool Exhaustion (98/100 Active)',
      type: 'Runtime Observability Outlier',
      component: 'PostgresPrimary Data Store',
      desc: 'Connection pool acquire latency spiked from 1.2ms to 5,000ms+ timeout threshold.',
      evidence: 'Prometheus metric: pg_stat_activity active connection saturation reached 98% capacity.',
      color: 'border-orange-500/40 text-orange-400 bg-orange-500/10'
    },
    {
      stage: 'Recent Change',
      title: 'Deployment #892 (Commit e8a109f: Rewrite settlement loop)',
      type: 'Git History Change-Point',
      component: 'PaymentService / Devon Vance',
      desc: 'PR #412 merged into main 13 minutes prior to initial latency escalation.',
      evidence: 'Code change extended transaction scope: db.beginTransaction() held open across Stripe network call.',
      color: 'border-sky-500/40 text-sky-400 bg-sky-500/10'
    },
    {
      stage: 'Dependency',
      title: 'Unbuffered Synchronous Stripe API Call (240ms - 1,420ms)',
      type: 'External Network Dependency',
      component: 'StripePaymentAPI / HTTP Client',
      desc: 'External HTTP round-trips held open inside the local PostgreSQL transaction lock.',
      evidence: 'Trace span duration: stripeClient.charges.create averaged 1,240ms with open DB connection.',
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10'
    },
    {
      stage: 'Likely Root Cause',
      title: 'Transaction Scope Contention in src/services/payment/settlement.ts',
      type: 'Verified Root Cause (92% Confidence)',
      component: 'PaymentService L42-L78',
      desc: 'Holding an open database transaction lock while awaiting external HTTP network completion exhausted pool connections across concurrent traffic.',
      evidence: 'Static AST rule violation: async external network calls forbidden within beginTransaction() boundaries.',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/15 ring-1 ring-emerald-500/30'
    }
  ]

  const activeItem = causalChain[selectedChainIndex]

  return (
    <div className="space-y-6 pb-20">
      {/* Capability Notice for Custom Repositories */}
      {isCustomRepo && (
        <div
          className="p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            color: 'var(--foreground)'
          }}
        >
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <span className="font-bold text-amber-500">[RUNTIME TELEMETRY REQUIRED]</span>
              <span className="ml-1.5" style={{ color: 'var(--foreground-secondary)' }}>
                Real-time causal DAG tracing for "{currentRepoName}" requires the cluster telemetry collector. Demonstrating benchmark causal chain below.
              </span>
            </div>
          </div>
          <button
            onClick={() => resetToOnboarding()}
            className="px-3 py-1 rounded-lg border font-bold text-amber-500 hover:bg-amber-500/10 transition-colors shrink-0 cursor-pointer"
            style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}
          >
            Switch to Sample Project
          </button>
        </div>
      )}

      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--accent-green)' }}>
            <GitBranch className="w-4 h-4" />
            <span>[REASONING // 07.CAUSAL_DAG]</span>
          </div>
          <h2 className="text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
            Root Cause Visualization
          </h2>
          <p className="text-xs sm:text-sm font-sans" style={{ color: 'var(--foreground-secondary)' }}>
            Triangulated from symptom anomaly to deployment commit. Each causal link is independently verifiable.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <LiquidMagneticButton
            variant="primary"
            size="sm"
            onClick={() => navigateToAppTab('remediation', 'payment-service')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Review Remediation Diff →
          </LiquidMagneticButton>
        </div>
      </div>

      {/* 5-Stage Causal Chain */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-xs">
        {causalChain.map((chain, idx) => {
          const isSelected = selectedChainIndex === idx
          return (
            <button
              key={chain.stage}
              onClick={() => setSelectedChainIndex(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected ? 'shadow-xl scale-[1.03]' : ''
              }`}
              style={{
                backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'var(--surface-elevated)',
                borderColor: isSelected ? 'var(--accent-orange)' : 'var(--border)'
              }}
            >
              <div>
                <span className="text-[10px] block mb-1" style={{ color: 'var(--muted-foreground)' }}>
                  0{idx + 1} // {chain.stage}
                </span>
                <span className="font-bold text-xs line-clamp-2" style={{ color: 'var(--foreground)' }}>
                  {chain.title}
                </span>
              </div>
              <span className="text-[10px] mt-2 block truncate" style={{ color: 'var(--muted-foreground)' }}>
                {chain.component}
              </span>
            </button>
          )
        })}
      </div>

      {/* Active Causal Item Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div
          className="lg:col-span-7 rounded-3xl p-6 space-y-4 transition-colors"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div
            className="flex items-center justify-between pb-3 font-mono text-xs"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <span className="uppercase" style={{ color: 'var(--muted-foreground)' }}>
              Inspecting Causal Link: <strong style={{ color: 'var(--foreground)' }}>{activeItem.stage}</strong>
            </span>
            <span className="font-bold" style={{ color: 'var(--accent-green)' }}>{activeItem.type}</span>
          </div>

          <h3 className="text-xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
            {activeItem.title}
          </h3>

          <p className="text-xs sm:text-sm leading-relaxed font-sans" style={{ color: 'var(--foreground-secondary)' }}>
            {activeItem.desc}
          </p>

          <div
            className="p-3.5 rounded-xl font-mono text-xs space-y-1"
            style={{
              backgroundColor: 'var(--surface-interactive)',
              border: '1px solid var(--border)'
            }}
          >
            <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--accent-orange)' }}>
              Verification Proof & Ground Truth Signal:
            </div>
            <div className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>{activeItem.evidence}</div>
          </div>
        </div>

        {/* Counterfactual Rollback Simulator */}
        <div
          className="lg:col-span-5 rounded-3xl p-6 space-y-5 transition-colors"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div
            className="flex items-center justify-between pb-3 font-mono text-xs"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-sky-400" />
              <span className="font-bold" style={{ color: 'var(--foreground)' }}>Counterfactual Rollback Simulation</span>
            </div>
            <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>Confidence: 84%</span>
          </div>

          <p className="text-xs leading-relaxed font-sans" style={{ color: 'var(--foreground-secondary)' }}>
            "What would happen if Deployment #892 (commit e8a109f) were immediately rolled back to c9118d2?"
          </p>

          <div
            className="p-4 rounded-xl space-y-3 font-mono text-xs"
            style={{
              backgroundColor: 'var(--surface-interactive)',
              border: '1px solid var(--border)'
            }}
          >
            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--muted-foreground)' }}>Current Production Error Rate:</span>
              <strong className="text-rose-400">31.4%</strong>
            </div>

            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--muted-foreground)' }}>Estimated Post-Rollback Rate:</span>
              <strong className="text-emerald-400">~3.8% (Normal Baseline)</strong>
            </div>

            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--muted-foreground)' }}>Estimated Recovery Time:</span>
              <strong style={{ color: 'var(--foreground)' }}>~45 seconds</strong>
            </div>
          </div>

          <LiquidMagneticButton
            variant="glass"
            size="sm"
            className="w-full"
            onClick={() => setIsRollbackSimulated(!isRollbackSimulated)}
          >
            {isRollbackSimulated ? '✓ Rollback Prediction Validated' : 'Simulate Rollback Effect'}
          </LiquidMagneticButton>

          {isRollbackSimulated && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 animate-in fade-in duration-200">
              ✓ Prediction Confirmed: Rolling back commit e8a109f restores pool availability to 82% within 60s.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
