import React, { useState, useEffect, useRef, useCallback } from 'react'
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
  ChevronRight,
  Network,
  AlertTriangle,
  Code2
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
    description: 'Codebases are more than static folders. RepoMind extracts AST call-graphs, package manifests, and imports into a living service mesh with zero manual configuration.',
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
  
  const [activeStage, setActiveStage] = useState(0)
  const [isAutoExploring, setIsAutoExploring] = useState(false)
  const autoPlayTimerRef = useRef<number | null>(null)
  const progressPercentRef = useRef<HTMLSpanElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const lastPercentRef = useRef<number>(-1)

  const [activeIncidentStep, setActiveIncidentStep] = useState(3)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Cached layout geometry to eliminate getBoundingClientRect() forced reflows inside scroll loop
  const geometryRef = useRef({ top: 0, height: 0, totalScrollable: 0 })

  const updateGeometry = useCallback(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const top = window.scrollY + rect.top
    const height = rect.height
    const totalScrollable = Math.max(1, height - window.innerHeight)
    geometryRef.current = { top, height, totalScrollable }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(media.matches)
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    }
  }, [])

  // Geometry cache initialization and resize observer
  useEffect(() => {
    updateGeometry()
    window.addEventListener('resize', updateGeometry, { passive: true })
    return () => window.removeEventListener('resize', updateGeometry)
  }, [updateGeometry])

  // Ultra-fluid scroll position listener using requestAnimationFrame and cached geometry
  useEffect(() => {
    if (prefersReducedMotion) return

    let rafId: number | null = null

    const handleScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const { top, totalScrollable } = geometryRef.current
        if (totalScrollable <= 0) return

        const scrollY = window.scrollY
        const relativeScroll = scrollY - top
        const progress = Math.min(1, Math.max(0, relativeScroll / totalScrollable))
        const percent = Math.round(progress * 100)

        // Direct DOM update avoiding React re-renders during high-frequency scroll ticks
        if (lastPercentRef.current !== percent) {
          lastPercentRef.current = percent
          if (progressPercentRef.current) {
            progressPercentRef.current.textContent = `${percent}%`
          }
        }
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${progress})`
        }

        // Only update active stage state when crossing threshold
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
    updateGeometry()
    const { top, totalScrollable } = geometryRef.current
    const targetScrollY = top + (idx / (STAGES.length - 1)) * totalScrollable

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
      progressBarRef.current.style.transform = `scaleX(${idx / (STAGES.length - 1)})`
    }
  }

  const stage = STAGES[activeStage]

  return (
    <section
      id="scroll-story-engine"
      ref={containerRef}
      className={`relative w-full ${prefersReducedMotion ? 'min-h-screen py-16' : 'h-[360vh]'}`}
      style={{ backgroundColor: 'var(--background)' }}
    >
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-300 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
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
              <span ref={progressPercentRef} className="tabular-nums inline-block w-8 text-right">0%</span>
              <div className="w-16 h-1 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 w-full origin-left will-change-transform"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Stage Viewport: Two-Column Editorial Grid with Continuous GPU Crossfade Deck */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
          
          {/* Left Column: Persistent Crossfade Narrative Deck */}
          <div className="lg:col-span-5 relative min-h-[380px] sm:min-h-[420px] flex items-center">
            {STAGES.map((s, idx) => {
              const isActive = activeStage === idx
              const isAdjacent = Math.abs(idx - activeStage) <= 1
              const isPrev = idx < activeStage

              if (!isAdjacent) {
                return (
                  <div
                    key={s.id}
                    className="opacity-0 pointer-events-none absolute inset-0 z-0 invisible"
                    aria-hidden="true"
                  />
                )
              }

              return (
                <div
                  key={s.id}
                  className={`space-y-5 transition-[opacity,transform] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive
                      ? 'opacity-100 translate-y-0 pointer-events-auto relative z-10 visible'
                      : `opacity-0 pointer-events-none absolute inset-0 z-0 visible ${isPrev ? '-translate-y-4' : 'translate-y-4'}`
                  }`}
                  style={isActive ? { willChange: 'transform, opacity' } : undefined}
                >
                  {/* Clean Technical Eyebrow */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[var(--surface-interactive)] border border-[var(--border)]">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.accentColor }} />
                    <span style={{ color: s.accentColor }}>{s.eyebrow}</span>
                  </div>

                  {/* Stage Title */}
                  <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display leading-[1.08] text-[var(--foreground)]">
                    {s.title}{' '}
                    <span
                      className="font-editorial italic font-normal block text-transparent bg-clip-text"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${s.accentColor}, #f1f5f9)`
                      }}
                    >
                      {s.titleItalic}
                    </span>
                  </h2>

                  {/* Stage Description */}
                  <p className="text-sm sm:text-base leading-relaxed text-[var(--foreground-secondary)] font-sans">
                    {s.description}
                  </p>

                  {/* Stage Highlights */}
                  <div className="space-y-2 pt-1">
                    {idx === 0 && (
                      <div className="space-y-1.5 text-xs font-mono text-[var(--muted-foreground)]">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-sky-400" />
                          <span>Language Server Protocol (LSP) AST symbol parsing</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-sky-400" />
                          <span>Identifies implicit RPC calls, REST routes & queues</span>
                        </div>
                      </div>
                    )}
                    {idx === 1 && (
                      <div className="space-y-1.5 text-xs font-mono text-[var(--muted-foreground)]">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-400" />
                          <span>Calculates Afferent (Ca) and Efferent (Ce) coupling</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-400" />
                          <span>Highlights single points of failure & synchronous locks</span>
                        </div>
                      </div>
                    )}
                    {idx === 2 && (
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
                    {idx === 3 && (
                      <div className="space-y-1.5 text-xs font-mono text-[var(--muted-foreground)]">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-rose-400" />
                          <span>Incident INC-2024-892 correlated with Commit 7f3a9b2</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-rose-400" />
                          <span>Database pool exhausted (98/100) due to synchronous lock</span>
                        </div>
                      </div>
                    )}
                    {idx === 4 && (
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
                    {idx === 5 && (
                      <div className="space-y-1.5 text-xs font-mono text-[var(--muted-foreground)]">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>Full 10-service e-commerce topology loaded & verified</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>Interactive graphs, failure simulations, and runbooks</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stage Quick Action CTA */}
                  <div className="pt-2 flex items-center gap-3">
                    {idx === 5 ? (
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
                        onClick={() => jumpToStage((idx + 1) % STAGES.length)}
                        className="inline-flex items-center gap-2 text-xs font-mono text-amber-500 hover:text-amber-400 font-semibold cursor-pointer group"
                      >
                        <span>Next Step: {STAGES[(idx + 1) % STAGES.length].id.toUpperCase()}</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: Persistent Crossfade Visualizer Deck */}
          <div className="lg:col-span-7 relative min-h-[420px] sm:min-h-[460px]">
            <div
              className="relative w-full rounded-3xl border p-5 sm:p-7 shadow-xl min-h-[420px] sm:min-h-[460px] flex flex-col justify-between overflow-hidden"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                borderColor: 'var(--border)',
                boxShadow: 'var(--card-shadow)'
              }}
            >
              {/* Minimal Clean Stage Badge Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] text-[11px] font-mono text-[var(--muted-foreground)]">
                <span className="font-semibold text-amber-500">STAGE {stage.number} OF 06</span>
                <span className="px-2 py-0.5 rounded-full bg-[var(--surface-interactive)] border border-[var(--border-subtle)] text-[10px] font-medium">
                  {stage.badge}
                </span>
              </div>

              {/* Stage Deck Container */}
              <div className="relative flex-1 py-4">
                
                {/* STAGE 01: UNDERSTAND (Clean Architectural Blueprint) */}
                {Math.abs(0 - activeStage) <= 1 ? (
                  <div
                    className={`space-y-4 transition-[opacity,transform] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      activeStage === 0
                        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto relative z-10 visible'
                        : `opacity-0 pointer-events-none absolute inset-0 z-0 scale-[0.98] visible ${activeStage > 0 ? '-translate-y-4' : 'translate-y-4'}`
                    }`}
                    style={activeStage === 0 ? { willChange: 'transform, opacity' } : undefined}
                  >
                    <div className="flex items-center gap-2.5 pb-2">
                      <Cpu className="w-4 h-4 text-sky-400" />
                      <span className="text-xs font-mono font-bold text-[var(--foreground)]">
                        Codebase AST Extraction & Service Discovery
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                      <div className="p-3.5 rounded-2xl bg-[var(--surface-interactive)] border border-[var(--border)] space-y-2">
                        <div className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5">
                          <Network className="w-3.5 h-3.5" />
                          <span>Discovered Topology</span>
                        </div>
                        <div className="space-y-1 text-[11px] text-[var(--muted-foreground)]">
                          <div>• 10 Microservices classified</div>
                          <div>• 13 Cross-boundary RPC / HTTP routes</div>
                          <div>• 4 Event-driven Kafka topics</div>
                          <div>• 2 Relational datastores mapped</div>
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
                          <div>• Instability Metric (I): 0.44</div>
                          <div>• AST Call-graph Depth: 6 levels</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--surface-interactive)] border border-[var(--border-subtle)] font-mono text-xs flex items-center justify-between">
                      <span className="text-[var(--muted-foreground)]">Target Repository:</span>
                      <strong className="text-sky-400">CheckoutPlatform-v2.8</strong>
                      <span className="text-emerald-400 font-semibold text-[11px]">✔ AST Verified</span>
                    </div>
                  </div>
                ) : (
                  <div className="opacity-0 pointer-events-none absolute inset-0 z-0 invisible" aria-hidden="true" />
                )}

                {/* STAGE 02: MAP (Coupling & Topology Breakdown) */}
                {Math.abs(1 - activeStage) <= 1 ? (
                  <div
                    className={`space-y-4 transition-[opacity,transform] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      activeStage === 1
                        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto relative z-10 visible'
                        : `opacity-0 pointer-events-none absolute inset-0 z-0 scale-[0.98] visible ${activeStage > 1 ? '-translate-y-4' : 'translate-y-4'}`
                    }`}
                    style={activeStage === 1 ? { willChange: 'transform, opacity' } : undefined}
                  >
                    <div className="flex items-center gap-2.5 pb-2">
                      <Layers className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-mono font-bold text-[var(--foreground)]">
                        Coupling & Instability (Robert C. Martin Index)
                      </span>
                    </div>

                    <div className="space-y-2.5 font-mono text-xs">
                      {[
                        { name: 'PaymentService', ca: 14, ce: 11, inst: 0.44, status: 'Central Hotspot', color: '#f59e0b' },
                        { name: 'APIGateway', ca: 0, ce: 3, inst: 1.0, status: 'Pure Ingress', color: '#38bdf8' },
                        { name: 'OrderService', ca: 2, ce: 5, inst: 0.71, status: 'State Machine', color: '#a855f7' },
                        { name: 'PostgresPrimary', ca: 7, ce: 0, inst: 0.0, status: 'Stable Datastore', color: '#34d399' }
                      ].map((item) => (
                        <div
                          key={item.name}
                          className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-interactive)] flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <strong className="text-[var(--foreground)]">{item.name}</strong>
                            <span className="text-[10px] text-[var(--muted-foreground)]">({item.status})</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px]">
                            <span>Ca: {item.ca}</span>
                            <span>Ce: {item.ce}</span>
                            <strong style={{ color: item.color }}>I = {item.inst}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="opacity-0 pointer-events-none absolute inset-0 z-0 invisible" aria-hidden="true" />
                )}

                {/* STAGE 03: DETECT (Risk Hotspots & Blast Radius) */}
                {Math.abs(2 - activeStage) <= 1 ? (
                  <div
                    className={`space-y-4 transition-[opacity,transform] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      activeStage === 2
                        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto relative z-10 visible'
                        : `opacity-0 pointer-events-none absolute inset-0 z-0 scale-[0.98] visible ${activeStage > 2 ? '-translate-y-4' : 'translate-y-4'}`
                    }`}
                    style={activeStage === 2 ? { willChange: 'transform, opacity' } : undefined}
                  >
                    <div className="flex items-center justify-between pb-2">
                      <div className="flex items-center gap-2.5">
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                        <span className="text-xs font-mono font-bold text-[var(--foreground)]">
                          Risk Hotspot: PaymentService (92/100)
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        CRITICAL RISK
                      </span>
                    </div>

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

                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-500">
                      <strong>Evidence:</strong> Synchronous SQL Transaction holds connection during external Stripe API call at <code className="bg-black/30 px-1 py-0.5 rounded">settlement.ts:42</code>.
                    </div>
                  </div>
                ) : (
                  <div className="opacity-0 pointer-events-none absolute inset-0 z-0 invisible" aria-hidden="true" />
                )}

                {/* STAGE 04: INVESTIGATE (Causal Incident Timeline) */}
                {Math.abs(3 - activeStage) <= 1 ? (
                  <div
                    className={`space-y-4 transition-[opacity,transform] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      activeStage === 3
                        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto relative z-10 visible'
                        : `opacity-0 pointer-events-none absolute inset-0 z-0 scale-[0.98] visible ${activeStage > 3 ? '-translate-y-4' : 'translate-y-4'}`
                    }`}
                    style={activeStage === 3 ? { willChange: 'transform, opacity' } : undefined}
                  >
                    <div className="flex items-center justify-between pb-2">
                      <div className="flex items-center gap-2.5">
                        <Flame className="w-4 h-4 text-rose-500" />
                        <span className="text-xs font-mono font-bold text-[var(--foreground)]">
                          Incident INC-2024-892 • Causal DAG
                        </span>
                      </div>
                      <span className="text-rose-400 font-mono text-xs font-bold">
                        P0 • 31.4% Spike
                      </span>
                    </div>

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
                ) : (
                  <div className="opacity-0 pointer-events-none absolute inset-0 z-0 invisible" aria-hidden="true" />
                )}

                {/* STAGE 05: RESOLVE (Remediation Diff & Before/After Telemetry) */}
                {Math.abs(4 - activeStage) <= 1 ? (
                  <div
                    className={`space-y-4 transition-[opacity,transform] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      activeStage === 4
                        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto relative z-10 visible'
                        : `opacity-0 pointer-events-none absolute inset-0 z-0 scale-[0.98] visible ${activeStage > 4 ? '-translate-y-4' : 'translate-y-4'}`
                    }`}
                    style={activeStage === 4 ? { willChange: 'transform, opacity' } : undefined}
                  >
                    <div className="flex items-center justify-between pb-2">
                      <div className="flex items-center gap-2.5">
                        <Wrench className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono font-bold text-[var(--foreground)]">
                          Remediation REM-892: Decouple DB Transaction
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        VERIFIED PATCH
                      </span>
                    </div>

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
                ) : (
                  <div className="opacity-0 pointer-events-none absolute inset-0 z-0 invisible" aria-hidden="true" />
                )}

                {/* STAGE 06: EXPLORE (Command Deck Launchpad) */}
                {Math.abs(5 - activeStage) <= 1 ? (
                  <div
                    className={`space-y-5 transition-[opacity,transform] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      activeStage === 5
                        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto relative z-10 visible'
                        : `opacity-0 pointer-events-none absolute inset-0 z-0 scale-[0.98] visible ${activeStage > 5 ? '-translate-y-4' : 'translate-y-4'}`
                    }`}
                    style={activeStage === 5 ? { willChange: 'transform, opacity' } : undefined}
                  >
                    <div className="flex items-center gap-2.5 pb-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-mono font-bold text-[var(--foreground)]">
                        Explore Full Platform Workspace
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[var(--foreground-secondary)] leading-relaxed font-sans">
                      Dive into all 11 workspace destinations with the CheckoutPlatform-v2.8 reference dataset or configure your own repository.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                      {[
                        { tab: 'overview', label: 'System Overview', icon: <Activity className="w-3.5 h-3.5 text-amber-500" /> },
                        { tab: 'architecture', label: 'Architecture', icon: <Layers className="w-3.5 h-3.5 text-sky-400" /> },
                        { tab: 'graph', label: 'Knowledge Graph', icon: <Network className="w-3.5 h-3.5 text-emerald-400" /> },
                        { tab: 'risks', label: 'Risk Intelligence', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> },
                        { tab: 'incidents', label: 'Incident Room', icon: <Flame className="w-3.5 h-3.5 text-rose-500" /> },
                        { tab: 'simulation', label: 'Failure Simulator', icon: <Cpu className="w-3.5 h-3.5 text-amber-400" /> }
                      ].map((dest) => (
                        <button
                          key={dest.tab}
                          onClick={() => navigateToAppTab(dest.tab as any)}
                          className="p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-interactive)] hover:border-amber-500/50 transition-all text-left flex items-center gap-2.5 cursor-pointer group"
                        >
                          {dest.icon}
                          <span className="text-[var(--foreground)] font-semibold truncate group-hover:text-amber-500 transition-colors">
                            {dest.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs font-mono text-[var(--muted-foreground)]">
                        10 services • 19 edges • 3 active findings
                      </span>
                      <LiquidMagneticButton
                        variant="primary"
                        size="sm"
                        onClick={loadSampleProject}
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Launch Workspace
                      </LiquidMagneticButton>
                    </div>
                  </div>
                ) : (
                  <div className="opacity-0 pointer-events-none absolute inset-0 z-0 invisible" aria-hidden="true" />
                )}

              </div>

              {/* Minimal Bottom Indicator */}
              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--muted-foreground)]">
                <span>STAGE {activeStage + 1} OF {STAGES.length}</span>
                <span className="text-amber-500 font-semibold">{STAGES[activeStage].id.toUpperCase()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
