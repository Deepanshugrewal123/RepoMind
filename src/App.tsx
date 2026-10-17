import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { Navbar } from './components/navigation/Navbar'
import { CommandPalette } from './components/ai/CommandPalette'
import { AskRepoMindModal } from './components/ai/AskRepoMindModal'
import { ExplainabilityDrawer } from './components/common/ExplainabilityDrawer'
import { RepositoryInputModal } from './components/home/RepositoryInputModal'
import { CustomRepoUnavailableModal } from './components/common/CustomRepoUnavailableModal'

// Public Pages
import { HomePage } from './pages/HomePage'
import { ProductPage } from './pages/ProductPage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { DemoPage } from './pages/DemoPage'
import { IntelligencePage } from './pages/IntelligencePage'
import { SecurityPage } from './pages/SecurityPage'
import { DocsPage } from './pages/DocsPage'
import { AboutPage } from './pages/AboutPage'

// Application Experience
import { AppDashboard } from './pages/AppDashboard'

const MainRouter: React.FC = () => {
  const { currentRoute } = useApp()

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage />
      case 'product':
        return <ProductPage />
      case 'how-it-works':
        return <HowItWorksPage />
      case 'demo':
        return <DemoPage />
      case 'intelligence':
        return <IntelligencePage />
      case 'security':
        return <SecurityPage />
      case 'docs':
        return <DocsPage />
      case 'about':
        return <AboutPage />
      case 'app':
        return <AppDashboard />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-[#06080d] text-[#f1f5f9] relative">
      {/* Show Public Navbar on non-app pages */}
      {currentRoute !== 'app' && <Navbar />}

      {/* Active Page View */}
      {renderCurrentPage()}

      {/* Global Modals & Overlays available everywhere */}
      <CommandPalette />
      <AskRepoMindModal />
      <ExplainabilityDrawer />
      <RepositoryInputModal />
      <CustomRepoUnavailableModal />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  )
}
