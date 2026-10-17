import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { LiquidMagneticButton } from '../ui/LiquidMagneticButton'
import { ContextualHelp } from './ContextualHelp'
import {
  X,
  ShieldAlert,
  CheckCircle2,
  FileCode,
  Flame,
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Search
} from 'lucide-react'

export const ExplainabilityDrawer: React.FC = () => {
  const { explainDrawer, closeExplainDrawer, navigateToAppTab, openAssistantWithPrompt } = useApp()
  const { isOpen, risk, component } = explainDrawer
  const [activeTier, setActiveTier] = useState<'level1' | 'level2' | 'level3'>('level1')

  if (!isOpen || !risk) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border)',
          color: 'var(--foreground)',
          boxShadow: 'var(--card-shadow)'
        }}
        className="w-full sm:max-w-xl h-full sm:h-[94vh] sm:mr-4 sm:rounded-2xl border flex flex-col overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-interactive)' }}
          className="p-4 border-b flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm font-display tracking-tight">Evidence & Explainability</span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  {risk.id}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono" style={{ color: 'var(--muted-foreground)' }}>
                <span>{risk.componentName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  Confidence: {risk.confidence}%
                  <ContextualHelp term="Confidence" />
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={closeExplainDrawer}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close explainability drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Progression Tabs: Simple First -> Evidence -> Deep AST */}
        <div 
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
          className="px-4 py-2 border-b flex items-center gap-1 text-xs"
        >
          <button
            onClick={() => setActiveTier('level1')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTier === 'level1'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold'
                : 'text-muted-foreground hover:text-foreground border border-transparent'
            }`}
            style={{ color: activeTier === 'level1' ? undefined : 'var(--muted-foreground)' }}
          >
            1. Plain English
          </button>
          <button
            onClick={() => setActiveTier('level2')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTier === 'level2'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold'
                : 'text-muted-foreground hover:text-foreground border border-transparent'
            }`}
            style={{ color: activeTier === 'level2' ? undefined : 'var(--muted-foreground)' }}
          >
            2. Triangulated Evidence
          </button>
          <button
            onClick={() => setActiveTier('level3')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTier === 'level3'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold'
                : 'text-muted-foreground hover:text-foreground border border-transparent'
            }`}
            style={{ color: activeTier === 'level3' ? undefined : 'var(--muted-foreground)' }}
          >
            3. Code AST & Graph
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Summary Banner */}
          <div 
            style={{ 
              backgroundColor: 'var(--surface-interactive)',
              borderColor: 'var(--border)'
            }}
            className="p-4 rounded-xl border space-y-1.5"
          >
            <div className="text-[11px] uppercase font-mono tracking-wider text-amber-500 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Detected Risk Assessment
            </div>
            <h3 className="text-base font-semibold font-display tracking-tight">{risk.title}</h3>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
              {risk.summary}
            </p>
          </div>

          {/* Level 1: Plain English Tab */}
          {activeTier === 'level1' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div 
                style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
                className="p-4 rounded-xl border space-y-2"
              >
                <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider font-mono">
                  Why this happens (Plain English)
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                  When traffic suddenly increases, this service tries to reconnect without waiting or limiting retries. Because it holds onto database slots while waiting, all available connections quickly get locked up, making other services time out.
                </p>
              </div>

              <div 
                style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
                className="p-4 rounded-xl border space-y-2"
              >
                <div className="text-xs font-semibold text-red-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  What breaks if unaddressed
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                  {risk.potentialImpact}
                </p>
              </div>

              <div 
                style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
                className="p-4 rounded-xl border space-y-2"
              >
                <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Recommended Fix
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                  {risk.remediationSummary}
                </p>
              </div>
            </div>
          )}

          {/* Level 2: Triangulated Evidence Tab */}
          {activeTier === 'level2' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-xs font-mono uppercase tracking-wider flex items-center justify-between" style={{ color: 'var(--muted-foreground)' }}>
                <span>Triangulated Proof Matrix</span>
                <span className="text-[10px] text-emerald-500 font-mono font-medium">Deterministic + AI Verified</span>
              </div>

              {/* Observed Ground Truth */}
              <div 
                style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
                className="p-3.5 rounded-xl border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-sky-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    1. Observed Ground Truth (Traces & Commits)
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    Telemetry
                  </span>
                </div>
                <ul className="space-y-2 text-xs" style={{ color: 'var(--foreground-secondary)' }}>
                  {risk.evidence.observed.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deterministic AST */}
              <div 
                style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
                className="p-3.5 rounded-xl border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-amber-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    2. Deterministic Graph & Call Hierarchy
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    AST Static
                  </span>
                </div>
                <ul className="space-y-2 text-xs" style={{ color: 'var(--foreground-secondary)' }}>
                  {risk.evidence.deterministic.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="font-mono text-[11px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Inference */}
              <div 
                style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
                className="p-3.5 rounded-xl border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    3. AI Inference & Blast Propagation
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {risk.confidence}% Model Confidence
                  </span>
                </div>
                <ul className="space-y-2 text-xs" style={{ color: 'var(--foreground-secondary)' }}>
                  {risk.evidence.inference.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Level 3: Code AST & Graph Details Tab */}
          {activeTier === 'level3' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
                Source Files & AST Graph Nodes
              </div>
              <div className="space-y-2">
                {risk.relatedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
                    className="px-3 py-2.5 rounded-lg border flex items-center justify-between text-xs font-mono transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="truncate" style={{ color: 'var(--foreground)' }}>{file}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 font-mono" style={{ color: 'var(--muted-foreground)' }}>
                      Cyclomatic: 14 • Coupl: 8
                    </span>
                  </div>
                ))}
              </div>

              <div 
                style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
                className="p-3.5 rounded-xl border space-y-2"
              >
                <div className="text-xs font-semibold uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-amber-500" />
                  AST Call Chain Trace
                </div>
                <div className="bg-black/10 dark:bg-black/40 p-3 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto" style={{ color: 'var(--foreground-secondary)' }}>
                  <code>
                    PaymentGateway.charge()<br />
                    &nbsp;↳ PoolManager.acquireConnection(timeout=0ms)<br />
                    &nbsp;&nbsp;↳ RetryPolicy.executeWithExponentialBackoff() [MISSING]<br />
                    &nbsp;&nbsp;&nbsp;↳ DatabaseSocketPool.exhausted [CRITICAL EXCEPTION]
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div 
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-interactive)' }}
          className="p-4 border-t flex flex-wrap items-center justify-between gap-3"
        >
          <button
            onClick={() => {
              closeExplainDrawer()
              openAssistantWithPrompt(`Can you explain the mathematical evidence for risk ${risk.id} in ${risk.componentName}?`)
            }}
            className="text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <span>Ask RepoMind about this</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
          </button>

          <div className="flex items-center gap-2">
            <LiquidMagneticButton
              variant="secondary"
              size="sm"
              onClick={() => {
                closeExplainDrawer()
                navigateToAppTab('blast-radius', risk.componentId)
              }}
            >
              Simulate Blast Radius
            </LiquidMagneticButton>

            <LiquidMagneticButton
              variant="primary"
              size="sm"
              onClick={() => {
                closeExplainDrawer()
                navigateToAppTab('remediation', risk.componentId)
              }}
            >
              View Code Patch →
            </LiquidMagneticButton>
          </div>
        </div>
      </div>
    </div>
  )
}

