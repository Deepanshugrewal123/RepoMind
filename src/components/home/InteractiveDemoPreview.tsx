import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { LiquidMagneticButton } from '../ui/LiquidMagneticButton'
import { InteractiveGraphDemo } from './InteractiveGraphDemo'
import { InteractiveSimulationDemo } from './InteractiveSimulationDemo'
import { InteractiveRiskDemo } from './InteractiveRiskDemo'
import {
  Sparkles,
  ArrowRight,
  Network,
  Cpu,
  ShieldAlert,
  ExternalLink,
  Layers
} from 'lucide-react'

export const InteractiveDemoPreview: React.FC = () => {
  const { setCurrentRoute, navigateToAppTab } = useApp()
  const [activeTab, setActiveTab] = useState<'graph' | 'simulation' | 'risks'>('graph')

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div 
          style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-medium shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">[ENVIRONMENT // LIVE SANDBOX]</span>
          <span className="opacity-30">|</span>
          <span style={{ color: 'var(--foreground-secondary)' }}>CheckoutPlatform-v2.8</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-display" style={{ color: 'var(--foreground)' }}>
          Test RepoMind on a{' '}
          <span className="font-editorial italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400">
            live microservices architecture.
          </span>
        </h2>

        <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
          Experiment with dependency topology, simulate catastrophic outages, and inspect multi-factor risk scores in real time without creating an account.
        </p>
      </div>

      {/* Interactive Container with Coordinate Framing */}
      <div 
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--card-shadow)'
        }}
        className="rounded-3xl border relative overflow-hidden transition-colors"
      >
        {/* Technical Coordinate Corners */}
        <div className="absolute top-3 left-4 text-[10px] font-mono select-none" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>
          + [SYS // SANDBOX_CANVAS]
        </div>
        <div className="absolute top-3 right-4 text-[10px] font-mono select-none" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>
          FPS: 60 // SIM_READY +
        </div>

        {/* Tab Selector Bar */}
        <div 
          className="pt-10 pb-4 px-6 border-b flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('graph')}
              style={{
                backgroundColor: activeTab === 'graph' ? 'rgba(56, 189, 248, 0.15)' : 'var(--surface-interactive)',
                borderColor: activeTab === 'graph' ? 'rgba(56, 189, 248, 0.5)' : 'var(--border)',
                color: activeTab === 'graph' ? '#38bdf8' : 'var(--foreground-secondary)'
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer"
            >
              <Network className="w-3.5 h-3.5" />
              <span>1. Knowledge Graph</span>
            </button>

            <button
              onClick={() => setActiveTab('simulation')}
              style={{
                backgroundColor: activeTab === 'simulation' ? 'rgba(245, 158, 11, 0.15)' : 'var(--surface-interactive)',
                borderColor: activeTab === 'simulation' ? 'var(--accent-orange)' : 'var(--border)',
                color: activeTab === 'simulation' ? 'var(--accent-orange)' : 'var(--foreground-secondary)'
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>2. "What If?" Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('risks')}
              style={{
                backgroundColor: activeTab === 'risks' ? 'rgba(239, 68, 68, 0.15)' : 'var(--surface-interactive)',
                borderColor: activeTab === 'risks' ? 'var(--accent-red)' : 'var(--border)',
                color: activeTab === 'risks' ? 'var(--accent-red)' : 'var(--foreground-secondary)'
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>3. Risk Matrix</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Interactive Live Sandbox</span>
          </div>
        </div>

        {/* Active Demo Content */}
        <div className="p-4 sm:p-6">
          {activeTab === 'graph' && <InteractiveGraphDemo />}
          {activeTab === 'simulation' && <InteractiveSimulationDemo />}
          {activeTab === 'risks' && <InteractiveRiskDemo />}
        </div>

        {/* Bottom Gateway to Full Sandbox Page and App */}
        <div 
          className="p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            backgroundColor: 'var(--surface-interactive)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="text-xs font-mono font-bold" style={{ color: 'var(--foreground)' }}>
              Want to see the complete end-to-end investigation workspace?
            </span>
            <p className="text-[11px] font-mono" style={{ color: 'var(--muted-foreground)' }}>
              Explore root-cause graphs, step-by-step remediation runbooks, and telemetry diffs in the full environment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LiquidMagneticButton
              variant="secondary"
              size="sm"
              onClick={() => setCurrentRoute('demo')}
              icon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              Open Full Demo Page
            </LiquidMagneticButton>

            <LiquidMagneticButton
              variant="primary"
              size="sm"
              onClick={() => navigateToAppTab('overview')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Launch Workspace
            </LiquidMagneticButton>
          </div>
        </div>
      </div>
    </section>
  )
}
