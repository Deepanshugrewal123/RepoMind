import React, { useState } from 'react'
import { REMEDIATION_PLANS, RemediationPlan } from '../../../data/mockData'
import { useApp } from '../../../context/AppContext'
import { LiquidMagneticButton } from '../../ui/LiquidMagneticButton'
import {
  Wrench,
  CheckCircle2,
  FileCode,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Sparkles,
  GitPullRequest,
  Check,
  Copy
} from 'lucide-react'

export const RemediationView: React.FC = () => {
  const { openExplainDrawer, navigateToAppTab, toggleFixApplied, isFixApplied } = useApp()
  const [selectedPlanId, setSelectedPlanId] = useState<string>(REMEDIATION_PLANS[0].id)
  const [copiedCode, setCopiedCode] = useState(false)

  const activePlan =
    REMEDIATION_PLANS.find((p) => p.id === selectedPlanId) || REMEDIATION_PLANS[0]

  const handleCopy = () => {
    navigator.clipboard.writeText(activePlan.codePatch.afterCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <div className="space-y-6 pb-20">
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--accent-orange)' }}>
            <Wrench className="w-4 h-4" />
            <span>[REMEDIATION // 08.ACTIONABLE_RUNBOOKS]</span>
          </div>
          <h2 className="text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
            Prioritized Remediation & Code Patches
          </h2>
          <p className="text-xs sm:text-sm font-sans" style={{ color: 'var(--foreground-secondary)' }}>
            Actionable step-by-step resolution runbooks with reviewable AST-safe patch proposals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <LiquidMagneticButton
            variant="primary"
            size="sm"
            onClick={() => navigateToAppTab('validation')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Go to Validation Suite →
          </LiquidMagneticButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Remediation Plans Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--muted-foreground)' }}>
            Prioritized Action Plans
          </div>
          {REMEDIATION_PLANS.map((plan) => {
            const isSelected = plan.id === selectedPlanId
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer block ${
                  isSelected ? 'shadow-lg' : ''
                }`}
                style={{
                  backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'var(--surface-elevated)',
                  borderColor: isSelected ? 'var(--accent-orange)' : 'var(--border)'
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded font-bold"
                    style={{
                      backgroundColor: 'rgba(52, 211, 153, 0.15)',
                      color: 'var(--accent-green)',
                      border: '1px solid rgba(52, 211, 153, 0.3)'
                    }}
                  >
                    {plan.priority} PRIORITY
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>
                    Effort: {plan.effort}
                  </span>
                </div>
                <h4 className="font-bold text-sm line-clamp-1 mb-1 font-display" style={{ color: 'var(--foreground)' }}>
                  {plan.title}
                </h4>
                <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
                  {plan.componentName} • Impact: {plan.impact}
                </p>
              </button>
            )
          })}
        </div>

        {/* Right Column: Code Patch Diff & Runbook (8 cols) */}
        <div
          className="lg:col-span-8 rounded-3xl p-6 space-y-6 transition-colors"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div>
              <span className="text-[10px] font-mono uppercase font-bold" style={{ color: 'var(--accent-orange)' }}>
                {activePlan.id} • {activePlan.componentName}
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-display mt-0.5" style={{ color: 'var(--foreground)' }}>
                {activePlan.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openExplainDrawer(activePlan.riskId, activePlan.componentId)}
                className="text-xs font-mono font-medium transition-opacity hover:opacity-80"
                style={{ color: 'var(--accent-orange)' }}
              >
                View Evidence →
              </button>
            </div>
          </div>

          <div className="space-y-2 text-xs sm:text-sm">
            <div className="text-[11px] font-mono uppercase" style={{ color: 'var(--muted-foreground)' }}>Problem Description:</div>
            <p className="leading-relaxed font-sans" style={{ color: 'var(--foreground-secondary)' }}>{activePlan.problemDescription}</p>
          </div>

          {/* Implementation Steps */}
          <div className="space-y-2 font-mono text-xs">
            <div className="text-[11px] uppercase tracking-wider font-bold" style={{ color: 'var(--accent-green)' }}>
              Step-by-Step Implementation Runbook:
            </div>
            <div className="space-y-1.5">
              {activePlan.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border flex items-start gap-2.5 transition-colors"
                  style={{
                    backgroundColor: 'var(--surface-interactive)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--accent-green)' }} />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Code Patch Diff Viewer */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
                AST-Safe Code Patch ({activePlan.codePatch.file})
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-[11px] transition-colors hover:opacity-80 cursor-pointer"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Remediation'}</span>
              </button>
            </div>

            {/* Side-by-side or stacked diff */}
            <div
              className="rounded-2xl p-4 space-y-4 overflow-x-auto text-[11px] transition-colors"
              style={{
                backgroundColor: 'var(--surface-interactive)',
                border: '1px solid var(--border)'
              }}
            >
              <div>
                <span className="text-[10px] text-red-400 block mb-1 font-bold">
                  // BEFORE (Critical Vulnerability)
                </span>
                <pre className="text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/25 overflow-x-auto">
                  {activePlan.codePatch.beforeCode}
                </pre>
              </div>

              <div>
                <span className="text-[10px] text-emerald-400 block mb-1 font-bold">
                  // AFTER (Decoupled with Circuit Breaker)
                </span>
                <pre className="text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30 overflow-x-auto">
                  {activePlan.codePatch.afterCode}
                </pre>
              </div>
            </div>

            <p className="text-[11px] italic pt-1 font-sans" style={{ color: 'var(--muted-foreground)' }}>
              Rationale: {activePlan.codePatch.explanation}
            </p>
          </div>

          {/* Validation CTA */}
          <div
            className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
              Ready to verify metric improvement?
            </span>
            <LiquidMagneticButton
              variant="primary"
              size="md"
              onClick={() => {
                if (!isFixApplied) toggleFixApplied()
                navigateToAppTab('validation')
              }}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Apply Patch & Validate →
            </LiquidMagneticButton>
          </div>
        </div>
      </div>
    </div>
  )
}
