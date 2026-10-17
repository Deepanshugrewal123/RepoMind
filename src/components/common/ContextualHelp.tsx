import React, { useState, useRef, useEffect } from 'react'
import { HelpCircle, Info, ChevronRight, X } from 'lucide-react'

export interface TermDefinition {
  title: string
  plain: string
  technical?: string
}

export const DEFINITIONS: Record<string, TermDefinition> = {
  cyclomaticComplexity: {
    title: 'Cyclomatic Complexity',
    plain: 'An estimate of how many different execution paths exist through a piece of code. More paths make testing and maintenance harder.',
    technical: 'McCabe metric calculated as M = E - N + 2P where E is edges, N is nodes, and P is connected components in the control-flow graph.'
  },
  busFactor: {
    title: 'Maintainer Bus Factor',
    plain: 'An estimate of how dependent a project or service is on a small number of primary contributors.',
    technical: 'Calculated from Git commit entropy and authorship concentration. A bus factor of 1 indicates critical knowledge bottleneck.'
  },
  dependencyCoupling: {
    title: 'Dependency Coupling',
    plain: 'How strongly one software component relies on other components to perform its duties.',
    technical: 'Measured via Afferent Coupling (Ca: incoming callers) and Efferent Coupling (Ce: outgoing dependencies), defining component instability.'
  },
  blastRadius: {
    title: 'Blast Radius',
    plain: 'How much of your overall system could be affected if this specific component fails or experiences high latency.',
    technical: 'Simulated transitive reachability over the directed software knowledge graph, weighted by synchronous vs asynchronous call semantics.'
  },
  confidence: {
    title: 'Evidence Confidence',
    plain: 'How strongly the available telemetry and code evidence supports this conclusion. It is not a guarantee that the prediction is correct.',
    technical: 'Calibrated score based on concordance between static AST signals, runtime Prometheus metric anomalies, and historical outcomes.'
  },
  afferentCoupling: {
    title: 'Afferent Coupling (Ca)',
    plain: 'The number of external services or modules that depend on this component.',
    technical: 'High Ca indicates that changes to this component risk impacting many downstream consumers.'
  },
  efferentCoupling: {
    title: 'Efferent Coupling (Ce)',
    plain: 'The number of other components this module directly calls.',
    technical: 'High Ce indicates high fragility, as changes in any external dependency can break this module.'
  }
}

export interface ContextualHelpProps {
  termKey?: string
  term?: string
  customTerm?: TermDefinition
  className?: string
  iconSize?: 'sm' | 'md'
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({
  termKey,
  term,
  customTerm,
  className = '',
  iconSize = 'sm'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showTechnical, setShowTechnical] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const lookupKey = term || termKey || ''
  const normalized = lookupKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  const def =
    customTerm ||
    DEFINITIONS[lookupKey] ||
    DEFINITIONS[normalized] ||
    (lookupKey === 'coupling' ? DEFINITIONS.dependencyCoupling : null) ||
    DEFINITIONS.confidence

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen])

  return (
    <span ref={popoverRef} className={`relative inline-flex items-center align-middle ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="text-[var(--muted-foreground)] hover:text-[var(--accent-orange)] transition-colors p-0.5 rounded cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500"
        aria-label={`Learn more about ${def.title}`}
      >
        <HelpCircle className={iconSize === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-3.5 rounded-2xl glass-panel border border-[var(--border)] shadow-2xl z-50 text-left animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] mb-2">
            <span className="font-bold text-xs text-[var(--foreground)] font-display flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-500" />
              <span>{def.title}</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed font-sans mb-2">
            {def.plain}
          </p>

          {def.technical && (
            <div className="pt-2 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => setShowTechnical(!showTechnical)}
                className="text-[11px] font-mono text-[var(--accent-orange)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{showTechnical ? 'Hide Technical Formulation' : 'View Technical Formulation'}</span>
                <ChevronRight className={`w-3 h-3 transition-transform ${showTechnical ? 'rotate-90' : ''}`} />
              </button>

              {showTechnical && (
                <p className="mt-1.5 p-2 rounded-lg bg-[var(--surface-interactive)] text-[11px] font-mono text-[var(--muted-foreground)] leading-normal border border-[var(--border-subtle)]">
                  {def.technical}
                </p>
              )}
            </div>
          )}

          {/* Tooltip triangle */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--border)]" />
        </div>
      )}
    </span>
  )
}
