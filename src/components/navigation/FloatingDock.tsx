import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useApp, AppTabType } from '../../context/AppContext'
import {
  LayoutDashboard,
  Layers,
  Network,
  ShieldAlert,
  Flame,
  Cpu,
  Activity,
  GitBranch,
  Wrench,
  CheckCircle2,
  LineChart,
  Sparkles,
  Maximize2,
  Minimize2,
  ChevronUp,
  X,
  Check,
  ShieldCheck
} from 'lucide-react'

interface SubDestination {
  id: AppTabType
  label: string
  shortDesc: string
  icon: React.ReactNode
  badge?: string
  accentColor?: string
}

interface NavGroup {
  id: 'overview' | 'understand' | 'investigate' | 'act' | 'insights'
  label: string
  shortLabel: string
  icon: React.ReactNode
  isDirect?: boolean
  directTabId?: AppTabType
  items?: SubDestination[]
  badge?: string
}

export const FloatingDock: React.FC = () => {
  const { appTab, setAppTab, setAskRepoMindOpen, focusMode, setFocusMode, securityReport } = useApp()
  
  // State for currently open group popover (null if closed)
  const [openGroupId, setOpenGroupId] = useState<string | null>(null)
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null)
  
  const dockRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const itemRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  const securityCount = securityReport?.summary?.findingsCount || 0

  // Semantic groups configuration
  const navGroups: NavGroup[] = [
    {
      id: 'overview',
      label: 'Overview',
      shortLabel: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      isDirect: true,
      directTabId: 'overview'
    },
    {
      id: 'understand',
      label: 'Understand',
      shortLabel: 'Understand',
      icon: <Layers className="w-4 h-4" />,
      items: [
        {
          id: 'architecture',
          label: 'Architecture',
          shortDesc: 'AST-derived boundaries & module coupling',
          icon: <Layers className="w-4 h-4 text-sky-400" />,
          accentColor: '#38bdf8'
        },
        {
          id: 'graph',
          label: 'Knowledge Graph',
          shortDesc: 'Living service dependency topology',
          icon: <Network className="w-4 h-4 text-emerald-400" />,
          accentColor: '#34d399'
        }
      ]
    },
    {
      id: 'investigate',
      label: 'Investigate',
      shortLabel: 'Investigate',
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: securityCount > 0 ? String(4 + 1) : '4',
      items: [
        {
          id: 'risks',
          label: 'Risk Intelligence',
          shortDesc: 'Calibrated multi-factor risk scores',
          icon: <ShieldAlert className="w-4 h-4 text-amber-400" />,
          badge: '3',
          accentColor: '#f59e0b'
        },
        {
          id: 'security',
          label: 'Security Intelligence',
          shortDesc: 'Evidence-based SAST, secrets & dependencies',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          badge: securityCount > 0 ? String(securityCount) : undefined,
          accentColor: '#10b981'
        },
        {
          id: 'blast-radius',
          label: 'Blast Radius',
          shortDesc: 'Failure propagation predictions',
          icon: <Flame className="w-4 h-4 text-rose-400" />,
          accentColor: '#f43f5e'
        },
        {
          id: 'incidents',
          label: 'Incident Investigation',
          shortDesc: 'Telemetry-correlated anomaly traces',
          icon: <Activity className="w-4 h-4 text-rose-400" />,
          badge: '1',
          accentColor: '#fb7185'
        },
        {
          id: 'root-cause',
          label: 'Root Cause Reasoning',
          shortDesc: 'Causal DAG from symptom to commit',
          icon: <GitBranch className="w-4 h-4 text-amber-400" />,
          accentColor: '#f59e0b'
        }
      ]
    },
    {
      id: 'act',
      label: 'Act',
      shortLabel: 'Act',
      icon: <Wrench className="w-4 h-4" />,
      badge: '2',
      items: [
        {
          id: 'remediation',
          label: 'Remediation',
          shortDesc: 'AST-safe patches & decouple runbooks',
          icon: <Wrench className="w-4 h-4 text-emerald-400" />,
          badge: '2',
          accentColor: '#34d399'
        },
        {
          id: 'validation',
          label: 'Validation & Learning',
          shortDesc: 'Post-incident risk deltas & verification',
          icon: <CheckCircle2 className="w-4 h-4 text-sky-400" />,
          accentColor: '#38bdf8'
        }
      ]
    },
    {
      id: 'insights',
      label: 'Insights',
      shortLabel: 'Insights',
      icon: <LineChart className="w-4 h-4" />,
      items: [
        {
          id: 'analytics',
          label: 'Engineering Fingerprint',
          shortDesc: 'Git churn, bus factors & risk distribution',
          icon: <LineChart className="w-4 h-4 text-amber-400" />,
          accentColor: '#f59e0b'
        },
        {
          id: 'simulation',
          label: 'Failure Simulation',
          shortDesc: 'What-if catastrophic outage simulator',
          icon: <Cpu className="w-4 h-4 text-emerald-400" />,
          accentColor: '#34d399'
        }
      ]
    }
  ]

  // Determine which group contains the current active appTab
  const activeGroup = navGroups.find((g) => {
    if (g.isDirect) return g.directTabId === appTab
    return g.items?.some((item) => item.id === appTab)
  })

  // Close popover when clicking outside
  useEffect(() => {
    setOpenGroupId(null)
  }, [appTab])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        dockRef.current &&
        !dockRef.current.contains(e.target as Node)
      ) {
        setOpenGroupId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  // Handle escape key to close popover
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openGroupId) {
        const closedGroupId = openGroupId
        setOpenGroupId(null)
        triggerRefs.current[closedGroupId]?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openGroupId])

  // Handle clicking a dock item
  const handleGroupClick = (group: NavGroup) => {
    if (group.isDirect && group.directTabId) {
      setAppTab(group.directTabId)
      setOpenGroupId(null)
      return
    }

    // Toggle popover
    if (openGroupId === group.id) {
      setOpenGroupId(null)
    } else {
      setOpenGroupId(group.id)
    }
  }

  // Select a sub-destination from a popover
  const handleSelectSubTab = (tabId: AppTabType) => {
    setAppTab(tabId)
    setOpenGroupId(null)
  }

  // Keyboard navigation within popover
  const handlePopoverKeyDown = (e: React.KeyboardEvent, items: SubDestination[], currentIndex: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextIndex = (currentIndex + 1) % items.length
      itemRefs.current[items[nextIndex].id]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prevIndex = (currentIndex - 1 + items.length) % items.length
      itemRefs.current[items[prevIndex].id]?.focus()
    }
  }

  // Current active sub-item label inside active group (if any)
  const currentSubItem = activeGroup?.items?.find((i) => i.id === appTab)
  const openGroupData = navGroups.find((g) => g.id === openGroupId)

  return (
    <>
      {/* Mobile Backdrop when a group is open on small screens */}
      {openGroupId && (
        <div
          className="sm:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 animate-in fade-in duration-200"
          onClick={() => setOpenGroupId(null)}
          aria-hidden="true"
        />
      )}

      {/* Floating Dock Wrapper */}
      <div
        ref={dockRef}
        role="navigation"
        aria-label="Workspace Command Dock"
        style={{
          paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))'
        }}
        className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[98vw] sm:max-w-max select-none"
      >
        {/* Active Popover Panel (Responsively centered: w-[calc(100vw-2rem)] max-w-sm on mobile, w-80 on sm+) */}
        {openGroupData && openGroupData.items && (
          <div
            ref={popoverRef}
            role="menu"
            aria-label={`${openGroupData.label} options`}
            style={{
              backgroundColor: 'var(--surface-elevated)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--card-shadow)'
            }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-sm sm:w-80 rounded-2xl border p-2 backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Popover Header */}
            <div
              className="flex items-center justify-between px-3 py-2 border-b text-[10px] font-mono tracking-wider uppercase font-semibold"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--muted-foreground)'
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>[{openGroupData.label} // {openGroupData.items.length} VIEWS]</span>
              </div>
              <button
                onClick={() => setOpenGroupId(null)}
                className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-[var(--muted-foreground)] hover:text-[var(--foreground)] sm:hidden"
                aria-label="Close menu"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sub-Destinations List */}
            <div className="py-1 space-y-1">
              {openGroupData.items.map((sub, idx) => {
                const isSelected = appTab === sub.id

                return (
                  <button
                    key={sub.id}
                    ref={(el) => {
                      itemRefs.current[sub.id] = el
                    }}
                    role="menuitem"
                    onClick={() => handleSelectSubTab(sub.id)}
                    onKeyDown={(e) => handlePopoverKeyDown(e, openGroupData.items!, idx)}
                    style={{
                      backgroundColor: isSelected
                        ? 'var(--surface-interactive)'
                        : 'transparent',
                      borderColor: isSelected
                        ? 'var(--border-highlight)'
                        : 'transparent'
                    }}
                    className={`
                      w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border
                      text-left transition-all duration-150 cursor-pointer outline-none
                      hover:bg-[var(--surface-interactive)] hover:border-[var(--border-subtle)]
                      focus:bg-[var(--surface-interactive)] focus:border-[var(--border-highlight)]
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="p-1.5 rounded-lg shrink-0"
                        style={{
                          backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'var(--surface-interactive)'
                        }}
                      >
                        {sub.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-xs font-semibold truncate"
                            style={{
                              color: isSelected ? 'var(--foreground)' : 'var(--foreground-secondary)'
                            }}
                          >
                            {sub.label}
                          </span>
                          {sub.badge && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                              {sub.badge}
                            </span>
                          )}
                        </div>
                        <p
                          className="text-[10px] font-sans truncate"
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          {sub.shortDesc}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Floating Command Dock Bar */}
        <div
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
          className="relative px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-2xl border backdrop-blur-2xl flex items-center gap-1 sm:gap-1.5 shadow-2xl transition-all duration-200"
        >
          {/* Nav Groups */}
          {navGroups.map((group) => {
            const isGroupActive = activeGroup?.id === group.id
            const isPopoverOpen = openGroupId === group.id
            const isHovered = hoveredGroupId === group.id

            return (
              <div key={group.id} className="relative">
                <button
                  ref={(el) => {
                    triggerRefs.current[group.id] = el
                  }}
                  data-group-id={group.id}
                  onClick={() => handleGroupClick(group)}
                  onMouseEnter={() => setHoveredGroupId(group.id)}
                  onMouseLeave={() => setHoveredGroupId(null)}
                  aria-expanded={isPopoverOpen}
                  aria-haspopup={!group.isDirect}
                  style={{
                    backgroundColor: isGroupActive
                      ? 'rgba(245, 158, 11, 0.12)'
                      : isPopoverOpen
                      ? 'var(--surface-interactive)'
                      : 'transparent',
                    borderColor: isGroupActive
                      ? 'rgba(245, 158, 11, 0.4)'
                      : isPopoverOpen
                      ? 'var(--border-highlight)'
                      : 'transparent',
                    color: isGroupActive
                      ? 'var(--accent-orange)'
                      : 'var(--foreground-secondary)'
                  }}
                  className={`
                    relative px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border flex items-center gap-1.5 sm:gap-2
                    cursor-pointer outline-none transition-all duration-150 font-sans text-xs font-medium
                    hover:text-[var(--foreground)] hover:bg-[var(--surface-interactive)]
                    focus-visible:ring-2 focus-visible:ring-amber-500/50
                    ${isGroupActive ? 'shadow-sm' : ''}
                  `}
                >
                  <span className="shrink-0">{group.icon}</span>

                  {/* Label: On small screens icon-only, on sm+ label shown */}
                  <span className="hidden sm:inline font-medium whitespace-nowrap">
                    {group.label}
                  </span>

                  {/* Active sub-tab pill hint when a grouped sub-tab is active */}
                  {isGroupActive && currentSubItem && !group.isDirect && (
                    <span
                      style={{
                        backgroundColor: 'var(--surface-interactive)',
                        color: 'var(--foreground)'
                      }}
                      className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono border border-[var(--border-subtle)]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      {currentSubItem.label}
                    </span>
                  )}

                  {/* Chevron indicator for grouped items */}
                  {!group.isDirect && (
                    <ChevronUp
                      className={`w-3 h-3 text-[var(--muted-foreground)] transition-transform duration-200 hidden sm:inline ${
                        isPopoverOpen ? 'rotate-180 text-amber-500' : ''
                      }`}
                    />
                  )}

                  {/* Notification badge */}
                  {group.badge && (
                    <span className="shrink-0 px-1 min-w-[15px] h-[15px] bg-amber-500 text-black text-[9px] font-bold font-mono rounded-full flex items-center justify-center shadow-md">
                      {group.badge}
                    </span>
                  )}

                  {/* Active bottom glowing indicator */}
                  {isGroupActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                  )}
                </button>

                {/* Desktop hover tooltip (only when popover is closed) */}
                {!openGroupId && isHovered && (
                  <div
                    style={{
                      backgroundColor: 'var(--surface-elevated)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                    className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-xl text-[11px] font-mono whitespace-nowrap shadow-xl border z-50 flex items-center gap-1.5 animate-in fade-in duration-100"
                  >
                    <span className="text-amber-500 uppercase font-bold text-[9px]">
                      [{group.id}]
                    </span>
                    <span>{group.label}</span>
                    {!group.isDirect && (
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        ({group.items?.length} views)
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* Divider before Quick Utilities */}
          <div
            className="h-5 w-[1px] mx-1 opacity-20"
            style={{ backgroundColor: 'var(--border)' }}
          />

          {/* Global Quick Utility 1: Ask RepoMind AI */}
          <div className="relative">
            <button
              onClick={() => setAskRepoMindOpen(true)}
              onMouseEnter={() => setHoveredGroupId('ask_ai')}
              onMouseLeave={() => setHoveredGroupId(null)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 cursor-pointer outline-none transition-all duration-150 bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20 shadow-sm"
              aria-label="Ask RepoMind Assistant (⌘K)"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="hidden lg:inline text-xs font-mono font-medium">⌘K</span>
            </button>

            {!openGroupId && hoveredGroupId === 'ask_ai' && (
              <div
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
                className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-xl text-[11px] font-mono whitespace-nowrap shadow-xl border z-50 flex items-center gap-1.5 animate-in fade-in duration-100"
              >
                <span className="text-amber-500 uppercase font-bold text-[9px]">[AI]</span>
                <span>Ask RepoMind (⌘K)</span>
              </div>
            )}
          </div>

          {/* Global Quick Utility 2: Focus Mode Toggle */}
          <div className="relative">
            <button
              onClick={() => setFocusMode(!focusMode)}
              onMouseEnter={() => setHoveredGroupId('focus_toggle')}
              onMouseLeave={() => setHoveredGroupId(null)}
              style={{ color: 'var(--muted-foreground)' }}
              className="p-1.5 sm:p-2 rounded-xl flex items-center justify-center cursor-pointer outline-none transition-all duration-150 hover:bg-black/5 dark:hover:bg-white/10 hover:text-[var(--foreground)] border border-transparent"
              aria-label={focusMode ? 'Exit Focus Mode' : 'Focus Mode'}
            >
              {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {!openGroupId && hoveredGroupId === 'focus_toggle' && (
              <div
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
                className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-xl text-[11px] font-mono whitespace-nowrap shadow-xl border z-50 flex items-center gap-1.5 animate-in fade-in duration-100"
              >
                <span className="text-slate-400 uppercase font-bold text-[9px]">[VIEW]</span>
                <span>{focusMode ? 'Exit Focus Mode' : 'Focus Mode'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
