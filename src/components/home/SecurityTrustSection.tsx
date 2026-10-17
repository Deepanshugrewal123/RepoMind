import React from 'react'
import { useApp } from '../../context/AppContext'
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Server,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  Info
} from 'lucide-react'

export const SecurityTrustSection: React.FC = () => {
  const { setCurrentRoute } = useApp()

  const claims = [
    {
      icon: <EyeOff className="w-5 h-5 text-emerald-400" />,
      title: 'In-Memory Ephemeral Analysis',
      desc: 'In this client demonstration, repository processing runs in your browser memory. In enterprise production, workers parse ASTs ephemerally with zero persistent source retention.',
      badge: 'Client-Side Verified',
      badgeColor: 'text-emerald-500'
    },
    {
      icon: <Lock className="w-5 h-5 text-amber-400" />,
      title: 'Zero Model Retraining',
      desc: 'No source code, repository metadata, or internal architectural logic is ever transmitted to train or fine-tune public foundation models.',
      badge: 'Client-Side Verified',
      badgeColor: 'text-emerald-500'
    },
    {
      icon: <FileCheck className="w-5 h-5 text-sky-400" />,
      title: 'Deterministic Graph Calculations',
      desc: 'Dependency coupling, blast radius, and failure propagation are computed using deterministic graph algorithms before any AI assistant prompt is synthesized.',
      badge: 'Verified Model',
      badgeColor: 'text-sky-500'
    },
    {
      icon: <Server className="w-5 h-5 text-purple-400" />,
      title: 'Enterprise Compliance Specification',
      desc: 'Designed around SOC 2 Type II and ISO 27001 trust criteria for enterprise deployments. Currently in architectural design specification for production server clusters.',
      badge: 'Target Architecture',
      badgeColor: 'text-purple-400'
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t" style={{ borderColor: 'var(--border-subtle)' }}>
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div 
          style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-medium shadow-sm"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">[TRUST & TRANSPARENCY]</span>
          <span className="opacity-30">|</span>
          <span style={{ color: 'var(--foreground-secondary)' }}>ARCHITECTURAL SPECIFICATION</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-display" style={{ color: 'var(--foreground)' }}>
          Transparent, verifiable{' '}
          <span className="font-editorial italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            intellectual property protection.
          </span>
        </h2>

        <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
          RepoMind prioritizes technical credibility. We provide honest, accurate disclosures regarding our client-side demonstration and target enterprise security architecture.
        </p>
      </div>

      {/* Grid of 4 Claims */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {claims.map((claim, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--surface-elevated)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--card-shadow)'
            }}
            className="p-6 rounded-3xl border flex flex-col justify-between transition-all hover:border-amber-500/40"
          >
            <div className="space-y-4">
              <div 
                style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
                className="w-10 h-10 rounded-2xl border flex items-center justify-center"
              >
                {claim.icon}
              </div>
              <h3 className="text-lg font-bold font-display" style={{ color: 'var(--foreground)' }}>
                {claim.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                {claim.desc}
              </p>
            </div>

            <div className={`pt-4 mt-4 border-t flex items-center gap-1.5 text-[11px] font-mono ${claim.badgeColor}`} style={{ borderColor: 'var(--border-subtle)' }}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{claim.badge}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Trust & Demonstration Disclosure Box */}
      <div 
        style={{
          backgroundColor: 'var(--surface-interactive)',
          borderColor: 'var(--border-subtle)'
        }}
        className="mt-8 p-4 sm:p-5 rounded-2xl border flex items-start gap-3 text-xs font-mono"
      >
        <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
          <strong>Transparency Disclosure:</strong> This web portfolio demonstration runs entirely client-side in the browser. Zero source code or telemetry payloads are transmitted to external servers. Target compliance specifications (e.g. SOC 2 Type II audit readiness) describe the backend cluster architecture designed for production enterprise environments.
        </p>
      </div>

      {/* Link to Full Security Page */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setCurrentRoute('security')}
          className="inline-flex items-center gap-2 text-xs font-mono text-amber-500 hover:text-amber-400 transition-colors cursor-pointer"
        >
          <span>Read our comprehensive Security, Data Handling & Privacy Architecture</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  )
}
