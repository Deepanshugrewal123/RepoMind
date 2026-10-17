import React, { useState } from 'react'
import confetti from 'canvas-confetti'
import { useApp } from '../../../context/AppContext'
import { LiquidMagneticButton } from '../../ui/LiquidMagneticButton'
import {
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Zap,
  Activity,
  Layers,
  Database
} from 'lucide-react'

export const ValidationView: React.FC = () => {
  const { isFixApplied, toggleFixApplied, navigateToAppTab } = useApp()
  const [isValidating, setIsValidating] = useState(false)

  const handleValidateFix = () => {
    setIsValidating(true)
    setTimeout(() => {
      setIsValidating(false)
      if (!isFixApplied) toggleFixApplied()

      // Fire celebratory confetti for successful validation
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        })
      } catch (err) {
        // Safe fallback if canvas not available
      }
    }, 900)
  }

  // Exact metrics requested:
  // BEFORE: Risk 91, Coupling 12, Coverage 42%
  // AFTER: Risk 67 ↓, Coupling 7 ↓, Coverage 69% ↑
  const comparisonData = [
    {
      label: 'PaymentService Risk Score',
      before: '91 / 100 (Critical)',
      after: '67 / 100 (Moderate)',
      delta: '-24 pts reduction',
      improved: true
    },
    {
      label: 'Architectural Coupling Degree',
      before: '12 dependencies',
      after: '7 dependencies',
      delta: '5 dependencies decoupled',
      improved: true
    },
    {
      label: 'Test Suite Branch Coverage',
      before: '42% covered',
      after: '69% covered',
      delta: '+27% test coverage',
      improved: true
    },
    {
      label: 'Database Connection Hold Duration',
      before: '1,420 ms / tx',
      after: '5.8 ms / tx',
      delta: '99.6% latency drop',
      improved: true
    },
    {
      label: 'System Health Overall Index',
      before: '72 / 100',
      after: '88 / 100',
      delta: '+16 pts overall recovery',
      improved: true
    }
  ]

  return (
    <div className="space-y-6 pb-20">
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--accent-green)' }}>
            <CheckCircle2 className="w-4 h-4" />
            <span>[VALIDATION // 09.CLOSED_LOOP_VERIFICATION]</span>
          </div>
          <h2 className="text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
            Validation & Closed-Loop Verification
          </h2>
          <p className="text-xs sm:text-sm font-sans" style={{ color: 'var(--foreground-secondary)' }}>
            Did the remediation actually improve system resilience? RepoMind objectively re-evaluates the architecture.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LiquidMagneticButton
            variant={isFixApplied ? 'glass' : 'primary'}
            size="sm"
            onClick={handleValidateFix}
            isLoading={isValidating}
            loadingText="Re-analyzing AST..."
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            {isFixApplied ? 'Re-run Validation Suite' : 'Execute & Validate Fix'}
          </LiquidMagneticButton>
        </div>
      </div>

      {/* Visually satisfying comparison table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* BEFORE CARD */}
        <div
          className="rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between transition-colors"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.06)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div>
            <div
              className="flex items-center justify-between pb-3"
              style={{ borderBottom: '1px solid rgba(239, 68, 68, 0.2)' }}
            >
              <span className="text-xs font-mono uppercase font-bold text-red-400 tracking-wider">
                BASELINE (BEFORE FIX)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30">
                Commit: e8a109f
              </span>
            </div>

            <div className="space-y-4 pt-4 font-mono text-xs">
              {comparisonData.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl flex items-center justify-between"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}
                >
                  <span style={{ color: 'var(--foreground-secondary)' }}>{item.label}</span>
                  <strong className="text-red-400 text-sm font-bold">{item.before}</strong>
                </div>
              ))}
            </div>
          </div>

          <div
            className="text-[11px] font-mono text-red-400 pt-2"
            style={{ borderTop: '1px solid rgba(239, 68, 68, 0.2)' }}
          >
            Result: 31.4% production checkout error rate during traffic bursts.
          </div>
        </div>

        {/* AFTER CARD */}
        <div
          className="rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-2xl transition-colors"
          style={{
            backgroundColor: 'rgba(52, 211, 153, 0.08)',
            border: '1px solid rgba(52, 211, 153, 0.35)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div>
            <div
              className="flex items-center justify-between pb-3"
              style={{ borderBottom: '1px solid rgba(52, 211, 153, 0.25)' }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase font-bold text-emerald-400 tracking-wider">
                  VERIFIED (AFTER REMEDIATION)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                Plan REM-892 Applied
              </span>
            </div>

            <div className="space-y-4 pt-4 font-mono text-xs">
              {comparisonData.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl flex items-center justify-between"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    border: '1px solid rgba(52, 211, 153, 0.25)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span style={{ color: 'var(--foreground)' }}>{item.label}</span>
                  </div>
                  <div className="text-right">
                    <strong className="text-emerald-400 text-sm font-bold block">{item.after}</strong>
                    <span className="text-[10px] text-emerald-400/80 font-normal">{item.delta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="text-[11px] font-mono text-emerald-400 pt-2 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(52, 211, 153, 0.25)' }}
          >
            <span>Result: Checkout error rate drops to &lt; 0.1% normal baseline.</span>
            <span className="font-bold">System Health: 88/100</span>
          </div>
        </div>
      </div>

      {/* Closed-Loop Continuous Learning Registry Entry */}
      <div
        className="rounded-3xl p-6 space-y-4 transition-colors"
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
            <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-orange)' }} />
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>Closed-Loop Learning Registry</span>
          </div>
          <span className="text-emerald-400">Entry #CLR-892 Enforced</span>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed font-sans" style={{ color: 'var(--foreground-secondary)' }}>
          The resolution of Incident #INC-2024-892 has been permanently indexed in RepoMind's continuous learning model. A custom AST lint guardrail has been synthesized to block any pull request wrapping external HTTP client calls inside SQL transactions.
        </p>

        <div
          className="p-3.5 rounded-2xl font-mono text-xs flex items-center justify-between transition-colors"
          style={{
            backgroundColor: 'var(--surface-interactive)',
            border: '1px solid var(--border)'
          }}
        >
          <span className="text-emerald-400">
            ✓ Guardrail: disallow-async-in-transaction-boundary.rego
          </span>
          <button
            onClick={() => navigateToAppTab('analytics')}
            className="font-bold transition-opacity hover:opacity-80"
            style={{ color: 'var(--accent-orange)' }}
          >
            View Engineering Fingerprint →
          </button>
        </div>
      </div>
    </div>
  )
}
