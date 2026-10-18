import React from 'react'
import { ENGINEERING_FINGERPRINT } from '../../../data/mockData'
import { useApp } from '../../../context/AppContext'
import { LiquidMagneticButton } from '../../ui/LiquidMagneticButton'
import { ContextualHelp } from '../../common/ContextualHelp'
import {
  LineChart,
  User,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  GitCommit,
  ArrowRight,
  Sparkles,
  Layers,
  Radio
} from 'lucide-react'

export const AnalyticsView: React.FC = () => {
  const { navigateToAppTab, isCustomRepo, currentRepoName, resetToOnboarding } = useApp()

  return (
    <div className="space-y-6 pb-20">
      {/* Capability Notice for Custom Repositories */}
      {isCustomRepo && (
        <div
          className="p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            color: 'var(--foreground)'
          }}
        >
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <span className="font-bold text-amber-500">[GIT LOG HISTORY REQUIRED]</span>
              <span className="ml-1.5" style={{ color: 'var(--foreground-secondary)' }}>
                180-day commit discipline analysis for "{currentRepoName}" requires full Git commit log ingestion. Demonstrating benchmark engineering profile below.
              </span>
            </div>
          </div>
          <button
            onClick={() => resetToOnboarding()}
            className="px-3 py-1 rounded-lg border font-bold text-amber-500 hover:bg-amber-500/10 transition-colors shrink-0 cursor-pointer"
            style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}
          >
            Switch to Sample Project
          </button>
        </div>
      )}

      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-1 text-sky-400">
            <LineChart className="w-4 h-4" />
            <span>[ANALYTICS // 10.ENGINEERING_FINGERPRINT]</span>
          </div>
          <h2 className="text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
            Engineering Fingerprint & Team Dynamics
          </h2>
          <p className="text-xs sm:text-sm font-sans" style={{ color: 'var(--foreground-secondary)' }}>
            Evidence-based engineering discipline profile synthesized from 180 days of Git commits, PR reviews, and code churn.
          </p>
        </div>

        <div
          className="px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold"
          style={{
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8'
          }}
        >
          DISCIPLINE SCORE: {ENGINEERING_FINGERPRINT.overallDisciplineScore} / 100
        </div>
      </div>

      {/* Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ENGINEERING_FINGERPRINT.dimensions.map((dim) => (
          <div
            key={dim.label}
            className="rounded-3xl p-5 flex flex-col justify-between space-y-4 transition-all"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--card-shadow)'
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{dim.label}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    dim.status === 'Strong'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : dim.status === 'Warning' || dim.status === 'Moderate'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {dim.status}
                </span>
              </div>

              <div className="flex items-baseline justify-between font-mono my-2">
                <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{dim.score} / 100</span>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Benchmark: {dim.benchmark}</span>
              </div>

              {/* Progress bar */}
              <div
                className="w-full h-1.5 rounded-full overflow-hidden mb-3"
                style={{ backgroundColor: 'var(--surface-interactive)' }}
              >
                <div
                  className={`h-full rounded-full ${
                    dim.score >= 75 ? 'bg-emerald-400' : dim.score >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                  }`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>

              <p className="text-xs leading-relaxed font-sans" style={{ color: 'var(--foreground-secondary)' }}>
                {dim.description}
              </p>
            </div>

            <div
              className="pt-2 text-[11px] font-mono"
              style={{
                borderTop: '1px solid var(--border)',
                color: 'var(--muted-foreground)'
              }}
            >
              Evaluated across 1,420 commits
            </div>
          </div>
        ))}
      </div>

      {/* Bus Factor Deep-Dive Alert */}
      <div
        className="rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
        style={{
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm font-mono">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>CRITICAL BUS FACTOR VULNERABILITY IN AUTH & PAYMENT</span>
            <ContextualHelp term="bus-factor" />
          </div>
          <p className="text-xs sm:text-sm leading-relaxed max-w-2xl font-sans" style={{ color: 'var(--foreground-secondary)' }}>
            94.2% of cryptography token signing and payment settlement routines were authored by a single developer. If this maintainer is unavailable, mean-time-to-repair (MTTR) increases by an estimated 4.8x.
          </p>
        </div>

        <LiquidMagneticButton
          variant="secondary"
          size="sm"
          onClick={() => navigateToAppTab('risks', 'auth-service')}
        >
          Review Bus Factor Risk →
        </LiquidMagneticButton>
      </div>
    </div>
  )
}
