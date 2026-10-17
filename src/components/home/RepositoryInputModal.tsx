import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { LiquidMagneticButton } from '../ui/LiquidMagneticButton'
import { GithubIcon } from '../ui/Icons'
import {
  X,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react'

export const RepositoryInputModal: React.FC = () => {
  const {
    repoModalOpen,
    setRepoModalOpen,
    repositoryInput,
    setRepositoryInput,
    isAnalyzing,
    analysisStep,
    startRepositoryAnalysis,
    loadSampleProject
  } = useApp()

  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!repoModalOpen) return null

  const handleValidateAndAnalyze = () => {
    setErrorMsg(null)
    const trimmed = repositoryInput.trim()

    if (!trimmed) {
      setErrorMsg('Please enter a GitHub repository URL or repository slug (e.g. org/repo).')
      return
    }

    // Basic format check
    const isValidFormat =
      /^(https?:\/\/)?(www\.)?github\.com\/[\w.-]+\/[\w.-]+/i.test(trimmed) ||
      /^[\w.-]+\/[\w.-]+$/.test(trimmed)

    if (!isValidFormat) {
      setErrorMsg('Invalid repository format. Please enter a valid GitHub path, e.g. "github.com/facebook/react" or "org/repo".')
      return
    }

    startRepositoryAnalysis(trimmed)
  }

  const sampleRepos = [
    { label: 'Checkout Platform (Verified Dataset)', url: 'https://github.com/cloud-mesh/checkout-platform' },
    { label: 'Express.js (Remote AST Test)', url: 'https://github.com/expressjs/express' },
    { label: 'Fastify (Remote AST Test)', url: 'https://github.com/fastify/fastify' }
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={() => {
        if (!isAnalyzing) setRepoModalOpen(false)
      }}
    >
      <div
        className="w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-6 relative transition-colors shadow-2xl"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--card-shadow)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Crosshairs */}
        <span className="absolute top-3 left-3 text-[11px] font-mono select-none" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>+ [REPO_INSPECTION]</span>
        <span className="absolute top-3 right-3 text-[11px] font-mono select-none" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>SCAN // READY +</span>

        {/* Modal Header */}
        <div className="flex items-start justify-between pt-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-orange)' }} />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold" style={{ color: 'var(--accent-orange)' }}>
                Deterministic Repository Analysis
              </span>
            </div>
            <h3 className="text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
              Analyze a Repository
            </h3>
            <p className="text-xs sm:text-sm font-sans mt-1" style={{ color: 'var(--foreground-secondary)' }}>
              Enter any public GitHub codebase to inspect service dependencies, calculate blast radius, and detect architectural drift.
            </p>
          </div>

          {!isAnalyzing && (
            <button
              onClick={() => setRepoModalOpen(false)}
              className="p-1.5 rounded-xl transition-colors hover:opacity-80"
              style={{ color: 'var(--muted-foreground)', backgroundColor: 'var(--surface-interactive)' }}
              aria-label="Close repository modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Input Form or Analyzing State */}
        {!isAnalyzing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
                GitHub Repository URL or Slug:
              </label>
              <div
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl border transition-all"
                style={{
                  backgroundColor: 'var(--surface-interactive)',
                  borderColor: errorMsg ? 'var(--accent-red)' : 'var(--border)'
                }}
              >
                <GithubIcon className="w-5 h-5 shrink-0" style={{ color: 'var(--muted-foreground)' }} />
                <input
                  type="text"
                  value={repositoryInput}
                  onChange={(e) => {
                    setRepositoryInput(e.target.value)
                    if (errorMsg) setErrorMsg(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleValidateAndAnalyze()
                  }}
                  placeholder="https://github.com/org/repo or org/repo"
                  className="w-full bg-transparent text-sm sm:text-base outline-none font-sans"
                  style={{ color: 'var(--foreground)' }}
                  autoFocus
                />
              </div>
              {errorMsg && (
                <p className="text-xs font-mono flex items-center gap-1.5" style={{ color: 'var(--accent-red)' }}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{errorMsg}</span>
                </p>
              )}
            </div>

            {/* Quick Sample Suggestions */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono block" style={{ color: 'var(--muted-foreground)' }}>
                Or select a curated repository:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleRepos.map((repo) => (
                  <button
                    key={repo.url}
                    type="button"
                    onClick={() => {
                      setRepositoryInput(repo.url)
                      setErrorMsg(null)
                    }}
                    className="px-2.5 py-1 rounded-xl text-xs font-mono border transition-all hover:scale-[1.02] cursor-pointer"
                    style={{
                      backgroundColor: 'var(--surface-interactive)',
                      borderColor: 'var(--border)',
                      color: repositoryInput === repo.url ? 'var(--accent-orange)' : 'var(--foreground-secondary)'
                    }}
                  >
                    {repo.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Technical Transparency Note */}
            <div
              className="p-3.5 rounded-2xl border text-xs font-mono space-y-1"
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                borderColor: 'rgba(245, 158, 11, 0.25)',
                color: 'var(--foreground-secondary)'
              }}
            >
              <div className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--accent-orange)' }}>
                <ShieldCheck className="w-4 h-4" />
                <span>Client Preview Environment</span>
              </div>
              <p className="text-[11px] leading-relaxed font-sans">
                Full AST extraction, compiler symbol binding, and trace correlation are pre-computed on the verified <strong>CheckoutPlatform-v2.8</strong> dataset. Live remote parsing requires the containerized RepoMind Parser Daemon.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setRepoModalOpen(false)
                  loadSampleProject()
                }}
                className="text-xs font-mono hover:underline cursor-pointer"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Or load default sample project →
              </button>

              <LiquidMagneticButton
                variant="primary"
                size="md"
                onClick={handleValidateAndAnalyze}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Analyze Codebase
              </LiquidMagneticButton>
            </div>
          </div>
        ) : (
          /* Multi-Step Analysis Progress Screen */
          <div className="py-6 space-y-6 text-center font-mono">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
              <Sparkles className="w-6 h-6 animate-pulse" style={{ color: 'var(--accent-orange)' }} />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold font-display" style={{ color: 'var(--foreground)' }}>
                Synthesizing Architectural Intelligence
              </h4>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                Parsing: {repositoryInput}
              </p>
            </div>

            {/* Progress Stages */}
            <div className="space-y-2 max-w-md mx-auto text-left text-xs">
              {[
                { step: 1, label: 'Resolving repository metadata & file manifests' },
                { step: 2, label: 'Extracting AST call graphs & import dependencies' },
                { step: 3, label: 'Calculating afferent/efferent coupling & blast radius' },
                { step: 4, label: 'Generating predictive risk matrix & verification runbooks' }
              ].map((s) => {
                const isDone = analysisStep > s.step
                const isCurrent = analysisStep === s.step
                return (
                  <div
                    key={s.step}
                    className="p-2.5 rounded-xl border flex items-center gap-3 transition-colors"
                    style={{
                      backgroundColor: isCurrent ? 'rgba(245, 158, 11, 0.1)' : 'var(--surface-interactive)',
                      borderColor: isCurrent ? 'var(--accent-orange)' : isDone ? 'rgba(52, 211, 153, 0.4)' : 'var(--border)',
                      color: isDone ? 'var(--accent-green)' : isCurrent ? 'var(--foreground)' : 'var(--muted-foreground)'
                    }}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-zinc-600 shrink-0" />
                    )}
                    <span className="truncate">{s.label}</span>
                  </div>
                )
              })}
            </div>

            <div className="pt-2 text-[10px] text-amber-500/90 font-mono">
              [PREVIEW RUNTIME] Verifying AST manifests & checking parser daemon capability...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
