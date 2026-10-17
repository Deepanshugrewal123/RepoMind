import React, { useState } from 'react'
import { SYSTEM_HEALTH_METRICS } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import { LiquidMagneticButton } from '../ui/LiquidMagneticButton'
import {
  ShieldAlert,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  AlertOctagon,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Activity,
  Cpu
} from 'lucide-react'

export const InteractiveRiskDemo: React.FC = () => {
  const { openExplainDrawer, navigateToAppTab } = useApp()
  const [activeCategory, setActiveCategory] = useState<string>('Architecture')

  const categories = [
    {
      name: 'Architecture',
      score: 72,
      status: 'warning',
      trend: '-4 pts',
      description: 'High afferent coupling in PaymentService; 11 direct dependents on critical checkout path.',
      evidence: [
        'Afferent coupling (Ca): 14 callers',
        'Direct synchronous dependencies without queue buffer',
        'Cyclomatic complexity: 38 (Threshold: 15)'
      ],
      componentId: 'payment-service',
      riskId: 'RSK-1049'
    },
    {
      name: 'Security',
      score: 84,
      status: 'healthy',
      trend: '+2 pts',
      description: 'Zero exposed secrets detected in Git history; TLS 1.3 enforced across all gateway ingress routes.',
      evidence: [
        'Automated secret scanner: 0 leaks in 1,420 commits',
        'Strict Content-Security-Policy & CORS headers enabled',
        'OAuth2 token expiration window capped at 15 minutes'
      ],
      componentId: 'auth-service',
      riskId: 'RSK-1033'
    },
    {
      name: 'Reliability',
      score: 58,
      status: 'critical',
      trend: '-9 pts',
      description: 'External third-party payment client lacks circuit breaker; 3500ms timeout threshold violated.',
      evidence: [
        'Stripe HTTP client has no exponential backoff retry jitter',
        'Simulated 2s upstream latency stalls internal event loop',
        'Single point of failure on payment token resolution'
      ],
      componentId: 'stripe-client',
      riskId: 'RSK-1021'
    },
    {
      name: 'Scalability',
      score: 46,
      status: 'critical',
      trend: '-12 pts',
      description: 'PostgreSQL connection pool saturates at 98% under 3x concurrency due to N+1 discount calculation query loop.',
      evidence: [
        'Iterative SQL queries in OrderService discount loop',
        'Pool acquire timeout occurred during simulated traffic spike',
        'Absence of read replica routing for historical order reads'
      ],
      componentId: 'order-service',
      riskId: 'RSK-1042'
    },
    {
      name: 'Maintainability',
      score: 67,
      status: 'warning',
      trend: '+1 pt',
      description: 'Oversized controller files and high code churn in settlement logic (+64% within 14 days).',
      evidence: [
        'File size of settlement.ts exceeds 1,200 lines',
        'Test coverage on error handling branches: only 42%',
        '19 pending TODO comments flagged in checkout retry flow'
      ],
      componentId: 'payment-service',
      riskId: 'RSK-1049'
    }
  ]

  const activeData = categories.find((c) => c.name === activeCategory) || categories[0]

  return (
    <div 
      style={{
        backgroundColor: 'var(--surface-elevated)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--card-shadow)'
      }}
      className="w-full rounded-3xl border p-6 sm:p-8 relative overflow-hidden transition-colors"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b gap-4" style={{ borderColor: 'var(--border)' }}>
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-wider mb-1 font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>Multi-Factor Risk Intelligence</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10" style={{ color: 'var(--muted-foreground)' }}>
              DEMO DATASET
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
            System Health: 72 / 100
          </h3>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--foreground-secondary)' }}>
            Click any score gauge to reveal deterministic evidence and causal reasoning behind the rating.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div 
            style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
            className="px-3.5 py-2 rounded-xl border text-right"
          >
            <span className="text-[10px] font-mono block uppercase" style={{ color: 'var(--muted-foreground)' }}>Overall Health</span>
            <span className="text-xl font-bold font-mono text-amber-500">72 / 100</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Categories List */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-xs font-mono uppercase tracking-wider mb-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>
            Risk Categories Breakdown
          </div>
          {categories.map((cat) => {
            const isSelected = cat.name === activeCategory
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                style={{
                  backgroundColor: isSelected ? 'var(--surface-interactive)' : 'transparent',
                  borderColor: isSelected ? 'var(--accent-orange)' : 'var(--border-subtle)'
                }}
                className={`
                  w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer block
                  ${isSelected ? 'shadow-md ring-1 ring-amber-500/30' : 'opacity-80 hover:opacity-100'}
                `}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs sm:text-sm" style={{ color: 'var(--foreground)' }}>{cat.name}</span>
                    <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{cat.trend}</span>
                  </div>
                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                      cat.status === 'healthy'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : cat.status === 'warning'
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        : 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20'
                    }`}
                  >
                    {cat.score} / 100
                  </span>
                </div>

                {/* Animated Score Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden mb-1">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      cat.status === 'healthy'
                        ? 'bg-emerald-500'
                        : cat.status === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* Evidence Card ("Why?") */}
        <div 
          style={{
            backgroundColor: 'var(--surface-interactive)',
            borderColor: 'var(--border)'
          }}
          className="lg:col-span-7 rounded-2xl border p-5 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h4 className="font-bold text-sm sm:text-base font-display" style={{ color: 'var(--foreground)' }}>
                Why is {activeData.name} rated {activeData.score} / 100?
              </h4>
            </div>
            <button
              onClick={() => openExplainDrawer(activeData.riskId, activeData.componentId)}
              className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors font-medium"
            >
              <span>Inspect Full Evidence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
            {activeData.description}
          </p>

          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider font-semibold" style={{ color: 'var(--muted-foreground)' }}>
              Verified Signals & Ground Truth Evidence:
            </div>
            <ul className="space-y-1.5">
              {activeData.evidence.map((ev, i) => (
                <li
                  key={i}
                  style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
                  className="px-3 py-2 rounded-xl border text-xs font-mono flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span style={{ color: 'var(--foreground)' }}>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          <div 
            style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
            className="p-3 rounded-xl border flex items-center justify-between text-xs font-mono"
          >
            <span style={{ color: 'var(--muted-foreground)' }}>
              Correlated Component: <strong style={{ color: 'var(--foreground)' }}>{activeData.componentId}</strong>
            </span>
            <button
              onClick={() => navigateToAppTab('risks', activeData.componentId)}
              className="text-amber-500 hover:text-amber-600 font-semibold cursor-pointer"
            >
              Open in Risk Matrix →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
