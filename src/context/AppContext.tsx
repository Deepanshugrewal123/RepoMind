import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  COMPONENTS_DATA,
  RISKS_DATA,
  ACTIVE_INCIDENT,
  REMEDIATION_PLANS,
  ComponentNode,
  RiskItem,
  IncidentRecord,
  RemediationPlan
} from '../data/mockData'

export type RouteType = 
  | 'home'
  | 'product'
  | 'how-it-works'
  | 'demo'
  | 'intelligence'
  | 'security'
  | 'docs'
  | 'about'
  | 'app'

export type AppTabType =
  | 'overview'
  | 'architecture'
  | 'graph'
  | 'risks'
  | 'blast-radius'
  | 'simulation'
  | 'incidents'
  | 'root-cause'
  | 'remediation'
  | 'validation'
  | 'analytics'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ExplainDrawerState {
  isOpen: boolean
  risk?: RiskItem
  component?: ComponentNode
  initialLevel?: 1 | 2 | 3
}

interface AppContextType {
  currentRoute: RouteType
  setCurrentRoute: (route: RouteType) => void
  appTab: AppTabType
  setAppTab: (tab: AppTabType) => void
  selectedComponentId: string
  setSelectedComponentId: (id: string) => void
  selectedRiskId: string
  setSelectedRiskId: (id: string) => void
  explainDrawer: ExplainDrawerState
  openExplainDrawer: (riskId?: string, componentId?: string, level?: 1 | 2 | 3) => void
  closeExplainDrawer: () => void
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  askRepoMindOpen: boolean
  setAskRepoMindOpen: (open: boolean) => void
  assistantInitialPrompt: string
  openAssistantWithPrompt: (prompt: string) => void
  focusMode: boolean
  setFocusMode: (mode: boolean) => void
  isFixApplied: boolean
  toggleFixApplied: () => void
  activeIncident: IncidentRecord
  repositoryInput: string
  setRepositoryInput: (val: string) => void
  isAnalyzing: boolean
  analysisStep: number
  startRepositoryAnalysis: (repoUrl: string) => void
  // Repository & First-Run state
  isFirstRun: boolean
  setIsFirstRun: (val: boolean) => void
  currentRepoName: string | null
  setCurrentRepoName: (name: string | null) => void
  isCustomRepo: boolean
  setIsCustomRepo: (val: boolean) => void
  customRepoUnavailable: string | null
  setCustomRepoUnavailable: (repo: string | null) => void
  loadSampleProject: () => void
  resetToOnboarding: () => void
  repoModalOpen: boolean
  setRepoModalOpen: (open: boolean) => void
  navigateToAppTab: (tab: AppTabType, componentId?: string) => void

  // Theme management
  themeMode: ThemeMode
  effectiveTheme: 'light' | 'dark'
  setThemeMode: (mode: ThemeMode) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const parseHashRoute = (): { route: RouteType; tab?: AppTabType } => {
  if (typeof window === 'undefined') return { route: 'home' }
  const raw = window.location.hash.replace(/^#\/?/, '').trim()
  const [pathPart, queryPart] = raw.split('?')
  const validRoutes: RouteType[] = ['home', 'product', 'how-it-works', 'demo', 'intelligence', 'security', 'docs', 'about', 'app']
  const matchedRoute = validRoutes.find(r => r === pathPart) || (pathPart === '' ? 'home' : undefined)
  
  let tab: AppTabType | undefined
  if (queryPart) {
    const params = new URLSearchParams(queryPart)
    const t = params.get('tab') as AppTabType
    if (t) tab = t
  }
  return { route: matchedRoute || 'home', tab }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = parseHashRoute()
  const [currentRoute, setCurrentRouteState] = useState<RouteType>(initial.route)
  const [appTab, setAppTabState] = useState<AppTabType>(initial.tab || 'overview')
  const [selectedComponentId, setSelectedComponentId] = useState<string>('payment-service')
  const [selectedRiskId, setSelectedRiskId] = useState<string>('RSK-1049')
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false)
  const [askRepoMindOpen, setAskRepoMindOpen] = useState<boolean>(false)
  const [assistantInitialPrompt, setAssistantInitialPrompt] = useState<string>('')
  const [focusMode, setFocusMode] = useState<boolean>(false)
  const [isFixApplied, setIsFixApplied] = useState<boolean>(false)
  const [repositoryInput, setRepositoryInput] = useState<string>('https://github.com/cloud-mesh/checkout-platform')
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [analysisStep, setAnalysisStep] = useState<number>(0)

  // First run & repo selection state
  const [isFirstRun, setIsFirstRun] = useState<boolean>(initial.route !== 'app' || !initial.tab)
  const [currentRepoName, setCurrentRepoName] = useState<string | null>(
    initial.route === 'app' && initial.tab ? 'CheckoutPlatform-v2.8' : null
  )
  const [isCustomRepo, setIsCustomRepo] = useState<boolean>(false)
  const [customRepoUnavailable, setCustomRepoUnavailable] = useState<string | null>(null)
  const [repoModalOpen, setRepoModalOpen] = useState<boolean>(false)

  // Sync browser back/forward buttons
  useEffect(() => {
    const syncFromUrl = () => {
      const { route, tab } = parseHashRoute()
      setCurrentRouteState(route)
      if (tab) {
        setAppTabState(tab)
        setIsFirstRun(false)
      }
    }
    window.addEventListener('popstate', syncFromUrl)
    window.addEventListener('hashchange', syncFromUrl)
    return () => {
      window.removeEventListener('popstate', syncFromUrl)
      window.removeEventListener('hashchange', syncFromUrl)
    }
  }, [])

  // Theme state
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('repomind-theme') as ThemeMode
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
    } catch (e) {}
    return 'dark'
  })

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const applyTheme = () => {
      let resolved: 'light' | 'dark' = 'dark'
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

      if (themeMode === 'system') {
        resolved = systemDark ? 'dark' : 'light'
      } else {
        resolved = themeMode
      }

      setEffectiveTheme(resolved)

      if (resolved === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    applyTheme()

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (themeMode === 'system') {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode])

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode)
    try {
      localStorage.setItem('repomind-theme', mode)
    } catch (e) {}
  }

  const [explainDrawer, setExplainDrawer] = useState<ExplainDrawerState>({
    isOpen: false,
    risk: RISKS_DATA[0],
    component: COMPONENTS_DATA[1],
    initialLevel: 1
  })

  // Global keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(prev => !prev)
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false)
        setAskRepoMindOpen(false)
        setExplainDrawer(prev => ({ ...prev, isOpen: false }))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const openExplainDrawer = (riskId?: string, componentId?: string, level: 1 | 2 | 3 = 1) => {
    const targetRisk = riskId ? RISKS_DATA.find(r => r.id === riskId) : RISKS_DATA.find(r => r.componentId === (componentId || selectedComponentId))
    const targetComp = componentId 
      ? COMPONENTS_DATA.find(c => c.id === componentId) 
      : (targetRisk ? COMPONENTS_DATA.find(c => c.id === targetRisk.componentId) : COMPONENTS_DATA.find(c => c.id === selectedComponentId))

    setExplainDrawer({
      isOpen: true,
      risk: targetRisk || RISKS_DATA[0],
      component: targetComp || COMPONENTS_DATA[1],
      initialLevel: level
    })
  }

  const closeExplainDrawer = () => {
    setExplainDrawer(prev => ({ ...prev, isOpen: false }))
  }

  const openAssistantWithPrompt = (prompt: string) => {
    setAssistantInitialPrompt(prompt)
    setAskRepoMindOpen(true)
  }

  const toggleFixApplied = () => {
    setIsFixApplied(prev => !prev)
  }

  const setCurrentRoute = (r: RouteType) => {
    setCurrentRouteState(r)
    const targetHash = r === 'home' ? '#/' : `#/${r}`
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const setAppTab = (tab: AppTabType) => {
    setAppTabState(tab)
    const targetHash = `#/app?tab=${tab}`
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash)
    }
  }

  const navigateToAppTab = (tab: AppTabType, componentId?: string) => {
    if (componentId) {
      setSelectedComponentId(componentId)
    }
    setIsFirstRun(false)
    setAppTabState(tab)
    setCurrentRouteState('app')
    const targetHash = `#/app?tab=${tab}`
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const loadSampleProject = () => {
    setIsFirstRun(false)
    setCurrentRepoName('CheckoutPlatform-v2.8')
    setIsCustomRepo(false)
    setCustomRepoUnavailable(null)
    setAppTabState('overview')
    setCurrentRouteState('app')
    const targetHash = `#/app?tab=overview`
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetToOnboarding = () => {
    setIsFirstRun(true)
    setCurrentRepoName(null)
    setIsCustomRepo(false)
    setCustomRepoUnavailable(null)
    setCurrentRouteState('app')
    const targetHash = `#/app`
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startRepositoryAnalysis = (repoUrl: string) => {
    const trimmed = repoUrl.trim()
    setRepositoryInput(trimmed)
    setIsAnalyzing(true)
    setAnalysisStep(1)

    const isSample =
      trimmed.toLowerCase().includes('cloud-mesh/checkout-platform') ||
      trimmed.toLowerCase().includes('checkoutplatform') ||
      trimmed.toLowerCase().includes('checkout-platform')

    if (isSample) {
      setTimeout(() => setAnalysisStep(2), 500)
      setTimeout(() => setAnalysisStep(3), 1000)
      setTimeout(() => setAnalysisStep(4), 1500)
      setTimeout(() => {
        setIsAnalyzing(false)
        loadSampleProject()
        setRepoModalOpen(false)
      }, 1900)
    } else {
      // Custom repository submitted: probe connection briefly then honestly report client-side capability limit
      setTimeout(() => setAnalysisStep(2), 600)
      setTimeout(() => {
        setIsAnalyzing(false)
        setRepoModalOpen(false)
        setCustomRepoUnavailable(trimmed)
      }, 1400)
    }
  }

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        appTab,
        setAppTab,
        selectedComponentId,
        setSelectedComponentId,
        selectedRiskId,
        setSelectedRiskId,
        explainDrawer,
        openExplainDrawer,
        closeExplainDrawer,
        commandPaletteOpen,
        setCommandPaletteOpen,
        askRepoMindOpen,
        setAskRepoMindOpen,
        assistantInitialPrompt,
        openAssistantWithPrompt,
        focusMode,
        setFocusMode,
        isFixApplied,
        toggleFixApplied,
        activeIncident: ACTIVE_INCIDENT,
        repositoryInput,
        setRepositoryInput,
        isAnalyzing,
        analysisStep,
        startRepositoryAnalysis,
        navigateToAppTab,
        isFirstRun,
        setIsFirstRun,
        currentRepoName,
        setCurrentRepoName,
        isCustomRepo,
        setIsCustomRepo,
        customRepoUnavailable,
        setCustomRepoUnavailable,
        loadSampleProject,
        resetToOnboarding,
        repoModalOpen,
        setRepoModalOpen,
        themeMode,
        effectiveTheme,
        setThemeMode
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
