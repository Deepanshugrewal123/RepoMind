import React, { useState } from 'react'
import { ACTIVE_INCIDENT } from '../../../data/mockData'
import { useApp } from '../../../context/AppContext'
import { LiquidMagneticButton } from '../../ui/LiquidMagneticButton'
import {
  Activity,
  AlertTriangle,
  GitCommit,
  GitBranch,
  ArrowRight,
  TrendingUp,
  Cpu,
  Database,
  Layers,
  Terminal,
  Clock,
  CheckCircle2,
  FileCode,
  Flame
} from 'lucide-react'

export const IncidentsView: React.FC = () => {
  const { navigateToAppTab, isFixApplied, isCustomRepo, currentRepoName, loadSampleProject } = useApp()
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(0)

  return (
    <div className="space-y-6 pb-20">
      {/* Honest Status Notice for Custom Repositories */}
      {isCustomRepo && (
        <div
          style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.25)' }}
          className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
        >
          <div className="flex items-center gap-2.5 text-amber-500">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>OpenTelemetry Collector Disconnected:</strong> Live APM trace ingestion and runtime anomaly alarms for <strong>{currentRepoName}</strong> require the cluster agent daemon. Below is a simulated incident workflow on the verified benchmark.
            </span>
          </div>
          <button
            onClick={() => loadSampleProject()}
            className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-500 font-semibold cursor-pointer shrink-0 self-start sm:self-auto transition-colors"
          >
            Switch to Sample Incident →
          </button>
        </div>
      )}

      {/* View Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-1 text-rose-400">
            <Activity className="w-4 h-4" />
            <span>[INCIDENT // 06.WAR_ROOM] • {isCustomRepo ? 'SIMULATED DEMO WORKFLOW' : 'DEMO INCIDENT SCENARIO'}</span>
          </div>
          <h2 className="text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
            {ACTIVE_INCIDENT.id}: {ACTIVE_INCIDENT.title}
          </h2>
          <p className="text-xs sm:text-sm font-sans" style={{ color: 'var(--foreground-secondary)' }}>
            Started: {ACTIVE_INCIDENT.startedAt} • Primary Component: <strong style={{ color: 'var(--foreground)' }}>{ACTIVE_INCIDENT.primaryComponent}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1.5 rounded-xl font-mono text-xs font-bold"
            style={
              isFixApplied
                ? {
                    backgroundColor: 'rgba(52, 211, 153, 0.15)',
                    color: 'var(--accent-green)',
                    border: '1px solid rgba(52, 211, 153, 0.3)'
                  }
                : {
                    backgroundColor: 'rgba(244, 63, 94, 0.15)',
                    color: '#f43f5e',
                    border: '1px solid rgba(244, 63, 94, 0.35)'
                  }
            }
          >
            {isFixApplied ? 'INCIDENT MITIGATED' : 'STATUS: ACTIVE P0'}
          </span>
          <LiquidMagneticButton
            variant="primary"
            size="sm"
            onClick={() => navigateToAppTab('root-cause')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Inspect Root Cause DAG
          </LiquidMagneticButton>
        </div>
      </div>

      {/* Main Grid: Timeline + Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Synchronized Incident Timeline (7 cols) */}
        <div
          className="lg:col-span-7 rounded-3xl p-6 space-y-6 transition-colors"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div
            className="flex items-center justify-between pb-3 font-mono text-xs"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>Synchronized Multi-Signal Timeline</span>
            <span style={{ color: 'var(--muted-foreground)' }}>5 Events Correlated</span>
          </div>

          {/* Timeline Nodes */}
          <div
            className="relative pl-6 space-y-6 font-mono text-xs"
            style={{ borderLeft: '2px solid var(--border)' }}
          >
            {ACTIVE_INCIDENT.timeline.map((evt, idx) => {
              const isSelected = selectedTimelineIndex === idx
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedTimelineIndex(idx)}
                  className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected ? 'scale-[1.02] shadow-lg' : ''
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'rgba(244, 63, 94, 0.12)' : 'var(--surface-interactive)',
                    borderColor: isSelected ? '#f43f5e' : 'var(--border)'
                  }}
                >
                  {/* Timeline bullet on the line */}
                  <span
                    className={`absolute -left-[31px] top-4 w-3.5 h-3.5 rounded-full border-2 ${
                      evt.type === 'deployment'
                        ? 'bg-sky-400 border-sky-300'
                        : evt.type === 'alert'
                        ? 'bg-amber-400 border-amber-300'
                        : 'bg-rose-500 border-rose-400'
                    }`}
                  />

                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs sm:text-sm" style={{ color: 'var(--foreground)' }}>{evt.title}</span>
                    <span className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>{evt.time}</span>
                  </div>

                  <p className="text-xs font-sans leading-relaxed mb-2" style={{ color: 'var(--foreground-secondary)' }}>
                    {evt.description}
                  </p>

                  {evt.meta && (
                    <div
                      className="text-[11px] font-mono px-2.5 py-1 rounded-lg"
                      style={{
                        backgroundColor: 'var(--surface-elevated)',
                        border: '1px solid var(--border)',
                        color: 'var(--accent-orange)'
                      }}
                    >
                      {evt.meta}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Correlated Commit Details */}
          <div
            className="p-4 rounded-2xl font-mono text-xs space-y-2 transition-colors"
            style={{
              backgroundColor: 'var(--surface-interactive)',
              border: '1px solid var(--border)'
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sky-400 font-bold flex items-center gap-1.5">
                <GitCommit className="w-4 h-4" />
                Triggering Commit: {ACTIVE_INCIDENT.correlatedCommit.hash}
              </span>
              <span style={{ color: 'var(--muted-foreground)' }}>PR #{ACTIVE_INCIDENT.correlatedCommit.prNumber}</span>
            </div>
            <div className="text-xs font-sans" style={{ color: 'var(--foreground)' }}>
              "{ACTIVE_INCIDENT.correlatedCommit.message}"
            </div>
            <div className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
              Author: {ACTIVE_INCIDENT.correlatedCommit.author} • {ACTIVE_INCIDENT.correlatedCommit.changedFiles} files modified
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry Spikes & Distributed Traces (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Telemetry Metrics Card */}
          <div
            className="rounded-3xl p-5 space-y-4 font-mono text-xs transition-colors"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--card-shadow)'
            }}
          >
            <div
              className="flex items-center justify-between pb-2"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <span className="font-bold" style={{ color: 'var(--foreground)' }}>Telemetry Shift During Incident</span>
              <span className="text-rose-400 font-bold">Spike: +31.4%</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1" style={{ color: 'var(--muted-foreground)' }}>
                  <span>API Error Rate (p99)</span>
                  <span className="text-rose-400 font-bold">31.4% (Baseline: 0.1%)</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-interactive)' }}>
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '31.4%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1" style={{ color: 'var(--muted-foreground)' }}>
                  <span>Postgres Pool Capacity</span>
                  <span className="text-amber-400 font-bold">98 / 100 connections (98%)</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-interactive)' }}>
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '98%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1" style={{ color: 'var(--muted-foreground)' }}>
                  <span>Checkout Latency (p99)</span>
                  <span className="font-bold" style={{ color: 'var(--accent-orange)' }}>6,800 ms (Baseline: 180ms)</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-interactive)' }}>
                  <div className="h-full rounded-full" style={{ width: '85%', backgroundColor: 'var(--accent-orange)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* OpenTelemetry Distributed Traces */}
          <div
            className="rounded-3xl p-5 space-y-3 font-mono text-xs transition-colors"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--card-shadow)'
            }}
          >
            <div
              className="flex items-center justify-between pb-2"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <span className="font-bold" style={{ color: 'var(--foreground)' }}>Distributed OpenTelemetry Spans</span>
              <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>Trace ID: tr-9941</span>
            </div>

            <div className="space-y-2">
              {ACTIVE_INCIDENT.traces.map((tr) => (
                <div
                  key={tr.span}
                  className="p-2.5 rounded-xl border flex flex-col gap-1 transition-colors"
                  style={
                    tr.status === 'error'
                      ? {
                          backgroundColor: 'rgba(244, 63, 94, 0.1)',
                          borderColor: 'rgba(244, 63, 94, 0.3)',
                          color: '#f43f5e'
                        }
                      : {
                          backgroundColor: 'var(--surface-interactive)',
                          borderColor: 'var(--border)',
                          color: 'var(--foreground)'
                        }
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] truncate">{tr.span}</span>
                    <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{tr.durationMs}ms</span>
                  </div>
                  {tr.errorDetail && (
                    <span className="text-[10px] text-rose-400 font-bold">
                      ⚠ {tr.errorDetail}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Remediation Action Card */}
          <div
            className="p-4 rounded-2xl flex items-center justify-between font-mono text-xs transition-colors"
            style={{
              backgroundColor: 'rgba(52, 211, 153, 0.08)',
              border: '1px solid rgba(52, 211, 153, 0.3)'
            }}
          >
            <div>
              <span className="font-bold block" style={{ color: 'var(--accent-green)' }}>Corrective Plan Ready</span>
              <span className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>Plan REM-892 addresses root cause</span>
            </div>
            <LiquidMagneticButton
              variant="primary"
              size="sm"
              onClick={() => navigateToAppTab('remediation', 'payment-service')}
            >
              Apply Fix →
            </LiquidMagneticButton>
          </div>
        </div>
      </div>
    </div>
  )
}
