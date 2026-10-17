import React, { useState, useEffect, useRef } from 'react'
import { useApp, AppTabType, RouteType } from '../../context/AppContext'
import {
  Search,
  Layers,
  Network,
  ShieldAlert,
  Flame,
  Cpu,
  Activity,
  GitBranch,
  Wrench,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  X
} from 'lucide-react'

interface CommandItem {
  id: string
  title: string
  category: 'Navigation' | 'Components' | 'Risks' | 'Incidents' | 'Actions'
  icon: React.ReactNode
  shortcut?: string
  action: () => void
}

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setCurrentRoute,
    navigateToAppTab,
    setAskRepoMindOpen,
    openExplainDrawer,
    openAssistantWithPrompt
  } = useApp()

  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [commandPaletteOpen])

  if (!commandPaletteOpen) return null

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-overview',
      title: 'Open System Dashboard Overview',
      category: 'Navigation',
      icon: <Layers className="w-4 h-4 text-sky-400" />,
      action: () => {
        navigateToAppTab('overview')
        setCommandPaletteOpen(false)
      }
    },
    {
      id: 'nav-graph',
      title: 'Inspect Interactive Knowledge Graph',
      category: 'Navigation',
      icon: <Network className="w-4 h-4 text-emerald-400" />,
      action: () => {
        navigateToAppTab('graph')
        setCommandPaletteOpen(false)
      }
    },
    {
      id: 'nav-risks',
      title: 'View Risk Intelligence Matrix',
      category: 'Navigation',
      icon: <ShieldAlert className="w-4 h-4 text-orange-400" />,
      action: () => {
        navigateToAppTab('risks')
        setCommandPaletteOpen(false)
      }
    },
    {
      id: 'nav-sim',
      title: 'Run Failure Simulation ("What If?")',
      category: 'Navigation',
      icon: <Cpu className="w-4 h-4 text-indigo-400" />,
      action: () => {
        navigateToAppTab('simulation')
        setCommandPaletteOpen(false)
      }
    },
    {
      id: 'nav-incident',
      title: 'Investigate Active Incident #INC-2024-892',
      category: 'Incidents',
      icon: <Activity className="w-4 h-4 text-rose-400" />,
      action: () => {
        navigateToAppTab('incidents')
        setCommandPaletteOpen(false)
      }
    },
    {
      id: 'nav-rootcause',
      title: 'Explore Root Cause Reasoning Graph',
      category: 'Incidents',
      icon: <GitBranch className="w-4 h-4 text-amber-400" />,
      action: () => {
        navigateToAppTab('root-cause')
        setCommandPaletteOpen(false)
      }
    },
    {
      id: 'nav-remediation',
      title: 'Review Prioritized Remediation & Code Patches',
      category: 'Actions',
      icon: <Wrench className="w-4 h-4 text-teal-400" />,
      action: () => {
        navigateToAppTab('remediation')
        setCommandPaletteOpen(false)
      }
    },
    // Components
    {
      id: 'comp-payment',
      title: 'PaymentService — Risk Score 91 (Critical Coupling)',
      category: 'Components',
      icon: <Terminal className="w-4 h-4 text-rose-400" />,
      action: () => {
        navigateToAppTab('risks', 'payment-service')
        setCommandPaletteOpen(false)
      }
    },
    {
      id: 'comp-order',
      title: 'OrderService — Risk Score 78 (N+1 Query Loop)',
      category: 'Components',
      icon: <Terminal className="w-4 h-4 text-amber-400" />,
      action: () => {
        navigateToAppTab('architecture', 'order-service')
        setCommandPaletteOpen(false)
      }
    },
    {
      id: 'comp-postgres',
      title: 'PostgresPrimary — 98% Connection Pool Saturation',
      category: 'Components',
      icon: <Terminal className="w-4 h-4 text-sky-400" />,
      action: () => {
        navigateToAppTab('graph', 'postgres-db')
        setCommandPaletteOpen(false)
      }
    },
    // Actions & AI
    {
      id: 'action-ask',
      title: '✦ Ask RepoMind AI Assistant',
      category: 'Actions',
      shortcut: 'AI',
      icon: <Sparkles className="w-4 h-4 text-amber-300" />,
      action: () => {
        setCommandPaletteOpen(false)
        setAskRepoMindOpen(true)
      }
    },
    {
      id: 'action-why-payment',
      title: 'Why is PaymentService High Risk? (Explainability Drawer)',
      category: 'Risks',
      icon: <Code2 className="w-4 h-4 text-orange-400" />,
      action: () => {
        setCommandPaletteOpen(false)
        openExplainDrawer('RSK-1049', 'payment-service')
      }
    },
    {
      id: 'action-validate',
      title: 'Validate Fix & Continuous Learning Loop',
      category: 'Actions',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      action: () => {
        navigateToAppTab('validation')
        setCommandPaletteOpen(false)
      }
    }
  ]

  const filteredCommands = commands.filter((cmd) => {
    const searchStr = `${cmd.title} ${cmd.category}`.toLowerCase()
    return searchStr.includes(query.toLowerCase())
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action()
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 backdrop-blur-md animate-in fade-in duration-200"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden transition-colors"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--card-shadow)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          className="flex items-center px-4 py-3.5 gap-3"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <Search className="w-5 h-5 shrink-0" style={{ color: 'var(--accent-orange)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, search component, risk, or incident..."
            className="w-full bg-transparent text-sm sm:text-base outline-none font-sans"
            style={{
              color: 'var(--foreground)'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 transition-opacity hover:opacity-80"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd
            className="hidden sm:inline text-[11px] font-mono px-2 py-0.5 rounded"
            style={{
              backgroundColor: 'var(--surface-interactive)',
              color: 'var(--muted-foreground)',
              border: '1px solid var(--border)'
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'var(--muted-foreground)' }}>
              <p className="text-sm">No commands or components matching "{query}"</p>
              <p className="text-xs mt-1 font-mono">Try searching "payment", "incident", or "simulation"</p>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                  style={{
                    backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                    border: isSelected ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid transparent'
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="p-1.5 rounded-lg shrink-0"
                      style={{
                        backgroundColor: 'var(--surface-interactive)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      {cmd.icon}
                    </div>
                    <div className="truncate">
                      <div
                        className="text-xs sm:text-sm font-medium truncate"
                        style={{ color: isSelected ? 'var(--foreground)' : 'var(--foreground-secondary)' }}
                      >
                        {cmd.title}
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
                        {cmd.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.shortcut && (
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: 'rgba(245, 158, 11, 0.15)',
                          color: 'var(--accent-orange)',
                          border: '1px solid rgba(245, 158, 11, 0.3)'
                        }}
                      >
                        {cmd.shortcut}
                      </span>
                    )}
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 opacity-100' : 'opacity-0'}`}
                      style={{ color: 'var(--accent-orange)' }}
                    />
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Footer info */}
        <div
          className="px-4 py-2.5 flex items-center justify-between text-[11px] font-mono transition-colors"
          style={{
            backgroundColor: 'var(--surface-interactive)',
            borderTop: '1px solid var(--border)',
            color: 'var(--muted-foreground)'
          }}
        >
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span style={{ color: 'var(--accent-orange)' }}>RepoMind Intelligence Engine</span>
        </div>
      </div>
    </div>
  )
}
