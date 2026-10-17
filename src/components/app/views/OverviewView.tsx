import React, { useState } from 'react'
import {
  SYSTEM_HEALTH_METRICS,
  COMPONENTS_DATA,
  RISKS_DATA,
  ACTIVE_INCIDENT,
  WHAT_CHANGED_DATA
} from '../../../data/mockData'
import { useApp } from '../../../context/AppContext'
import { LiquidMagneticButton } from '../../ui/LiquidMagneticButton'
import { ContextualHelp } from '../../common/ContextualHelp'
import {
  ShieldAlert,
  Activity,
  Flame,
  Layers,
  Network,
  Cpu,
  Wrench,
  CheckCircle2,
  ArrowRight,
  GitCommit,
  TrendingDown,
  TrendingUp,
  AlertOctagon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  GitBranch,
  RefreshCw
} from 'lucide-react'

export const OverviewView: React.FC = () => {
  const {
    navigateToAppTab,
    openExplainDrawer,
    isFixApplied,
    currentRepoName,
    isCustomRepo,
    resetToOnboarding
  } = useApp()

  const [showDeepTelemetry, setShowDeepTelemetry] = useState(true)

  const healthScore = isFixApplied ? 88 : SYSTEM_HEALTH_METRICS.overallScore
  const criticalRisksCount = isFixApplied ? 1 : SYSTEM_HEALTH_METRICS.criticalRisks
  const activeIncidentsCount = isFixApplied ? 0 : SYSTEM_HEALTH_METRICS.activeIncidents

  return (
    <div className="space-y-6 pb-20">
      {/* 1. REPOSITORY IDENTIFICATION & PLAIN-LANGUAGE SUMMARY BANNER */}
      <div
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--card-shadow)'
        }}
        className="rounded-3xl border p-6 sm:p-7 relative overflow-hidden transition-colors"
      >
        {/* Subtle Accent Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase" style={{ color: 'var(--accent-orange)' }}>
                {isCustomRepo ? 'ANALYZED REPOSITORY' : 'DEMO ENVIRONMENT'}
              </span>
              <span className="opacity-30 font-mono">|</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)', color: 'var(--foreground-secondary)' }}>
                {isCustomRepo ? 'Simulated Repo Model' : 'CheckoutPlatform-v2.8'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
              {currentRepoName}
            </h2>

            {/* Plain-Language 1-Sentence System Summary */}
            <p className="text-xs sm:text-sm font-sans max-w-3xl leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
              {isCustomRepo 
                ? `Representative architecture model synthesized for ${currentRepoName}. In this client-side demo, RepoMind maps sample microservices topology and failure scenarios to demonstrate risk analytics.`
                : 'Distributed microservices architecture managing cart checkout, high-throughput payment orchestration, and asynchronous inventory reconciliation.'}
            </p>
          </div>

          {/* Quick System Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={resetToOnboarding}
              style={{
                backgroundColor: 'var(--surface-interactive)',
                borderColor: 'var(--border)'
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono border hover:border-amber-500/50 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
              <span>Switch Repo</span>
            </button>

            <LiquidMagneticButton
              variant="primary"
              size="sm"
              onClick={() => navigateToAppTab('simulation')}
              icon={<Cpu className="w-3.5 h-3.5" />}
            >
              Simulate Failure
            </LiquidMagneticButton>
          </div>
        </div>
      </div>

      {/* Simulated Demonstration Callout (When Custom Repo is active) */}
      {isCustomRepo && (
        <div 
          style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.25)' }}
          className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
        >
          <div className="flex items-center gap-2.5 text-amber-500">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              <strong>Simulated Demonstration Model:</strong> Client-side browser demo. Showing synthetic telemetry and representative microservice topology mapped to <strong>{currentRepoName}</strong>.
            </span>
          </div>
          <button
            onClick={() => {
              resetToOnboarding()
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-500 font-semibold cursor-pointer shrink-0 self-start sm:self-auto transition-colors"
          >
            Switch to Sample Dataset →
          </button>
        </div>
      )}

      {/* 2. THREE PRIORITIZED FINDINGS (Progressive Disclosure - Clear Triage First) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
              PRIORITY TRIAGE
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
              (3 Key Action Items)
            </span>
          </div>

          <ContextualHelp term="confidence" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Finding 1: Critical Risk */}
          <div
            onClick={() => navigateToAppTab('risks', 'payment-service')}
            style={{
              backgroundColor: 'var(--surface-elevated)',
              borderColor: 'rgba(239, 68, 68, 0.3)'
            }}
            className="p-5 rounded-2xl border flex flex-col justify-between group cursor-pointer hover:border-red-500/60 transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
                  1. STRUCTURAL RISK
                </span>
                <span className="text-xs font-mono font-bold text-red-400">Risk 92/100</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold font-display group-hover:text-amber-400 transition-colors" style={{ color: 'var(--foreground)' }}>
                PaymentService DB Pool Saturation
              </h4>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                High afferent coupling (Ca=14) combined with synchronous 45s database transactions creates a cascade outage risk under load.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-mono text-red-400" style={{ borderColor: 'var(--border-subtle)' }}>
              <span>Inspect Risk Matrix</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Finding 2: Active Incident */}
          <div
            onClick={() => navigateToAppTab('incidents')}
            style={{
              backgroundColor: 'var(--surface-elevated)',
              borderColor: isFixApplied ? 'rgba(52, 211, 153, 0.3)' : 'rgba(244, 63, 94, 0.4)'
            }}
            className="p-5 rounded-2xl border flex flex-col justify-between group cursor-pointer transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                    isFixApplied 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}
                >
                  {isFixApplied ? 'RESOLVED' : '2. ACTIVE P0 INCIDENT'}
                </span>
                <span className="text-xs font-mono font-bold text-rose-400">
                  {isFixApplied ? 'Healthy' : ACTIVE_INCIDENT.id}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold font-display group-hover:text-amber-400 transition-colors" style={{ color: 'var(--foreground)' }}>
                {isFixApplied ? 'DB Pool Stabilized' : ACTIVE_INCIDENT.title}
              </h4>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                {isFixApplied 
                  ? 'Remediation plan REM-892 applied successfully. DB connection pool usage reduced from 98% to 22%.'
                  : 'Correlated with commit 7f3a9b2: Unindexed query in transaction loop causing 31.4% error spike.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-mono text-rose-400" style={{ borderColor: 'var(--border-subtle)' }}>
              <span>{isFixApplied ? 'View Validation' : 'Open Incident Room'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Finding 3: Recommended Remediation */}
          <div
            onClick={() => navigateToAppTab('remediation', 'payment-service')}
            style={{
              backgroundColor: 'var(--surface-elevated)',
              borderColor: 'rgba(52, 211, 153, 0.3)'
            }}
            className="p-5 rounded-2xl border flex flex-col justify-between group cursor-pointer hover:border-emerald-500/60 transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  3. RECOMMENDED FIX
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">94% Confidence</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold font-display group-hover:text-amber-400 transition-colors" style={{ color: 'var(--foreground)' }}>
                Runbook REM-892: Decouple SQL TX
              </h4>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                Isolate synchronous third-party gateway API call outside PostgreSQL transaction block with an idempotency key.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-mono text-emerald-400" style={{ borderColor: 'var(--border-subtle)' }}>
              <span>Review Remediation Plan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. PROGRESSIVE DISCLOSURE TOGGLE: FULL SYSTEM TELEMETRY */}
      <div className="pt-2">
        <button
          onClick={() => setShowDeepTelemetry(!showDeepTelemetry)}
          style={{
            backgroundColor: 'var(--surface-interactive)',
            borderColor: 'var(--border)'
          }}
          className="w-full py-3 px-4 rounded-2xl border flex items-center justify-between text-xs font-mono transition-all hover:border-amber-500/50 cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
            <span className="font-bold uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>
              {showDeepTelemetry ? 'Hide' : 'Show'} Full System Telemetry & Technical Metrics
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              6 KPIs • 7-Day Trend • Service Map
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>{showDeepTelemetry ? 'Collapse' : 'Expand'}</span>
            {showDeepTelemetry ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>
      </div>

      {/* 4. EXPANDABLE DEEP TELEMETRY & CHARTS */}
      {showDeepTelemetry && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Banner KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* System Health */}
            <div
              className="p-4 rounded-2xl flex flex-col justify-between transition-colors relative overflow-hidden"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--card-shadow)'
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase" style={{ color: 'var(--muted-foreground)' }}>System Health</span>
                <ContextualHelp term="confidence" />
              </div>
              <div className="my-2">
                <span
                  className={`text-2xl sm:text-3xl font-bold font-mono ${
                    healthScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {healthScore}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}> / 100</span>
              </div>
              <span className="text-[10px] flex items-center gap-1 font-mono" style={{ color: 'var(--muted-foreground)' }}>
                {isFixApplied ? (
                  <span className="text-emerald-400 font-bold">+16 pts improved</span>
                ) : (
                  <span className="text-amber-400 font-medium">Moderate Risk</span>
                )}
              </span>
            </div>

            {/* Critical Risks */}
            <div
              onClick={() => navigateToAppTab('risks')}
              className="p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-colors relative"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              <span className="text-[10px] font-mono uppercase text-red-400 font-semibold">Critical Risks</span>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-red-400">
                  {criticalRisksCount}
                </span>
              </div>
              <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                <span>Needs attention</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>

            {/* Active Incidents */}
            <div
              onClick={() => navigateToAppTab('incidents')}
              className="p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-colors relative"
              style={{
                backgroundColor: 'rgba(244, 63, 94, 0.08)',
                border: '1px solid rgba(244, 63, 94, 0.3)'
              }}
            >
              <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold">Active Incidents</span>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-rose-400">
                  {activeIncidentsCount}
                </span>
              </div>
              <span className="text-[10px] text-rose-400 font-mono flex items-center gap-1">
                {activeIncidentsCount > 0 ? 'P0: INC-2024-892' : 'All systems normal'}
              </span>
            </div>

            {/* High-risk Components */}
            <div
              onClick={() => navigateToAppTab('architecture')}
              className="p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-colors"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                border: '1px solid var(--border)'
              }}
            >
              <span className="text-[10px] font-mono uppercase" style={{ color: 'var(--muted-foreground)' }}>High-Risk Components</span>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
                  {SYSTEM_HEALTH_METRICS.highRiskComponents}
                </span>
              </div>
              <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>of 10 total services</span>
            </div>

            {/* Dependency Hotspots */}
            <div
              onClick={() => navigateToAppTab('graph')}
              className="p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-colors"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                border: '1px solid var(--border)'
              }}
            >
              <span className="text-[10px] font-mono uppercase" style={{ color: 'var(--muted-foreground)' }}>Dependency Hotspots</span>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-sky-400">
                  {SYSTEM_HEALTH_METRICS.dependencyHotspots}
                </span>
              </div>
              <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>High fan-in concentration</span>
            </div>

            {/* Recommended Actions */}
            <div
              onClick={() => navigateToAppTab('remediation')}
              className="p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-colors"
              style={{
                backgroundColor: 'rgba(52, 211, 153, 0.08)',
                border: '1px solid rgba(52, 211, 153, 0.3)'
              }}
            >
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">Recommended Actions</span>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                  {SYSTEM_HEALTH_METRICS.recommendedActions}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span>Prioritized runbooks</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>

          {/* Main Grid: Active Incident Alert + Mini Graph + Risk Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Active Incident Live Card & Trend (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {!isFixApplied ? (
                <div
                  className="rounded-3xl p-6 shadow-xl relative overflow-hidden transition-colors"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    border: '1px solid rgba(244, 63, 94, 0.4)',
                    boxShadow: 'var(--card-shadow)'
                  }}
                >
                  <div
                    className="flex items-center justify-between pb-3"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                      <span className="font-mono text-xs text-rose-400 font-bold uppercase tracking-wider">
                        ACTIVE PRODUCTION INCIDENT — P0 CRITICAL (DEMO SCENARIO)
                      </span>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 font-bold border border-rose-500/30">
                      {ACTIVE_INCIDENT.id}
                    </span>
                  </div>

                  <div className="my-4 space-y-2">
                    <h4 className="text-lg sm:text-xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
                      {ACTIVE_INCIDENT.title}
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed font-sans" style={{ color: 'var(--foreground-secondary)' }}>
                      {ACTIVE_INCIDENT.rootCauseSummary}
                    </p>
                  </div>

                  {/* Incident Metrics Bar */}
                  <div
                    className="grid grid-cols-3 gap-2.5 p-3 rounded-xl font-mono text-xs my-4"
                    style={{
                      backgroundColor: 'var(--surface-interactive)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <div>
                      <span className="text-[10px] block" style={{ color: 'var(--muted-foreground)' }}>Error Rate</span>
                      <strong className="text-rose-400 text-sm">31.4% Spike</strong>
                    </div>
                    <div>
                      <span className="text-[10px] block" style={{ color: 'var(--muted-foreground)' }}>p99 Latency</span>
                      <strong className="text-amber-400 text-sm">6,800 ms</strong>
                    </div>
                    <div>
                      <span className="text-[10px] block" style={{ color: 'var(--muted-foreground)' }}>Postgres Pool</span>
                      <strong className="text-orange-400 text-sm">98% Saturation</strong>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
                      Correlated with Commit: <code style={{ color: 'var(--accent-orange)' }}>{ACTIVE_INCIDENT.correlatedCommit.hash}</code>
                    </span>
                    <LiquidMagneticButton
                      variant="primary"
                      size="sm"
                      onClick={() => navigateToAppTab('incidents')}
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Investigate Incident Room
                    </LiquidMagneticButton>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-3xl p-6 flex items-center justify-between transition-colors"
                  style={{
                    backgroundColor: 'rgba(52, 211, 153, 0.08)',
                    border: '1px solid rgba(52, 211, 153, 0.3)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>All Systems Operating Normally</h4>
                      <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>
                        Remediation REM-892 applied. DB connection pool usage stabilized at 22%.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateToAppTab('validation')}
                    className="text-xs font-mono text-emerald-400 hover:underline font-bold"
                  >
                    Inspect Validation Report →
                  </button>
                </div>
              )}

              {/* Risk Trend Chart (7-day timeline visualization) */}
              <div
                className="rounded-3xl p-6 space-y-4 transition-colors"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border)'
                }}
              >
                <div
                  className="flex items-center justify-between pb-3 font-mono text-xs"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" style={{ color: 'var(--accent-orange)' }} />
                    <span className="font-bold" style={{ color: 'var(--foreground)' }}>7-Day System Health & Risk Index Trend</span>
                  </div>
                  <span style={{ color: 'var(--muted-foreground)' }}>Simulated Prometheus Telemetry</span>
                </div>

                {/* Visual Bar/Curve Chart */}
                <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
                  {[
                    { day: 'Wed', score: 84, color: 'bg-emerald-500' },
                    { day: 'Thu', score: 82, color: 'bg-emerald-500' },
                    { day: 'Fri', score: 81, color: 'bg-emerald-500' },
                    { day: 'Sat', score: 79, color: 'bg-amber-500' },
                    { day: 'Sun', score: 78, color: 'bg-amber-500' },
                    { day: 'Mon', score: 76, color: 'bg-amber-500' },
                    { day: 'Today (Pre-Fix)', score: isFixApplied ? 88 : 72, color: isFixApplied ? 'bg-emerald-400' : 'bg-rose-500' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--foreground)' }}>{item.score}</span>
                      <div
                        className={`w-full max-w-[36px] rounded-t-lg transition-all duration-500 ${item.color}`}
                        style={{ height: `${item.score}%` }}
                      />
                      <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Mini Architecture Graph + Quick Actions (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Mini System Architecture */}
              <div
                className="rounded-3xl p-5 space-y-3 transition-colors"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border)'
                }}
              >
                <div
                  className="flex items-center justify-between pb-2 font-mono text-xs"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <span className="font-bold" style={{ color: 'var(--foreground)' }}>System Topology</span>
                  <button
                    onClick={() => navigateToAppTab('graph')}
                    className="text-[11px] font-semibold transition-opacity hover:opacity-80"
                    style={{ color: 'var(--accent-orange)' }}
                  >
                    Expand →
                  </button>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {COMPONENTS_DATA.slice(0, 5).map((comp) => (
                    <div
                      key={comp.id}
                      onClick={() => navigateToAppTab('architecture', comp.id)}
                      className="p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer hover:border-orange-500/40"
                      style={{
                        backgroundColor: 'var(--surface-interactive)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            comp.riskScore >= 80 ? 'bg-red-400' : comp.riskScore >= 60 ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                        />
                        <span className="font-bold" style={{ color: 'var(--foreground)' }}>{comp.name}</span>
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>Risk {comp.riskScore}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions Shortcuts */}
              <div
                className="rounded-3xl p-5 space-y-3 transition-colors"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border)'
                }}
              >
                <div
                  className="font-mono text-xs font-bold pb-2"
                  style={{
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--foreground)'
                  }}
                >
                  Recommended Next Actions
                </div>

                <div className="space-y-2 text-xs">
                  <button
                    onClick={() => navigateToAppTab('remediation', 'payment-service')}
                    className="w-full text-left p-3 rounded-xl font-medium transition-colors flex items-center justify-between cursor-pointer"
                    style={{
                      backgroundColor: 'rgba(52, 211, 153, 0.08)',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                      color: 'var(--accent-green)'
                    }}
                  >
                    <div>
                      <div className="font-bold">Apply Plan REM-892</div>
                      <div className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>Decouple PaymentService SQL tx</div>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button
                    onClick={() => navigateToAppTab('simulation')}
                    className="w-full text-left p-3 rounded-xl transition-colors flex items-center justify-between cursor-pointer hover:border-orange-500/30"
                    style={{
                      backgroundColor: 'var(--surface-interactive)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)'
                    }}
                  >
                    <div>
                      <div className="font-bold">Run Failure Simulation</div>
                      <div className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>Test 10x traffic spike resilience</div>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button
                    onClick={() => navigateToAppTab('analytics')}
                    className="w-full text-left p-3 rounded-xl transition-colors flex items-center justify-between cursor-pointer hover:border-orange-500/30"
                    style={{
                      backgroundColor: 'var(--surface-interactive)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)'
                    }}
                  >
                    <div>
                      <div className="font-bold">Engineering Fingerprint</div>
                      <div className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>Inspect team bus factor & churn</div>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
