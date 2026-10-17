import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { LiquidMagneticButton } from '../components/ui/LiquidMagneticButton'
import { InteractiveGraphDemo } from '../components/home/InteractiveGraphDemo'
import { InteractiveSimulationDemo } from '../components/home/InteractiveSimulationDemo'
import { InteractiveRiskDemo } from '../components/home/InteractiveRiskDemo'
import { Footer } from '../components/common/Footer'
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Activity,
  Layers,
  Network,
  Cpu,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'

export const DemoPage: React.FC = () => {
  const { navigateToAppTab } = useApp()
  const [activeDemoTab, setActiveDemoTab] = useState<'graph' | 'simulation' | 'risks'>('graph')

  return (
    <div 
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)'
      }}
      className="min-h-screen pt-28 transition-colors"
    >
      {/* Demo Header */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto py-10 border-b text-center space-y-4" style={{ borderColor: 'var(--border)' }}>
        <div 
          style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-amber-600 dark:text-amber-400 text-xs font-mono font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>PRELOADED REPOSITORY SANDBOX • NO LOGIN REQUIRED</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight" style={{ color: 'var(--foreground)' }}>
          Explore Demo Repository
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
          Interact with a real-world ecommerce microservices architecture (<code className="text-amber-500 font-mono text-sm px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}>CheckoutPlatform-v2.8</code>) with simulated incidents, dependency hot-spots, and live failure simulations.
        </p>

        {/* Enter Full App Workspace CTA */}
        <div className="pt-2 flex items-center justify-center gap-4">
          <LiquidMagneticButton
            variant="primary"
            size="md"
            onClick={() => navigateToAppTab('overview')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Launch Full Demo Workspace →
          </LiquidMagneticButton>
        </div>
      </section>

      {/* Demo Tab Selector */}
      <section className="py-10 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveDemoTab('graph')}
            style={{
              backgroundColor: activeDemoTab === 'graph' ? 'rgba(5, 150, 105, 0.15)' : 'var(--surface-interactive)',
              borderColor: activeDemoTab === 'graph' ? 'var(--accent-green)' : 'var(--border)',
              color: activeDemoTab === 'graph' ? 'var(--accent-green)' : 'var(--foreground-secondary)'
            }}
            className="px-4 py-2 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer"
          >
            1. Knowledge Graph Explorer
          </button>
          <button
            onClick={() => setActiveDemoTab('simulation')}
            style={{
              backgroundColor: activeDemoTab === 'simulation' ? 'rgba(245, 158, 11, 0.15)' : 'var(--surface-interactive)',
              borderColor: activeDemoTab === 'simulation' ? 'var(--accent-orange)' : 'var(--border)',
              color: activeDemoTab === 'simulation' ? 'var(--accent-orange)' : 'var(--foreground-secondary)'
            }}
            className="px-4 py-2 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer"
          >
            2. "What If?" Failure Simulator
          </button>
          <button
            onClick={() => setActiveDemoTab('risks')}
            style={{
              backgroundColor: activeDemoTab === 'risks' ? 'rgba(239, 68, 68, 0.15)' : 'var(--surface-interactive)',
              borderColor: activeDemoTab === 'risks' ? 'var(--accent-red)' : 'var(--border)',
              color: activeDemoTab === 'risks' ? 'var(--accent-red)' : 'var(--foreground-secondary)'
            }}
            className="px-4 py-2 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer"
          >
            3. Multi-Factor Risk Matrix
          </button>
        </div>

        {/* Tab Content Render */}
        <div className="animate-in fade-in duration-300">
          {activeDemoTab === 'graph' && <InteractiveGraphDemo />}
          {activeDemoTab === 'simulation' && <InteractiveSimulationDemo />}
          {activeDemoTab === 'risks' && <InteractiveRiskDemo />}
        </div>
      </section>

      <Footer />
    </div>
  )
}
