import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { LiquidMagneticButton } from '../ui/LiquidMagneticButton'
import { GithubIcon } from '../ui/Icons'
import {
  GitBranch,
  ArrowRight,
  Sparkles,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Flame,
  Activity
} from 'lucide-react'

export const FirstRunOnboarding: React.FC = () => {
  const {
    repositoryInput,
    setRepositoryInput,
    isAnalyzing,
    analysisStep,
    analysisStepText,
    startRepositoryAnalysis,
    loadSampleProject,
    githubToken,
    setGithubToken
  } = useApp()

  const [inputVal, setInputVal] = useState(repositoryInput || '')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showToken, setShowToken] = useState(false)
  const [tokenVal, setTokenVal] = useState(githubToken || '')

  const handleAnalyze = () => {
    setErrorMsg(null)
    const trimmed = inputVal.trim()
    if (!trimmed) {
      setErrorMsg('Please enter a GitHub repository URL or slug (e.g. github.com/facebook/react).')
      return
    }

    const isValid =
      /^(https?:\/\/)?(www\.)?github\.com\/[\w.-]+\/[\w.-]+/i.test(trimmed) ||
      /^[\w.-]+\/[\w.-]+$/.test(trimmed)

    if (!isValid) {
      setErrorMsg('Invalid format. Please enter a valid GitHub path, e.g. "github.com/org/repo" or "https://github.com/org/repo".')
      return
    }

    const token = tokenVal.trim() || undefined
    if (token) setGithubToken(token)
    startRepositoryAnalysis(trimmed, token)
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-3">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: 'var(--accent-orange)'
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>ONBOARDING // REPOSITORY_WORKSPACE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight" style={{ color: 'var(--foreground)' }}>
          Let's understand your repository.
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-sans" style={{ color: 'var(--foreground-secondary)' }}>
          Start with a public repository URL, or explore a sample project to see how RepoMind works.
        </p>
      </div>

      {/* Choice Grid: 2 Clear Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: Analyze a Repository */}
        <div
          className="rounded-3xl p-6 sm:p-7 flex flex-col justify-between border space-y-5 transition-colors relative"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <span className="absolute top-3 left-3 text-[10px] font-mono select-none" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>+ [OPTION_01]</span>

          <div className="space-y-3 pt-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-orange)' }}>
              <GitBranch className="w-5 h-5" />
            </div>

            <h3 className="text-xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
              Analyze a Repository
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed font-sans" style={{ color: 'var(--foreground-secondary)' }}>
              Provide any public GitHub repository to parse code structure, discover dependencies, and evaluate architectural risk.
            </p>

            {/* Input field */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-mono block" style={{ color: 'var(--muted-foreground)' }}>
                GitHub Repository URL:
              </label>
              <div
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all"
                style={{
                  backgroundColor: 'var(--surface-interactive)',
                  borderColor: errorMsg ? 'var(--accent-red)' : 'var(--border)'
                }}
              >
                <GithubIcon className="w-4 h-4 shrink-0" style={{ color: 'var(--muted-foreground)' }} />
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value)
                    if (errorMsg) setErrorMsg(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAnalyze()
                  }}
                  placeholder="https://github.com/org/repo"
                  className="w-full bg-transparent text-xs sm:text-sm outline-none font-sans"
                  style={{ color: 'var(--foreground)' }}
                  disabled={isAnalyzing}
                />
              </div>
              {errorMsg && (
                <span className="text-[11px] font-mono text-red-400 block pt-0.5">
                  ⚠ {errorMsg}
                </span>
              )}
            </div>

            {/* Optional GitHub Token Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="text-[11px] font-mono text-amber-500 hover:underline cursor-pointer"
              >
                {showToken ? '− Hide GitHub Token' : '+ Add GitHub Token (Private repo or higher rate limit)'}
              </button>
              {showToken && (
                <div className="mt-2 p-3 rounded-xl border bg-black/20 text-xs font-mono space-y-1" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-[10px] text-[var(--muted-foreground)] block">Stored only in memory; never transmitted to servers or logged:</span>
                  <input
                    type="password"
                    value={tokenVal}
                    onChange={(e) => setTokenVal(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-transparent border-b border-[var(--border)] py-1 outline-none text-xs text-[var(--foreground)]"
                  />
                </div>
              )}
            </div>

            {/* Live Progress Feedback when Analyzing */}
            {isAnalyzing && (
              <div
                className="p-3 rounded-xl border text-xs font-mono space-y-2 animate-in fade-in"
                style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.3)' }}
              >
                <div className="flex items-center gap-2 text-amber-500 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>Stage {analysisStep} of 4:</span>
                </div>
                <div className="text-[11px] text-[var(--foreground)] truncate">
                  {analysisStepText || 'Processing codebase structure...'}
                </div>
              </div>
            )}

            <div className="text-[11px] font-mono space-y-1" style={{ color: 'var(--muted-foreground)' }}>
              <div>Supported: Public & private GitHub repositories (`github.com/org/repo`)</div>
              <div className="text-[10px] text-emerald-500/90 font-semibold">✔ Real client-side AST parsing, manifest ingestion, & coupling analysis.</div>
            </div>
          </div>

          <div className="pt-4">
            <LiquidMagneticButton
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleAnalyze}
              isLoading={isAnalyzing}
              loadingText={analysisStepText || 'Analyzing Repository...'}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Analyze Repository
            </LiquidMagneticButton>
          </div>
        </div>

        {/* Card 2: Explore Sample Project */}
        <div
          className="rounded-3xl p-6 sm:p-7 flex flex-col justify-between border space-y-5 transition-colors relative"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <span className="absolute top-3 left-3 text-[10px] font-mono select-none" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>+ [OPTION_02]</span>

          <div className="space-y-3 pt-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(52, 211, 153, 0.15)', color: 'var(--accent-green)' }}>
              <Layers className="w-5 h-5" />
            </div>

            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
                Explore Sample Project
              </h3>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed font-sans" style={{ color: 'var(--foreground-secondary)' }}>
              Explore a pre-loaded, multi-service e-commerce application with an active production incident, high-risk coupling, and verified remediation diffs.
            </p>

            {/* Dataset Pill */}
            <div
              className="p-3 rounded-2xl border space-y-1 font-mono text-xs"
              style={{
                backgroundColor: 'var(--surface-interactive)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-amber-500">CheckoutPlatform-v2.8</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  DEMO DATASET
                </span>
              </div>
              <div className="text-[11px]" style={{ color: 'var(--foreground-secondary)' }}>
                10 Microservices • 13 Dependencies • 1 Active P0 Incident
              </div>
            </div>

            <div className="space-y-1 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero configuration required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simulated OpenTelemetry trace correlation</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <LiquidMagneticButton
              variant="secondary"
              size="md"
              className="w-full"
              onClick={loadSampleProject}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Sample Project →
            </LiquidMagneticButton>
          </div>
        </div>
      </div>
    </div>
  )
}
