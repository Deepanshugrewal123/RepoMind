import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { AppHeader } from '../components/app/AppHeader'
import { FloatingDock } from '../components/navigation/FloatingDock'
import { WhatChangedPanel } from '../components/app/WhatChangedPanel'

import { OverviewView } from '../components/app/views/OverviewView'
import { ArchitectureView } from '../components/app/views/ArchitectureView'
import { KnowledgeGraphView } from '../components/app/views/KnowledgeGraphView'
import { RisksView } from '../components/app/views/RisksView'
import { BlastRadiusView } from '../components/app/views/BlastRadiusView'
import { SimulationView } from '../components/app/views/SimulationView'
import { IncidentsView } from '../components/app/views/IncidentsView'
import { RootCauseView } from '../components/app/views/RootCauseView'
import { RemediationView } from '../components/app/views/RemediationView'
import { ValidationView } from '../components/app/views/ValidationView'
import { AnalyticsView } from '../components/app/views/AnalyticsView'

import { FirstRunOnboarding } from '../components/app/FirstRunOnboarding'

export const AppDashboard: React.FC = () => {
  const { appTab, focusMode, isFirstRun } = useApp()
  const [isWhatChangedOpen, setIsWhatChangedOpen] = useState(false)

  const renderActiveView = () => {
    switch (appTab) {
      case 'overview':
        return <OverviewView />
      case 'architecture':
        return <ArchitectureView />
      case 'graph':
        return <KnowledgeGraphView />
      case 'risks':
        return <RisksView />
      case 'blast-radius':
        return <BlastRadiusView />
      case 'simulation':
        return <SimulationView />
      case 'incidents':
        return <IncidentsView />
      case 'root-cause':
        return <RootCauseView />
      case 'remediation':
        return <RemediationView />
      case 'validation':
        return <ValidationView />
      case 'analytics':
        return <AnalyticsView />
      default:
        return <OverviewView />
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col relative selection:bg-orange-500/25 selection:text-orange-200 transition-colors duration-200"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)'
      }}
    >
      {/* Top Application Header */}
      {!focusMode && (
        <AppHeader
          isWhatChangedOpen={isWhatChangedOpen}
          onToggleWhatChanged={() => setIsWhatChangedOpen(!isWhatChangedOpen)}
        />
      )}

      {/* Main Workspace Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-8 pt-6 sm:pt-8 relative pb-28">
        {isFirstRun ? (
          <FirstRunOnboarding />
        ) : (
          <>
            {/* Toggleable "What Changed?" Panel */}
            {isWhatChangedOpen && !focusMode && (
              <div className="mb-6 animate-in slide-in-from-top-4 duration-300">
                <WhatChangedPanel onClose={() => setIsWhatChangedOpen(false)} />
              </div>
            )}

            {/* Active Application Subview */}
            <div className="animate-in fade-in duration-200">
              {renderActiveView()}
            </div>
          </>
        )}
      </main>

      {/* Floating Dock for In-App Navigation (only visible when a project is loaded) */}
      {!isFirstRun && <FloatingDock />}
    </div>
  )
}
