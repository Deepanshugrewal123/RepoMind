import React, { useState, useEffect } from 'react'
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
  CheckCircle2,
  RefreshCw,
  KeyRound,
  ExternalLink,
  Clock,
  HelpCircle
} from 'lucide-react'

export const CustomRepoUnavailableModal: React.FC = () => {
  const {
    customRepoError,
    setCustomRepoError,
    customRepoUnavailable,
    setCustomRepoUnavailable,
    loadSampleProject,
    resetToOnboarding,
    setRepoModalOpen,
    startRepositoryAnalysis,
    githubToken,
    setGithubToken
  } = useApp()

  const [tokenInput, setTokenInput] = useState(githubToken)
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)

  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!customRepoError && !customRepoUnavailable) return null

  const handleDismiss = () => {
    setCustomRepoError(null)
    setCustomRepoUnavailable(null)
  }

  const handleLaunchSample = () => {
    handleDismiss()
    loadSampleProject()
  }

  const handleRetry = async () => {
    const targetUrl = customRepoError?.repoUrl || customRepoUnavailable
    if (!targetUrl) return
    setIsRetrying(true)
    if (tokenInput.trim()) {
      setGithubToken(tokenInput.trim())
    }
    await startRepositoryAnalysis(targetUrl, tokenInput.trim() || undefined)
    setIsRetrying(false)
  }

  const handleEditUrl = () => {
    handleDismiss()
    setRepoModalOpen(true)
  }

  // Derive error presentation based on error code
  const errCode = customRepoError?.code || 'PARSING_ERROR'
  const targetRepo = customRepoError?.repoUrl || customRepoUnavailable || 'Submitted Repository'

  const getErrorMeta = () => {
    switch (errCode) {
      case 'RATE_LIMIT':
        return {
          badge: 'GitHub Rate Limit • HTTP 403',
          badgeColor: '#f59e0b',
          title: 'GitHub API Rate Limit Reached',
          icon: <Clock className="w-5 h-5 text-amber-500 shrink-0" />,
          explanation: (
            <>
              GitHub allocates <strong>60 unauthenticated requests per hour</strong> per public IP address. This limit was reached while inspecting repository manifests.
            </>
          ),
          recommendation:
            'You can provide an optional GitHub Personal Access Token (stored strictly in local memory and never logged or transmitted elsewhere) for 5,000 requests/hour, or retry after the hourly reset window.'
        }
      case 'NOT_FOUND':
        return {
          badge: 'Inaccessible Repository • HTTP 404',
          badgeColor: '#ef4444',
          title: 'Repository Not Found or Private',
          icon: <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />,
          explanation: (
            <>
              GitHub reported that <strong>{targetRepo}</strong> does not exist or is marked private.
            </>
          ),
          recommendation:
            'Verify that the repository owner and name are spelled correctly. If this is a private organization repository, provide an authentication token with read access below.'
        }
      case 'EMPTY_REPO':
        return {
          badge: 'Zero Commits • Empty Repository',
          badgeColor: '#f59e0b',
          title: 'Repository Contains No Code',
          icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          explanation: (
            <>
              The target repository was found on GitHub but contains <strong>0 committed files or branches</strong>.
            </>
          ),
          recommendation: 'Please select a repository that contains committed application code.'
        }
      case 'NO_SUPPORTED_FILES':
        return {
          badge: 'Language Support Notice',
          badgeColor: '#38bdf8',
          title: 'No Supported Source Files Found',
          icon: <HelpCircle className="w-5 h-5 text-sky-400 shrink-0" />,
          explanation: (
            <>
              RepoMind inspected the repository tree, but found no files matching supported source languages.
            </>
          ),
          recommendation:
            'RepoMind currently extracts AST models from TypeScript, JavaScript, Python, Go, Rust, Java, and manifest files (package.json, go.mod, Cargo.toml). Ensure the repository contains these files.'
        }
      case 'TIMEOUT':
        return {
          badge: 'Network Timeout',
          badgeColor: '#ef4444',
          title: 'Connection Timed Out',
          icon: <Clock className="w-5 h-5 text-rose-500 shrink-0" />,
          explanation: (
            <>
              The request to GitHub API or raw content CDN exceeded the 12-second safety deadline.
            </>
          ),
          recommendation: 'Check your internet connection and retry the analysis.'
        }
      case 'INVALID_URL':
        return {
          badge: 'Validation Failure',
          badgeColor: '#f59e0b',
          title: 'Invalid GitHub URL Format',
          icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          explanation: (
            <>
              The entered URL <strong>{targetRepo}</strong> does not match standard GitHub repository path syntax.
            </>
          ),
          recommendation: 'Use standard formats such as "github.com/expressjs/express" or "owner/repo".'
        }
      default:
        return {
          badge: 'Parsing Diagnostic Notice',
          badgeColor: '#f59e0b',
          title: customRepoError?.title || 'Unable to Complete Remote Analysis',
          icon: <Server className="w-5 h-5 text-amber-500 shrink-0" />,
          explanation: (
            <>
              {customRepoError?.message ||
                'Remote repository analysis could not be completed with the current client-side connectivity.'}
            </>
          ),
          recommendation:
            customRepoError?.recoveryAction ||
            'Verify the repository name, check network connectivity, or explore our verified sample project.'
        }
    }
  }

  const meta = getErrorMeta()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="capability-notice-title"
    >
      <div
        className="w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-6 relative transition-colors border shadow-2xl max-h-[90vh] overflow-y-auto"
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
          + [STATUS // DIAGNOSTIC_NOTICE]
        </span>
        <span
          className="absolute top-3 right-3 text-[10px] font-mono select-none"
          style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}
        >
          SECURITY_BOUNDARY // SECURE +
        </span>

        {/* Header */}
        <div className="flex items-start justify-between pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.badgeColor }} />
              <span
                className="text-xs font-mono uppercase tracking-wider font-semibold"
                style={{ color: meta.badgeColor }}
              >
                {meta.badge}
              </span>
            </div>
            <h3
              id="capability-notice-title"
              className="text-xl sm:text-2xl font-bold font-display"
              style={{ color: 'var(--foreground)' }}
            >
              {meta.title}
            </h3>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-xl transition-colors hover:opacity-80 cursor-pointer"
            style={{ color: 'var(--muted-foreground)', backgroundColor: 'var(--surface-interactive)' }}
            aria-label="Close capability notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Repo Identification Badge */}
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
            <span className="font-bold text-amber-500">{targetRepo}</span>
          </div>
        </div>

        {/* Diagnosis & Honesty Guarantee */}
        <div className="space-y-3 text-xs sm:text-sm font-sans" style={{ color: 'var(--foreground-secondary)' }}>
          <p className="leading-relaxed">{meta.explanation}</p>

          <div
            className="p-4 rounded-2xl border space-y-2.5 text-xs font-sans"
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.06)',
              borderColor: 'rgba(245, 158, 11, 0.25)'
            }}
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-500">
              {meta.icon}
              <span>Recommended Recovery Action</span>
            </div>
            <p className="leading-relaxed text-zinc-300">{meta.recommendation}</p>
          </div>
        </div>

        {/* Optional GitHub Token Collapsible Drawer (for Rate Limits or Private Repos) */}
        {(errCode === 'RATE_LIMIT' || errCode === 'NOT_FOUND' || showTokenInput) && (
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() => setShowTokenInput(!showTokenInput)}
              className="text-xs font-mono flex items-center gap-2 text-amber-500 hover:underline cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{showTokenInput ? 'Hide GitHub Token Input' : 'Configure GitHub Token (Private Repo / 5,000 req/hr)'}</span>
            </button>

            {showTokenInput && (
              <div
                className="p-3.5 rounded-2xl border space-y-2 text-xs font-mono"
                style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
                  <span>Personal Access Token (classic or fine-grained):</span>
                  <span className="text-emerald-400">Never logged or saved to server</span>
                </div>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-1.5 rounded-xl border bg-black/30 outline-none text-xs font-mono"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </div>
            )}
          </div>
        )}

        {/* Optional Sample Project Alternative (Never forced) */}
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
                Sample Dataset • 10 Microservices • 19 Edges • Active P0 Incident
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLaunchSample}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 font-bold cursor-pointer shrink-0 transition-colors"
          >
            Explore Sample →
          </button>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 order-2 sm:order-1">
            <button
              type="button"
              onClick={handleEditUrl}
              className="text-xs font-mono hover:underline cursor-pointer"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Edit URL
            </button>
            <span style={{ color: 'var(--border)' }}>•</span>
            <button
              type="button"
              onClick={() => {
                handleDismiss()
                resetToOnboarding()
              }}
              className="text-xs font-mono hover:underline cursor-pointer"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Back to Onboarding
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
            <LiquidMagneticButton
              variant="primary"
              size="sm"
              onClick={handleRetry}
              isLoading={isRetrying}
              loadingText="Retrying..."
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              className="w-full sm:w-auto"
            >
              Retry Analysis
            </LiquidMagneticButton>
          </div>
        </div>
      </div>
    </div>
  )
}
