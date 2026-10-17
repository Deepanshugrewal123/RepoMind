import React, { useState, useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { LiquidMagneticButton } from '../ui/LiquidMagneticButton'
import {
  Layers,
  ShieldAlert,
  Flame,
  Activity,
  Cpu,
  GitBranch,
  Wrench,
  CheckCircle2,
  Sparkles,
  Play,
  Pause,
  ArrowRight,
  Maximize2,
  Code2,
  Info,
  Check,
  ChevronRight
} from 'lucide-react'

interface ShowcaseStage {
  id: string
  number: string
  code: string
  titleMain: string
  titleEmphasis: string
  subtitle: string
  category: string
  plainLanguage: string
  technicalSummary: string
  renderVisual: (onAction: () => void) => React.ReactNode
}

export const CinematicProductShowcase: React.FC = () => {
  const { navigateToAppTab, openExplainDrawer } = useApp()
  const [activeStageIndex, setActiveStageIndex] = useState(0)
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [isAutoPlaying, setIsAutoPlaying] = useState(!prefersReduced)
  const [progress, setProgress] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const isHoveredRef = useRef(false)
  const timerRef = useRef<number | null>(null)

  // Stage Duration (5.5 seconds per stage)
  const STAGE_DURATION_MS = 5500
  const TICK_INTERVAL_MS = 50

  // Interactive mini-states
  const [selectedArchNode, setSelectedArchNode] = useState<string>('PaymentService')
  const [incidentTimelineScrub, setIncidentTimelineScrub] = useState<number>(3)

  const stages: ShowcaseStage[] = [
    {
      id: 'understand',
      number: '01',
      code: 'UNDERSTAND',
      titleMain: 'Repository to Architecture.',
      titleEmphasis: 'Visualized dynamically.',
      subtitle: 'See how your software components actually connect before changing them.',
      category: 'Architecture Intelligence',
      plainLanguage: 'RepoMind extracts abstract syntax trees (AST) and import graphs, transforming static directories into an interactive architectural topology.',
      technicalSummary: 'AST call-graph extraction • Transitive dependency clustering • Efferent/Afferent coupling analysis',
      renderVisual: (onAction) => (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5 font-mono text-xs select-none">
          <div className="flex items-center justify-between pb-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Service Topology & Dependency Mesh</span>
            </div>
            <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>10 services • 13 connections</span>
          </div>

          {/* Interactive Topology Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-3">
            {[
              { id: 'APIGateway', type: 'Ingress Edge', loc: '4.8k LOC', deps: '4 deps', accent: '#38bdf8' },
              { id: 'PaymentService', type: 'Core Service', loc: '18.4k LOC', deps: '11 deps (Critical)', accent: '#f59e0b' },
              { id: 'PostgresPrimary', type: 'Data Store', loc: '3.2k Queries', deps: '7 callers', accent: '#34d399' }
            ].map((node) => (
              <button
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedArchNode(node.id)
                }}
                className="p-3 rounded-xl border text-left transition-all cursor-pointer"
                style={{
                  backgroundColor: selectedArchNode === node.id ? 'rgba(245, 158, 11, 0.12)' : 'var(--surface-interactive)',
                  borderColor: selectedArchNode === node.id ? 'var(--accent-orange)' : 'var(--border)',
                  transform: selectedArchNode === node.id ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{node.type}</div>
                <div className="font-bold text-sm my-1" style={{ color: 'var(--foreground)' }}>{node.id}</div>
                <div className="flex justify-between text-[11px]" style={{ color: 'var(--foreground-secondary)' }}>
                  <span>{node.loc}</span>
                  <span className="font-bold" style={{ color: node.accent }}>{node.deps}</span>
                </div>
              </button>
            ))}
          </div>

          <div
            className="p-2.5 rounded-xl border flex items-center justify-between text-[11px]"
            style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
          >
            <span style={{ color: 'var(--foreground-secondary)' }}>
              Active node: <strong className="text-amber-500">{selectedArchNode}</strong> (Afferent coupling Ca=14)
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAction()
              }}
              className="text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Open Graph →
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'predict',
      number: '02',
      code: 'PREDICT',
      titleMain: 'Multi-dimensional risk.',
      titleEmphasis: 'Before production failures.',
      subtitle: 'Identify fragile architectural hotspots and single-maintainer bottlenecks.',
      category: 'Risk Intelligence',
      plainLanguage: 'Triangulates code complexity, dependency concentration, and historical Git churn to compute calibrated risk scores with evidence.',
      technicalSummary: 'Cyclomatic complexity parsing • Churn heatmaps • Maintainer bus-factor entropy • Transitive reachability',
      renderVisual: (onAction) => (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5 text-xs font-mono select-none">
          <div className="flex items-center justify-between pb-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>System Health Index: 72 / 100</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              3 HOTSPOTS DETECTED
            </span>
          </div>

          <div className="space-y-2 my-2">
            {[
              { label: 'Architecture Coupling', score: 72, color: '#f59e0b', note: 'PaymentService ➔ 11 deps' },
              { label: 'Fault-Tolerance Deficit', score: 58, color: '#ef4444', note: 'Stripe client lacks circuit breaker' },
              { label: 'Database Saturation Risk', score: 46, color: '#f43f5e', note: 'Pool exhaust under 3x load' }
            ].map((risk, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl border"
                style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-sans font-medium" style={{ color: 'var(--foreground)' }}>{risk.label}</span>
                  <span className="font-bold">{risk.score}/100</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden mb-1" style={{ backgroundColor: 'var(--border-subtle)' }}>
                  <div className="h-full rounded-full" style={{ width: `${risk.score}%`, backgroundColor: risk.color }} />
                </div>
                <div className="text-[10px] flex items-center justify-between" style={{ color: 'var(--muted-foreground)' }}>
                  <span>⚠ {risk.note}</span>
                  <span className="text-amber-500">92% confidence</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 border-t text-[11px]" style={{ borderColor: 'var(--border)' }}>
            <span style={{ color: 'var(--muted-foreground)' }}>Triangulated from AST & Git churn</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAction()
              }}
              className="text-amber-500 hover:text-amber-400 font-semibold cursor-pointer"
            >
              Inspect Risk Matrix →
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'investigate',
      number: '03',
      code: 'INVESTIGATE',
      titleMain: 'Triangulated root cause.',
      titleEmphasis: 'Traced to the exact commit.',
      subtitle: 'Connect deployment events, latency spikes, and SQL connection holding.',
      category: 'Incident Correlator',
      plainLanguage: 'When an error occurs, RepoMind links production symptoms directly to the triggering pull request and code lines.',
      technicalSummary: 'Distributed trace span analysis • Anomaly change-point detection • Git blame correlation • Causal reasoning DAG',
      renderVisual: (onAction) => (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5 text-xs font-mono select-none">
          <div className="flex items-center justify-between pb-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Active Incident: #INC-2024-892</span>
            </div>
            <span className="text-rose-500 font-bold text-[10px]">P0 • ERROR SPIKE 31.4%</span>
          </div>

          <div className="my-2 space-y-1.5">
            {[
              { time: '14:31', label: 'Deploy #892 (Commit e8a109f)', note: 'Rewrite settlement loop', color: '#38bdf8' },
              { time: '14:34', label: 'Payment Latency Elevated (+42%)', note: 'p99 jumped to 2,450ms', color: '#f59e0b' },
              { time: '14:35', label: 'Postgres Pool Exhaustion (98/100)', note: 'Connections held in lock', color: '#f97316' },
              { time: '14:36', label: 'Checkout 504 Gateway Timeouts', note: '31.4% failure spike', color: '#f43f5e' }
            ].map((step, idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  setIncidentTimelineScrub(idx)
                }}
                className="p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between"
                style={{
                  backgroundColor: incidentTimelineScrub === idx ? 'var(--surface-interactive)' : 'transparent',
                  borderColor: incidentTimelineScrub === idx ? 'var(--accent-orange)' : 'var(--border-subtle)'
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: step.color }}>{step.time}</span>
                  <span style={{ color: 'var(--foreground)' }}>{step.label}</span>
                </div>
                <span className="text-[10px] hidden sm:inline" style={{ color: 'var(--muted-foreground)' }}>{step.note}</span>
              </div>
            ))}
          </div>

          <div
            className="p-2.5 rounded-xl border flex items-center justify-between text-[11px]"
            style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
          >
            <span className="text-rose-400 truncate max-w-[280px]">
              Root Cause: Commit e8a109f held DB lock across external HTTP call
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAction()
              }}
              className="text-amber-500 hover:text-amber-400 font-semibold cursor-pointer shrink-0 ml-2"
            >
              War Room →
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'resolve',
      number: '04',
      code: 'RESOLVE',
      titleMain: 'Actionable code patches.',
      titleEmphasis: 'Reviewable AST diffs.',
      subtitle: 'Review prioritized remediation runbooks before shipping fixes to production.',
      category: 'Remediation Engine',
      plainLanguage: 'RepoMind generates step-by-step resolution runbooks and verifiable code diffs that isolate failures and decouple transaction boundaries.',
      technicalSummary: 'AST-safe patch generation • Transaction decoupling • Circuit-breaker synthesis • Scope isolation',
      renderVisual: (onAction) => (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5 text-xs font-mono select-none">
          <div className="flex items-center justify-between pb-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Plan REM-892: Decouple SQL Transaction</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: 'rgba(52, 211, 153, 0.15)', color: 'var(--accent-green)', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              PRIORITY #1
            </span>
          </div>

          {/* Code Patch Diff */}
          <div
            className="my-2.5 rounded-xl border p-3 text-[11px] overflow-hidden space-y-1.5"
            style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
          >
            <div className="text-[10px] pb-1 border-b" style={{ borderColor: 'var(--border-subtle)', color: 'var(--muted-foreground)' }}>
              src/services/payment/settlement.ts
            </div>
            <div className="text-red-400 bg-red-500/10 px-2 py-1 rounded line-through">
              - const stripeRes = await stripeClient.charges.create(...); // INSIDE DB TX LOCK
            </div>
            <div className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
              + await db.orders.updateStatus(orderId, 'PAYMENT_PENDING'); // Fast 2ms query
            </div>
            <div className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
              + const stripeRes = await paymentCircuitBreaker.execute(...); // Non-blocking
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t text-[11px]" style={{ borderColor: 'var(--border)' }}>
            <span style={{ color: 'var(--muted-foreground)' }}>Reduces connection hold duration from 1,420ms to 5.8ms</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAction()
              }}
              className="text-amber-500 hover:text-amber-400 font-semibold cursor-pointer"
            >
              View Full Diff →
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'validate',
      number: '05',
      code: 'VALIDATE',
      titleMain: 'Objective validation.',
      titleEmphasis: 'Quantifiable risk reduction.',
      subtitle: 'Differential comparison proving the fix actually eliminated the risk.',
      category: 'Verification Sandbox',
      plainLanguage: 'Did the change actually solve the issue? RepoMind re-runs the architecture analysis to verify Before vs After metrics.',
      technicalSummary: 'Differential risk delta • Coupling reduction check • Latency regression benchmark • Before/After AST verification',
      renderVisual: (onAction) => (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5 text-xs font-mono select-none">
          <div className="flex items-center justify-between pb-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Validation: Before vs After Remediation</span>
            </div>
            <span className="font-bold text-emerald-400">+16 PTS HEALTH RECOVERY</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 my-2.5">
            <div
              className="p-3 rounded-xl border"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <div className="text-[10px] text-red-400 uppercase font-bold mb-1.5">BEFORE REMEDIATION</div>
              <div className="space-y-1 text-[11px]" style={{ color: 'var(--foreground-secondary)' }}>
                <div className="flex justify-between"><span>Risk Score:</span><strong className="text-red-400">91 (Critical)</strong></div>
                <div className="flex justify-between"><span>DB Hold:</span><strong>1,420 ms</strong></div>
                <div className="flex justify-between"><span>Error Spike:</span><strong className="text-red-400">31.4%</strong></div>
              </div>
            </div>

            <div
              className="p-3 rounded-xl border"
              style={{ backgroundColor: 'rgba(52, 211, 153, 0.08)', borderColor: 'rgba(52, 211, 153, 0.3)' }}
            >
              <div className="text-[10px] text-emerald-400 uppercase font-bold mb-1.5">VERIFIED AFTER FIX</div>
              <div className="space-y-1 text-[11px]" style={{ color: 'var(--foreground-secondary)' }}>
                <div className="flex justify-between"><span>Risk Score:</span><strong className="text-emerald-400">67 (Medium) ↓</strong></div>
                <div className="flex justify-between"><span>DB Hold:</span><strong className="text-emerald-400">5.8 ms ↓</strong></div>
                <div className="flex justify-between"><span>Error Spike:</span><strong className="text-emerald-400">&lt; 0.1% ↓</strong></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t text-[11px]" style={{ borderColor: 'var(--border)' }}>
            <span style={{ color: 'var(--muted-foreground)' }}>Deterministic AST differential verified</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAction()
              }}
              className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
            >
              Inspect Validation Report →
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'learn',
      number: '06',
      code: 'LEARN',
      titleMain: 'Closed-loop learning.',
      titleEmphasis: 'Synthesized CI guardrails.',
      subtitle: 'Feed validated incident learnings back into pre-merge guardrails.',
      category: 'Continuous Learning',
      plainLanguage: 'Every resolved failure generates preventive AST lint rules that automatically block duplicate anti-patterns in future PRs.',
      technicalSummary: 'Rule generation from causal incidents • CI/CD lint enforcement • Rego policy synthesis • Drift deterrence',
      renderVisual: (onAction) => (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5 text-xs font-mono select-none">
          <div className="flex items-center justify-between pb-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-orange)' }} />
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Synthesized CI Guardrails</span>
            </div>
            <span className="font-bold text-emerald-400">ENTRY #CLR-892 ENFORCED</span>
          </div>

          <div className="my-2 space-y-1.5">
            {[
              { rule: 'Guardrail #1', desc: 'Disallow external async HTTP calls inside SQL transaction scopes', status: 'Enforced via AST linter' },
              { rule: 'Guardrail #2', desc: 'Warn when database connection acquisition hold exceeds 250ms', status: 'Prometheus Alert Synced' },
              { rule: 'Guardrail #3', desc: 'Require 2 peer approvals when maintainer Bus Factor equals 1', status: 'GitHub Branch Rule' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl border flex items-center justify-between"
                style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
              >
                <div>
                  <div className="font-bold text-[11px]" style={{ color: 'var(--foreground)' }}>{item.rule}</div>
                  <div className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 shrink-0 ml-2">
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 border-t text-[11px]" style={{ borderColor: 'var(--border)' }}>
            <span style={{ color: 'var(--muted-foreground)' }}>Closed-loop feedback actively protects main</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAction()
              }}
              className="text-amber-500 hover:text-amber-400 font-semibold cursor-pointer"
            >
              View Engineering Discipline →
            </button>
          </div>
        </div>
      )
    }
  ]

  const currentStage = stages[activeStageIndex]

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    const interval = setInterval(() => {
      if (isHoveredRef.current) return // pause when user is interacting

      setProgress((prev) => {
        const next = prev + (TICK_INTERVAL_MS / STAGE_DURATION_MS) * 100
        if (next >= 100) {
          setActiveStageIndex((current) => (current + 1) % stages.length)
          return 0
        }
        return next
      })
    }, TICK_INTERVAL_MS)

    timerRef.current = interval as unknown as number

    return () => clearInterval(interval)
  }, [isAutoPlaying, activeStageIndex, stages.length])

  const handleStageSelect = (idx: number) => {
    setActiveStageIndex(idx)
    setProgress(0)
  }

  const handleToggleAutoPlay = () => {
    setIsAutoPlaying((prev) => !prev)
  }

  const handleNavigateToActiveFeature = () => {
    switch (currentStage.id) {
      case 'understand':
        navigateToAppTab('architecture', 'payment-service')
        break
      case 'predict':
        navigateToAppTab('risks', 'payment-service')
        break
      case 'investigate':
        navigateToAppTab('incidents')
        break
      case 'resolve':
        navigateToAppTab('remediation', 'payment-service')
        break
      case 'validate':
        navigateToAppTab('validation')
        break
      case 'learn':
        navigateToAppTab('analytics')
        break
      default:
        navigateToAppTab('overview')
    }
  }

  return (
    <section id="cinematic-showcase" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto relative">
      {/* Outer Technical Bounding Box inspired by Reference Video */}
      <div
        className="rounded-3xl border relative transition-colors duration-300"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--card-shadow)'
        }}
      >
        {/* Technical Coordinate Indicators in Corners */}
        <span className="absolute top-3.5 left-4 text-[10px] font-mono select-none" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>
          + [POS // {currentStage.number}.06] — REPOMIND INTELLIGENCE SYSTEM
        </span>
        <span className="absolute top-3.5 right-4 text-[10px] font-mono select-none hidden sm:inline" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>
          STREAM // ACTIVE +
        </span>
        <span className="absolute bottom-3.5 left-4 text-[10px] font-mono select-none hidden sm:inline" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>
          + [SYS_OK] DETERMINISTIC_AST_ANALYSIS
        </span>

        {/* Floating Pill Auto-Play / Pause Control in Bottom Right corner */}
        <div className="absolute bottom-3.5 right-4 z-20">
          <button
            onClick={handleToggleAutoPlay}
            className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.03] active:scale-[0.98] shadow-md"
            style={{
              backgroundColor: 'var(--surface-interactive)',
              borderColor: isAutoPlaying ? 'var(--accent-orange)' : 'var(--border)',
              color: isAutoPlaying ? 'var(--foreground)' : 'var(--muted-foreground)'
            }}
            aria-label={isAutoPlaying ? 'Pause automatic exploration' : 'Resume automatic exploration'}
          >
            {/* Animated progress indicator */}
            <div className="relative w-3.5 h-3.5 flex items-center justify-center">
              {isAutoPlaying ? (
                <>
                  <Pause className="w-3 h-3 text-amber-500" />
                  <svg className="absolute -inset-1 w-5 h-5 -rotate-90 pointer-events-none">
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      className="opacity-20 text-amber-500"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray={50}
                      strokeDashoffset={50 - (progress / 100) * 50}
                      className="text-amber-500 transition-all duration-75"
                    />
                  </svg>
                </>
              ) : (
                <Play className="w-3 h-3 text-slate-400" />
              )}
            </div>
            <span>{isAutoPlaying ? 'PAUSE EXPERIENCE' : 'AUTO EXPLORE'}</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="p-6 sm:p-10 pt-12 sm:pt-14 pb-14 sm:pb-16 space-y-8">
          {/* Stage Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            {stages.map((stg, idx) => {
              const isCurrent = idx === activeStageIndex
              return (
                <button
                  key={stg.id}
                  onClick={() => handleStageSelect(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                    isCurrent ? 'shadow-sm' : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: isCurrent ? 'rgba(245, 158, 11, 0.14)' : 'var(--surface-interactive)',
                    borderColor: isCurrent ? 'var(--accent-orange)' : 'var(--border)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    color: isCurrent ? 'var(--accent-orange)' : 'var(--muted-foreground)'
                  }}
                >
                  <span className="font-bold">{stg.number}</span>
                  <span>{stg.code}</span>
                </button>
              )
            })}
          </div>

          {/* Main 2-Column Split: Editorial Typography (Left) + Layered Spatial Product Windows (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[460px]">
            {/* Left Column: Typography-Driven Narrative */}
            <div className="lg:col-span-5 space-y-4">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold"
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: 'var(--accent-orange)'
                }}
              >
                <span>{currentStage.number} // {currentStage.category.toUpperCase()}</span>
              </div>

              {/* Headline with contrasting editorial italic serif */}
              <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display leading-[1.12]" style={{ color: 'var(--foreground)' }}>
                {currentStage.titleMain}<br />
                <span className="font-editorial italic font-normal text-amber-500">
                  {currentStage.titleEmphasis}
                </span>
              </h3>

              <p className="text-sm sm:text-base font-sans leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                {currentStage.plainLanguage}
              </p>

              {/* Expandable Technical Details Button */}
              <div className="pt-1">
                <button
                  onClick={() => setDetailsOpen(!detailsOpen)}
                  className="text-xs font-mono flex items-center gap-1.5 cursor-pointer hover:underline"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{detailsOpen ? 'Hide AST analysis parameters' : 'Inspect AST methodology & formulas'}</span>
                </button>

                {detailsOpen && (
                  <div
                    className="mt-2.5 p-3 rounded-xl border text-xs font-mono animate-in fade-in duration-200"
                    style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)', color: 'var(--foreground-secondary)' }}
                  >
                    <div className="text-[10px] uppercase font-bold text-amber-500 mb-1">Theoretical Ground Truth:</div>
                    <p className="text-[11px] leading-relaxed">{currentStage.technicalSummary}</p>
                  </div>
                )}
              </div>

              {/* Action Link */}
              <div className="pt-3">
                <LiquidMagneticButton
                  variant="primary"
                  size="md"
                  onClick={handleNavigateToActiveFeature}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore in Platform Workspace
                </LiquidMagneticButton>
              </div>
            </div>

            {/* Right Column: Layered Spatial Product Windows */}
            <div
              className="lg:col-span-7 relative h-[380px] sm:h-[420px] flex items-center justify-center"
              onMouseEnter={() => {
                isHoveredRef.current = true
              }}
              onMouseLeave={() => {
                isHoveredRef.current = false
              }}
            >
              {/* Layer 3: Faint background card */}
              <div
                className="absolute w-[88%] h-[320px] rounded-2xl border opacity-30 shadow-md pointer-events-none transition-all duration-500"
                style={{
                  backgroundColor: 'var(--surface-interactive)',
                  borderColor: 'var(--border)',
                  transform: 'translateY(-28px) scale(0.92) perspective(1000px) rotateX(4deg)'
                }}
              />

              {/* Layer 2: Midground subtle card */}
              <div
                className="absolute w-[94%] h-[350px] rounded-2xl border opacity-60 shadow-lg pointer-events-none transition-all duration-500"
                style={{
                  backgroundColor: 'var(--surface-interactive)',
                  borderColor: 'var(--border)',
                  transform: 'translateY(-14px) scale(0.96) perspective(1000px) rotateX(2deg)'
                }}
              />

              {/* Layer 1: Foreground Active Interactive Product Window */}
              <div
                className="relative w-full h-[370px] sm:h-[400px] rounded-2xl border overflow-hidden transition-all duration-500 shadow-2xl"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--border)',
                  boxShadow: 'var(--card-shadow)',
                  transform: 'translateY(0) scale(1) perspective(1000px)'
                }}
              >
                {/* Title Bar with Coordinate URI and Live Simulation Badge */}
                <div
                  className="px-4 py-2.5 border-b flex items-center justify-between transition-colors"
                  style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-[11px] font-mono" style={{ color: 'var(--muted-foreground)' }}>
                      repomind://system/{currentStage.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded border font-semibold" style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', color: 'var(--accent-green)', borderColor: 'rgba(52, 211, 153, 0.25)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    SIMULATED ENVIRONMENT
                  </div>
                </div>

                {/* Render Stage Specific Visual */}
                <div className="w-full h-[calc(100%-41px)] overflow-hidden">
                  {currentStage.renderVisual(handleNavigateToActiveFeature)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
