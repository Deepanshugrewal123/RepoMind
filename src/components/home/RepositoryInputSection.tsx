import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { LiquidMagneticButton } from '../ui/LiquidMagneticButton'
import {
  Search,
  CheckCircle2,
  ArrowRight,
  GitBranch,
  Sparkles,
  Layers,
  Network,
  ShieldAlert,
  Cpu,
  Activity
} from 'lucide-react'
import { GithubIcon } from '../ui/Icons'

export const RepositoryInputSection: React.FC = () => {
  const { repositoryInput, setRepositoryInput, startRepositoryAnalysis, isAnalyzing, analysisStep } = useApp()
  const [isFocused, setIsFocused] = useState(false)

  // Validate GitHub / GitLab / Git URL
  const isValidUrl =
    repositoryInput.trim().length > 10 &&
    (repositoryInput.includes('github.com') ||
      repositoryInput.includes('gitlab.com') ||
      repositoryInput.includes('bitbucket.org') ||
      repositoryInput.startsWith('https://'))

  const sampleRepos = [
    'https://github.com/cloud-mesh/checkout-platform',
    'https://github.com/kubernetes/kubernetes',
    'https://github.com/facebook/react'
  ]

  const handleAnalyze = () => {
    if (!isValidUrl) return
    startRepositoryAnalysis(repositoryInput)
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 sm:mt-10 relative z-20">
      {/* Analysis Transition Overlay (When clicked) */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl animate-in fade-in duration-300">
          <div 
            style={{
              backgroundColor: 'var(--surface-elevated)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--card-shadow)'
            }}
            className="w-full max-w-lg p-6 sm:p-8 rounded-3xl border text-center relative overflow-hidden"
          >
            {/* Ambient liquid glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center animate-pulse-subtle">
                <Sparkles className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
                  Assembling Software Intelligence
                </h3>
                <p className="text-xs sm:text-sm mt-1 font-mono truncate" style={{ color: 'var(--muted-foreground)' }}>
                  {repositoryInput}
                </p>
              </div>

              {/* Step Progression */}
              <div className="space-y-3 text-left font-mono text-xs max-w-md mx-auto">
                <div
                  style={{
                    backgroundColor: analysisStep >= 1 ? 'var(--surface-interactive)' : 'transparent',
                    borderColor: analysisStep >= 1 ? 'var(--accent-orange)' : 'var(--border-subtle)',
                    color: analysisStep >= 1 ? 'var(--foreground)' : 'var(--muted-foreground)'
                  }}
                  className="p-3 rounded-xl border flex items-center justify-between transition-all duration-300"
                >
                  <div className="flex items-center gap-2.5">
                    <Search className={`w-4 h-4 ${analysisStep >= 1 ? 'text-amber-500' : 'text-slate-400'}`} />
                    <span>Scanning Repository AST & Commit History</span>
                  </div>
                  {analysisStep > 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                  )}
                </div>

                <div
                  style={{
                    backgroundColor: analysisStep >= 2 ? 'var(--surface-interactive)' : 'transparent',
                    borderColor: analysisStep >= 2 ? 'var(--accent-orange)' : 'var(--border-subtle)',
                    color: analysisStep >= 2 ? 'var(--foreground)' : 'var(--muted-foreground)'
                  }}
                  className="p-3 rounded-xl border flex items-center justify-between transition-all duration-300"
                >
                  <div className="flex items-center gap-2.5">
                    <Network className={`w-4 h-4 ${analysisStep >= 2 ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span>Synthesizing Topological Knowledge Graph</span>
                  </div>
                  {analysisStep > 2 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : analysisStep === 2 ? (
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  ) : null}
                </div>

                <div
                  style={{
                    backgroundColor: analysisStep >= 3 ? 'var(--surface-interactive)' : 'transparent',
                    borderColor: analysisStep >= 3 ? 'var(--accent-orange)' : 'var(--border-subtle)',
                    color: analysisStep >= 3 ? 'var(--foreground)' : 'var(--muted-foreground)'
                  }}
                  className="p-3 rounded-xl border flex items-center justify-between transition-all duration-300"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className={`w-4 h-4 ${analysisStep >= 3 ? 'text-amber-500' : 'text-slate-400'}`} />
                    <span>Calculating Multi-Dimensional Risk Vectors</span>
                  </div>
                  {analysisStep > 3 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : analysisStep === 3 ? (
                    <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                  ) : null}
                </div>

                <div
                  style={{
                    backgroundColor: analysisStep >= 4 ? 'var(--surface-interactive)' : 'transparent',
                    borderColor: analysisStep >= 4 ? 'var(--accent-green)' : 'var(--border-subtle)',
                    color: analysisStep >= 4 ? 'var(--foreground)' : 'var(--muted-foreground)'
                  }}
                  className="p-3 rounded-xl border flex items-center justify-between transition-all duration-300"
                >
                  <div className="flex items-center gap-2.5">
                    <Cpu className={`w-4 h-4 ${analysisStep >= 4 ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span>Calibrating Incident Correlator & Blast Engine</span>
                  </div>
                  {analysisStep >= 4 && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Interactive Input Container */}
      <div
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderColor: isFocused ? 'var(--accent-orange)' : 'var(--border)',
          boxShadow: isFocused ? '0 0 24px rgba(245, 158, 11, 0.2)' : 'var(--card-shadow)'
        }}
        className={`relative rounded-2xl p-2 transition-all duration-300 border ${isFocused ? 'scale-[1.01]' : ''}`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="flex items-center gap-3 px-3.5 w-full flex-1 py-1.5 sm:py-0">
            <GithubIcon className="w-5 h-5 shrink-0" style={{ color: 'var(--muted-foreground)' }} />
            <input
              id="hero-repo-input"
              type="text"
              value={repositoryInput}
              onChange={(e) => setRepositoryInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAnalyze()
              }}
              placeholder="Paste a GitHub repository URL (e.g. github.com/user/project)"
              style={{ color: 'var(--foreground)' }}
              className="w-full bg-transparent text-sm sm:text-base outline-none font-sans placeholder:opacity-50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end pr-1 pb-1 sm:pb-0">
            <LiquidMagneticButton
              variant="primary"
              size="md"
              disabled={!isValidUrl || isAnalyzing}
              onClick={handleAnalyze}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Analyze →
            </LiquidMagneticButton>
          </div>
        </div>

        {/* Validation and Quick Selector Bar */}
        <div 
          style={{ borderColor: 'var(--border-subtle)' }}
          className="mt-2 pt-2 px-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
        >
          <div className="flex items-center gap-1.5">
            {isValidUrl ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Repository verified • Ready for intelligence ingestion</span>
              </span>
            ) : (
              <span style={{ color: 'var(--muted-foreground)' }}>
                Supports GitHub, GitLab, and public Git repositories
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span style={{ color: 'var(--muted-foreground)' }} className="hidden sm:inline">Try Demo:</span>
            <button
              onClick={() => {
                setRepositoryInput('https://github.com/cloud-mesh/checkout-platform')
              }}
              className="text-amber-500 hover:text-amber-600 hover:underline cursor-pointer font-medium"
            >
              CheckoutPlatform-v2.8 (Recommended)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
