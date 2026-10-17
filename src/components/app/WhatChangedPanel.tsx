import React from 'react'
import { WHAT_CHANGED_DATA } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import {
  GitCommit,
  ArrowRight,
  TrendingUp,
  FileCode,
  PackagePlus,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react'

interface WhatChangedPanelProps {
  onClose?: () => void
}

export const WhatChangedPanel: React.FC<WhatChangedPanelProps> = ({ onClose }) => {
  const { navigateToAppTab } = useApp()

  return (
    <div
      className="rounded-2xl p-5 shadow-2xl space-y-4 transition-colors"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        boxShadow: 'var(--card-shadow)'
      }}
    >
      <div
        className="flex items-center justify-between pb-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: 'var(--accent-orange)' }} />
          <h3 className="font-bold text-sm sm:text-base font-mono tracking-tight" style={{ color: 'var(--foreground)' }}>
            WHAT CHANGED?
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-mono px-2 py-0.5 rounded"
            style={{
              backgroundColor: 'var(--surface-interactive)',
              border: '1px solid var(--border)',
              color: 'var(--foreground-secondary)'
            }}
          >
            {WHAT_CHANGED_DATA.commitRange}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg transition-colors hover:opacity-80"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* High-level stats specified in Prompt #28 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
        {WHAT_CHANGED_DATA.stats.map((stat, i) => (
          <div
            key={i}
            className={`p-2.5 rounded-xl border flex flex-col justify-between ${
              stat.type === 'critical'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : stat.type === 'warning'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : stat.type === 'positive'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'text-slate-300'
            }`}
            style={
              stat.type === 'neutral'
                ? {
                    backgroundColor: 'var(--surface-interactive)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }
                : undefined
            }
          >
            <span
              className="text-[10px] block mb-0.5"
              style={{ color: stat.type === 'neutral' ? 'var(--muted-foreground)' : undefined }}
            >
              {stat.label}
            </span>
            <strong className="text-xs sm:text-sm font-bold">{stat.value}</strong>
          </div>
        ))}
      </div>

      {/* Recent commits affecting risk */}
      <div className="space-y-2 pt-1 font-mono text-xs">
        <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
          Correlated Git Commits in Ingestion Window:
        </div>
        <div className="space-y-1.5">
          {WHAT_CHANGED_DATA.recentCommits.map((c) => (
            <div
              key={c.hash}
              className="p-2 rounded-xl flex items-center justify-between transition-colors"
              style={{
                backgroundColor: 'var(--surface-interactive)',
                border: '1px solid var(--border)'
              }}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold shrink-0" style={{ color: 'var(--accent-orange)' }}>{c.hash}</span>
                <span className="shrink-0" style={{ color: 'var(--muted-foreground)' }}>({c.author})</span>
                <span className="truncate text-[11px]" style={{ color: 'var(--foreground-secondary)' }}>{c.message}</span>
              </div>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                  c.riskImpact === 'HIGH'
                    ? 'bg-rose-500/20 text-rose-400'
                    : c.riskImpact === 'MEDIUM'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {c.riskImpact} IMPACT
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex items-center justify-between pt-2 text-xs"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <span className="text-[11px] font-mono" style={{ color: 'var(--muted-foreground)' }}>Analyzed against HEAD commit</span>
        <button
          onClick={() => navigateToAppTab('risks')}
          className="font-mono text-xs flex items-center gap-1 font-semibold transition-opacity hover:opacity-80"
          style={{ color: 'var(--accent-orange)' }}
        >
          <span>View Escalated Risks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
