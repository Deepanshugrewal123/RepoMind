import React from 'react'
import { useApp } from '../../context/AppContext'
import { LiquidMagneticButton } from '../ui/LiquidMagneticButton'
import {
  AlertTriangle,
  Layers,
  ArrowRight,
  X,
  Server,
  ShieldAlert,
  GitBranch,
  CheckCircle2
} from 'lucide-react'

export const CustomRepoUnavailableModal: React.FC = () => {
  const {
    customRepoUnavailable,
    setCustomRepoUnavailable,
    loadSampleProject,
    resetToOnboarding
  } = useApp()

  if (!customRepoUnavailable) return null

  const handleDismiss = () => {
    setCustomRepoUnavailable(null)
  }

  const handleLaunchSample = () => {
    setCustomRepoUnavailable(null)
    loadSampleProject()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
      onClick={handleDismiss}
    >
      <div
        className="w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-6 relative transition-colors border shadow-2xl"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--card-shadow)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Technical Coordinate Indicators */}
        <span
          className="absolute top-3 left-3 text-[10px] font-mono select-none"
          style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}
        >
          + [DAEMON_STATUS // CLIENT_PREVIEW]
        </span>
        <span
          className="absolute top-3 right-3 text-[10px] font-mono select-none"
          style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}
        >
          SECURITY_BOUNDARY // VERIFIED +
        </span>

        {/* Header */}
        <div className="flex items-start justify-between pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span
                className="text-xs font-mono uppercase tracking-wider font-semibold"
                style={{ color: 'var(--accent-orange)' }}
              >
                Capability Notice • Remote AST Extraction
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
              Live Remote AST Parsing Unavailable in Preview
            </h3>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-xl transition-colors hover:opacity-80"
            style={{ color: 'var(--muted-foreground)', backgroundColor: 'var(--surface-interactive)' }}
            aria-label="Close capability notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Repo Identification */}
        <div
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl border text-xs font-mono"
          style={{
            backgroundColor: 'var(--surface-interactive)',
            borderColor: 'var(--border)'
          }}
        >
          <GitBranch className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="truncate">
            <span style={{ color: 'var(--muted-foreground)' }}>Target Codebase: </span>
            <span className="font-bold text-amber-500">{customRepoUnavailable}</span>
          </div>
        </div>

        {/* Technical Explanation */}
        <div className="space-y-3 text-xs sm:text-sm font-sans" style={{ color: 'var(--foreground-secondary)' }}>
          <p className="leading-relaxed">
            Live remote AST parsing requires the <strong className="font-semibold text-white">RepoMind Distributed Parser Daemon</strong>—a
            dedicated worker cluster that clones, sandboxes, and executes language server compiler passes across millions of symbols.
          </p>

          <div
            className="p-4 rounded-2xl border space-y-2.5"
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.06)',
              borderColor: 'rgba(245, 158, 11, 0.25)'
            }}
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-500">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Architectural Honesty & Trust Guarantee</span>
            </div>
            <p className="text-xs font-sans leading-relaxed text-zinc-300">
              To uphold developer trust, <strong>RepoMind never presents simulated mock topologies under an unparsed repository&apos;s name</strong>.
              We do not pretend code was parsed when client-side workers are not provisioned.
            </p>
          </div>

          <div className="text-xs font-sans leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            To inspect complete architectural graphs, blast radius calculations, incident causality models, and automated diff verifications, explore our pre-indexed reference platform:
          </div>
        </div>

        {/* Reference Dataset Showcase Card */}
        <div
          className="p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs font-mono"
          style={{
            backgroundColor: 'var(--surface-interactive)',
            borderColor: 'rgba(52, 211, 153, 0.25)'
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="truncate">
              <div className="font-bold text-emerald-400">CheckoutPlatform-v2.8</div>
              <div className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
                10 Microservices • AST Call Trees • Active P0 Incident
              </div>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold shrink-0">
            READY
          </span>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              handleDismiss()
              resetToOnboarding()
            }}
            className="text-xs font-mono hover:underline cursor-pointer order-2 sm:order-1"
            style={{ color: 'var(--muted-foreground)' }}
          >
            ← Return to workspace onboarding
          </button>

          <LiquidMagneticButton
            variant="primary"
            size="md"
            onClick={handleLaunchSample}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            Explore Verified Sample Project
          </LiquidMagneticButton>
        </div>
      </div>
    </div>
  )
}
