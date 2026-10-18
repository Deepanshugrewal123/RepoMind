import React, { useState } from 'react'
import { RISKS_DATA, SYSTEM_HEALTH_METRICS, RiskItem } from '../../../data/mockData'
import { useApp } from '../../../context/AppContext'
import { LiquidMagneticButton } from '../../ui/LiquidMagneticButton'
import { ContextualHelp } from '../../common/ContextualHelp'
import {
  ShieldAlert,
  Flame,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Filter,
  Search,
  AlertTriangle,
  HelpCircle,
  FileCode
} from 'lucide-react'

export const RisksView: React.FC = () => {
  const { openExplainDrawer, navigateToAppTab, risksData, systemHealthMetrics } = useApp()
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const activeRisks = risksData && risksData.length > 0 ? risksData : RISKS_DATA
  const activeMetrics = systemHealthMetrics || SYSTEM_HEALTH_METRICS

  const criticalCount = activeRisks.filter((r) => r.severity === 'CRITICAL').length
  const highCount = activeRisks.filter((r) => r.severity === 'HIGH').length

  const filteredRisks = activeRisks.filter((risk) => {
    const matchesSev = selectedSeverity === 'ALL' || risk.severity === selectedSeverity
    const matchesQuery =
      risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.componentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSev && matchesQuery
  })

  return (
    <div className="space-y-6 pb-20">
      {/* View Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold" style={{ color: 'var(--accent-orange)' }}>
              [RISK // 03.PREDICTIVE_MATRIX]
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
            Predictive Risk Intelligence Matrix
          </h2>
          <p className="text-xs sm:text-sm font-sans" style={{ color: 'var(--foreground-secondary)' }}>
            Triangulated from lexical coupling metrics, dependency concentration, and Martin instability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl"
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              color: 'var(--accent-orange)',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}
          >
            {criticalCount} Critical • {highCount} High
          </span>
        </div>
      </div>

      {/* Multi-Dimensional Category Score Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {activeMetrics.categories.map((cat) => (
          <div
            key={cat.name}
            className="p-3 rounded-2xl flex flex-col justify-between transition-colors"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--card-shadow)'
            }}
          >
            <span className="text-[10px] font-mono uppercase truncate" style={{ color: 'var(--muted-foreground)' }}>{cat.name}</span>
            <div className="my-1.5 flex items-baseline justify-between">
              <span
                className={`text-xl font-bold font-mono ${
                  cat.score >= 80 ? 'text-emerald-400' : cat.score >= 60 ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {cat.score}
              </span>
              <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>/ 100</span>
            </div>
            <span className="text-[9px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{cat.trend}</span>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl transition-colors"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--border)'
        }}
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl flex-1 max-w-md"
          style={{
            backgroundColor: 'var(--surface-interactive)',
            border: '1px solid var(--border)'
          }}
        >
          <Search className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by risk title, service name, or category..."
            className="bg-transparent text-xs sm:text-sm outline-none w-full"
            style={{ color: 'var(--foreground)' }}
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="hidden sm:inline mr-1" style={{ color: 'var(--muted-foreground)' }}>Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className="px-2.5 py-1 rounded-lg border transition-colors cursor-pointer text-xs"
              style={{
                backgroundColor: selectedSeverity === sev ? 'rgba(245, 158, 11, 0.15)' : 'var(--surface-interactive)',
                color: selectedSeverity === sev ? 'var(--accent-orange)' : 'var(--foreground-secondary)',
                borderColor: selectedSeverity === sev ? 'var(--accent-orange)' : 'var(--border)',
                fontWeight: selectedSeverity === sev ? 'bold' : 'normal'
              }}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Prioritized Risks List */}
      <div className="space-y-4">
        {filteredRisks.map((risk) => (
          <div
            key={risk.id}
            className="rounded-3xl p-5 sm:p-6 space-y-4 transition-all duration-300"
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
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                    risk.severity === 'CRITICAL'
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {risk.severity} • {risk.id}
                </span>
                <span className="text-sm sm:text-base font-bold font-display" style={{ color: 'var(--foreground)' }}>
                  {risk.title}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span style={{ color: 'var(--muted-foreground)' }}>
                  Component: <strong style={{ color: 'var(--foreground)' }}>{risk.componentName}</strong>
                </span>
                <span className="font-bold" style={{ color: 'var(--accent-orange)' }}>Score: {risk.score}/100</span>
                <span className="flex items-center gap-1" style={{ color: 'var(--accent-green)' }}>
                  Confidence: {risk.confidence}%
                  <ContextualHelp term="confidence" />
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed font-sans" style={{ color: 'var(--foreground-secondary)' }}>
              {risk.summary}
            </p>

            {/* Evidence Preview Pill Row */}
            <div
              className="p-3 rounded-xl space-y-1.5 font-mono text-xs"
              style={{
                backgroundColor: 'var(--surface-interactive)',
                border: '1px solid var(--border)'
              }}
            >
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
                Triangulated Signals:
              </div>
              {risk.evidence.observed.slice(0, 2).map((obs, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--foreground-secondary)' }}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--accent-orange)' }} />
                  <span>{obs}</span>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div
              className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <button
                onClick={() => openExplainDrawer(risk.id, risk.componentId)}
                className="font-mono flex items-center gap-1.5 cursor-pointer font-medium transition-opacity hover:opacity-80"
                style={{ color: 'var(--accent-orange)' }}
              >
                <span>Why is this risky? (Open Explainability Drawer)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <LiquidMagneticButton
                  variant="secondary"
                  size="sm"
                  onClick={() => navigateToAppTab('blast-radius', risk.componentId)}
                  icon={<Flame className="w-3.5 h-3.5" />}
                >
                  Blast Radius
                </LiquidMagneticButton>

                <LiquidMagneticButton
                  variant="primary"
                  size="sm"
                  onClick={() => navigateToAppTab('remediation', risk.componentId)}
                  icon={<Wrench className="w-3.5 h-3.5" />}
                >
                  View Code Patch
                </LiquidMagneticButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
