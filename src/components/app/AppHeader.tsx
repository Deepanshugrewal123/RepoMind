import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { LiquidMagneticButton } from '../ui/LiquidMagneticButton'
import { ThemeSwitcher } from '../ui/ThemeSwitcher'
import {
  Search,
  Sparkles,
  GitBranch,
  ShieldAlert,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Bell,
  ArrowLeft,
  ChevronDown,
  Layers,
  HelpCircle,
  Activity
} from 'lucide-react'

interface AppHeaderProps {
  onToggleWhatChanged: () => void
  isWhatChangedOpen: boolean
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onToggleWhatChanged,
  isWhatChangedOpen
}) => {
  const {
    setCurrentRoute,
    setCommandPaletteOpen,
    setAskRepoMindOpen,
    focusMode,
    setFocusMode,
    isFixApplied,
    toggleFixApplied,
    currentRepoName,
    isCustomRepo,
    resetToOnboarding,
    isFirstRun,
    appTab,
    setAppTab
  } = useApp()

  const [viewMenuOpen, setViewMenuOpen] = useState(false)
  const systemScore = isFixApplied ? 88 : 72

  const getTabCategory = (tab: string) => {
    if (['overview', 'architecture', 'risks', 'incidents'].includes(tab)) return 'PRIMARY'
    if (['graph', 'blast-radius', 'simulation'].includes(tab)) return 'EXPLORE'
    if (['root-cause', 'remediation', 'validation'].includes(tab)) return 'ACTIONS'
    if (tab === 'analytics') return 'INSIGHTS'
    return 'PRIMARY'
  }

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 py-2.5 glass-panel border-b border-[var(--border)] transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand & Project Selector */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={() => setCurrentRoute('home')}
            className="flex items-center gap-1.5 group text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer mr-1"
            title="Return to Public Website"
          >
            <div className="w-7 h-7 rounded-lg bg-[var(--surface-interactive)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent-orange)]">
              <ArrowLeft className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--accent-orange)] transition-colors" />
            </div>
            <span className="hidden md:inline text-xs font-mono">Website</span>
          </button>

          <div className="h-4 w-px bg-[var(--border)] hidden sm:block" />

          {/* Active Repo Selector & Switch Button */}
          {!isFirstRun && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--surface-interactive)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]">
                <GitBranch className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold truncate max-w-[130px] sm:max-w-[180px]">
                  {currentRepoName}
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold uppercase">
                  {isCustomRepo ? 'Analyzed Repo' : 'Sample Dataset'}
                </span>
              </div>

              <button
                onClick={resetToOnboarding}
                className="text-[11px] font-mono px-2 py-1 rounded-lg border border-[var(--border)] hover:border-[var(--accent-orange)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer hidden md:inline"
                title="Switch repository or return to onboarding"
              >
                Switch Repo
              </button>

              {/* Active Tab Category Dropdown Selector (Accessible navigation on desktop & mobile) */}
              <div className="relative">
                <button
                  onClick={() => setViewMenuOpen(!viewMenuOpen)}
                  className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--muted-foreground)] hover:text-[var(--foreground)] px-2.5 py-1 rounded-lg bg-[var(--surface-interactive)] border border-[var(--border)] hover:border-[var(--border-highlight)] transition-colors cursor-pointer"
                  title="Switch application view"
                >
                  <span className="text-amber-500 font-bold">{getTabCategory(appTab)}</span>
                  <span>//</span>
                  <span className="capitalize">{appTab.replace('-', ' ')}</span>
                  <ChevronDown className="w-3 h-3 text-[var(--muted-foreground)] ml-0.5" />
                </button>

                {viewMenuOpen && (
                  <div
                    className="absolute top-full left-0 mt-1.5 w-60 rounded-2xl border p-2 z-50 shadow-2xl glass-panel animate-in fade-in duration-150"
                    style={{
                      backgroundColor: 'var(--surface-elevated)',
                      borderColor: 'var(--border)'
                    }}
                  >
                    {[
                      {
                        cat: 'PRIMARY',
                        views: [
                          { id: 'overview', name: 'Overview' },
                          { id: 'architecture', name: 'Architecture' },
                          { id: 'risks', name: 'Risks' },
                          { id: 'incidents', name: 'Incidents' }
                        ]
                      },
                      {
                        cat: 'EXPLORE',
                        views: [
                          { id: 'graph', name: 'Knowledge Graph' },
                          { id: 'blast-radius', name: 'Blast Radius' },
                          { id: 'simulation', name: 'Simulation' }
                        ]
                      },
                      {
                        cat: 'ACTIONS',
                        views: [
                          { id: 'root-cause', name: 'Root Cause' },
                          { id: 'remediation', name: 'Remediation' },
                          { id: 'validation', name: 'Validation' }
                        ]
                      },
                      {
                        cat: 'INSIGHTS',
                        views: [
                          { id: 'analytics', name: 'Engineering Fingerprint' }
                        ]
                      }
                    ].map((group) => (
                      <div key={group.cat} className="mb-2 last:mb-0">
                        <div className="px-2 py-0.5 text-[9px] font-mono font-bold text-amber-500 tracking-wider">
                          [{group.cat}]
                        </div>
                        <div className="space-y-0.5 mt-0.5">
                          {group.views.map((v) => (
                            <button
                              key={v.id}
                              onClick={() => {
                                setAppTab(v.id as any)
                                setViewMenuOpen(false)
                              }}
                              className={`w-full text-left px-2 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                                appTab === v.id
                                  ? 'bg-amber-500/15 text-amber-500 font-bold'
                                  : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-interactive)]'
                              }`}
                            >
                              {v.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* System Health Badge (when project loaded) */}
          {!isFirstRun && (
            <div
              onClick={toggleFixApplied}
              className={`cursor-pointer px-2.5 py-1 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 transition-all ${
                isFixApplied
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-300 shadow-sm'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 shadow-sm'
              }`}
              title="Click to toggle simulated remediation fix"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isFixApplied ? 'bg-emerald-500 animate-ping' : 'bg-amber-500 animate-pulse'
                }`}
              />
              <span>HEALTH: {systemScore} / 100</span>
              {isFixApplied && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 hidden sm:inline">(FIX APPLIED)</span>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions, Theme Switcher & Tools */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Switcher */}
          <ThemeSwitcher compact={true} />

          {/* "What Changed?" Toggle Button */}
          <button
            onClick={onToggleWhatChanged}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
              isWhatChangedOpen
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/50'
                : 'bg-[var(--surface-interactive)] text-[var(--foreground-secondary)] border-[var(--border)] hover:text-[var(--foreground)]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">What Changed?</span>
          </button>

          {/* Command Palette Trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] bg-[var(--surface-interactive)] border border-[var(--border)] hover:border-[var(--border-highlight)] transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <kbd className="text-[10px] font-mono px-1 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--muted-foreground)] border border-[var(--border)]">
              ⌘K
            </kbd>
          </button>

          {/* Ask RepoMind AI Assistant Trigger */}
          <button
            onClick={() => setAskRepoMindOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Ask RepoMind</span>
          </button>

          {/* Focus Mode Toggle */}
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              focusMode
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-300'
                : 'bg-[var(--surface-interactive)] border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
            title={focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode (Distraction-Free)'}
          >
            {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}
