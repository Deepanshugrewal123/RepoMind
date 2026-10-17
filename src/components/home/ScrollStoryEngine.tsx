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
  Check,
  ChevronRight,
  Network,
  AlertTriangle,
  Zap,
  Clock,
  Compass
} from 'lucide-react'

interface StageMeta {
  id: string
  number: string
  eyebrow: string
  title: string
  titleItalic: string
  description: string
  badge: string
  accentColor: string
}

const STAGES: StageMeta[] = [
  {
    id: 'understand',
    number: '01',
    eyebrow: '01 // ARCHITECTURAL RECOVERY',
    title: 'Codebase to',
    titleItalic: 'Living Architecture.',
    description: 'Codebases are more than static directories. RepoMind extracts AST call-graphs, package manifests, and imports into a living service mesh with zero manual configuration.',
    badge: 'AST EXTRACTOR',
    accentColor: '#38bdf8'
  },
  {
    id: 'map',
    number: '02',
    eyebrow: '02 // COUPLING & TOPOLOGY',
    title: 'Every Connection',
    titleItalic: 'Mapped & Measured.',
    description: 'Calculates afferent (Ca) and efferent (Ce) coupling across all services. Identifies hidden cyclic dependencies and brittle synchronous bottlenecks.',
    badge: 'TOPOLOGY ENGINE',
    accentColor: '#f59e0b'
  },
  {
    id: 'detect',
    number: '03',
    eyebrow: '03 // RISK INTELLIGENCE',
    title: 'Multi-Dimensional Risk',
    titleItalic: 'Before It Breaks.',
    description: 'Triangulates code complexity, dependency concentration, and historical Git churn to compute calibrated risk scores and predict blast radius.',
    badge: 'BLAST RADIUS 94%',
    accentColor: '#f43f5e'
  },
  {
    id: 'investigate',
    number: '04',
    eyebrow: '04 // INCIDENT CAUSALITY',
    title: 'Incident Symptoms to',
    titleItalic: 'Exact Triggering Commit.',
    description: 'When runtime anomalies occur, RepoMind correlates OpenTelemetry trace spikes with recent Git changes to build a causal DAG pinpointing root cause in seconds.',
    badge: 'CAUSAL DAG',
    accentColor: '#fb7185'
  },
  {
    id: 'resolve',
    number: '05',
    eyebrow: '05 // REMEDIATION & VALIDATION',
    title: 'Actionable Patches with',
    titleItalic: 'Verified Risk Delta.',
    description: 'Generates AST-safe resolution runbooks and code patches that decouple transaction boundaries, proving risk reduction with before/after benchmarks.',
    badge: 'VERIFIED DELTA',
    accentColor: '#34d399'
  },
  {
    id: 'explore',
    number: '06',
    eyebrow: '06 // INTERACTIVE WORKSPACE',
    title: 'Explore the',
    titleItalic: 'Complete Platform.',
    description: 'Step into the full-featured RepoMind workspace. Inspect the verified CheckoutPlatform-v2.8 reference dataset or connect your engineering stack.',
    badge: 'SAMPLE READY',
    accentColor: '#f59e0b'
  }
]

export const ScrollStoryEngine: React.FC = () => {
  const { loadSampleProject, navigateToAppTab } = useApp()
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Stages state
  const [activeStage, setActiveStage] = useState(0)
  const [isAutoExploring, setIsAutoExploring] = useState(false)
  const autoPlayTimerRef = useRef<number | null>(null)
  const progressPercentRef = useRef<HTMLSpanElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Interactive node selector for Stage 2
  const [selectedNode, setSelectedNode] = useState('PaymentService')
  
  // Interactive timeline scrubber for Stage 4
  const [activeIncidentStep, setActiveIncidentStep] = useState(3)

  // Motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(media.matches)
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    }
  }, [])

  // Batched scroll position listener using requestAnimationFrame to advance/reverse stages
  useEffect(() => {
    if (prefersReducedMotion) return

    let rafId: number | null = null

    const handleScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const totalScrollable = rect.height - window.innerHeight
        if (totalScrollable <= 0) return

        // Calculate progress fraction: 0 when top is at top of screen, 1 when bottom reached
        const progress = Math.min(1, Math.max(0, -rect.top / totalScrollable))
        const percent = Math.round(progress * 100)

        // Directly update DOM to avoid 60fps React state re-renders across 800 LOC
        if (progressPercentRef.current) {
          progressPercentRef.current.textContent = `${percent}%`
        }
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${percent}%`
        }

        // Only trigger state update when active stage index actually changes
        const stageIdx = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length))
        setActiveStage((prev) => (prev !== stageIdx ? stageIdx : prev))
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [prefersReducedMotion])

  // Auto explore feature
  useEffect(() => {
    if (!isAutoExploring) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
      return
    }

    autoPlayTimerRef.current = window.setInterval(() => {
      setActiveStage((prev) => {
        const next = (prev + 1) % STAGES.length
        jumpToStage(next)
        return next
      })
    }, 4500)

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
    }
  }, [isAutoExploring])

  // Gracefully yield auto-explore when user initiates manual scrolling or touch
  useEffect(() => {
    if (!isAutoExploring) return

    const handleUserInteraction = () => {
      setIsAutoExploring(false)
    }

    window.addEventListener('wheel', handleUserInteraction, { passive: true })
    window.addEventListener('touchstart', handleUserInteraction, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleUserInteraction)
      window.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [isAutoExploring])

  // Direct jump to a stage by scrolling the window
  const jumpToStage = (idx: number) => {
    if (!containerRef.current) {
      setActiveStage(idx)
      return
    }

    const rect = containerRef.current.getBoundingClientRect()
    const containerTop = window.scrollY + rect.top
    const totalScrollable = rect.height - window.innerHeight
    const targetScrollY = containerTop + (idx / (STAGES.length - 1)) * totalScrollable

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    })
    setActiveStage(idx)

    const percent = Math.round((idx / (STAGES.length - 1)) * 100)
    if (progressPercentRef.current) {
      progressPercentRef.current.textContent = `${percent}%`
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${percent}%`
    }
  }

  const stage = STAGES[activeStage]

  return (
    <section
      id="scroll-story-engine"
      ref={containerRef}
      className={`relative w-full ${prefersReducedMotion ? 'min-h-screen py-16' : 'h-[360vh]'} transition-colors`}
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Anchor alias for cinematic-showcase */}
      <div id="cinematic-showcase" className="absolute -top-24 left-0" />

      {/* Pinned Sticky Stage Deck */}
      <div className={`${prefersReducedMotion ? 'relative' : 'sticky top-16'} min-h-[calc(100vh-4rem)] flex flex-col justify-between py-8 px-4 sm:px-8 max-w-7xl mx-auto z-20`}>
        
        {/* Top Control Bar: Stage Navigator & Auto-Explore Pill */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          
          {/* Stage Direct-Jump Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
            {STAGES.map((s, idx) => {
              const isActive = activeStage === idx
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setIsAutoExploring(false)
                    jumpToStage(idx)
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border border-[var(--border-highlight)] shadow-sm'
                      : 'opacity-60 hover:opacity-100 hover:bg-[var(--surface-interactive)]'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--surface-interactive)' : 'transparent',
                    color: isActive ? s.accentColor : 'var(--muted-foreground)'
                  }}
                >
                  <span className="font-bold">{s.number}</span>
                  <span className="hidden md:inline font-sans capitalize">{s.id}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.accentColor }} />}
                </button>
              )
            })}
          </div>

          {/* Right Controls: Auto-Explore Toggle & Progress Meter */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoExploring(!isAutoExploring)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs font-mono bg-[var(--surface-interactive)] hover:border-[var(--accent-orange)] transition-colors cursor-pointer"
              title="Automatically advance through product walkthrough"
            >
              {isAutoExploring ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[var(--foreground)]">Pause Experience</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                  <span className="text-[var(--muted-foreground)]">Auto Explore</span>
                </>
              )}
            </button>

            {/* Scroll Progress Indicator */}
            <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-[var(--muted-foreground)]">
              <span ref={progressPercentRef}>0%</span>
              <div className="w-16 h-1 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-75"
                  style={{ width: '0%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Stage Viewport (Two-Column Editorial Grid) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
          
          {/* Left Column: Stage Editorial Narrative */}
          <div className="lg:col-span-5 space-y-5 animate-in fade-in duration-300">
            {/* Technical Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[var(--surface-interactive)] border border-[var(--border)]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stage.accentColor }} />
              <span style={{ color: stage.accentColor }}>{stage.eyebrow}</span>
            </div>

            {/* Stage Title */}
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display leading-[1.08] text-[var(--foreground)]">
              {stage.title}{' '}
              <span
                className="font-editorial italic font-normal block text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${stage.accentColor}, #f1f5f9)`
                }}
              >
                {stage.titleItalic}
              </span>
            </h2>

            {/* Stage Description */}
            <p className="text-sm sm:text-base leading-relaxed text-[var(--foreground-secondary)] font-sans">
              {stage.description}
            </p>

            {/* Stage Key Points */}
            <div className="space-y-2 pt-1">
              {activeStage === 0 && (
                <div className="space-y-1.5 text-xs font-mono text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    <span>Language Server Protocol (LSP) symbol resolution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    <span>Identifies implicit RPC calls, REST routes, Kafka topics</span>
                  </div>
                </div>
              )}
              {activeStage === 1 && (
                <div className="space-y-1.5 text-xs font-mono text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Calculates Afferent (Ca=14) and Efferent (Ce=11) coupling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Detects hidden cyclic dependencies and single points of failure</span>
                  </div>
                </div>
              )}
              {activeStage === 2 && (
                <div className="space-y-1.5 text-xs font-mono text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>PaymentService flagged: 92/100 risk score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>94% blast radius reachability into OrderService & CheckoutWeb</span>
                  </div>
                </div>
              )}
              {activeStage === 3 && (
                <div className="space-y-1.5 text-xs font-mono text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-400" />
                    <span>Incident INC-2024-892 correlated with Commit 7f3a9b2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-400" />
                    <span>Postgres connection pool exhausted (98/100) due to lock delay</span>
                  </div>
                </div>
              )}
              {activeStage === 4 && (
                <div className="space-y-1.5 text-xs font-mono text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Decoupled DB transaction from external Stripe HTTP call</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Connection hold reduced from 1,420ms to 5.8ms (-99.6%)</span>
                  </div>
                </div>
              )}
              {activeStage === 5 && (
                <div className="space-y-1.5 text-xs font-mono text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Full 10-service e-commerce topology loaded & ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Explore interactive graphs, failure simulations, and runbooks</span>
                  </div>
                </div>
              )}
            </div>

            {/* Stage Quick Action CTA */}
            <div className="pt-2 flex items-center gap-3">
              {activeStage === 5 ? (
                <LiquidMagneticButton
                  variant="primary"
                  size="md"
                  onClick={loadSampleProject}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Verified Sample Project
                </LiquidMagneticButton>
              ) : (
                <button
                  onClick={() => jumpToStage((activeStage + 1) % STAGES.length)}
                  className="inline-flex items-center gap-2 text-xs font-mono text-amber-500 hover:text-amber-400 font-semibold cursor-pointer group"
                >
                  <span>Next Step: {STAGES[(activeStage + 1) % STAGES.length].id.toUpperCase()}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Dynamic Interactive Stage Visualizer */}
          <div className="lg:col-span-7">
            <div
              className="relative w-full rounded-3xl border p-5 sm:p-7 shadow-2xl backdrop-blur-md min-h-[420px] flex flex-col justify-between transition-colors overflow-hidden"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                borderColor: 'var(--border)',
                boxShadow: 'var(--card-shadow)'
              }}
            >
              {/* Corner Coordinate Labels */}
              <span className="absolute top-3 left-4 text-[10px] font-mono select-none" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>
                + [STAGE // {stage.number}]
              </span>
              <span className="absolute top-3 right-4 text-[10px] font-mono select-none" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>
                {stage.badge} +
              </span>

              {/* STAGE 01: UNDERSTAND (Abstract AST Resolution) */}
              {activeStage === 0 && (
                <div className="pt-4 space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2.5">
                      <Cpu className="w-4 h-4 text-sky-400" />
                      <span className="text-xs font-mono font-bold text-[var(--foreground)]">
                        Abstract Syntax Tree Extraction Pipeline
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      RESOLVED IN 1.2s
                    </span>
                  </div>

                  {/* Visual AST Code Hierarchy */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                    <div className="p-3.5 rounded-2xl bg-[var(--surface-interactive)] border border-[var(--border)] space-y-2">
                      <div className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5">
                        <Network className="w-3.5 h-3.5" />
                        <span>Discovered Boundaries</span>
                      </div>
                      <div className="space-y-1 text-[11px] text-[var(--muted-foreground)]">
                        <div>• 10 Microservices detected</div>
                        <div>• 13 Cross-boundary RPC / HTTP routes</div>
                        <div>• 4 Event-driven Kafka topics</div>
                        <div>• 2 Primary relational datastores</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[var(--surface-interactive)] border border-[var(--border)] space-y-2">
                      <div className="text-[11px] font-bold text-amber-500 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Coupling Index</span>
                      </div>
                      <div className="space-y-1 text-[11px] text-[var(--muted-foreground)]">
                        <div>• Average Efferent Coupling: 3.4</div>
                        <div>• Highest Fan-In: PaymentService (14)</div>
                        <div>• Instability Metric (I): 0.44 (Balanced)</div>
                        <div>• AST Call-graph Depth: 6 levels</div>
                      </div>
                    </div>
                  </div>

                  {/* Terminal Log Stream Preview */}
                  <div className="p-3 rounded-xl bg-black/40 border border-[var(--border-subtle)] font-mono text-[11px] space-y-1 text-zinc-400">
                    <div className="text-emerald-400">✔ Cloned repository manifest: cloud-mesh/checkout-platform</div>
                    <div className="text-sky-400">✔ Parsed 48 TypeScript AST files and 14 SQL migrations</div>
                    <div className="text-amber-400">⚡ Synthesized architectural graph in 1,240ms</div>
                  </div>
                </div>
              )}

              {/* STAGE 02: MAP (Interactive Service Topology Mesh) */}
              {activeStage === 1 && (
                <div className="pt-4 space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-mono font-bold text-[var(--foreground)]">
                        Interactive Topology Nodes (Select to Inspect)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                      5 Key Nodes Displayed
                    </span>
                  </div>

                  {/* Interactive Nodes Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono">
                    {[
                      { id: 'APIGateway', role: 'Ingress Edge', callers: 'Public', deps: '3 services', color: '#38bdf8' },
                      { id: 'PaymentService', role: 'Core Transaction', callers: '4 callers', deps: '11 dependencies', color: '#f59e0b' },
                      { id: 'OrderService', role: 'State Machine', callers: '2 callers', deps: '5 dependencies', color: '#a855f7' },
                      { id: 'PostgresPrimary', role: 'Relational DB', callers: '7 callers', deps: '0 dependencies', color: '#34d399' },
                      { id: 'KafkaBus', role: 'Event Broker', callers: '5 pub/sub', deps: '0 dependencies', color: '#ec4899' }
                    ].map((n) => {
                      const isSel = selectedNode === n.id
                      return (
                        <button
                          key={n.id}
                          onClick={() => setSelectedNode(n.id)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSel
                              ? 'border-amber-500 bg-amber-500/10 scale-[1.02] shadow-md'
                              : 'border-[var(--border)] bg-[var(--surface-interactive)] hover:border-[var(--border-highlight)]'
                          }`}
                        >
                          <div className="text-[10px] uppercase font-bold" style={{ color: n.color }}>{n.role}</div>
                          <div className="font-bold text-xs text-[var(--foreground)] my-1 truncate">{n.id}</div>
                          <div className="text-[10px] text-[var(--muted-foreground)] flex justify-between">
                            <span>{n.callers}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Active Selected Node Details Inspector */}
                  <div className="p-3.5 rounded-2xl bg-[var(--surface-interactive)] border border-[var(--border)] flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-[var(--muted-foreground)]">Inspecting Node: </span>
                      <strong className="text-amber-500">{selectedNode}</strong>
                      <span className="text-[11px] text-[var(--foreground-secondary)] ml-2">
                        {selectedNode === 'PaymentService' ? '(Afferent: 14 • Efferent: 11 • Critical Centrality)' : '(Coupled via synchronous REST & Kafka pub/sub)'}
                      </span>
                    </div>
                    <button
                      onClick={() => navigateToAppTab('architecture', selectedNode.toLowerCase())}
                      className="text-amber-500 hover:text-amber-400 font-bold hover:underline cursor-pointer shrink-0 ml-2"
                    >
                      Open in Graph →
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 03: DETECT (Risk Inspection & Blast Radius Rays) */}
              {activeStage === 2 && (
                <div className="pt-4 space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                      <span className="text-xs font-mono font-bold text-[var(--foreground)]">
                        Risk Hotspot Detected: PaymentService (92/100)
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      CRITICAL SEVERITY
                    </span>
                  </div>

                  {/* Blast Radius Rays Visualization */}
                  <div className="space-y-2 font-mono text-xs">
                    {[
                      { target: 'OrderService', impact: '94% Cascade Probability', note: 'Synchronous blocking RPC on checkout flow', color: '#f43f5e' },
                      { target: 'CheckoutWeb (Frontend)', impact: '89% Cascade Probability', note: '504 Gateway Timeout surface exposure', color: '#fb7185' },
                      { target: 'PostgresPrimary', impact: '78% Resource Saturation', note: 'Active connection hold duration exceeds threshold', color: '#f59e0b' }
                    ].map((ray, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-interactive)] flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-[var(--foreground)] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ray.color }} />
                            <span>➔ {ray.target}</span>
                          </div>
                          <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{ray.note}</div>
                        </div>
                        <span className="text-xs font-bold" style={{ color: ray.color }}>{ray.impact}</span>
                      </div>
                    ))}
                  </div>

                  {/* Evidence Drawer Note */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-500">
                    <strong>Evidence:</strong> Synchronous SQL Transaction holds connection during external Stripe API call at <code className="bg-black/40 px-1 py-0.5 rounded">settlement.ts:42</code>.
                  </div>
                </div>
              )}

              {/* STAGE 04: INVESTIGATE (Causal Incident Timeline) */}
              {activeStage === 3 && (
                <div className="pt-4 space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2.5">
                      <Flame className="w-4 h-4 text-rose-500" />
                      <span className="text-xs font-mono font-bold text-[var(--foreground)]">
                        Incident #INC-2024-892 • Causal DAG Timeline
                      </span>
                    </div>
                    <span className="text-rose-400 font-mono text-xs font-bold">
                      P0 • 31.4% Error Spike
                    </span>
                  </div>

                  {/* Interactive Timeline Steps */}
                  <div className="space-y-2 font-mono text-xs">
                    {[
                      { time: '14:31', label: 'Deploy #892 (Commit 7f3a9b2)', detail: 'Author: @alexm • "Rewrite settlement loop"', color: '#38bdf8' },
                      { time: '14:34', label: 'Payment Latency Elevated (+42%)', detail: 'p99 latency escalated to 2,450ms', color: '#f59e0b' },
                      { time: '14:35', label: 'Postgres Pool Saturation (98/100)', detail: 'Database connections held in wait-lock', color: '#f97316' },
                      { time: '14:36', label: 'Checkout 504 Timeouts', detail: '31.4% transaction failure rate observed', color: '#f43f5e' }
                    ].map((step, idx) => {
                      const isSel = activeIncidentStep === idx
                      return (
                        <div
                          key={idx}
                          onClick={() => setActiveIncidentStep(idx)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSel
                              ? 'border-rose-500 bg-rose-500/10'
                              : 'border-[var(--border)] bg-[var(--surface-interactive)] hover:border-[var(--border-highlight)]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-bold px-1.5 py-0.5 rounded text-[10px] bg-black/30" style={{ color: step.color }}>
                              {step.time}
                            </span>
                            <span className="font-semibold text-[var(--foreground)]">{step.label}</span>
                          </div>
                          <span className="text-[11px] text-[var(--muted-foreground)] hidden sm:inline">{step.detail}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Root Cause Conclusion Box */}
                  <div className="p-3 rounded-2xl bg-[var(--surface-interactive)] border border-[var(--border)] flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-400 font-semibold truncate">
                      Root Cause: Commit 7f3a9b2 wrapped Stripe HTTP request inside DB transaction lock.
                    </span>
                    <button
                      onClick={() => navigateToAppTab('incidents')}
                      className="text-amber-500 hover:text-amber-400 font-bold hover:underline cursor-pointer shrink-0 ml-2"
                    >
                      War Room →
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 05: RESOLVE (Remediation Diff & Before/After Telemetry) */}
              {activeStage === 4 && (
                <div className="pt-4 space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2.5">
                      <Wrench className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-mono font-bold text-[var(--foreground)]">
                        Remediation Plan REM-892: Decouple DB Transaction
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      VERIFIED PATCH
                    </span>
                  </div>

                  {/* AST Unified Code Patch Diff */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-[var(--border)] font-mono text-[11px] space-y-1.5 overflow-x-auto">
                    <div className="text-[10px] text-[var(--muted-foreground)] pb-1 border-b border-[var(--border-subtle)]">
                      src/services/payment/settlement.ts
                    </div>
                    <div className="text-red-400 bg-red-500/10 px-2.5 py-1 rounded line-through">
                      - const stripeRes = await stripeClient.charges.create(...); // INSIDE DB TX LOCK
                    </div>
                    <div className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
                      + await db.orders.updateStatus(orderId, 'PAYMENT_PENDING'); // Fast 2ms query
                    </div>
                    <div className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
                      + const stripeRes = await paymentCircuitBreaker.execute(...); // Async decoupled
                    </div>
                  </div>

                  {/* Before vs After Telemetry Comparison */}
                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-1">
                      <div className="text-[10px] font-bold text-red-400 uppercase">BEFORE REMEDIATION</div>
                      <div className="text-[11px] text-[var(--foreground-secondary)] flex justify-between">
                        <span>Connection Hold:</span>
                        <strong className="text-red-400">1,420 ms</strong>
                      </div>
                      <div className="text-[11px] text-[var(--foreground-secondary)] flex justify-between">
                        <span>Risk Score:</span>
                        <strong className="text-red-400">92 / 100</strong>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                      <div className="text-[10px] font-bold text-emerald-400 uppercase">VERIFIED AFTER FIX</div>
                      <div className="text-[11px] text-[var(--foreground-secondary)] flex justify-between">
                        <span>Connection Hold:</span>
                        <strong className="text-emerald-400">5.8 ms (-99.6%)</strong>
                      </div>
                      <div className="text-[11px] text-[var(--foreground-secondary)] flex justify-between">
                        <span>Risk Score:</span>
                        <strong className="text-emerald-400">24 / 100</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 06: EXPLORE (Command Deck Launchpad) */}
              {activeStage === 5 && (
                <div className="pt-4 space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-mono font-bold text-[var(--foreground)]">
                        RepoMind Platform Workspace • Verified Dataset
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      LIVE DEMO READY
                    </span>
                  </div>

                  {/* Ready Action Launchers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                    <button
                      onClick={loadSampleProject}
                      className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-interactive)] hover:border-amber-500 hover:bg-amber-500/10 text-left transition-all cursor-pointer group space-y-1"
                    >
                      <div className="font-bold text-sm text-[var(--foreground)] group-hover:text-amber-500 flex items-center justify-between">
                        <span>CheckoutPlatform-v2.8</span>
                        <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                      <div className="text-[11px] text-[var(--muted-foreground)]">
                        Launch full multi-service workspace with 10 microservices and verified incident runbooks.
                      </div>
                    </button>

                    <button
                      onClick={() => navigateToAppTab('architecture')}
                      className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-interactive)] hover:border-sky-500 hover:bg-sky-500/10 text-left transition-all cursor-pointer group space-y-1"
                    >
                      <div className="font-bold text-sm text-[var(--foreground)] group-hover:text-sky-400 flex items-center justify-between">
                        <span>Interactive Architecture</span>
                        <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                      <div className="text-[11px] text-[var(--muted-foreground)]">
                        Inspect dynamic force-directed call graph and blast radius calculations.
                      </div>
                    </button>
                  </div>

                  {/* Transparency Confirmation */}
                  <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-interactive)] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-[var(--foreground-secondary)]">
                        Zero tokens or installations required • Fully functional client demonstration
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--muted-foreground)]">
                <span>
                  Stage {stage.number} of 06 • {stage.id.toUpperCase()}
                </span>
                <span className="text-amber-500">
                  {activeStage < 5 ? 'Scroll down to advance ↓' : 'Ready for workspace exploration'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Pinned Status Bar */}
        <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--muted-foreground)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>TOPOLOGY_ENGINE // REALTIME_OBSERVABILITY</span>
          </div>
          <div className="hidden sm:inline">
            Scroll forward to inspect progression • Backward to reverse state
          </div>
        </div>

      </div>
    </section>
  )
}
